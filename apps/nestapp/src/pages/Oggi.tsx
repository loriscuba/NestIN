import { useNavigate } from 'react-router-dom';
import { DIARY_FLAG_LABELS, TEACHER_NOTE_SOFIA, firstName, type DiaryFlags } from '@nestin/shared';
import { useStore } from '../store';

export function Oggi() {
  const { child, diary, diaryFlags, absence } = useStore();
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
        <div className="row wrap" style={{ gap: 8 }}>
          {(Object.keys(DIARY_FLAG_LABELS) as (keyof DiaryFlags)[]).map((f) => (
            <span key={f} className={`badge ${diaryFlags[f] ? 'ok' : 'navy-soft'}`} style={{ fontSize: 14, padding: '4px 14px' }}>
              {diaryFlags[f] ? '✓' : '–'} {DIARY_FLAG_LABELS[f]}{diaryFlags[f] ? ' fatta' : ' non ancora'}
            </span>
          ))}
        </div>
        {diary.map((e, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '52px minmax(0,1fr)', gap: 10 }}>
            <span className="muted" style={{ fontWeight: 700 }}>{e.time}</span><span>{e.text}</span>
          </div>
        ))}
      </div>
      <button className="pbtn" onClick={() => nav('/assenza')}>Segnala un'assenza</button>
      <button className="pbtn outline" onClick={() => nav('/colloqui')}>Prenota un colloquio con la maestra</button>
    </>
  );
}
