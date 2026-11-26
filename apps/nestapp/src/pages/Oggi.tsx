import { useNavigate } from 'react-router-dom';
import { TEACHER_NOTE_SOFIA, firstName } from '@nestin/shared';
import { useStore } from '../store';

export function Oggi() {
  const { child, diary, absence } = useStore();
  const nav = useNavigate();
  const name = firstName(child.name);

  return (
    <>
      <div className="pcard" style={{ background: 'var(--ok-bg)', color: 'var(--ok-fg)', gap: 2, border: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 18 }}>{name} è a scuola</div>
        <div className="small">Entrata alle {child.ingresso} · Uscita tra le 15:45 e le 16:30</div>
      </div>
      {absence && (
        <div className="pcard" style={{ background: 'var(--warn-bg)', color: 'var(--warn-fg)', border: 0, fontWeight: 700, fontSize: 14 }}>
          Assenza segnalata: {absence.day}. La scuola è stata avvisata.
        </div>
      )}
      <div className="pcard">
        <div className="label">Dalla maestra</div>
        <div>{TEACHER_NOTE_SOFIA}</div>
      </div>
      <div className="pcard" style={{ padding: 18, gap: 12 }}>
        <h2 style={{ fontSize: 21 }}>Diario di oggi</h2>
        {diary.map((e, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '52px minmax(0,1fr)', gap: 10 }}>
            <span className="muted" style={{ fontWeight: 700 }}>{e.time}</span><span>{e.text}</span>
          </div>
        ))}
      </div>
      <button className="pbtn" onClick={() => nav('/assenza')}>Segnala un'assenza</button>
    </>
  );
}
