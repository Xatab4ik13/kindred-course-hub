import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  bootstrap,
  COLLECTIONS,
  deleteAccount,
  deleteAccountsByTeacher,
  findAccount,
  listAccounts,
  readAll,
  readCollection,
  upsertAccount,
  writeCollection,
} from "./db.js";

const PORT = Number(process.env.PORT || 4000);
const JWT_SECRET = process.env.JWT_SECRET || "change-me-in-production";
const TOKEN_TTL = "12h";

bootstrap();

const app = express();
app.use(cors());
app.use(express.json({ limit: "12mb" }));

const auth = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "unauthorized" });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "unauthorized" });
  }
};

const superOnly = (req, res, next) =>
  req.user?.role === "admin" && req.user?.isSuper ? next() : res.status(403).json({ error: "forbidden" });

/** Какие коллекции роль видит и может менять. */
const READ_SCOPE = {
  admin: null, // всё
  manager: ["requests", "teachers", "lessons", "reviews", "prices", "news", "org"],
  editor: ["news"],
  teacher: ["teachers", "lessons", "reviews", "prices", "news", "org"],
};

const WRITE_SCOPE = {
  admin: null,
  manager: ["requests", "lessons", "reviews", "prices", "news"],
  editor: ["news"],
  teacher: ["lessons", "teachers"],
};

const canWrite = (role, key) => {
  const scope = WRITE_SCOPE[role];
  if (scope === undefined) return false;
  return scope === null || scope.includes(key);
};

/* ---------- auth ---------- */

app.post("/api/auth/login", (req, res) => {
  const { login, password } = req.body || {};
  const acc = login ? findAccount(String(login)) : null;
  if (!acc || !password || !bcrypt.compareSync(String(password), acc.password_hash)) {
    return res.status(401).json({ error: "Неверный логин или пароль" });
  }
  const session = {
    login: acc.login,
    name: acc.name,
    role: acc.role,
    isSuper: Boolean(acc.is_super),
    ...(acc.teacher_id ? { teacherId: acc.teacher_id } : {}),
  };
  const token = jwt.sign(session, JWT_SECRET, { expiresIn: TOKEN_TTL });
  res.json({ token, session });
});

app.get("/api/auth/me", auth, (req, res) => {
  const { login, name, role, teacherId, isSuper } = req.user;
  res.json({ login, name, role, isSuper: Boolean(isSuper), ...(teacherId ? { teacherId } : {}) });
});

/* ---------- публичные данные для сайта ---------- */

app.get("/api/public/state", (_req, res) => {
  res.json({
    teachers: (readCollection("teachers") || []).filter((t) => t.visible),
    leaders: (readCollection("leaders") || []).filter((l) => l.visible),
    prices: (readCollection("prices") || []).filter((p) => p.visible),
    reviews: (readCollection("reviews") || []).filter((r) => r.visible),
    lessons: readCollection("lessons") || [],
    news: readCollection("news") || [],
    org: readCollection("org") || {},
  });
});

/** Заявка с формы записи на сайте. */
app.post("/api/public/requests", (req, res) => {
  const { name, phone, program, source, comment } = req.body || {};
  if (!name || !phone) return res.status(400).json({ error: "name and phone are required" });
  const requests = readCollection("requests") || [];
  const item = {
    id: `r${Date.now()}`,
    name: String(name).slice(0, 120),
    phone: String(phone).slice(0, 40),
    program: String(program || "Не указано").slice(0, 120),
    createdAt: new Date().toISOString(),
    source: ["Сайт", "Телефон", "VK"].includes(source) ? source : "Сайт",
    status: "new",
    ...(comment ? { comment: String(comment).slice(0, 500) } : {}),
  };
  writeCollection("requests", [item, ...requests]);
  res.status(201).json(item);
});

/* ---------- админ / преподаватель ---------- */

app.get("/api/state", auth, (req, res) => {
  const state = readAll();
  const scope = READ_SCOPE[req.user.role];
  if (scope) {
    for (const key of COLLECTIONS) {
      if (!scope.includes(key)) state[key] = key === "org" ? {} : [];
    }
  }
  const isSuper = req.user.role === "admin" && req.user.isSuper;
  res.json({ ...state, accounts: isSuper ? listAccounts() : [] });
});

/** Полная замена коллекции. Преподавателю разрешено менять только свои данные. */
app.put("/api/state/:key", auth, (req, res) => {
  const { key } = req.params;
  if (!COLLECTIONS.includes(key)) return res.status(404).json({ error: "unknown collection" });
  const value = req.body?.data;
  if (value === undefined) return res.status(400).json({ error: "data required" });

  if (!canWrite(req.user.role, key)) return res.status(403).json({ error: "forbidden" });

  if (req.user.role === "teacher") {
    const teacherId = req.user.teacherId;
    if (!teacherId) return res.status(403).json({ error: "forbidden" });

    if (key === "lessons") {
      if (!Array.isArray(value)) return res.status(400).json({ error: "array required" });
      const current = readCollection("lessons") || [];
      const others = current.filter((l) => l.teacherId !== teacherId);
      const mine = value.filter((l) => l.teacherId === teacherId);
      writeCollection("lessons", [...others, ...mine]);
      return res.json({ ok: true, data: readCollection("lessons") });
    }

    if (key === "teachers") {
      if (!Array.isArray(value)) return res.status(400).json({ error: "array required" });
      const current = readCollection("teachers") || [];
      const next = current.map((t) => (t.id === teacherId ? value.find((x) => x.id === teacherId) || t : t));
      writeCollection("teachers", next);
      return res.json({ ok: true, data: next });
    }

    return res.status(403).json({ error: "forbidden" });
  }

  writeCollection(key, value);
  res.json({ ok: true, data: value });
});

/* ---------- учётные записи (только админ) ---------- */

app.get("/api/accounts", auth, superOnly, (_req, res) => res.json(listAccounts()));

app.post("/api/accounts", auth, superOnly, (req, res) => {
  const { login, password, role, name, teacherId } = req.body || {};
  if (!login || !name || !["admin", "manager", "editor", "teacher"].includes(role)) {
    return res.status(400).json({ error: "login, name and role are required" });
  }
  const existing = findAccount(String(login));
  if (!existing && !password) return res.status(400).json({ error: "password required" });
  if (existing?.is_super && role !== "admin") {
    return res.status(400).json({ error: "нельзя понизить роль главного администратора" });
  }
  upsertAccount({ login: String(login), password: password ? String(password) : undefined, role, name: String(name), teacherId: teacherId || null });
  res.json({ ok: true, accounts: listAccounts() });
});

app.delete("/api/accounts/:login", auth, superOnly, (req, res) => {
  if (req.params.login === req.user.login) return res.status(400).json({ error: "нельзя удалить свою учётную запись" });
  if (findAccount(req.params.login)?.is_super) return res.status(400).json({ error: "нельзя удалить главного администратора" });
  deleteAccount(req.params.login);
  res.json({ ok: true, accounts: listAccounts() });
});

app.delete("/api/accounts/by-teacher/:teacherId", auth, superOnly, (req, res) => {
  deleteAccountsByTeacher(req.params.teacherId);
  res.json({ ok: true, accounts: listAccounts() });
});

/* ---------- удаление заявок (только главный админ) ---------- */

app.delete("/api/requests/:id", auth, superOnly, (req, res) => {
  const requests = readCollection("requests") || [];
  const next = requests.filter((r) => r.id !== req.params.id);
  writeCollection("requests", next);
  res.json({ ok: true, data: next });
});

app.delete("/api/requests", auth, superOnly, (_req, res) => {
  writeCollection("requests", []);
  res.json({ ok: true, data: [] });
});

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, "127.0.0.1", () => {
  console.log(`chinar api listening on http://127.0.0.1:${PORT}`);
});
