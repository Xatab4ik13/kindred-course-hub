/** Стартовые данные: переносятся в базу при первом запуске сервера. */

const iso = (daysFromNow) => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().slice(0, 10);
};

export const CANCEL_REASONS = [
  "Болезнь преподавателя",
  "Болезнь учеников",
  "Праздничный день",
  "Технические проблемы",
  "Перенос по просьбе группы",
  "Другое",
];

const TEACHERS = [
  {
    id: "t1",
    name: "Ли Мэй",
    initials: "ЛМ",
    photo: "/media/teacher-1.webp",
    role: "Носитель · HSK 4–6",
    bio: "10 лет преподавания. Магистр филологии Пекинского университета, сертификат IPA.",
    email: "limei@onlinechinar.ru",
    phone: "+7 900 111-22-33",
    visible: true,
  },
  {
    id: "t2",
    name: "Чжан Юй",
    initials: "ЧЮ",
    photo: "/media/teacher-2.webp",
    role: "Носитель · Разговорный",
    bio: "Специализация — разговорная практика и произношение, тренинги по деловому этикету.",
    email: "zhangyu@onlinechinar.ru",
    phone: "+7 900 222-33-44",
    visible: true,
  },
  {
    id: "t3",
    name: "Ван Синь",
    initials: "ВС",
    photo: "/media/teacher-3.webp",
    role: "Методист · HSK 1–3",
    bio: "Автор программы для начинающих, ведёт детские и взрослые группы.",
    email: "wangxin@onlinechinar.ru",
    phone: "+7 900 333-44-55",
    visible: true,
  },
];




export const SEED = {
  requests: [],
  teachers: TEACHERS,
  leaders: [
    { id: "l1", name: "Тимофей", photo: "/media/timofey.jpg", role: "Основатель школы", bio: "Отвечает за развитие школы и партнёрские программы.", visible: true },
    { id: "l2", name: "Николай", photo: "/media/nikolay.jpg", role: "Руководитель направления", bio: "Курирует методику и качество преподавания.", visible: true },
    { id: "l3", name: "Вадим", photo: "/media/vadim.jpg", role: "Операционный директор", bio: "Организация учебного процесса и расписания.", visible: true },
  ],
  lessons: [],
  reviews: [
    { id: "rv1", author: "Анна", level: "HSK 3", text: "За полгода прошла с нуля до уверенных диалогов. Атмосфера как в чайной — тепло и по делу.", visible: true },
    { id: "rv2", author: "Игорь", level: "Бизнес-курс", text: "Готовился к переговорам в Шанхае — за месяц собрали лексику, кейсы, этикет. Сделка закрыта.", visible: true },
    { id: "rv3", author: "Маша", level: "9 лет", text: "Дочка ждёт занятия всю неделю. Уже сама читает пиньинь и учит нас иероглифам.", visible: true },
  ],
  prices: [
    { id: "p1", title: "HSK 1 · Группа", price: "5 900 ₽", period: "в месяц", features: ["8 занятий по 90 минут", "Группа до 8 человек", "Материалы включены"], featured: false, visible: true },
    { id: "p2", title: "HSK 2 · Группа", price: "6 900 ₽", period: "в месяц", features: ["8 занятий по 90 минут", "Разговорная практика", "Домашние с проверкой"], featured: true, visible: true },
    { id: "p3", title: "Индивидуально", price: "1 800 ₽", period: "за занятие", features: ["Персональная программа", "Гибкое расписание", "Онлайн или офлайн"], featured: false, visible: true },
    { id: "p4", title: "ЕГЭ", price: "7 900 ₽", period: "в месяц", features: ["Разбор формата экзамена", "Пробники каждый месяц", "Индивидуальный план"], featured: false, visible: true },
    { id: "p5", title: "Школьники", price: "5 400 ₽", period: "в месяц", features: ["Игровой формат", "Группа до 6 человек", "Отчёты родителям"], featured: false, visible: true },
  ],
  users: [
    { id: "u1", name: "Главный админ", email: "admin@onlinechinar.ru", login: "AdminChinar1", role: "admin", status: "active" },
    { id: "u2", name: "Ли Мэй", email: "limei@onlinechinar.ru", login: "limei", role: "teacher", status: "active" },
  ],
  org: {
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
  },
  news: [],
};

/** Стартовые учётки (пароли хешируются при первом запуске). */
export const SEED_ACCOUNTS = [
  { login: "AdminChinar1", password: "NoNIKROM1$", role: "admin", name: "Главный админ" },
  { login: "limei", password: "Teacher1$", role: "teacher", name: "Ли Мэй", teacherId: "t1" },
];
