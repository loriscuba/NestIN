import { useNavigate } from 'react-router-dom';
import { MENU_WEEK, SCHEDULE, SECTIONS, SECTION_IDS } from '@nestin/shared';
import { useStore } from '../store';

const BAR: Record<string, string> = { farm: 'var(--farm)', jungle: 'var(--jungle)', ocean: 'var(--ocean)' };

export function Dashboard() {
  const { kids, pay, absMon, role } = useStore();
  const nav = useNavigate();
  const today = MENU_WEEK[4];
  const toPay = kids.filter((k) => pay[k.id] !== 'paid').length;
  const meals = kids.length - kids.filter((k) => absMon[k.id]).length;

  return (
    <section className="stack" style={{ gap: 24 }}>
      <div className="grid3">
        {SECTION_IDS.map((id) => {
          const all = kids.filter((k) => k.sec === id);
          const pres = all.filter((k) => k.present).length;
          const s = SECTIONS[id];
          return (
            <button key={id} className="section-card" onClick={() => nav('/presenze', { state: { sec: id } })}>
              <span className={`badge ${id}`} style={{ alignSelf: 'flex-start' }}>{s.tag}</span>
              <span className="big" style={{ fontSize: 32 }}>{s.name}</span>
              <span className="muted small">{s.desc}</span>
              <span style={{ fontSize: 17 }}><b>{pres}</b> presenti su {all.length}</span>
              <span className="bar"><span style={{ background: BAR[id], width: Math.round((pres / all.length) * 100) + '%' }} /></span>
            </button>
          );
        })}
      </div>

      <div className="split">
        <div className="card" style={{ gap: 16 }}>
          <h2>La giornata</h2>
          {SCHEDULE.map((r) => (
            <div key={r.when} style={{ display: 'grid', gridTemplateColumns: '120px minmax(0,1fr)', gap: 12 }}>
              <span className="muted" style={{ fontWeight: 700 }}>{r.when}</span><span>{r.what}</span>
            </div>
          ))}
        </div>
        <div className="stack">
          <div className="card" style={{ gap: 10 }}>
            <h2>Da fare</h2>
            <div className="todo"><span>Certificati medici in scadenza</span><span className="badge warn">3</span></div>
            <div className="todo"><span>Autorizzazioni giornata al maneggio</span><span className="badge info">7 mancanti</span></div>
            {role === 'segreteria' && (
              <>
                <button className="todo" onClick={() => nav('/pasti')}><span>Pasti di lunedì da confermare</span><span className="badge info">{meals}</span></button>
                <button className="todo" onClick={() => nav('/rette')}><span>Rette da incassare</span><span className="badge bad">{toPay}</span></button>
              </>
            )}
          </div>
          <div className="card" style={{ gap: 6 }}>
            <h2 style={{ marginBottom: 4 }}>Menù di oggi</h2>
            <div><span className="muted">Primo</span> · {today.primo}</div>
            <div><span className="muted">Secondo</span> · {today.secondo}</div>
            <div><span className="muted">Contorno</span> · {today.contorno}</div>
            <div><span className="muted">Frutta</span> · Di stagione</div>
            <div className="muted small" style={{ marginTop: 4 }}>3 menù alternativi attivi per allergie e intolleranze</div>
          </div>
        </div>
      </div>
    </section>
  );
}
