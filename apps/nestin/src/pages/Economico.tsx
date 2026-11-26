import { SECTIONS, SECTION_IDS, eur, num, rettaOf } from '@nestin/shared';
import { useStore } from '../store';

const BAR: Record<string, string> = { farm: 'var(--farm)', jungle: 'var(--jungle)', ocean: 'var(--ocean)' };

export function Economico() {
  const { kids, costi, setCosto } = useStore();
  const revenue = kids.reduce((a, k) => a + rettaOf(k), 0);
  const costTot = num(costi.personale) + num(costi.cucina) + num(costi.altri);
  const margin = revenue - costTot;
  const postiTot = SECTION_IDS.reduce((a, s) => a + SECTIONS[s].capacity, 0);
  const freeSlots = postiTot - kids.length;
  const freeValue = SECTION_IDS.reduce((a, s) => a + (SECTIONS[s].capacity - kids.filter((k) => k.sec === s).length) * SECTIONS[s].retta, 0);
  const cols = 'minmax(0,2fr) minmax(0,2fr) minmax(0,2fr) minmax(0,2fr) minmax(0,3fr)';

  const fields: { key: keyof typeof costi; label: string; id: string }[] = [
    { key: 'personale', label: 'Personale (€)', id: 'cpers' },
    { key: 'cucina', label: 'Cucina e pasti (€)', id: 'ccuc' },
    { key: 'altri', label: 'Affitto, utenze e altro (€)', id: 'caltri' }
  ];

  return (
    <section className="stack">
      <div className="grid4">
        <div className="card" style={{ padding: 22, gap: 4 }}><div className="label">Ricavi mensili</div><div className="big" style={{ fontSize: 36 }}>{eur(revenue)}</div><div className="muted small">rette di ottobre</div></div>
        <div className="card" style={{ padding: 22, gap: 4 }}><div className="label">Costi mensili</div><div className="big" style={{ fontSize: 36 }}>{eur(costTot)}</div><div className="muted small">personale, cucina, altro</div></div>
        <div className="card" style={{ padding: 22, gap: 4 }}>
          <div className="label">Margine</div>
          <div className="big" style={{ fontSize: 36, color: margin >= 0 ? 'var(--ok-fg)' : 'var(--bad-fg)' }}>{eur(margin)}</div>
          <div className="muted small">{revenue > 0 ? Math.round((margin / revenue) * 100) + '%' : '—'} dei ricavi</div>
        </div>
        <div className="card" style={{ padding: 22, gap: 4 }}><div className="label">Posti occupati</div><div className="big" style={{ fontSize: 36 }}>{Math.round((kids.length / postiTot) * 100)}%</div><div className="muted small">{kids.length} su {postiTot}</div></div>
      </div>

      <div className="card sun" style={{ border: '2px solid var(--sun)', padding: '20px 24px', gap: 4 }}>
        <div className="big" style={{ fontSize: 26 }}>{freeSlots} posti liberi = {eur(freeValue)} al mese di ricavi non incassati</div>
        <div className="small" style={{ color: 'var(--warn-fg)' }}>Con le rette di esempio, ogni posto riempito vale da € 380 a € 420 al mese.</div>
      </div>

      <div className="split">
        <div className="card">
          <h2>Per sezione</h2>
          <div className="table-head" style={{ gridTemplateColumns: cols, padding: 0 }}><span>Sezione</span><span>Iscritti</span><span>Posti liberi</span><span>Ricavo</span><span>Bimbi per educatrice oggi</span></div>
          {SECTION_IDS.map((id) => {
            const s = SECTIONS[id];
            const iscr = kids.filter((k) => k.sec === id).length;
            const pres = kids.filter((k) => k.sec === id && k.present).length;
            return (
              <div key={id} className="stack" style={{ gap: 8, paddingTop: 12, borderTop: '1px solid var(--line-soft)' }}>
                <div className="table-head" style={{ gridTemplateColumns: cols, padding: 0, color: 'inherit', fontWeight: 400, fontSize: 16, display: 'grid' }}>
                  <span><span className={`badge ${id}`}>{s.name}</span></span>
                  <span>{iscr} su {s.capacity}</span>
                  <span>{s.capacity - iscr}</span>
                  <b>{eur(iscr * s.retta)}</b>
                  <span>{(pres / s.educatrici).toFixed(1).replace('.', ',')}</span>
                </div>
                <div className="bar"><span style={{ background: BAR[id], width: Math.round((iscr / s.capacity) * 100) + '%' }} /></div>
              </div>
            );
          })}
        </div>

        <div className="card" style={{ gap: 10 }}>
          <h2>Costi mensili</h2>
          <div className="muted small">Li inserisce la direzione. Sono cifre di esempio: modificale e guarda il margine cambiare.</div>
          {fields.map((f) => (
            <div key={f.id} className="stack" style={{ gap: 4 }}>
              <label className="label" htmlFor={f.id}>{f.label}</label>
              <input id={f.id} className="input" value={costi[f.key]} onChange={(e) => setCosto(f.key, e.target.value)} />
            </div>
          ))}
          <div style={{ borderTop: '1px solid var(--line-soft)', paddingTop: 10 }}>Il personale pesa il <b>{revenue > 0 ? Math.round((num(costi.personale) / revenue) * 100) + '%' : '—'}</b> dei ricavi.</div>
        </div>
      </div>
    </section>
  );
}
