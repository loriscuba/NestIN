import { PAY_META, eur, firstName, lastName, rettaOf, SECTIONS } from '@nestin/shared';
import { useStore } from '../store';

export function Rette() {
  const { kids, pay, markPaid, reminded, remindAll, attGen, genAtt } = useStore();
  const dovuto = kids.reduce((a, k) => a + rettaOf(k), 0);
  const incassato = kids.reduce((a, k) => a + (pay[k.id] === 'paid' ? rettaOf(k) : 0), 0);
  const unpaid = kids.filter((k) => pay[k.id] !== 'paid');
  const allReminded = unpaid.length > 0 && unpaid.every((k) => reminded[k.id]);
  const cols = 'minmax(0,3fr) minmax(0,1fr) minmax(0,1fr) minmax(0,2fr) minmax(0,2fr)';

  return (
    <section className="stack">
      <div className="grid3">
        <div className="card" style={{ padding: 22, gap: 4 }}>
          <div className="label">Incassato</div>
          <div className="big" style={{ fontSize: 40, color: 'var(--ok-fg)' }}>{eur(incassato)}</div>
          <div className="muted small">su {eur(dovuto)} di ottobre</div>
        </div>
        <div className="card" style={{ padding: 22, gap: 4 }}>
          <div className="label">Da incassare</div>
          <div className="big" style={{ fontSize: 40 }}>{eur(dovuto - incassato)}</div>
          <div className="muted small">{unpaid.length} famiglie</div>
        </div>
        <div className="card sun" style={{ padding: 22, gap: 10 }}>
          <div className="label" style={{ color: 'var(--warn-fg)' }}>Promemoria automatici</div>
          <div className="small">Cinque giorni prima della scadenza, alla scadenza e una settimana dopo, con un testo gentile.</div>
          {unpaid.length > 0 && !allReminded && <button className="btn primary" onClick={remindAll}>Invia a {unpaid.length} famiglie</button>}
          {allReminded && <div className="badge ok" style={{ padding: 10, borderRadius: 12 }}>Promemoria inviati (simulato)</div>}
        </div>
      </div>

      <div className="card" style={{ padding: '20px 24px' }}>
        <div className="row between wrap">
          <div>
            <div className="big" style={{ fontSize: 22 }}>Attestazione per la detrazione nel 730</div>
            <div className="muted small">Un documento per ogni famiglia con le rette pagate nell'anno, pronto a gennaio.</div>
          </div>
          {!attGen && <button className="btn outline" onClick={genAtt}>Genera {kids.length} attestazioni</button>}
          {attGen && <div className="badge ok" style={{ padding: '10px 16px', borderRadius: 12 }}>{kids.length} attestazioni pronte in PDF (esempio)</div>}
        </div>
      </div>

      <div className="card">
        <h2>Rette di ottobre</h2>
        <div className="table-head" style={{ gridTemplateColumns: cols }}><span>Famiglia</span><span>Importo</span><span>Scadenza</span><span>Stato</span><span /></div>
        {kids.map((k) => {
          const st = pay[k.id];
          return (
            <div key={k.id} className="table-row" style={{ gridTemplateColumns: cols }}>
              <span style={{ display: 'flex', flexDirection: 'column' }}><b>Famiglia {lastName(k.name)}</b><span className="muted small">{firstName(k.name)} · {SECTIONS[k.sec].name}</span></span>
              <span>{eur(rettaOf(k))}</span>
              <span className="muted">10 ott</span>
              <span style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start' }}>
                <span className={`badge ${PAY_META[st].cls}`}>{PAY_META[st].label}</span>
                {st !== 'paid' && reminded[k.id] && <span className="muted small">Promemoria inviato</span>}
              </span>
              <span style={{ justifySelf: 'end' }}>
                {st !== 'paid' && <button className="btn outline" style={{ padding: '0 16px', fontSize: 14 }} onClick={() => markPaid(k.id)}>Segna pagata</button>}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
