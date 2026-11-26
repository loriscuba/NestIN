import { MENU_WEEK, SECTIONS, dietaOf, eur2, firstName, lastName, num } from '@nestin/shared';
import { useStore } from '../store';

export function Pasti() {
  const { kids, absMon, toggleAbsMon, costoPasto, setCostoPasto } = useStore();
  const absCount = kids.filter((k) => absMon[k.id]).length;
  const meals = kids.length - absCount;
  const cost = num(costoPasto);
  const specials = kids.filter((k) => !absMon[k.id] && dietaOf(k.nota));
  const shopping = [
    { item: 'Pasta', qty: Math.round(meals * 60) + ' g' },
    { item: 'Uova per la frittata', qty: meals + ' uova' },
    { item: 'Insalata', qty: Math.round(meals * 40) + ' g' },
    { item: 'Frutta di stagione', qty: meals + ' pezzi' }
  ];

  return (
    <section className="stack">
      <div className="grid3">
        <div className="card" style={{ padding: 22, gap: 4 }}>
          <div className="label">Pasti da preparare</div>
          <div className="big" style={{ fontSize: 44 }}>{meals}</div>
          <div className="muted small">su {kids.length} iscritti · {absCount} assenze segnalate</div>
        </div>
        <div className="card" style={{ padding: 22, gap: 4 }}>
          <div className="label">Costo cucina del giorno</div>
          <div className="big" style={{ fontSize: 44 }}>{eur2(meals * cost)}</div>
          <div className="muted small">a {eur2(cost)} a pasto</div>
        </div>
        <div className="card sun" style={{ padding: 22, gap: 4 }}>
          <div className="label" style={{ color: 'var(--warn-fg)' }}>Risparmiato grazie alle assenze segnalate</div>
          <div className="big" style={{ fontSize: 44 }}>{eur2(absCount * cost)}</div>
          <div className="small" style={{ color: 'var(--warn-fg)' }}>pasti non cucinati</div>
        </div>
      </div>

      <div className="split">
        <div className="card">
          <h2>Assenze segnalate per lunedì</h2>
          <div className="muted small">I genitori le segnalano dall'app. Tocca un bambino per cambiare lo stato e guarda i pasti aggiornarsi.</div>
          <div className="row wrap" style={{ gap: 8 }}>
            {kids.map((k) => (
              <button key={k.id} className={`chipkid${absMon[k.id] ? ' abs' : ''}`} onClick={() => toggleAbsMon(k.id)}>
                <span style={{ fontSize: 15, fontWeight: 700 }}>{firstName(k.name)} {lastName(k.name).charAt(0)}.</span>
                <span style={{ fontSize: 13 }}>{absMon[k.id] ? 'Assente' : 'Presente'}</span>
              </button>
            ))}
          </div>
          <label className="label" htmlFor="costopasto" style={{ marginTop: 6 }}>Costo medio per pasto (€, esempio modificabile)</label>
          <input id="costopasto" className="input" style={{ width: 140 }} value={costoPasto} onChange={(e) => setCostoPasto(e.target.value)} />
        </div>

        <div className="stack">
          <div className="card" style={{ gap: 10 }}>
            <h2>Diete speciali</h2>
            {specials.length === 0 && <div className="muted small">Nessuna dieta speciale per lunedì.</div>}
            {specials.map((k) => (
              <div key={k.id} className="row between wrap" style={{ paddingTop: 8, borderTop: '1px solid var(--line-soft)' }}>
                <b>{k.name}</b>
                <span className="row" style={{ gap: 6 }}>
                  <span className={`badge ${k.sec}`}>{SECTIONS[k.sec].name}</span>
                  <span className="badge navy">{dietaOf(k.nota)}</span>
                </span>
              </div>
            ))}
          </div>
          <div className="card" style={{ gap: 8 }}>
            <h2>Lista della spesa</h2>
            {shopping.map((r) => (
              <div key={r.item} className="row between"><span>{r.item}</span><b>{r.qty}</b></div>
            ))}
            <div className="muted small" style={{ marginTop: 4 }}>Calcolata dal menù di lunedì per i {meals} pasti. Grammature di esempio.</div>
          </div>
        </div>
      </div>

      <div className="stack" style={{ gap: 12 }}>
        <h2>Menù della settimana</h2>
        <div className="grid5">
          {MENU_WEEK.map((d) => (
            <div key={d.name} className="card" style={{ padding: 18, gap: 8 }}>
              <div className="big" style={{ fontSize: 20 }}>{d.name}</div>
              <div className="small"><span className="muted">Primo</span><br />{d.primo}</div>
              <div className="small"><span className="muted">Secondo</span><br />{d.secondo}</div>
              <div className="small"><span className="muted">Contorno</span><br />{d.contorno}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
