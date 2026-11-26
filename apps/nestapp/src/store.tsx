import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { DEMO_CHILD_ID, INITIAL_DIARY, INITIAL_KIDS, INITIAL_NOTICES, INITIAL_PAY, noticeVisibleTo, type DiaryEntry, type Kid, type Notice } from '@nestin/shared';

interface Absence { day: string; reason: string }

interface Store {
  child: Kid;
  diary: DiaryEntry[];
  notices: Notice[];
  done: Record<number, boolean>;
  markDone: (id: number) => void;
  absence: Absence | null;
  sendAbsence: (a: Absence) => void;
  clearAbsence: () => void;
  paid: boolean;
  pay: () => void;
}

const Ctx = createContext<Store | null>(null);

export function useStore(): Store {
  const c = useContext(Ctx);
  if (!c) throw new Error('StoreProvider mancante');
  return c;
}

/** Stato in memoria. Quando ci sarà un backend, questo è il punto da sostituire con le chiamate API. */
export function StoreProvider({ children }: { children: ReactNode }) {
  const child = INITIAL_KIDS.find((k) => k.id === DEMO_CHILD_ID)!;
  const [done, setDone] = useState<Record<number, boolean>>({});
  const [absence, setAbsence] = useState<Absence | null>(null);
  const [paid, setPaid] = useState(INITIAL_PAY[child.id] === 'paid');

  const value = useMemo<Store>(
    () => ({
      child,
      diary: INITIAL_DIARY[child.id] ?? [],
      notices: INITIAL_NOTICES.filter((n) => noticeVisibleTo(n.target, child.sec)),
      done,
      markDone: (id) => setDone((d) => ({ ...d, [id]: true })),
      absence,
      sendAbsence: setAbsence,
      clearAbsence: () => setAbsence(null),
      paid,
      pay: () => setPaid(true)
    }),
    [child, done, absence, paid]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
