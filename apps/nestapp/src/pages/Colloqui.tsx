import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BOOKING_META, CHANGE_DAYS, DEMO_TODAY, SECTIONS, canChange, fmtDate, isFree, useMeetings } from '@nestin/shared';
import { useStore } from '../store';

export function Colloqui() {
  const { child } = useStore();
  const { slots, book, cancel } = useMeetings();
  const nav = useNavigate();
  const [moving, setMoving] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const mine = slots.find((s) => s.booking?.kidId === child.id && s.booking.status !== 'rifiutato');
  const refused = slots.filter((s) => s.booking?.kidId === child.id && s.booking.status === 'rifiutato');
  const free = slots.filter((s) => s.sec === child.sec && isFree(s) && canChange(s) && s.date > DEMO_TODAY);
  const showFree = !mine || moving !== null;

  return (
    <>
      <button className="back" onClick={() => nav('/')}>← Indietro</button>
      <h2 style={{ fontSize: 22 }}>Colloqui con la maestra</h2>
      <div className="small muted">Sezione {SECTIONS[child.sec].name}. Puoi modificare o annullare fino a {CHANGE_DAYS} giorni prima del colloquio.</div>
      {refused.map((s) => (
        <div key={s.id} className="pcard" style={{ background: 'var(--bad-bg)', color: 'var(--bad-fg)', border: 0 }}>
          La maestra non può il {fmtDate(s.date)} alle {s.time}: scegli un altro orario.
        </div>
      ))}
      {mine && (
        <div className="pcard" style={{ padding: 18, gap: 10 }}>
          <div className="label">La tua prenotazione</div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>{fmtDate(mine.date)} · {mine.time} ({mine.mins} min)</div>
          <span className={`badge ${BOOKING_META[mine.booking!.status].cls}`} style={{ alignSelf: 'start' }}>{BOOKING_META[mine.booking!.status].label}</span>
          {canChange(mine) ? (
            <div className="row" style={{ gap: 8 }}>
              <button className="pbtn outline" onClick={() => setMoving(moving ? null : mine.id)}>{moving ? 'Lascia così' : 'Modifica'}</button>
              <button className="pbtn outline" onClick={() => { cancel(mine.id); setMoving(null); }}>Annulla</button>
            </div>
          ) : (
            <div className="small muted">Mancano meno di {CHANGE_DAYS} giorni: per cambiare contatta la scuola.</div>
          )}
        </div>
      )}
      {showFree && (
        <div className="pcard" style={{ padding: 18, gap: 10 }}>
          <div className="label">{moving ? 'Scegli il nuovo orario' : 'Orari disponibili'}</div>
          {free.length === 0 && <div className="muted">Nessun orario libero al momento.</div>}
          {free.length > 0 && <input className="input" placeholder="Argomento (facoltativo)" value={note} onChange={(e) => setNote(e.target.value)} />}
          {free.map((s) => (
            <button key={s.id} className="pbtn outline" onClick={() => { book(s.id, child.id, note.trim() || undefined, moving ?? undefined); setMoving(null); setNote(''); }}>
              {fmtDate(s.date)} · {s.time} ({s.mins} min)
            </button>
          ))}
        </div>
      )}
    </>
  );
}
