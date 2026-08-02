import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import fs from "node:fs";
import path from "node:path";
import { SEED, SEED_ACCOUNTS } from "./seed.js";

const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), "data", "chinar.db");
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

export const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS collections (
    key TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS accounts (
    login TEXT PRIMARY KEY,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL,
    name TEXT NOT NULL,
    teacher_id TEXT
  );
`);

export const COLLECTIONS = ["requests", "teachers", "leaders", "lessons", "reviews", "prices", "users", "org", "news"];

const readStmt = db.prepare("SELECT data FROM collections WHERE key = ?");
const writeStmt = db.prepare(
  "INSERT INTO collections (key, data, updated_at) VALUES (?, ?, datetime('now')) ON CONFLICT(key) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at",
);

export function readCollection(key) {
  const row = readStmt.get(key);
  return row ? JSON.parse(row.data) : null;
}

export function writeCollection(key, value) {
  writeStmt.run(key, JSON.stringify(value));
}

export function readAll() {
  const out = {};
  for (const key of COLLECTIONS) out[key] = readCollection(key);
  return out;
}

export function listAccounts() {
  return db
    .prepare("SELECT login, role, name, teacher_id AS teacherId FROM accounts")
    .all();
}

export function findAccount(login) {
  return db.prepare("SELECT * FROM accounts WHERE login = ?").get(login);
}

export function upsertAccount({ login, password, role, name, teacherId }) {
  const existing = findAccount(login);
  const hash = password ? bcrypt.hashSync(password, 10) : existing?.password_hash;
  if (!hash) throw new Error("password required for new account");
  db.prepare(
    `INSERT INTO accounts (login, password_hash, role, name, teacher_id)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(login) DO UPDATE SET password_hash = excluded.password_hash, role = excluded.role, name = excluded.name, teacher_id = excluded.teacher_id`,
  ).run(login, hash, role, name, teacherId ?? null);
}

export function deleteAccount(login) {
  db.prepare("DELETE FROM accounts WHERE login = ?").run(login);
}

export function deleteAccountsByTeacher(teacherId) {
  db.prepare("DELETE FROM accounts WHERE teacher_id = ?").run(teacherId);
}

/** Первый запуск: переносим стартовые данные и учётки. */
export function bootstrap() {
  for (const key of COLLECTIONS) {
    if (readCollection(key) === null) writeCollection(key, SEED[key]);
  }
  const count = db.prepare("SELECT COUNT(*) AS n FROM accounts").get().n;
  if (count === 0) {
    for (const acc of SEED_ACCOUNTS) upsertAccount(acc);
  }
}
