/**
 * Преобразование занятий из админки (бекенд) в карточки публичного расписания.
 */
import type { Lesson, Teacher } from "@/lib/admin-data";

export type LevelTone = "hsk1" | "hsk2" | "hsk3" | "kids" | "speak" | "individual" | "ege";

export type LessonView = {
  id: string;
  time: string;
  duration: number;
  level: string;
  tone: LevelTone;
  group: string;
  goalId: string;
  teacherId: string;
  teacherName: string;
  teacherPhoto?: string;
  teacherInitials: string;
};

export type ScheduleFilter = { teacherId: string | null; query: string };
export const EMPTY_FILTER: ScheduleFilter = { teacherId: null, query: "" };

/** Тон и цель записи выводим из названия уровня — админ пишет его свободным текстом. */
export function toneForLevel(level: string): LevelTone {
  const l = level.toLowerCase();
  if (l.includes("егэ") || l.includes("ege")) return "ege";
  if (l.includes("дет") || l.includes("школь") || l.includes("kids")) return "kids";
  if (l.includes("индив") || l.includes("individual")) return "individual";
  if (l.includes("разговор") || l.includes("speak")) return "speak";
  if (l.includes("3")) return "hsk3";
  if (l.includes("2")) return "hsk2";
  return "hsk1";
}

export function goalForLevel(level: string): string {
  const tone = toneForLevel(level);
  if (tone === "ege") return "ege";
  if (tone === "kids") return "kids";
  if (tone === "individual") return "individual";
  if (tone === "speak") return "group";
  if (tone === "hsk2" || tone === "hsk3") return "hsk2";
  return "hsk1";
}

function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

/** Занятия одного дня с учётом фильтра (преподаватель + номер группы). */
export function dayLessons(
  lessons: Lesson[],
  teachers: Teacher[],
  dateKey: string,
  filter: ScheduleFilter,
): LessonView[] {
  const q = filter.query.trim().toLowerCase().replace(/^№|^#/, "");
  return lessons
    .filter((l) => l.date === dateKey && l.status !== "cancelled")
    .filter((l) => (filter.teacherId ? l.teacherId === filter.teacherId : true))
    .filter((l) => (q ? l.group.toLowerCase().replace(/^№|^#/, "").includes(q) : true))
    .sort((a, b) => a.time.localeCompare(b.time))
    .map((l) => {
      const teacher = teachers.find((t) => t.id === l.teacherId);
      const name = teacher?.name ?? "—";
      return {
        id: l.id,
        time: l.time,
        duration: l.duration ?? 90,
        level: l.level,
        tone: toneForLevel(l.level),
        group: l.group.replace(/^№|^#/, ""),
        goalId: goalForLevel(l.level),
        teacherId: l.teacherId,
        teacherName: name,
        ...(teacher?.photo ? { teacherPhoto: teacher.photo } : {}),
        teacherInitials: teacher?.initials || initialsOf(name),
      };
    });
}

export function dateKey(d: Date) {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}
