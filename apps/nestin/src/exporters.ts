import { jsPDF } from 'jspdf';
import JSZip from 'jszip';
import { SECTIONS, type SchoolBilling } from '@nestin/shared';
import { ESENZIONE_RIF, cap, itDate, type Invoice } from './billing';

const money = (n: number): string => n.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const NAVY: [number, number, number] = [23, 48, 94];
const SUN: [number, number, number] = [244, 196, 48];
const MUTED: [number, number, number] = [91, 82, 71];

/* ------------------------------------------------------------------ PDF */

function drawInvoice(doc: jsPDF, inv: Invoice, s: SchoolBilling) {
  const W = 210;
  const L = 18;
  const R = W - 18;

  // Intestazione
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, W, 34, 'F');
  doc.setFillColor(...SUN);
  doc.rect(0, 34, W, 2.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(17);
  doc.text(s.ragioneSociale, L, 15);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.text(`${s.address} · ${s.cap} ${s.city} (${s.prov})`, L, 22);
  doc.text(`P. IVA ${s.piva} · C.F. ${s.cf}`, L, 27.5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('FATTURA', R, 15, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`N. ${inv.number}`, R, 22, { align: 'right' });
  doc.text(`del ${itDate(inv.date)}`, R, 27.5, { align: 'right' });

  // Destinatario e riferimento bambino
  doc.setTextColor(...MUTED);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('INTESTATARIO', L, 50);
  doc.text('RIFERIMENTO', 118, 50);
  doc.setTextColor(...NAVY);
  doc.setFontSize(11);
  doc.text(inv.payer.name, L, 57);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`C.F. ${inv.payer.cf}`, L, 63);
  doc.text(inv.payer.address, L, 68.5);
  doc.text(`${inv.payer.cap} ${inv.payer.city} (${inv.payer.prov})`, L, 74);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(inv.kidName, 118, 57);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Sezione ${SECTIONS[inv.sec].name}`, 118, 63);
  doc.text(`Periodo: ${cap(inv.monthLabel)}`, 118, 68.5);
  doc.text(`Scadenza: ${itDate(inv.due)}`, 118, 74);

  // Tabella righe
  let y = 90;
  doc.setFillColor(248, 244, 236);
  doc.rect(L, y - 6, R - L, 9, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...MUTED);
  doc.text('Descrizione', L + 3, y);
  doc.text('Ore/sett.', 140, y, { align: 'right' });
  doc.text('Importo', R - 3, y, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(...NAVY);
  y += 10;
  for (const l of inv.lines) {
    const desc = doc.splitTextToSize(l.desc, 100) as string[];
    doc.text(desc[0] + (desc.length > 1 ? '…' : ''), L + 3, y);
    if (l.hours !== undefined) doc.text(String(l.hours).replace('.', ','), 140, y, { align: 'right' });
    doc.text(`€ ${money(l.amount)}`, R - 3, y, { align: 'right' });
    doc.setDrawColor(239, 231, 216);
    doc.line(L, y + 3.5, R, y + 3.5);
    y += 10;
  }

  // Totali
  y += 4;
  const tot = (label: string, value: string, bold = false) => {
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.text(label, 140, y, { align: 'right' });
    doc.text(value, R - 3, y, { align: 'right' });
    y += 7;
  };
  doc.setFontSize(10);
  tot('Totale esente IVA (N4)', `€ ${money(inv.esente)}`);
  const recupero = inv.lines.find((l) => l.kind === 'bollo');
  if (recupero) tot('Recupero bollo (N1)', `€ ${money(recupero.amount)}`);
  y += 2;
  doc.setFillColor(...SUN);
  doc.roundedRect(96, y - 6.5, R - 96, 11, 2, 2, 'F');
  doc.setFontSize(12);
  tot('Totale da pagare', `€ ${money(inv.total)}`, true);

  // Pagamento e note
  y += 10;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...MUTED);
  doc.text('PAGAMENTO', L, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...NAVY);
  doc.setFontSize(10);
  doc.text(`Bonifico entro il ${itDate(inv.due)} · IBAN ${s.iban}`, L, y + 6);
  doc.text(`Causale: Fattura ${inv.number} – ${inv.kidName}`, L, y + 11.5);

  y += 24;
  doc.setFontSize(8.5);
  doc.setTextColor(...MUTED);
  const notes = [
    'Operazione esente IVA ai sensi dell\'art. 10 n. 20 DPR 633/72.',
    inv.bollo ? `Imposta di bollo di € ${money(inv.bollo)} assolta in modo virtuale.` : '',
    'Le rette sono detraibili nella dichiarazione dei redditi se pagate con strumenti tracciabili.',
    'Copia di cortesia: la fattura elettronica è trasmessa tramite il Sistema di Interscambio (SdI).'
  ].filter(Boolean);
  notes.forEach((n, i) => doc.text(n, L, y + i * 4.6));

  doc.setFontSize(8);
  doc.text(`${s.ragioneSociale} · documento generato con NestIN`, W / 2, 287, { align: 'center' });
}

/** Un unico PDF con una pagina per fattura. */
export function invoicesPdf(invoices: Invoice[], s: SchoolBilling): Blob {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  invoices.forEach((inv, i) => {
    if (i > 0) doc.addPage();
    drawInvoice(doc, inv, s);
  });
  return doc.output('blob');
}

export const fileBase = (inv: Invoice): string =>
  `Fattura_${inv.number.replace('/', '-')}_${inv.kidName.replace(/\s+/g, '_')}`;

/** ZIP con un PDF per ogni fattura. */
export async function invoicesPdfZip(invoices: Invoice[], s: SchoolBilling): Promise<Blob> {
  const zip = new JSZip();
  for (const inv of invoices) zip.file(`${fileBase(inv)}.pdf`, invoicesPdf([inv], s));
  return zip.generateAsync({ type: 'blob' });
}

/* ------------------------------------------------------------------ CSV */

const csvCell = (v: string | number): string => {
  const t = typeof v === 'number' ? v.toFixed(2).replace('.', ',') : v;
  return /[;"\n]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t;
};

/**
 * CSV a righe di fattura (una riga per voce), separatore ";" e decimali con la virgola:
 * si apre in Excel e si importa nei gestionali (SAP, TeamSystem, Zucchetti…) con un tracciato di mappatura.
 */
export function invoicesCsv(invoices: Invoice[], s: SchoolBilling): Blob {
  const head = [
    'NumeroFattura', 'DataFattura', 'DataScadenza', 'Periodo', 'TipoDocumento', 'PartitaIvaEmittente',
    'CodiceFiscaleCliente', 'Cliente', 'Indirizzo', 'CAP', 'Comune', 'Provincia', 'Email',
    'Bambino', 'Sezione', 'NumeroRiga', 'TipoRiga', 'Descrizione', 'OreSettimanali', 'Quantita',
    'PrezzoUnitario', 'ImportoRiga', 'AliquotaIVA', 'NaturaIVA', 'RiferimentoNormativo', 'ImportoBollo', 'TotaleDocumento', 'IBAN'
  ];
  const rows = invoices.flatMap((inv) =>
    inv.lines.map((l, i) => [
      inv.number, itDate(inv.date), itDate(inv.due), cap(inv.monthLabel), 'TD01', s.piva,
      inv.payer.cf, inv.payer.name, inv.payer.address, inv.payer.cap, inv.payer.city, inv.payer.prov, inv.payer.email,
      inv.kidName, SECTIONS[inv.sec].name, String(i + 1), l.kind, l.desc, l.hours !== undefined ? String(l.hours).replace('.', ',') : '', '1',
      l.amount, l.amount, 0, l.natura, l.natura === 'N4' ? ESENZIONE_RIF : 'Escluso art. 15 DPR 633/72', inv.bollo, inv.total, s.iban
    ].map(csvCell).join(';'))
  );
  return new Blob(['﻿' + [head.join(';'), ...rows].join('\r\n') + '\r\n'], { type: 'text/csv;charset=utf-8' });
}

/* ------------------------------------------------------- XML FatturaPA */

/** Lo SdI accetta solo caratteri Latin-1: trattini lunghi, apostrofi tipografici ecc. vanno convertiti. */
const latin1 = (v: string): string =>
  v.replace(/[\u2013\u2014]/g, '-').replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/\u2026/g, '...').replace(/\u20AC/g, 'EUR').replace(/[^\u0000-\u00FF]/g, '');
const x = (v: string): string => latin1(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const d2 = (n: number): string => n.toFixed(2);

/** Progressivo d'invio di 5 caratteri alfanumerici per il nome file SdI. */
const progressivo = (inv: Invoice): string => (Number(inv.date.slice(2, 4)) * 1000 + inv.seq).toString(36).toUpperCase().padStart(5, '0').slice(-5);
export const xmlFileName = (inv: Invoice, s: SchoolBilling): string => `IT${s.piva}_${progressivo(inv)}.xml`;

/** Fattura elettronica ordinaria FPR12 (versione 1.2) verso un privato senza P. IVA. */
export function fatturaPaXml(inv: Invoice, s: SchoolBilling): string {
  const [nome, ...rest] = inv.payer.name.split(' ');
  const cognome = rest.join(' ');
  const righe = inv.lines.map((l, i) => `
      <DettaglioLinee>
        <NumeroLinea>${i + 1}</NumeroLinea>
        <Descrizione>${x(l.desc)}</Descrizione>
        <Quantita>1.00</Quantita>
        <PrezzoUnitario>${d2(l.amount)}</PrezzoUnitario>
        <PrezzoTotale>${d2(l.amount)}</PrezzoTotale>
        <AliquotaIVA>0.00</AliquotaIVA>
        <Natura>${l.natura}</Natura>
      </DettaglioLinee>`).join('');
  const sum = (n: 'N4' | 'N1') => inv.lines.filter((l) => l.natura === n).reduce((a, l) => a + l.amount, 0);
  const riepilogo = (['N4', 'N1'] as const).filter((n) => sum(n) > 0).map((n) => `
      <DatiRiepilogo>
        <AliquotaIVA>0.00</AliquotaIVA>
        <Natura>${n}</Natura>
        <ImponibileImporto>${d2(sum(n))}</ImponibileImporto>
        <Imposta>0.00</Imposta>
        <RiferimentoNormativo>${x(n === 'N4' ? ESENZIONE_RIF : 'Escluso art. 15 DPR 633/72')}</RiferimentoNormativo>
      </DatiRiepilogo>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<p:FatturaElettronica versione="FPR12" xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns:p="http://ivaservizi.agenziaentrate.gov.it/docs/xsd/fatture/v1.2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://ivaservizi.agenziaentrate.gov.it/docs/xsd/fatture/v1.2 http://www.fatturapa.gov.it/export/fatturazione/sdi/fatturapa/v1.2/Schema_del_file_xml_FatturaPA_versione_1.2.xsd">
  <FatturaElettronicaHeader>
    <DatiTrasmissione>
      <IdTrasmittente>
        <IdPaese>IT</IdPaese>
        <IdCodice>${x(s.piva)}</IdCodice>
      </IdTrasmittente>
      <ProgressivoInvio>${progressivo(inv)}</ProgressivoInvio>
      <FormatoTrasmissione>FPR12</FormatoTrasmissione>
      <CodiceDestinatario>0000000</CodiceDestinatario>
    </DatiTrasmissione>
    <CedentePrestatore>
      <DatiAnagrafici>
        <IdFiscaleIVA>
          <IdPaese>IT</IdPaese>
          <IdCodice>${x(s.piva)}</IdCodice>
        </IdFiscaleIVA>
        <CodiceFiscale>${x(s.cf)}</CodiceFiscale>
        <Anagrafica>
          <Denominazione>${x(s.ragioneSociale)}</Denominazione>
        </Anagrafica>
        <RegimeFiscale>RF01</RegimeFiscale>
      </DatiAnagrafici>
      <Sede>
        <Indirizzo>${x(s.address)}</Indirizzo>
        <CAP>${x(s.cap)}</CAP>
        <Comune>${x(s.city)}</Comune>
        <Provincia>${x(s.prov)}</Provincia>
        <Nazione>IT</Nazione>
      </Sede>
    </CedentePrestatore>
    <CessionarioCommittente>
      <DatiAnagrafici>
        <CodiceFiscale>${x(inv.payer.cf)}</CodiceFiscale>
        <Anagrafica>
          <Nome>${x(nome)}</Nome>
          <Cognome>${x(cognome)}</Cognome>
        </Anagrafica>
      </DatiAnagrafici>
      <Sede>
        <Indirizzo>${x(inv.payer.address)}</Indirizzo>
        <CAP>${x(inv.payer.cap)}</CAP>
        <Comune>${x(inv.payer.city)}</Comune>
        <Provincia>${x(inv.payer.prov)}</Provincia>
        <Nazione>IT</Nazione>
      </Sede>
    </CessionarioCommittente>
  </FatturaElettronicaHeader>
  <FatturaElettronicaBody>
    <DatiGenerali>
      <DatiGeneraliDocumento>
        <TipoDocumento>TD01</TipoDocumento>
        <Divisa>EUR</Divisa>
        <Data>${inv.date}</Data>
        <Numero>${x(inv.number)}</Numero>${inv.bollo ? `
        <DatiBollo>
          <BolloVirtuale>SI</BolloVirtuale>
          <ImportoBollo>${d2(inv.bollo)}</ImportoBollo>
        </DatiBollo>` : ''}
        <ImportoTotaleDocumento>${d2(inv.total)}</ImportoTotaleDocumento>
        <Causale>${x(`Retta e corsi ${inv.monthLabel} – ${inv.kidName}`)}</Causale>
      </DatiGeneraliDocumento>
    </DatiGenerali>
    <DatiBeniServizi>${righe}${riepilogo}
    </DatiBeniServizi>
    <DatiPagamento>
      <CondizioniPagamento>TP02</CondizioniPagamento>
      <DettaglioPagamento>
        <ModalitaPagamento>MP05</ModalitaPagamento>
        <DataScadenzaPagamento>${inv.due}</DataScadenzaPagamento>
        <ImportoPagamento>${d2(inv.total)}</ImportoPagamento>
        <IBAN>${x(s.iban)}</IBAN>
      </DettaglioPagamento>
    </DatiPagamento>
  </FatturaElettronicaBody>
</p:FatturaElettronica>
`;
}

/** ZIP con un file XML FatturaPA per ogni fattura, pronto per il gestionale o l'intermediario SdI. */
export async function invoicesXmlZip(invoices: Invoice[], s: SchoolBilling): Promise<Blob> {
  const zip = new JSZip();
  for (const inv of invoices) zip.file(xmlFileName(inv, s), fatturaPaXml(inv, s));
  return zip.generateAsync({ type: 'blob' });
}

/* -------------------------------------------------------------- download */

export function download(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
