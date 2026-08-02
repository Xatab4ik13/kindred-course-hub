/** Типы данных админ-панели. Сами данные приходят с бекенда (папка server/). */

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
