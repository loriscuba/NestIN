import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SECTIONS, SECTION_IDS, type SectionId } from '@nestin/shared';
import { useStore } from '../store';

export function Presenze() {
  const loc = useLocation();
  const [sec, setSec] = useState<SectionId>((loc.state as { sec?: SectionId } | null)?.sec ?? 'farm');
  const { kids, togglePresent, allPresent } = useStore();
  const list = kids.filter((k) => k.sec === sec);
  const cols = 'minmax(0,3fr) minmax(0,2fr) minmax(0,2fr) minmax(0,2fr)';

  return (
    <section className="stack">
      <div className="row wrap" style={{ gap: 8 }}>
        {SECTION_IDS.map((id) => (
          <button key={id} className={`chip${sec === id ? ' on' : ''}`} onClick={() => setSec(id)}>{SECTIONS[id].name}</button>
        ))}
      </div>
      <div className="card">
        <div className="row between wrap">
          <h2>Sezione {SECTIONS[sec].name}</h2>
          <div className="row">
            <span className="badge ok" style={{ fontSize: 16, padding: '6px 14px' }}>{list.filter((k) => k.present).length} presenti su {list.length}</span>
            <button className="btn outline" onClick={() => allPresent(sec)}>Segna tutti presenti</button>
          </div>
        </div>
        <div className="table-head" style={{ gridTemplateColumns: cols }}><span>Bambino</span><span>Età</span><span>Ingresso</span><span>Stato</span></div>
        {list.map((k) => (
          <div key={k.id} className="table-row" style={{ gridTemplateColumns: cols }}>
            <b>{k.name}</b>
            <span className="muted">{k.eta}</span>
            <span>{k.present ? k.ingresso : '—'}</span>
            <button className={`btn ${k.present ? 'ok' : 'warn'}`} style={{ borderRadius: 12, padding: 0 }} onClick={() => togglePresent(k.id)}>
              {k.present ? 'Presente' : 'Assente'}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
