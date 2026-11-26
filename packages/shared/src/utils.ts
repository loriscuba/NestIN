import type { Kid, NoticeTarget, PayStatus, SectionId } from './types';
import { SECTIONS } from './data';

export const num = (v: string | number): number => {
  const n = parseFloat(String(v).replace(',', '.'));
  return isNaN(n) ? 0 : n;
};
export const eur = (n: number): string => '€ ' + Math.round(n).toLocaleString('it-IT');
export const eur2 = (n: number): string => '€ ' + n.toFixed(2).replace('.', ',');
export const initials = (name: string): string => name.split(' ').map((p) => p[0]).join('');
export const firstName = (name: string): string => name.split(' ')[0];
export const lastName = (name: string): string => name.split(' ')[1] ?? '';

export const dietaOf = (nota: string): string => {
  if (nota.includes('latticini')) return 'Senza latticini';
  if (nota.includes('glutine')) return 'Senza glutine';
  if (nota.includes('uova')) return 'Senza uova';
  if (nota.includes('frutta secca')) return 'Senza frutta secca';
  return '';
};

export const PAY_META: Record<PayStatus, { label: string; cls: string }> = {
  paid: { label: 'Pagata', cls: 'ok' },
  wait: { label: 'In attesa', cls: 'warn' },
  late: { label: 'Scaduta', cls: 'bad' }
};

export const secClass = (s: SectionId): string => s;
export const secName = (s: SectionId): string => SECTIONS[s].name;
export const rettaOf = (k: Kid): number => SECTIONS[k.sec].retta;

export const targetClass = (t: NoticeTarget): string => (t === 'Tutti' ? 'navy-soft' : t.toLowerCase());
/** Un avviso è visibile a una sezione se è per Tutti o per quella sezione. */
export const noticeVisibleTo = (t: NoticeTarget, sec: SectionId): boolean => t === 'Tutti' || t === SECTIONS[sec].name;
