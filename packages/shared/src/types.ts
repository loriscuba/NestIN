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
