export type SectionId = 'farm' | 'jungle' | 'ocean';
export type PayStatus = 'paid' | 'wait' | 'late';
export type NoticeTarget = 'Tutti' | 'Farm' | 'Jungle' | 'Ocean';

export interface Kid {
  id: number;
  sec: SectionId;
  name: string;
  eta: string;
  nota: string;
  contatto: string;
  delega: string;
  present: boolean;
  ingresso: string;
}

export interface Notice {
  id: number;
  title: string;
  target: NoticeTarget;
  date: string;
  body: string;
  /** Azione richiesta alla famiglia (es. prenotare, autorizzare) */
  action?: string;
  doneLabel?: string;
  fresh?: boolean;
}

export interface MenuDay {
  name: string;
  primo: string;
  secondo: string;
  contorno: string;
}

export interface DiaryEntry {
  time: string;
  text: string;
}

/** Spunte rapide del diario di oggi, per bambino. */
export interface DiaryFlags {
  cacca: boolean;
  nanna: boolean;
}

export const DIARY_FLAG_LABELS: Record<keyof DiaryFlags, string> = { cacca: 'Cacca', nanna: 'Nanna' };

/** Corso a pagamento del listino (es. Inglese, Musica), con canone mensile e ore settimanali. */
export interface Course {
  id: number;
  name: string;
  /** Canone mensile in euro */
  price: number;
  /** Ore di corso a settimana */
  hours: number;
  /** Giorno/orario o breve descrizione */
  desc: string;
}

/** Intestatario delle fatture del bambino (genitore che paga). */
export interface Payer {
  name: string;
  cf: string;
  address: string;
  cap: string;
  city: string;
  prov: string;
  email: string;
}

/** Dati dell'asilo che compaiono in fattura (cedente/prestatore). */
export interface SchoolBilling {
  ragioneSociale: string;
  piva: string;
  cf: string;
  address: string;
  cap: string;
  city: string;
  prov: string;
  iban: string;
  /** Giorno del mese entro cui pagare */
  dueDay: number;
  /** Addebitare alla famiglia i 2 € di bollo sulle fatture esenti sopra 77,47 € */
  bolloToFamily: boolean;
}
