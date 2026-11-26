import { useState } from 'react';
import { PAY_META, SECTIONS, initials } from '@nestin/shared';
import { useStore } from '../store';

export function Bambini() {
  const { kids, pay, role } = useStore();
  const [q, setQ] = useState('');
  const [selId, setSelId] = useState<number | null>(null);
  const list = kids.filter((k) => k.name.toLowerCase().includes(q.trim().toLowerCase()));
  const sel = kids.find((k) => k.id === selId);

  return (
    <section className="split">
      <div className="card" style={{ padding: 20, gap: 10 }}>
        <label className="label" htmlFor="cerca">Cerca un bambino</label>
        <input id="cerca" className="input" placeholder="Nome o cognome" value={q} onChange={(e) => setQ(e.target.value)} />
        {list.map((k) => (
          <button key={k.id} className={`list-btn${selId === k.id ? ' sel' : ''}`} onClick={() => setSelId(k.id)}>
            <span className={`avatar ${k.sec}`} style={{ width: 48, height: 48, fontSize: 17 }}>{initials(k.name)}</span>
            <span style={{ display: 'flex', flexDirection: 'column' }}>
              <b>{k.name}</b>
              <span className="muted small">{SECTIONS[k.sec].name} · {k.eta}</span>
            </span>
          </button>
        ))}
        {list.length === 0 && <div className="muted">Nessun bambino trovato.</div>}
      </div>

      <div className="card" style={{ gap: 14 }}>
        {!sel && <div className="muted">Seleziona un bambino per vedere la scheda.</div>}
        {sel && (
          <>
            <div className="row" style={{ gap: 14 }}>
              <span className={`avatar ${sel.sec}`} style={{ width: 64, height: 64, fontSize: 22 }}>{initials(sel.name)}</span>
              <div>
                <div className="big" style={{ fontSize: 26 }}>{sel.name}</div>
                <div className="muted">Sezione {SECTIONS[sel.sec].name} · {sel.eta}</div>
              </div>
            </div>
            <div style={{ borderTop: '1px solid var(--line-soft)', paddingTop: 12 }}><div className="label">Allergie e note</div>{sel.nota}</div>
            <div><div className="label">Contatto principale</div>{sel.contatto}</div>
            <div><div className="label">Deleghe al ritiro</div>{sel.delega}</div>
            <div><div className="label">Presenza oggi</div>{sel.present ? 'Presente dalle ' + sel.ingresso : 'Assente'}</div>
            {role === 'segreteria' && (
              <div>
                <div className="label">Retta di ottobre</div>
                <span className={`badge ${PAY_META[pay[sel.id]].cls}`} style={{ marginTop: 2 }}>{PAY_META[pay[sel.id]].label}</span>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
