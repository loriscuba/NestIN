import { useState } from 'react';
import { targetClass, type NoticeTarget } from '@nestin/shared';
import { useStore } from '../store';

const TARGETS: NoticeTarget[] = ['Tutti', 'Farm', 'Jungle', 'Ocean'];

export function Comunicazioni() {
  const { notices, sendNotice } = useStore();
  const [composing, setComposing] = useState(false);
  const [target, setTarget] = useState<NoticeTarget>('Tutti');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const reset = () => { setComposing(false); setTitle(''); setBody(''); setTarget('Tutti'); };
  const send = () => {
    if (!title.trim() || !body.trim()) return;
    sendNotice(title.trim(), body.trim(), target);
    reset();
  };

  return (
    <section className="stack">
      {!composing && <button className="btn" style={{ alignSelf: 'flex-start' }} onClick={() => setComposing(true)}>Nuova comunicazione</button>}
      {composing && (
        <div className="card" style={{ border: '2px solid var(--sun)' }}>
          <h2>Nuova comunicazione</h2>
          <div className="label">A chi</div>
          <div className="row wrap" style={{ gap: 8 }}>
            {TARGETS.map((t) => <button key={t} className={`chip${target === t ? ' on' : ''}`} onClick={() => setTarget(t)}>{t}</button>)}
          </div>
          <label className="label" htmlFor="titolo">Titolo</label>
          <input id="titolo" className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Es. Festa di Natale" />
          <label className="label" htmlFor="testo">Messaggio</label>
          <textarea id="testo" className="input" rows={4} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Scrivi il testo per le famiglie" />
          <div className="row" style={{ gap: 8 }}>
            <button className="btn primary" onClick={send}>Invia alle famiglie</button>
            <button className="btn outline" onClick={reset}>Annulla</button>
          </div>
        </div>
      )}
      {notices.map((m) => (
        <div key={m.id} className="card" style={{ padding: '20px 24px', gap: 6 }}>
          <div className="row wrap" style={{ gap: 10 }}>
            <span className="big" style={{ fontSize: 20 }}>{m.title}</span>
            <span className={`badge ${targetClass(m.target)}`}>{m.target}</span>
            {m.fresh && <span className="badge navy">Appena inviata</span>}
            <span className="muted small" style={{ marginLeft: 'auto' }}>{m.date}</span>
          </div>
          <div style={{ color: '#3b4a66' }}>{m.body}</div>
        </div>
      ))}
    </section>
  );
}
