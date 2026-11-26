import { useEffect, useState } from 'react';
import type { SectionId } from './types';

/** Colloqui genitori-maestra: slot per sezione, prenotazioni con conferma della maestra. */
export type BookingStatus = 'attesa' | 'confermato' | 'rifiutato';
export interface Booking { kidId: number; status: BookingStatus; note?: string }
export interface MeetingSlot { id: number; sec: SectionId; date: string; time: string; mins: number; booking?: Booking }

/** "Oggi" della demo (ISO) e preavviso minimo per modificare/annullare. */
export const DEMO_TODAY = '2026-10-02';
export const CHANGE_DAYS = 2;
export const BOOKING_META: Record<BookingStatus, { label: string; cls: string }> = {
  attesa: { label: 'In attesa di conferma', cls: 'warn' },
  confermato: { label: 'Confermato', cls: 'ok' },
  rifiutato: { label: 'Rifiutato', cls: 'bad' }
};

const day = (iso: string) => new Date(iso + 'T00:00:00Z').getTime() / 86400000;
/** Il genitore può modificare/annullare fino a 2 giorni prima del colloquio. */
export const canChange = (s: MeetingSlot): boolean => day(s.date) - day(DEMO_TODAY) >= CHANGE_DAYS;
export const isFree = (s: MeetingSlot): boolean => !s.booking || s.booking.status === 'rifiutato';
export const fmtDate = (iso: string): string =>
  new Date(iso + 'T12:00:00Z').toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' });

const INITIAL: MeetingSlot[] = [
  { id: 1, sec: 'farm', date: '2026-10-03', time: '16:30', mins: 20, booking: { kidId: 2, status: 'confermato' } },
  { id: 2, sec: 'farm', date: '2026-10-07', time: '16:30', mins: 20, booking: { kidId: 3, status: 'attesa' } },
  { id: 3, sec: 'farm', date: '2026-10-07', time: '16:50', mins: 20 },
  { id: 4, sec: 'farm', date: '2026-10-07', time: '17:10', mins: 20 },
  { id: 5, sec: 'farm', date: '2026-10-09', time: '16:30', mins: 20 },
  { id: 6, sec: 'jungle', date: '2026-10-08', time: '16:45', mins: 20 },
  { id: 7, sec: 'ocean', date: '2026-10-08', time: '17:00', mins: 20 }
];

/** Salvato in localStorage: NestIN e NestApp, aperte nello stesso browser, vedono gli stessi slot. */
const KEY = 'nestin.meetings.v1';
const load = (): MeetingSlot[] => {
  try { const raw = localStorage.getItem(KEY); if (raw) return JSON.parse(raw); } catch { /* ignore */ }
  return INITIAL;
};

export function useMeetings() {
  const [slots, setSlots] = useState<MeetingSlot[]>(load);
  useEffect(() => {
    const on = (e: StorageEvent) => { if (e.key === KEY) setSlots(load()); };
    window.addEventListener('storage', on);
    return () => window.removeEventListener('storage', on);
  }, []);
  const save = (fn: (s: MeetingSlot[]) => MeetingSlot[]) =>
    setSlots((cur) => {
      const next = fn(cur).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  const patch = (id: number, booking: Booking | undefined) => save((s) => s.map((x) => (x.id === id ? { ...x, booking } : x)));
  return {
    slots,
    addSlot: (sec: SectionId, date: string, time: string, mins: number) =>
      save((s) => [...s, { id: Date.now(), sec, date, time, mins }]),
    removeSlot: (id: number) => save((s) => s.filter((x) => x.id !== id)),
    /** Maestra: conferma o rifiuta una richiesta. */
    setStatus: (id: number, status: BookingStatus) =>
      save((s) => s.map((x) => (x.id === id && x.booking ? { ...x, booking: { ...x.booking, status } } : x))),
    /** Genitore: prenota (o sposta, liberando lo slot precedente). */
    book: (id: number, kidId: number, note?: string, fromId?: number) =>
      save((s) => s.map((x) =>
        x.id === id ? { ...x, booking: { kidId, status: 'attesa' as const, note } } : x.id === fromId ? { ...x, booking: undefined } : x)),
    cancel: (id: number) => patch(id, undefined)
  };
}
