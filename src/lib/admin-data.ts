/**
 * Мок-данные админ-панели (этап «только фронт»).
 * Ничего не сохраняется: все правки живут в памяти до перезагрузки.
 * На этапе бекенда этот модуль заменяется на API-слой.
 */
import teacher1 from "@/assets/teachers/teacher-1.webp";
import teacher2 from "@/assets/teachers/teacher-2.webp";
import teacher3 from "@/assets/teachers/teacher-3.webp";
import teacher4 from "@/assets/teachers/teacher-4.webp";
import lead1 from "@/assets/leadership/timofey.jpg";
import lead2 from "@/assets/leadership/nikolay.jpg";
import lead3 from "@/assets/leadership/vadim.jpg";

export type Role = "admin" | "teacher";

export type RequestStatus = "new" | "progress" | "enrolled" | "declined";

export const REQUEST_STATUS_LABEL: Record<RequestStatus, string> = {
  new: "Новая",
  progress: "В работе",
  enrolled: "Записан",
  declined: "Отказ",
};

export type EnrollRequest = {
  id: string;
  name: string;
  phone: string;
  program: string;
  createdAt: string; // ISO
  source: "Сайт" | "Телефон" | "VK";
  status: RequestStatus;
  comment?: string;
};

export type Teacher = {
  id: string;
  name: string;
  initials: string;
  photo: string;
  role: string;
  bio: string;
  email: string;
  phone: string;
  visible: boolean;
};

export type Leader = {
  id: string;
  name: string;
  photo: string;
  role: string;
  bio: string;
  visible: boolean;
};

export type Lesson = {
  id: string;
  teacherId: string;
  group: string; // №035
  level: string;
  date: string; // ISO date
  time: string; // 18:00
  status: "planned" | "done" | "cancelled";
  cancelReason?: string;
};

export const CANCEL_REASONS = [
  "Болезнь преподавателя",
  "Болезнь учеников",
  "Праздничный день",
  "Технические проблемы",
  "Перенос по просьбе группы",
  "Другое",
];

export type Review = {
  id: string;
  author: string;
  level: string;
  text: string;
  visible: boolean;
};

export type PricePlan = {
  id: string;
  title: string;
  price: string;
  period: string;
  features: string[];
  featured: boolean;
  visible: boolean;
};

export type AppUser = {
  id: string;
  name: string;
  email: string;
  login: string;
  role: Role;
  status: "active" | "invited";
};

export type OrgInfo = {
  phone: string;
  email: string;
  address: string;
  vk: string;
  telegram: string;
  legalName: string;
  inn: string;
  ogrn: string;
  bank: string;
  account: string;
};

const iso = (daysFromNow: number) => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().slice(0, 10);
};

export const SEED_REQUESTS: EnrollRequest[] = [
  { id: "r1", name: "Анна Кузнецова", phone: "+7 912 445-10-22", program: "HSK 1 · Группа", createdAt: iso(-1), source: "Сайт", status: "new" },
  { id: "r2", name: "Игорь Лапшин", phone: "+7 903 118-77-04", program: "Индивидуально", createdAt: iso(-2), source: "Сайт", status: "progress" },
  { id: "r3", name: "Мария Орлова", phone: "+7 921 700-31-88", program: "Школьники", createdAt: iso(-3), source: "VK", status: "enrolled" },
  { id: "r4", name: "Дмитрий Белов", phone: "+7 999 004-52-13", program: "ЕГЭ", createdAt: iso(-4), source: "Телефон", status: "declined", comment: "Не подошло расписание" },
  { id: "r5", name: "Ксения Титова", phone: "+7 916 220-66-90", program: "HSK 2 · Группа", createdAt: iso(-5), source: "Сайт", status: "enrolled" },
  { id: "r6", name: "Павел Смирнов", phone: "+7 905 331-19-47", program: "Разговорный клуб", createdAt: iso(-6), source: "Сайт", status: "new" },
  { id: "r7", name: "Елена Гущина", phone: "+7 926 812-40-15", program: "HSK 1 · Группа", createdAt: iso(-8), source: "VK", status: "progress" },
  { id: "r8", name: "Артём Рогов", phone: "+7 962 550-08-77", program: "Индивидуально", createdAt: iso(-11), source: "Сайт", status: "enrolled" },
];

export const SEED_TEACHERS: Teacher[] = [
  {
    id: "t1",
    name: "Ли Мэй",
    initials: "ТБ",
    photo: teacher1,
    role: "Носитель · HSK 4–6",
    bio: "10 лет преподавания. Магистр филологии Пекинского университета, сертификат IPA.",
    email: "limei@onlinechinar.ru",
    phone: "+7 900 111-22-33",
    visible: true,
  },
  {
    id: "t2",
    name: "Чжан Юй",
    initials: "НР",
    photo: teacher2,
    role: "Носитель · Разговорный",
    bio: "Специализация — разговорная практика и произношение, тренинги по деловому этикету.",
    email: "zhangyu@onlinechinar.ru",
    phone: "+7 900 222-33-44",
    visible: true,
  },
  {
    id: "t3",
    name: "Ван Синь",
    initials: "ВГ",
    photo: teacher3,
    role: "Методист · HSK 1–3",
    bio: "Автор программы для начинающих, ведёт детские и взрослые группы.",
    email: "wangxin@onlinechinar.ru",
    phone: "+7 900 333-44-55",
    visible: true,
  },
  {
    id: "t4",
    name: "Анна Соколова",
    initials: "АС",
    photo: teacher4,
    role: "Преподаватель · ЕГЭ и школьники",
    bio: "Готовит к ЕГЭ и олимпиадам, 7 лет практики в языковых школах.",
    email: "sokolova@onlinechinar.ru",
    phone: "+7 900 444-55-66",
    visible: true,
  },
];

export const SEED_LEADERS: Leader[] = [
  { id: "l1", name: "Тимофей", photo: lead1, role: "Основатель школы", bio: "Отвечает за развитие школы и партнёрские программы.", visible: true },
  { id: "l2", name: "Николай", photo: lead2, role: "Руководитель направления", bio: "Курирует методику и качество преподавания.", visible: true },
  { id: "l3", name: "Вадим", photo: lead3, role: "Операционный директор", bio: "Организация учебного процесса и расписания.", visible: true },
];

const LEVELS = ["HSK 1", "HSK 2", "HSK 3", "Дети", "Разговорный", "ЕГЭ"];
const TIMES = ["10:00", "12:00", "16:00", "18:00", "19:30"];

export const SEED_LESSONS: Lesson[] = Array.from({ length: 48 }, (_, i) => {
  const teacher = SEED_TEACHERS[i % 4]!;
  const offset = (i % 14) - 7;
  const past = offset < 0;
  const cancelled = past && i % 9 === 0;
  return {
    id: `l${i + 1}`,
    teacherId: teacher.id,
    group: `№0${30 + (i % 8)}`,
    level: LEVELS[i % LEVELS.length]!,
    date: iso(offset),
    time: TIMES[i % TIMES.length]!,
    status: cancelled ? "cancelled" : past ? "done" : "planned",
    ...(cancelled ? { cancelReason: CANCEL_REASONS[i % CANCEL_REASONS.length]! } : {}),
  } as Lesson;
});

export const SEED_REVIEWS: Review[] = [
  { id: "rv1", author: "Анна", level: "HSK 3", text: "За полгода прошла с нуля до уверенных диалогов. Атмосфера как в чайной — тепло и по делу.", visible: true },
  { id: "rv2", author: "Игорь", level: "Бизнес-курс", text: "Готовился к переговорам в Шанхае — за месяц собрали лексику, кейсы, этикет. Сделка закрыта.", visible: true },
  { id: "rv3", author: "Маша", level: "9 лет", text: "Дочка ждёт занятия всю неделю. Уже сама читает пиньинь и учит нас иероглифам.", visible: true },
];

export const SEED_PRICES: PricePlan[] = [
  { id: "p1", title: "HSK 1 · Группа", price: "5 900 ₽", period: "в месяц", features: ["8 занятий по 90 минут", "Группа до 8 человек", "Материалы включены"], featured: false, visible: true },
  { id: "p2", title: "HSK 2 · Группа", price: "6 900 ₽", period: "в месяц", features: ["8 занятий по 90 минут", "Разговорная практика", "Домашние с проверкой"], featured: true, visible: true },
  { id: "p3", title: "Индивидуально", price: "1 800 ₽", period: "за занятие", features: ["Персональная программа", "Гибкое расписание", "Онлайн или офлайн"], featured: false, visible: true },
  { id: "p4", title: "ЕГЭ", price: "7 900 ₽", period: "в месяц", features: ["Разбор формата экзамена", "Пробники каждый месяц", "Индивидуальный план"], featured: false, visible: true },
  { id: "p5", title: "Школьники", price: "5 400 ₽", period: "в месяц", features: ["Игровой формат", "Группа до 6 человек", "Отчёты родителям"], featured: false, visible: true },
];

export const SEED_USERS: AppUser[] = [
  { id: "u1", name: "Главный админ", email: "admin@onlinechinar.ru", login: "AdminChinar1", role: "admin", status: "active" },
  { id: "u2", name: "Ли Мэй", email: "limei@onlinechinar.ru", login: "limei", role: "teacher", status: "active" },
  { id: "u3", name: "Чжан Юй", email: "zhangyu@onlinechinar.ru", login: "zhangyu", role: "teacher", status: "active" },
  { id: "u4", name: "Ван Синь", email: "wangxin@onlinechinar.ru", login: "wangxin", role: "teacher", status: "invited" },
];

export const SEED_ORG: OrgInfo = {
  phone: "+7 (999) 123-45-67",
  email: "info@onlinechinar.ru",
  address: "Москва, ул. Примерная, 12, офис 5",
  vk: "https://vk.ru/onlinechinar",
  telegram: "https://t.me/onlinechinar",
  legalName: "ИП Иванов Иван Иванович",
  inn: "770123456789",
  ogrn: "321774600123456",
  bank: "АО «Тинькофф Банк»",
  account: "40802810900000123456",
};

/** Демо-учётные записи фронтенда (на бекенде заменяются реальной авторизацией). */
export const DEMO_ACCOUNTS: { login: string; password: string; role: Role; name: string; teacherId?: string }[] = [
  { login: "AdminChinar1", password: "NoNIKROM1$", role: "admin", name: "Главный админ" },
  { login: "limei", password: "Teacher1$", role: "teacher", name: "Ли Мэй", teacherId: "t1" },
];
