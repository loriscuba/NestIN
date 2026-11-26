import { SECTIONS, eur } from '@nestin/shared';
import { useStore } from '../store';

export function Rette() {
  const { child, paid, pay } = useStore();
  return (
    <>
      <div className="pcard" style={{ padding: 18, gap: 10 }}>
        <div className="row between">
          <h2 style={{ fontSize: 21 }}>Retta di ottobre</h2>
          <span className={`badge ${paid ? 'ok' : 'warn'}`}>{paid ? 'Pagata' : 'Da pagare'}</span>
        </div>
        <div className="big" style={{ fontSize: 40 }}>{eur(SECTIONS[child.sec].retta)}</div>
        <div className="muted small">Scadenza 10 ottobre</div>
        {!paid && (
          <>
            <button className="pbtn primary" onClick={pay}>Paga ora</button>
            <button className="pbtn outline">Scarica l'avviso di pagamento</button>
          </>
        )}
        {paid && <div className="badge ok" style={{ padding: 12, borderRadius: 12, fontSize: 14 }}>Pagamento ricevuto. Questa è una simulazione per la demo.</div>}
      </div>
      <div className="pcard" style={{ padding: 18 }}>
        <div className="label">Mesi precedenti</div>
        <div className="row between"><span>Settembre</span><span className="badge ok">Pagata</span></div>
      </div>
    </>
  );
}
