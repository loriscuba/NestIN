import { SECTIONS, rettaOf, type Course, type Kid, type Payer, type SchoolBilling, type SectionId } from '@nestin/shared';

/** Soglia oltre la quale una fattura esente IVA paga 2 € di imposta di bollo. */
export const BOLLO_THRESHOLD = 77.47;
export const BOLLO_AMOUNT = 2;
export const ESENZIONE_RIF = 'Esente IVA art. 10 n. 20 DPR 633/72';

export interface InvoiceLine {
  desc: string;
  /** Ore settimanali, solo per i corsi */
  hours?: number;
  amount: number;
  /** N4 = esente (retta e corsi), N1 = escluso art. 15 (recupero bollo) */
  natura: 'N4' | 'N1';
  kind: 'retta' | 'corso' | 'bollo';
}

export interface Invoice {
  seq: number;
  number: string;
  /** AAAA-MM-GG */
  date: string;
  due: string;
  monthKey: string;
  monthLabel: string;
  kidId: number;
  kidName: string;
  sec: SectionId;
  payer: Payer;
  lines: InvoiceLine[];
  /** Somma delle righe esenti (retta + corsi) */
  esente: number;
  bollo: number;
  total: number;
}

export interface Month { key: string; label: string; year: number; month: number }

const MONTH_NAMES = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];

/** Mesi dell'anno scolastico 2026/27 (settembre–luglio). */
export const SCHOOL_MONTHS: Month[] = Array.from({ length: 11 }, (_, i) => {
  const m = ((8 + i) % 12) + 1;
  const y = m >= 9 ? 2026 : 2027;
  return { key: `${y}-${String(m).padStart(2, '0')}`, label: `${MONTH_NAMES[m - 1]} ${y}`, year: y, month: m };
});
export const DEFAULT_MONTH = '2026-10';
export const monthOf = (key: string): Month => SCHOOL_MONTHS.find((m) => m.key === key) ?? SCHOOL_MONTHS[1];
export const cap = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

export const round2 = (n: number): number => Math.round(n * 100) / 100;
export const itDate = (iso: string): string => iso.split('-').reverse().join('/');

/** Righe e totali della fattura mensile di un bambino: retta della sezione + corsi assegnati (+ bollo). */
export function buildLines(kid: Kid, courseIds: number[], courses: Course[], school: SchoolBilling, monthLabel: string) {
  const lines: InvoiceLine[] = [
    { desc: `Retta mensile ${monthLabel} – Sezione ${SECTIONS[kid.sec].name}`, amount: rettaOf(kid), natura: 'N4', kind: 'retta' }
  ];
  for (const c of courses) {
    if (courseIds.includes(c.id)) lines.push({ desc: `${c.name} – ${monthLabel}`, hours: c.hours, amount: c.price, natura: 'N4', kind: 'corso' });
  }
  const esente = round2(lines.reduce((a, l) => a + l.amount, 0));
  const bollo = esente > BOLLO_THRESHOLD ? BOLLO_AMOUNT : 0;
  if (bollo && school.bolloToFamily) lines.push({ desc: 'Recupero imposta di bollo (art. 15 DPR 633/72)', amount: bollo, natura: 'N1', kind: 'bollo' });
  const total = round2(lines.reduce((a, l) => a + l.amount, 0));
  return { lines, esente, bollo, total };
}

/** Genera le fatture del mese per tutti i bambini, numerandole da `firstSeq`. */
export function buildInvoices(
  monthKey: string, kids: Kid[], enrollments: Record<number, number[]>, courses: Course[],
  payers: Record<number, Payer>, school: SchoolBilling, firstSeq: number
): Invoice[] {
  const m = monthOf(monthKey);
  const date = `${m.key}-01`;
  const due = `${m.key}-${String(school.dueDay).padStart(2, '0')}`;
  return kids.map((kid, i) => {
    const seq = firstSeq + i;
    const { lines, esente, bollo, total } = buildLines(kid, enrollments[kid.id] ?? [], courses, school, m.label);
    return {
      seq, number: `${m.year}/${String(seq).padStart(3, '0')}`, date, due, monthKey, monthLabel: m.label,
      kidId: kid.id, kidName: kid.name, sec: kid.sec, payer: payers[kid.id], lines, esente, bollo, total
    };
  });
}
