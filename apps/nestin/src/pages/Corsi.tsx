import { useState } from 'react';
import { SECTIONS, SECTION_IDS, eur, eur2, num, type Course } from '@nestin/shared';
import { useStore } from '../store';

const EMPTY = { name: '', price: '', hours: '', desc: '' };
/** Settimane medie in un mese, per il costo orario indicativo. */
const WEEKS_PER_MONTH = 4.33;
const hoursLabel = (h: number): string => String(h).replace('.', ',') + (h === 1 ? ' ora' : ' ore');

export function Corsi() {
  const { courses, saveCourse, removeCourse, kids, enrollments, toggleEnroll } = useStore();
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState<number | null>(null);
  const [filter, setFilter] = useState<number | 'tutti'>('tutti');

  const enrolled = (cid: number) => kids.filter((k) => (enrollments[k.id] ?? []).includes(cid));
  const monthly = courses.reduce((a, c) => a + enrolled(c.id).length * c.price, 0);
  const valid = form.name.trim() !== '' && num(form.price) > 0 && num(form.hours) > 0;

  const startEdit = (c: Course) => {
    setEditId(c.id);
    setForm({ name: c.name, price: String(c.price).replace('.', ','), hours: String(c.hours).replace('.', ','), desc: c.desc });
  };
  const reset = () => { setEditId(null); setForm(EMPTY); };
  const submit = () => {
    if (!valid) return;
    saveCourse({ id: editId ?? Math.max(0, ...courses.map((c) => c.id)) + 1, name: form.name.trim(), price: num(form.price), hours: num(form.hours), desc: form.desc.trim() });
    reset();
  };

  const listCols = 'minmax(0,3fr) minmax(0,1.2fr) minmax(0,1.2fr) minmax(0,1fr) minmax(0,1.3fr) minmax(0,2fr)';
  const shownKids = filter === 'tutti' ? kids : enrolled(filter);

  return (
    <section className="stack">
      <div className="grid3">
        <div className="card" style={{ padding: 22, gap: 4 }}><div className="label">Corsi a listino</div><div className="big" style={{ fontSize: 40 }}>{courses.length}</div><div className="muted small">{courses.reduce((a, c) => a + c.hours, 0).toString().replace('.', ',')} ore a settimana in totale</div></div>
        <div className="card" style={{ padding: 22, gap: 4 }}><div className="label">Iscrizioni</div><div className="big" style={{ fontSize: 40 }}>{courses.reduce((a, c) => a + enrolled(c.id).length, 0)}</div><div className="muted small">{kids.filter((k) => (enrollments[k.id] ?? []).length > 0).length} bambini su {kids.length} fanno almeno un corso</div></div>
        <div className="card sun" style={{ padding: 22, gap: 4 }}><div className="label" style={{ color: 'var(--warn-fg)' }}>Ricavo mensile dei corsi</div><div className="big" style={{ fontSize: 40 }}>{eur(monthly)}</div><div className="small" style={{ color: 'var(--warn-fg)' }}>Entra nelle fatture del mese insieme alla retta</div></div>
      </div>

      <div className="card">
        <h2>Listino corsi</h2>
        <div className="table-head" style={{ gridTemplateColumns: listCols }}><span>Corso</span><span>Prezzo al mese</span><span>Ore a settimana</span><span>Iscritti</span><span>Ricavo mese</span><span /></div>
        {courses.map((c) => (
          <div key={c.id} className="table-row" style={{ gridTemplateColumns: listCols }}>
            <span style={{ display: 'flex', flexDirection: 'column' }}><b>{c.name}</b><span className="muted small">{c.desc || '—'}</span></span>
            <span style={{ display: 'flex', flexDirection: 'column' }}><b>{eur2(c.price)}</b><span className="muted small">≈ {eur2(c.price / (c.hours * WEEKS_PER_MONTH))} l'ora</span></span>
            <span>{hoursLabel(c.hours)}</span>
            <span>{enrolled(c.id).length}</span>
            <span>{eur(enrolled(c.id).length * c.price)}</span>
            <span className="row" style={{ justifySelf: 'end', gap: 6 }}>
              <button className="btn outline" style={{ padding: '0 14px', fontSize: 14 }} onClick={() => startEdit(c)}>Modifica</button>
              <button className="btn ghost" style={{ fontSize: 14, color: 'var(--bad-fg)' }} onClick={() => { removeCourse(c.id); if (editId === c.id) reset(); }} aria-label={`Elimina ${c.name}`}>Elimina</button>
            </span>
          </div>
        ))}
        {courses.length === 0 && <div className="muted">Nessun corso a listino. Aggiungine uno qui sotto.</div>}

        <div className="course-form" style={{ borderTop: '1px solid var(--line-soft)', paddingTop: 16 }}>
          <div className="big" style={{ fontSize: 19, gridColumn: '1 / -1' }}>{editId ? 'Modifica corso' : 'Aggiungi un corso'}</div>
          <label><span className="label">Nome</span><input className="input" placeholder="Es. Corso di Inglese" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
          <label><span className="label">Prezzo al mese (€)</span><input className="input" inputMode="decimal" placeholder="40" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></label>
          <label><span className="label">Ore a settimana</span><input className="input" inputMode="decimal" placeholder="2" value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} /></label>
          <label><span className="label">Giorno e orario</span><input className="input" placeholder="Es. Martedì 10:00–11:00" value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} /></label>
          <div className="row" style={{ gridColumn: '1 / -1', gap: 8 }}>
            <button className="btn primary" disabled={!valid} onClick={submit}>{editId ? 'Salva modifiche' : 'Aggiungi al listino'}</button>
            {editId && <button className="btn ghost" onClick={reset}>Annulla</button>}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="row between wrap">
          <div>
            <h2>Corsi dei bambini</h2>
            <div className="muted small">Spunta i corsi di ogni bambino: il costo si aggiunge alla retta nella fattura del mese.</div>
          </div>
          <label className="row small" style={{ gap: 8, fontWeight: 700 }}>
            Mostra
            <select className="input" style={{ width: 'auto' }} value={filter} onChange={(e) => setFilter(e.target.value === 'tutti' ? 'tutti' : Number(e.target.value))}>
              <option value="tutti">Tutti i bambini</option>
              {courses.map((c) => <option key={c.id} value={c.id}>Iscritti a {c.name}</option>)}
            </select>
          </label>
        </div>
        <div className="matrix-wrap">
          <table className="matrix">
            <thead>
              <tr>
                <th>Bambino</th>
                {courses.map((c) => <th key={c.id}>{c.name}<div className="muted small">{eur2(c.price)} · {hoursLabel(c.hours)}</div></th>)}
                <th style={{ textAlign: 'right' }}>Corsi al mese</th>
              </tr>
            </thead>
            <tbody>
              {SECTION_IDS.flatMap((sec) => {
                const group = shownKids.filter((k) => k.sec === sec);
                if (group.length === 0) return [];
                return [
                  <tr key={sec} className="matrix-sec"><td colSpan={courses.length + 2}><span className={`badge ${sec}`}>{SECTIONS[sec].name}</span></td></tr>,
                  ...group.map((k) => {
                    const mine = enrollments[k.id] ?? [];
                    const tot = courses.filter((c) => mine.includes(c.id)).reduce((a, c) => a + c.price, 0);
                    return (
                      <tr key={k.id}>
                        <td><b>{k.name}</b></td>
                        {courses.map((c) => (
                          <td key={c.id}>
                            <label className="cell-chk">
                              <input type="checkbox" checked={mine.includes(c.id)} onChange={() => toggleEnroll(k.id, c.id)} aria-label={`${c.name} per ${k.name}`} />
                            </label>
                          </td>
                        ))}
                        <td style={{ textAlign: 'right', fontWeight: 700 }}>{tot ? eur2(tot) : '—'}</td>
                      </tr>
                    );
                  })
                ];
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
