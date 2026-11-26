import { useState } from 'react';
import { BOOKING_META, SECTIONS, SECTION_IDS, fmtDate, useMeetings, type SectionId } from '@nestin/shared';
import { useStore } from '../store';

export function Colloqui() {
  const { kids } = useStore();
  const { slots, addSlot, removeSlot, setStatus } = useMeetings();
  const [sec, setSec] = useState<SectionId>('farm');
  const [date, setDate] = useState('2026-10-14');
  const [time, setTime] = useState('16:30');
  const [mins, setMins] = useState(20);
  const list = slots.filter((s) => s.sec === sec);
  const pending = list.filter((s) => s.booking?.status === 'attesa').length;
  const cols = 'minmax(0,2fr) minmax(0,3fr) minmax(0,2fr) minmax(0,3fr)';

  return (
    <section className="stack">
      <div className="row wrap" style={{ gap: 8 }}>
        {SECTION_IDS.map((id) => (
          <button key={id} className={`chip${sec === id ? ' on' : ''}`} onClick={() => setSec(id)}>{SECTIONS[id].name}</button>
        ))}
      </div>
      <div className="card">
        <h2>Nuovo slot di ricevimento · {SECTIONS[sec].name}</h2>
        <div className="row wrap" style={{ gap: 8, alignItems: 'end' }}>
          <label className="label">Giorno<input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label>
          <label className="label">Ora<input className="input" type="time" value={time} onChange={(e) => setTime(e.target.value)} /></label>
          <label className="label">Durata (min)<input className="input" type="number" min={5} step={5} value={mins} onChange={(e) => setMins(Number(e.target.value))} /></label>
          <button className="btn primary" disabled={!date || !time} onClick={() => addSlot(sec, date, time, mins || 20)}>Aggiungi slot</button>
        </div>
      </div>
      <div className="card">
        <div className="row between wrap">
          <h2>Agenda colloqui</h2>
          {pending > 0 && <span className="badge warn">{pending} da confermare</span>}
        </div>
        <div className="table-head" style={{ gridTemplateColumns: cols }}><span>Quando</span><span>Famiglia</span><span>Stato</span><span /></div>
        {list.length === 0 && <div className="muted">Nessuno slot per questa sezione.</div>}
        {list.map((s) => {
          const b = s.booking;
          const kid = b && kids.find((k) => k.id === b.kidId);
          return (
            <div key={s.id} className="table-row" style={{ gridTemplateColumns: cols }}>
              <span><b>{fmtDate(s.date)}</b> {s.time} · {s.mins}′</span>
              <span>{kid ? <><b>{kid.name}</b>{b?.note && <div className="small muted">{b.note}</div>}</> : <span className="muted">Libero</span>}</span>
              <span>{b ? <span className={`badge ${BOOKING_META[b.status].cls}`}>{BOOKING_META[b.status].label}</span> : '—'}</span>
              <span className="row wrap" style={{ gap: 6 }}>
                {b?.status === 'attesa' && <>
                  <button className="btn ok" onClick={() => setStatus(s.id, 'confermato')}>Conferma</button>
                  <button className="btn warn" onClick={() => setStatus(s.id, 'rifiutato')}>Rifiuta</button>
                </>}
                {(!b || b.status === 'rifiutato') && <button className="btn ghost" onClick={() => removeSlot(s.id)}>Elimina</button>}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
