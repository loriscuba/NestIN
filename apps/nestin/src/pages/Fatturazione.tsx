import { useMemo, useState } from 'react';
import { SECTIONS, eur2, lastName, type SchoolBilling } from '@nestin/shared';
import { useStore } from '../store';
import { BOLLO_THRESHOLD, DEFAULT_MONTH, SCHOOL_MONTHS, buildLines, cap, itDate, monthOf, type Invoice } from '../billing';
/** Le librerie PDF/ZIP si caricano solo quando servono, per non appesantire l'app. */
const ex = () => import('../exporters');

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

export function Fatturazione() {
  const { kids, courses, enrollments, school, setSchool, invoices, generateInvoices, cancelInvoices, canCancel } = useStore();
  const [monthKey, setMonthKey] = useState(DEFAULT_MONTH);
  const [busy, setBusy] = useState<string | null>(null);
  const [showSchool, setShowSchool] = useState(false);
  const month = monthOf(monthKey);
  const issued = invoices[monthKey];
  const slug = monthKey;

  /** Anteprima se il mese non è ancora fatturato, altrimenti le fatture emesse. */
  const rows = useMemo(() => {
    if (issued) return issued.map((inv) => ({ kidId: inv.kidId, name: inv.kidName, sec: inv.sec, lines: inv.lines, total: inv.total, inv: inv as Invoice | undefined }));
    return kids.map((k) => {
      const b = buildLines(k, enrollments[k.id] ?? [], courses, school, month.label);
      return { kidId: k.id, name: k.name, sec: k.sec, lines: b.lines, total: b.total, inv: undefined };
    });
  }, [issued, kids, enrollments, courses, school, month.label]);

  const by = (kind: string) => sum(rows.flatMap((r) => r.lines.filter((l) => l.kind === kind).map((l) => l.amount)));
  const totRette = by('retta');
  const totCorsi = by('corso');
  const totBollo = by('bollo');
  const totale = sum(rows.map((r) => r.total));

  const run = async (label: string, fn: () => Promise<void> | void) => {
    setBusy(label);
    try { await fn(); } finally { setBusy(null); }
  };

  const cols = 'minmax(0,2.6fr) minmax(0,1fr) minmax(0,2.4fr) minmax(0,0.8fr) minmax(0,1.1fr) minmax(0,1.3fr)';

  return (
    <section className="stack">
      <div className="card" style={{ padding: '18px 24px' }}>
        <div className="row between wrap">
          <label className="row" style={{ gap: 10, fontWeight: 700 }}>
            Mese da fatturare
            <select className="input" style={{ width: 'auto' }} value={monthKey} onChange={(e) => setMonthKey(e.target.value)}>
              {SCHOOL_MONTHS.map((m) => <option key={m.key} value={m.key}>{cap(m.label)}{invoices[m.key] ? ' · emesse' : ''}</option>)}
            </select>
          </label>
          {!issued && (
            <button className="btn primary" disabled={kids.length === 0} onClick={() => generateInvoices(monthKey)}>
              Genera {kids.length} fatture di {month.label}
            </button>
          )}
          {issued && (
            <span className="badge ok" style={{ padding: '10px 16px', borderRadius: 12, fontSize: 14 }}>
              {issued.length} fatture emesse · n. {issued[0].number} – {issued[issued.length - 1].number}
            </span>
          )}
        </div>
        {!issued && <div className="muted small">Anteprima: retta della sezione più i corsi assegnati. Data fattura {itDate(`${monthKey}-01`)}, scadenza il {school.dueDay} del mese. Correggi i corsi nella pagina Corsi prima di generare.</div>}
      </div>

      <div className="grid4">
        <div className="card" style={{ padding: 22, gap: 4 }}><div className="label">Rette</div><div className="big" style={{ fontSize: 32 }}>{eur2(totRette)}</div><div className="muted small">{rows.length} bambini</div></div>
        <div className="card" style={{ padding: 22, gap: 4 }}><div className="label">Corsi</div><div className="big" style={{ fontSize: 32 }}>{eur2(totCorsi)}</div><div className="muted small">{rows.filter((r) => r.lines.some((l) => l.kind === 'corso')).length} bambini con corsi</div></div>
        <div className="card" style={{ padding: 22, gap: 4 }}><div className="label">Bollo addebitato</div><div className="big" style={{ fontSize: 32 }}>{eur2(totBollo)}</div><div className="muted small">2 € sopra {eur2(BOLLO_THRESHOLD)}</div></div>
        <div className="card sun" style={{ padding: 22, gap: 4 }}><div className="label" style={{ color: 'var(--warn-fg)' }}>Totale da fatturare</div><div className="big" style={{ fontSize: 32 }}>{eur2(totale)}</div><div className="small" style={{ color: 'var(--warn-fg)' }}>{cap(month.label)}</div></div>
      </div>

      {issued && (
        <div className="card">
          <h2>Scarica le fatture di {month.label}</h2>
          <div className="export-grid">
            <div className="export">
              <b>PDF unico</b>
              <span className="muted small">Tutte le fatture in un file, una per pagina. Comodo da stampare.</span>
              <button className="btn primary" disabled={!!busy} onClick={() => run('pdf', async () => { const e = await ex(); e.download(e.invoicesPdf(issued, school), `Fatture_${slug}.pdf`); })}>{busy === 'pdf' ? 'Preparo…' : 'Scarica PDF'}</button>
            </div>
            <div className="export">
              <b>PDF separati</b>
              <span className="muted small">Un PDF per famiglia in un file ZIP, da inviare via email o in NestApp.</span>
              <button className="btn outline" disabled={!!busy} onClick={() => run('zip', async () => { const e = await ex(); e.download(await e.invoicesPdfZip(issued, school), `Fatture_${slug}_PDF.zip`); })}>{busy === 'zip' ? 'Preparo…' : 'Scarica ZIP'}</button>
            </div>
            <div className="export">
              <b>CSV per gestionale</b>
              <span className="muted small">Una riga per voce di fattura, separatore ";". Si importa in SAP, TeamSystem, Zucchetti o Excel.</span>
              <button className="btn outline" disabled={!!busy} onClick={() => run('csv', async () => { const e = await ex(); e.download(e.invoicesCsv(issued, school), `Fatture_${slug}.csv`); })}>Scarica CSV</button>
            </div>
            <div className="export">
              <b>XML FatturaPA</b>
              <span className="muted small">Fatture elettroniche nel formato dell'Agenzia delle Entrate, da caricare sul gestionale o inviare allo SdI.</span>
              <button className="btn outline" disabled={!!busy} onClick={() => run('xml', async () => { const e = await ex(); e.download(await e.invoicesXmlZip(issued, school), `Fatture_${slug}_XML.zip`); })}>{busy === 'xml' ? 'Preparo…' : 'Scarica XML'}</button>
            </div>
          </div>
          {canCancel(monthKey) && (
            <div className="row wrap small" style={{ gap: 8 }}>
              <span className="muted">Hai sbagliato qualcosa? Puoi annullare l'ultimo lotto emesso e generarlo di nuovo.</span>
              <button className="btn ghost" style={{ color: 'var(--bad-fg)', fontSize: 14 }} onClick={() => cancelInvoices(monthKey)}>Annulla le fatture di {month.label}</button>
            </div>
          )}
        </div>
      )}

      <div className="card">
        <h2>{issued ? 'Fatture emesse' : 'Anteprima fatture'}</h2>
        <div className="table-head" style={{ gridTemplateColumns: cols }}><span>Famiglia</span><span>Retta</span><span>Corsi</span><span>Bollo</span><span>Totale</span><span /></div>
        {rows.map((r) => {
          const corsi = r.lines.filter((l) => l.kind === 'corso');
          const retta = r.lines.find((l) => l.kind === 'retta')?.amount ?? 0;
          const bollo = r.lines.find((l) => l.kind === 'bollo')?.amount ?? 0;
          return (
            <div key={r.kidId} className="table-row" style={{ gridTemplateColumns: cols }}>
              <span style={{ display: 'flex', flexDirection: 'column' }}>
                <b>Famiglia {lastName(r.name)}</b>
                <span className="muted small">{r.name} · {SECTIONS[r.sec].name}{r.inv ? ` · n. ${r.inv.number}` : ''}</span>
              </span>
              <span>{eur2(retta)}</span>
              <span className="small">{corsi.length ? corsi.map((c) => `${c.desc.split(' – ')[0]} ${eur2(c.amount)}`).join(', ') : <span className="muted">Nessun corso</span>}</span>
              <span>{bollo ? eur2(bollo) : '—'}</span>
              <b>{eur2(r.total)}</b>
              <span style={{ justifySelf: 'end' }}>
                {r.inv && (
                  <button className="btn outline" style={{ padding: '0 14px', fontSize: 14 }} onClick={async () => { const e = await ex(); e.download(e.invoicesPdf([r.inv!], school), `${e.fileBase(r.inv!)}.pdf`); }}>PDF</button>
                )}
              </span>
            </div>
          );
        })}
      </div>

      <div className="card">
        <div className="row between wrap">
          <div>
            <h2>Dati dell'asilo in fattura</h2>
            <div className="muted small">{school.ragioneSociale} · P. IVA {school.piva} · IBAN {school.iban}</div>
          </div>
          <button className="btn outline" onClick={() => setShowSchool((v) => !v)}>{showSchool ? 'Chiudi' : 'Modifica'}</button>
        </div>
        {showSchool && <SchoolForm value={school} onChange={setSchool} locked={!!issued} />}
        <div className="muted small">
          Rette e corsi sono fatturati esenti IVA (art. 10 n. 20 DPR 633/72). Sopra {eur2(BOLLO_THRESHOLD)} si applica il bollo virtuale da 2 €.
          I dati fiscali e i codici fiscali delle famiglie sono di esempio: vanno verificati con il commercialista prima dell'uso reale.
        </div>
      </div>
    </section>
  );
}

function SchoolForm({ value, onChange, locked }: { value: SchoolBilling; onChange: (s: SchoolBilling) => void; locked: boolean }) {
  const field = (key: keyof SchoolBilling, label: string) => (
    <label key={key}>
      <span className="label">{label}</span>
      <input className="input" value={String(value[key])} onChange={(e) => onChange({ ...value, [key]: key === 'dueDay' ? Math.min(28, Math.max(1, Number(e.target.value) || 1)) : e.target.value })} />
    </label>
  );
  return (
    <div className="course-form">
      {locked && <div className="small" style={{ gridColumn: '1 / -1', color: 'var(--warn-fg)' }}>Le modifiche valgono per i mesi non ancora fatturati.</div>}
      {field('ragioneSociale', 'Ragione sociale')}
      {field('piva', 'Partita IVA')}
      {field('cf', 'Codice fiscale')}
      {field('iban', 'IBAN')}
      {field('address', 'Indirizzo')}
      {field('cap', 'CAP')}
      {field('city', 'Comune')}
      {field('prov', 'Provincia')}
      {field('dueDay', 'Giorno di scadenza')}
      <label className="flagchk" style={{ alignSelf: 'end' }}>
        <input type="checkbox" checked={value.bolloToFamily} onChange={(e) => onChange({ ...value, bolloToFamily: e.target.checked })} />
        Bollo a carico della famiglia
      </label>
    </div>
  );
}
