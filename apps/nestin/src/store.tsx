import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import {
  COSTI_DEFAULT, DEMO_DATE_SHORT, INITIAL_ABSENCES_MON, INITIAL_DIARY, INITIAL_DIARY_FLAGS, INITIAL_KIDS, INITIAL_NOTICES, INITIAL_PAY, MEAL_COST_DEFAULT,
  type DiaryEntry, type DiaryFlags, type Kid, type Notice, type NoticeTarget, type PayStatus
} from '@nestin/shared';

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
        })
    }),
    [role, kids, pay, reminded, attGen, absMon, costoPasto, costi, notices, diary, diaryFlags]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
