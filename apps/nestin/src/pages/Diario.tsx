import { useState } from 'react';
import { SECTIONS, SECTION_IDS, type SectionId } from '@nestin/shared';
import { useStore } from '../store';

/** Le maestre scrivono qui il diario che le famiglie leggono in NestApp (demo: non è ancora collegato). */
export function Diario() {
  const { kids, diary, addDiary } = useStore();
  const [sec, setSec] = useState<SectionId>('farm');
  const [kidId, setKidId] = useState<number>(1);
  const [text, setText] = useState('');
  const list = kids.filter((k) => k.sec === sec);
  const kid = kids.find((k) => k.id === kidId) ?? list[0];
  const entries = (kid && diary[kid.id]) || [];

  const pickSec = (id: SectionId) => {
    setSec(id);
    const first = kids.find((k) => k.sec === id);
    if (first) setKidId(first.id);
  };

  return (
    <section className="stack">
      <div className="row wrap" style={{ gap: 8 }}>
        {SECTION_IDS.map((id) => (
          <button key={id} className={`chip${sec === id ? ' on' : ''}`} onClick={() => pickSec(id)}>{SECTIONS[id].name}</button>
        ))}
      </div>
      <div className="split">
        <div className="card" style={{ gap: 8 }}>
          <h2>Bambini</h2>
          {list.map((k) => (
            <button key={k.id} className={`list-btn${kid?.id === k.id ? ' sel' : ''}`} onClick={() => setKidId(k.id)}>
              <b>{k.name}</b>
              <span className={`badge ${k.present ? 'ok' : 'warn'}`} style={{ marginLeft: 'auto' }}>{k.present ? 'Presente' : 'Assente'}</span>
            </button>
          ))}
        </div>
        <div className="card">
          <h2>{kid ? kid.name : 'Seleziona un bambino'}</h2>
          {kid && (
            <>
              {entries.length === 0 && <div className="muted">Ancora nessuna annotazione per oggi.</div>}
              {entries.map((e, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '52px minmax(0,1fr)', gap: 10 }}>
                  <span className="muted" style={{ fontWeight: 700 }}>{e.time}</span><span>{e.text}</span>
                </div>
              ))}
              <label className="label" htmlFor="nota">Nuova annotazione per la famiglia</label>
              <textarea id="nota" className="input" rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder="Es. Ha mangiato bene e ha fatto un bel riposo" />
              <button className="btn primary" style={{ alignSelf: 'flex-start' }} disabled={!text.trim()} onClick={() => { addDiary(kid.id, text.trim()); setText(''); }}>
                Aggiungi al diario
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
