import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { api, setToken, getToken, ApiError } from "@/lib/api";
import type { AppUser, EnrollRequest, Leader, Lesson, OrgInfo, PricePlan, Review, Role, Teacher } from "@/lib/admin-data";

export type Session = { login: string; name: string; role: Role; teacherId?: string };
export type Account = { login: string; name: string; role: Role; teacherId?: string | null };

type ServerState = {
  requests: EnrollRequest[];
  teachers: Teacher[];
  leaders: Leader[];
  lessons: Lesson[];
  reviews: Review[];
  prices: PricePlan[];
  users: AppUser[];
  org: OrgInfo;
  accounts: Account[];
};

const EMPTY_ORG: OrgInfo = {
  phone: "",
  email: "",
  address: "",
  vk: "",
  telegram: "",
  legalName: "",
  inn: "",
  ogrn: "",
  bank: "",
  account: "",
};

type Setter<T> = React.Dispatch<React.SetStateAction<T>>;

type Store = {
  session: Session | null;
  loading: boolean;
  error: string | null;
  signIn: (login: string, password: string) => Promise<boolean>;
  signOut: () => void;

  requests: EnrollRequest[];
  setRequests: Setter<EnrollRequest[]>;
  teachers: Teacher[];
  setTeachers: Setter<Teacher[]>;
  leaders: Leader[];
  setLeaders: Setter<Leader[]>;
  lessons: Lesson[];
  setLessons: Setter<Lesson[]>;
  reviews: Review[];
  setReviews: Setter<Review[]>;
  prices: PricePlan[];
  setPrices: Setter<PricePlan[]>;
  users: AppUser[];
  setUsers: Setter<AppUser[]>;
  org: OrgInfo;
  setOrg: Setter<OrgInfo>;

  accounts: Account[];
  saveAccount: (input: { login: string; password?: string; role: Role; name: string; teacherId?: string | null }) => Promise<void>;
  deleteAccount: (login: string) => Promise<void>;
  deleteAccountsByTeacher: (teacherId: string) => Promise<void>;
};

const Ctx = createContext<Store | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [requests, setRequestsRaw] = useState<EnrollRequest[]>([]);
  const [teachers, setTeachersRaw] = useState<Teacher[]>([]);
  const [leaders, setLeadersRaw] = useState<Leader[]>([]);
  const [lessons, setLessonsRaw] = useState<Lesson[]>([]);
  const [reviews, setReviewsRaw] = useState<Review[]>([]);
  const [prices, setPricesRaw] = useState<PricePlan[]>([]);
  const [users, setUsersRaw] = useState<AppUser[]>([]);
  const [org, setOrgRaw] = useState<OrgInfo>(EMPTY_ORG);
  const [accounts, setAccounts] = useState<Account[]>([]);

  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const save = useCallback((key: string, data: unknown) => {
    const existing = timers.current[key];
    if (existing) clearTimeout(existing);
    timers.current[key] = setTimeout(() => {
      void api(`/state/${key}`, { method: "PUT", body: JSON.stringify({ data }) }).catch((e: unknown) => {
        setError(e instanceof Error ? e.message : "Не удалось сохранить изменения");
      });
    }, 350);
  }, []);

  const applyState = useCallback((state: Partial<ServerState>) => {
    setRequestsRaw(state.requests ?? []);
    setTeachersRaw(state.teachers ?? []);
    setLeadersRaw(state.leaders ?? []);
    setLessonsRaw(state.lessons ?? []);
    setReviewsRaw(state.reviews ?? []);
    setPricesRaw(state.prices ?? []);
    setUsersRaw(state.users ?? []);
    setOrgRaw(state.org ?? EMPTY_ORG);
    setAccounts(state.accounts ?? []);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [me, state] = await Promise.all([api<Session>("/auth/me"), api<ServerState>("/state")]);
      setSession(me);
      applyState(state);
      setError(null);
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        setToken(null);
        setSession(null);
      } else {
        setError(e instanceof Error ? e.message : "Сервер недоступен");
      }
    } finally {
      setLoading(false);
    }
  }, [applyState]);

  useEffect(() => {
    if (getToken()) void load();
    else setLoading(false);
  }, [load]);

  const makeSetter = useCallback(
    <T,>(key: string, setLocal: Setter<T>): Setter<T> =>
      (update) => {
        setLocal((prev) => {
          const next = typeof update === "function" ? (update as (p: T) => T)(prev) : update;
          save(key, next);
          return next;
        });
      },
    [save],
  );

  const value = useMemo<Store>(() => {
    const refreshAccounts = (res: { accounts: Account[] }) => setAccounts(res.accounts);
    return {
      session,
      loading,
      error,
      signIn: async (login, password) => {
        try {
          const res = await api<{ token: string; session: Session }>("/auth/login", {
            method: "POST",
            body: JSON.stringify({ login, password }),
          });
          setToken(res.token);
          setSession(res.session);
          await load();
          return true;
        } catch {
          return false;
        }
      },
      signOut: () => {
        setToken(null);
        setSession(null);
        applyState({});
      },
      requests,
      setRequests: makeSetter("requests", setRequestsRaw),
      teachers,
      setTeachers: makeSetter("teachers", setTeachersRaw),
      leaders,
      setLeaders: makeSetter("leaders", setLeadersRaw),
      lessons,
      setLessons: makeSetter("lessons", setLessonsRaw),
      reviews,
      setReviews: makeSetter("reviews", setReviewsRaw),
      prices,
      setPrices: makeSetter("prices", setPricesRaw),
      users,
      setUsers: makeSetter("users", setUsersRaw),
      org,
      setOrg: makeSetter("org", setOrgRaw),
      accounts,
      saveAccount: async (input) => {
        const res = await api<{ accounts: Account[] }>("/accounts", { method: "POST", body: JSON.stringify(input) });
        refreshAccounts(res);
      },
      deleteAccount: async (login) => {
        const res = await api<{ accounts: Account[] }>(`/accounts/${encodeURIComponent(login)}`, { method: "DELETE" });
        refreshAccounts(res);
      },
      deleteAccountsByTeacher: async (teacherId) => {
        const res = await api<{ accounts: Account[] }>(`/accounts/by-teacher/${encodeURIComponent(teacherId)}`, { method: "DELETE" });
        refreshAccounts(res);
      },
    };
  }, [session, loading, error, requests, teachers, leaders, lessons, reviews, prices, users, org, accounts, makeSetter, load, applyState]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAdmin() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAdmin must be used inside AdminProvider");
  return ctx;
}
