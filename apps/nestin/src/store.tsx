import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import {
  INITIAL_COURSES, INITIAL_ENROLLMENTS, INITIAL_PAYERS, SCHOOL_BILLING_DEFAULT,
  type Course, type Payer, type SchoolBilling,
  COSTI_DEFAULT, DEMO_DATE_SHORT, INITIAL_ABSENCES_MON, INITIAL_DIARY, INITIAL_DIARY_FLAGS, INITIAL_KIDS, INITIAL_NOTICES, INITIAL_PAY, MEAL_COST_DEFAULT,
  type DiaryEntry, type DiaryFlags, type Kid, type Notice, type NoticeTarget, type PayStatus
} from '@nestin/shared';
import { buildInvoices, monthOf, type Invoice } from './billing';

export type Role = 'segreteria' | 'maestra';

interface Store {
  role: Role;
  setRole: (r: Role) => void;
  kids: Kid[];
  togglePresent: (id: number) => void;
  allPresent: (sec: Kid['sec']) => void;
  pay: Record<number, PayStatus>;
  markPaid: (id: number) => void;
  reminded: Record<number, boolean>;
  remindAll: () => void;
  attGen: boolean;
  genAtt: () => void;
  absMon: Record<number, boolean>;
  toggleAbsMon: (id: number) => void;
  costoPasto: string;
  setCostoPasto: (v: string) => void;
  costi: typeof COSTI_DEFAULT;
  setCosto: (k: keyof typeof COSTI_DEFAULT, v: string) => void;
  notices: Notice[];
  sendNotice: (title: string, body: string, target: NoticeTarget) => void;
  diary: Record<number, DiaryEntry[]>;
  addDiary: (kidId: number, text: string) => void;
  diaryFlags: Record<number, DiaryFlags>;
  toggleDiaryFlag: (kidId: number, flag: keyof DiaryFlags) => void;
  courses: Course[];
  saveCourse: (c: Course) => void;
  removeCourse: (id: number) => void;
  enrollments: Record<number, number[]>;
  toggleEnroll: (kidId: number, courseId: number) => void;
  payers: Record<number, Payer>;
  school: SchoolBilling;
  setSchool: (s: SchoolBilling) => void;
  /** Fatture emesse per mese (AAAA-MM → fatture) */
  invoices: Record<string, Invoice[]>;
  generateInvoices: (monthKey: string) => void;
  /** Annulla l'ultimo lotto emesso dell'anno (per correggere e rigenerare) */
  cancelInvoices: (monthKey: string) => void;
  canCancel: (monthKey: string) => boolean;
}

const Ctx = createContext<Store | null>(null);

export function useStore(): Store {
  const c = useContext(Ctx);
  if (!c) throw new Error('StoreProvider mancante');
  return c;
}

/** Stato interamente in memoria: ricaricando la pagina si riparte dai dati finti. */
export function StoreProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('segreteria');
  const [kids, setKids] = useState<Kid[]>(INITIAL_KIDS);
  const [pay, setPay] = useState(INITIAL_PAY);
  const [reminded, setReminded] = useState<Record<number, boolean>>({});
  const [attGen, setAttGen] = useState(false);
  const [absMon, setAbsMon] = useState(INITIAL_ABSENCES_MON);
  const [costoPasto, setCostoPasto] = useState(MEAL_COST_DEFAULT);
  const [costi, setCosti] = useState(COSTI_DEFAULT);
  const [notices, setNotices] = useState(INITIAL_NOTICES);
  const [diary, setDiary] = useState(INITIAL_DIARY);
  const [diaryFlags, setDiaryFlags] = useState(INITIAL_DIARY_FLAGS);
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [enrollments, setEnrollments] = useState<Record<number, number[]>>(INITIAL_ENROLLMENTS);
  const [payers] = useState<Record<number, Payer>>(INITIAL_PAYERS);
  const [school, setSchool] = useState<SchoolBilling>(SCHOOL_BILLING_DEFAULT);
  const [invoices, setInvoices] = useState<Record<string, Invoice[]>>({});

  /** Ultimo numero di fattura usato nell'anno (la numerazione riparte a gennaio). */
  const lastSeq = (year: number): number =>
    Math.max(0, ...Object.values(invoices).flat().filter((i) => i.date.startsWith(String(year))).map((i) => i.seq));
  const canCancel = (monthKey: string): boolean => {
    const batch = invoices[monthKey];
    if (!batch?.length) return false;
    return batch[batch.length - 1].seq === lastSeq(monthOf(monthKey).year);
  };

  const value = useMemo<Store>(
    () => ({
      role, setRole, kids,
      togglePresent: (id) => setKids((ks) => ks.map((k) => (k.id === id ? { ...k, present: !k.present, ingresso: !k.present ? '08:45' : '—' } : k))),
      allPresent: (sec) => setKids((ks) => ks.map((k) => (k.sec === sec && !k.present ? { ...k, present: true, ingresso: '08:45' } : k))),
      pay,
      markPaid: (id) => setPay((p) => ({ ...p, [id]: 'paid' })),
      reminded,
      remindAll: () => setReminded(Object.fromEntries(kids.filter((k) => pay[k.id] !== 'paid').map((k) => [k.id, true]))),
      attGen, genAtt: () => setAttGen(true),
      absMon, toggleAbsMon: (id) => setAbsMon((a) => ({ ...a, [id]: !a[id] })),
      costoPasto, setCostoPasto,
      costi, setCosto: (k, v) => setCosti((c) => ({ ...c, [k]: v })),
      notices,
      sendNotice: (title, body, target) => setNotices((n) => [{ id: Date.now(), title, body, target, date: DEMO_DATE_SHORT, fresh: true }, ...n]),
      diary,
      addDiary: (kidId, text) => setDiary((d) => ({ ...d, [kidId]: [...(d[kidId] ?? []), { time: '14:30', text }] })),
      diaryFlags,
      toggleDiaryFlag: (kidId, flag) =>
        setDiaryFlags((f) => {
          const cur = f[kidId] ?? { cacca: false, nanna: false };
          return { ...f, [kidId]: { ...cur, [flag]: !cur[flag] } };
        }),
      courses,
      saveCourse: (c) => setCourses((cs) => (cs.some((x) => x.id === c.id) ? cs.map((x) => (x.id === c.id ? c : x)) : [...cs, c])),
      removeCourse: (id) => {
        setCourses((cs) => cs.filter((c) => c.id !== id));
        setEnrollments((e) => Object.fromEntries(Object.entries(e).map(([k, v]) => [k, v.filter((c) => c !== id)])));
      },
      enrollments,
      toggleEnroll: (kidId, courseId) =>
        setEnrollments((e) => {
          const cur = e[kidId] ?? [];
          return { ...e, [kidId]: cur.includes(courseId) ? cur.filter((c) => c !== courseId) : [...cur, courseId] };
        }),
      payers,
      school, setSchool,
      invoices,
      generateInvoices: (monthKey) => {
        if (invoices[monthKey]?.length) return;
        const batch = buildInvoices(monthKey, kids, enrollments, courses, payers, school, lastSeq(monthOf(monthKey).year) + 1);
        setInvoices((inv) => ({ ...inv, [monthKey]: batch }));
      },
      cancelInvoices: (monthKey) => {
        if (!canCancel(monthKey)) return;
        setInvoices((inv) => {
          const next = { ...inv };
          delete next[monthKey];
          return next;
        });
      },
      canCancel
    }),
    [role, kids, pay, reminded, attGen, absMon, costoPasto, costi, notices, diary, diaryFlags, courses, enrollments, payers, school, invoices]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
