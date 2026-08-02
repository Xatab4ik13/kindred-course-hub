/**
 * Публичные данные сайта: приходят с бекенда (папка server/), редактируются в админ-панели.
 */
import { useEffect, useState } from "react";
import type { Leader, Lesson, OrgInfo, PricePlan, Review, Teacher } from "@/lib/admin-data";

export type NewsItem = { id: string; title: string; text: string; photo?: string; date: string; author?: string };

export type PublicContent = {
  teachers: Teacher[];
  leaders: Leader[];
  prices: PricePlan[];
  reviews: Review[];
  lessons: Lesson[];
  news: NewsItem[];
  org: Partial<OrgInfo>;
};

const EMPTY: PublicContent = { teachers: [], leaders: [], prices: [], reviews: [], lessons: [], news: [], org: {} };

const BASE = (import.meta.env['VITE_API_URL'] as string | undefined) ?? "/api";

export function usePublicContent() {
  const [data, setData] = useState<PublicContent>(EMPTY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetch(`${BASE}/public/state`)
      .then((r) => (r.ok ? (r.json() as Promise<PublicContent>) : Promise.reject(new Error("bad response"))))
      .then((json) => {
        if (alive) setData({ ...EMPTY, ...json });
      })
      .catch(() => undefined)
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  return { ...data, loading };
}

export async function submitEnrollRequest(input: { name: string; phone: string; program?: string; comment?: string }) {
  const res = await fetch(`${BASE}/public/requests`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Не удалось отправить заявку");
  return res.json();
}
