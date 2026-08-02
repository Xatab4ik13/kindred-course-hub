import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  DEMO_ACCOUNTS,
  SEED_LEADERS,
  SEED_LESSONS,
  SEED_ORG,
  SEED_PRICES,
  SEED_REQUESTS,
  SEED_REVIEWS,
  SEED_TEACHERS,
  SEED_USERS,
  type AppUser,
  type EnrollRequest,
  type Leader,
  type Lesson,
  type OrgInfo,
  type PricePlan,
  type Review,
  type Role,
  type Teacher,
} from "@/lib/admin-data";

export type Session = { login: string; name: string; role: Role; teacherId?: string };

type Store = {
  session: Session | null;
  signIn: (login: string, password: string) => boolean;
  signOut: () => void;

  requests: EnrollRequest[];
  setRequests: React.Dispatch<React.SetStateAction<EnrollRequest[]>>;
  teachers: Teacher[];
  setTeachers: React.Dispatch<React.SetStateAction<Teacher[]>>;
  leaders: Leader[];
  setLeaders: React.Dispatch<React.SetStateAction<Leader[]>>;
  lessons: Lesson[];
  setLessons: React.Dispatch<React.SetStateAction<Lesson[]>>;
  reviews: Review[];
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
  prices: PricePlan[];
  setPrices: React.Dispatch<React.SetStateAction<PricePlan[]>>;
  users: AppUser[];
  setUsers: React.Dispatch<React.SetStateAction<AppUser[]>>;
  org: OrgInfo;
  setOrg: React.Dispatch<React.SetStateAction<OrgInfo>>;
};

const Ctx = createContext<Store | null>(null);
const SESSION_KEY = "chinar.admin.session";

export function AdminProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [requests, setRequests] = useState(SEED_REQUESTS);
  const [teachers, setTeachers] = useState(SEED_TEACHERS);
  const [leaders, setLeaders] = useState(SEED_LEADERS);
  const [lessons, setLessons] = useState(SEED_LESSONS);
  const [reviews, setReviews] = useState(SEED_REVIEWS);
  const [prices, setPrices] = useState(SEED_PRICES);
  const [users, setUsers] = useState(SEED_USERS);
  const [org, setOrg] = useState(SEED_ORG);

  useEffect(() => {
    const raw = typeof window !== "undefined" ? window.sessionStorage.getItem(SESSION_KEY) : null;
    if (raw) {
      try {
        setSession(JSON.parse(raw) as Session);
      } catch {
        /* ignore */
      }
    }
  }, []);

  const value = useMemo<Store>(
    () => ({
      session,
      signIn: (login, password) => {
        const acc = DEMO_ACCOUNTS.find((a) => a.login === login && a.password === password);
        if (!acc) return false;
        const next: Session = { login: acc.login, name: acc.name, role: acc.role, ...(acc.teacherId ? { teacherId: acc.teacherId } : {}) };
        setSession(next);
        window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(next));
        return true;
      },
      signOut: () => {
        setSession(null);
        window.sessionStorage.removeItem(SESSION_KEY);
      },
      requests,
      setRequests,
      teachers,
      setTeachers,
      leaders,
      setLeaders,
      lessons,
      setLessons,
      reviews,
      setReviews,
      prices,
      setPrices,
      users,
      setUsers,
      org,
      setOrg,
    }),
    [session, requests, teachers, leaders, lessons, reviews, prices, users, org],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAdmin() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAdmin must be used inside AdminProvider");
  return ctx;
}
