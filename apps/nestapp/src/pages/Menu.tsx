import { MENU_WEEK } from '@nestin/shared';

export function Menu() {
  return (
    <>
      <div className="pcard" style={{ padding: 18, gap: 8 }}>
        <h2 style={{ fontSize: 21, marginBottom: 4 }}>Menù della settimana</h2>
        {MENU_WEEK.map((d) => (
          <div key={d.name} style={{ display: 'grid', gridTemplateColumns: '84px minmax(0,1fr)', gap: 10, padding: '8px 10px', borderRadius: 12, background: d.name === 'Venerdì' ? 'var(--warn-bg)' : 'transparent' }}>
            <b>{d.name}</b><span>{d.primo}, {d.secondo.toLowerCase()}, {d.contorno.toLowerCase()}</span>
          </div>
        ))}
      </div>
      <div className="pcard small" style={{ background: 'var(--warn-bg)', color: 'var(--warn-fg)', border: 0 }}>
        I pasti sono cucinati al momento dalla cuoca. Per allergie e intolleranze il menù si adatta.
      </div>
    </>
  );
}
