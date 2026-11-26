import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import { BrandMark, DEMO_DATE, SECTIONS, firstName } from '@nestin/shared';
import { useStore } from './store';
import { Oggi } from './pages/Oggi';
import { Assenza } from './pages/Assenza';
import { Menu } from './pages/Menu';
import { Avvisi } from './pages/Avvisi';
import { AvvisoDettaglio } from './pages/AvvisoDettaglio';
import { Rette } from './pages/Rette';

const TABS = [
  { to: '/', label: 'Oggi' },
  { to: '/menu', label: 'Menù' },
  { to: '/avvisi', label: 'Avvisi' },
  { to: '/rette', label: 'Rette' }
];

export function App() {
  const { child } = useStore();
  return (
    <div className="stage">
      <div className="phone">
        <header className="phone-head"><BrandMark height={48} /></header>
        <div className="phone-hero">
          <h1>Ciao, famiglia di {firstName(child.name)}</h1>
          <div className="row" style={{ gap: 8 }}>
            <span className={`badge ${child.sec}`}>Sezione {SECTIONS[child.sec].name}</span>
            <span style={{ fontSize: 14, color: '#d5ddec' }}>{DEMO_DATE}</span>
          </div>
        </div>
        <div className="phone-body">
          <Routes>
            <Route path="/" element={<Oggi />} />
            <Route path="/assenza" element={<Assenza />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/avvisi" element={<Avvisi />} />
            <Route path="/avvisi/:id" element={<AvvisoDettaglio />} />
            <Route path="/rette" element={<Rette />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <nav className="tabs" aria-label="Sezioni app">
          {TABS.map((t) => (
            <NavLink key={t.to} to={t.to} end={t.to === '/'} className={({ isActive }) => (isActive ? 'active' : '')}>{t.label}</NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
