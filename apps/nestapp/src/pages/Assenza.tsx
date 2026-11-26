import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';

const DAYS = ['Oggi', 'Domani', 'Lunedì'];
const REASONS = ['Malattia', 'Visita medica', 'Famiglia'];

export function Assenza() {
  const { sendAbsence, absence, clearAbsence } = useStore();
  const nav = useNavigate();
  const [day, setDay] = useState('Oggi');
  const [reason, setReason] = useState('');
  const [sent, setSent] = useState<string | null>(null);

  if (sent) {
    return (
      <>
        <div className="pcard" style={{ background: 'var(--ok-bg)', color: 'var(--ok-fg)', border: 0, padding: 18 }}>
          <h2 style={{ fontSize: 22, color: 'inherit' }}>Segnalazione inviata</h2>
          <div>La scuola ha ricevuto l'avviso di assenza: {sent}.</div>
        </div>
        <button className="pbtn primary" onClick={() => nav('/')}>Torna a oggi</button>
      </>
    );
  }

  return (
    <>
      <button className="back" onClick={() => nav('/')}>← Indietro</button>
      <div className="pcard" style={{ padding: 18, gap: 12 }}>
        <h2 style={{ fontSize: 22 }}>Segnala un'assenza</h2>
        {absence && (
          <div className="small muted">Hai già segnalato: {absence.day}. <button className="back" style={{ minHeight: 0, display: 'inline', textDecoration: 'underline' }} onClick={clearAbsence}>Annulla segnalazione</button></div>
        )}
        <div className="label">Quando</div>
        <div className="row wrap" style={{ gap: 8 }}>
          {DAYS.map((d) => <button key={d} className={`pchip${day === d ? ' on' : ''}`} onClick={() => setDay(d)}>{d}</button>)}
        </div>
        <div className="label">Motivo</div>
        <div className="row wrap" style={{ gap: 8 }}>
          {REASONS.map((r) => <button key={r} className={`pchip${reason === r ? ' on' : ''}`} onClick={() => setReason(r)}>{r}</button>)}
        </div>
        <button className="pbtn primary" style={{ marginTop: 6 }} onClick={() => { sendAbsence({ day, reason }); setSent(day); }}>Invia alla scuola</button>
      </div>
    </>
  );
}
