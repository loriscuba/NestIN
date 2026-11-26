import { useState } from 'react';
import { DIARY_FLAG_LABELS, NO_DIARY_FLAGS, SECTIONS, SECTION_IDS, type DiaryFlags, type SectionId } from '@nestin/shared';
import { useStore } from '../store';

const FLAGS = Object.keys(DIARY_FLAG_LABELS) as (keyof DiaryFlags)[];

/** Le maestre scrivono qui il diario che le famiglie leggono in NestApp (demo: non è ancora collegato). */
export function Diario() {
  const { kids, diary, addDiary, diaryFlags, toggleDiaryFlag } = useStore();
  const [sec, setSec] = useState<SectionId>('farm');
  const [kidId, setKidId] = useState<number>(1);
  const [q, setQ] = useState('');
  const [text, setText] = useState('');
  const query = q.trim().toLowerCase();
  // Con una ricerca attiva si cerca in tutte le sezioni, altrimenti si mostra la sezione scelta.
  const list = query ? kids.filter((k) => k.name.toLowerCase().includes(query)) : kids.filter((k) => k.sec === sec);
  const kid = kids.find((k) => k.id === kidId) ?? list[0];
  const entries = (kid && diary[kid.id]) || [];
  const flags = (kid && diaryFlags[kid.id]) || NO_DIARY_FLAGS;

  const pickSec = (id: SectionId) => {
    setSec(id);
    setQ('');
    const first = kids.find((k) => k.sec === id);
    if (first) setKidId(first.id);
  };

  return (
    <section className="stack">
      <div className="row wrap" style={{ gap: 8 }}>
        {SECTION_IDS.map((id) => (
          <button key={id} className={`chip${!query && sec === id ? ' on' : ''}`} onClick={() => pickSec(id)}>{SECTIONS[id].name}</button>
        ))}
      </div>
      <div className="split">
        <div className="card" style={{ gap: 8 }}>
          <h2>Bambini</h2>
          <label className="label" htmlFor="cerca-diario">Cerca per nome</label>
          <input id="cerca-diario" className="input" type="search" placeholder="Nome o cognome" value={q} onChange={(e) => setQ(e.target.value)} />
          {list.map((k) => {
            const f = diaryFlags[k.id] ?? NO_DIARY_FLAGS;
            return (
              <button key={k.id} className={`list-btn${kid?.id === k.id ? ' sel' : ''}`} onClick={() => setKidId(k.id)}>
                <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                  <b>{k.name}</b>
                  <span className="muted small">
                    {query && `${SECTIONS[k.sec].name} · `}
                    {FLAGS.filter((x) => f[x]).map((x) => DIARY_FLAG_LABELS[x]).join(' · ') || 'Nessuna spunta'}
                  </span>
                </span>
                <span className={`badge ${k.present ? 'ok' : 'warn'}`} style={{ marginLeft: 'auto' }}>{k.present ? 'Presente' : 'Assente'}</span>
              </button>
            );
          })}
          {list.length === 0 && <div className="muted">Nessun bambino trovato.</div>}
        </div>
        <div className="card">
          <h2>{kid ? kid.name : 'Seleziona un bambino'}</h2>
          {kid && (
            <>
              <div className="row wrap" style={{ gap: 8 }}>
                {FLAGS.map((f) => (
                  <label key={f} className={`flagchk${flags[f] ? ' on' : ''}`}>
                    <input type="checkbox" checked={flags[f]} onChange={() => toggleDiaryFlag(kid.id, f)} />
                    {DIARY_FLAG_LABELS[f]}
                  </label>
                ))}
              </div>
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
