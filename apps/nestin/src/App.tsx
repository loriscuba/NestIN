import { NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { BrandMark, DEMO_DATE } from '@nestin/shared';
import { useStore, type Role } from './store';
import { Dashboard } from './pages/Dashboard';
import { Presenze } from './pages/Presenze';
import { Pasti } from './pages/Pasti';
import { Bambini } from './pages/Bambini';
import { Diario } from './pages/Diario';
import { Comunicazioni } from './pages/Comunicazioni';
import { Rette } from './pages/Rette';
import { Economico } from './pages/Economico';

interface Item { path: string; label: string; title: string; roles: Role[] }
const ITEMS: Item[] = [
  { path: '/', label: 'Panoramica', title: 'Panoramica', roles: ['segreteria', 'maestra'] },
  { path: '/presenze', label: 'Presenze', title: 'Presenze di oggi', roles: ['segreteria', 'maestra'] },
  { path: '/diario', label: 'Diario', title: 'Diario della giornata', roles: ['maestra', 'segreteria'] },
  { path: '/pasti', label: 'Pasti', title: 'Pasti di lunedì 5 ottobre', roles: ['segreteria'] },
  { path: '/bambini', label: 'Bambini', title: 'Bambini', roles: ['segreteria', 'maestra'] },
  { path: '/comunicazioni', label: 'Comunicazioni', title: 'Comunicazioni', roles: ['segreteria', 'maestra'] },
  { path: '/rette', label: 'Rette', title: 'Rette', roles: ['segreteria'] },
  { path: '/economico', label: 'Economico', title: 'Economico', roles: ['segreteria'] }
];

export function App() {
  const { role, setRole } = useStore();
  const { pathname } = useLocation();
  const visible = ITEMS.filter((i) => i.roles.includes(role));
  const current = ITEMS.find((i) => i.path === pathname) ?? ITEMS[0];
  const allowed = visible.some((i) => i.path === current.path);

  return (
    <>
      <header className="topbar">
        <div className="topbar-in">
          <BrandMark />
          <nav className="nav" aria-label="Sezioni">
            {visible.map((i) => (
              <NavLink key={i.path} to={i.path} end className={({ isActive }) => (isActive ? 'active' : '')}>{i.label}</NavLink>
            ))}
          </nav>
          <label className="role">
            Accedi come
            <select value={role} onChange={(e) => setRole(e.target.value as Role)}>
              <option value="segreteria">Segreteria</option>
              <option value="maestra">Maestra</option>
            </select>
          </label>
        </div>
      </header>
      <main className="page">
        <div>
          <h1>{current.title}</h1>
          <div className="muted" style={{ marginTop: 2 }}>NestIN · {DEMO_DATE} · Demo con dati di esempio</div>
        </div>
        {allowed ? (
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/presenze" element={<Presenze />} />
            <Route path="/diario" element={<Diario />} />
            <Route path="/pasti" element={<Pasti />} />
            <Route path="/bambini" element={<Bambini />} />
            <Route path="/comunicazioni" element={<Comunicazioni />} />
            <Route path="/rette" element={<Rette />} />
            <Route path="/economico" element={<Economico />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        ) : (
          <Navigate to="/" replace />
        )}
      </main>
    </>
  );
}
