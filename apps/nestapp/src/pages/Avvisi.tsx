import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';

export function Avvisi() {
  const { notices } = useStore();
  const nav = useNavigate();
  return (
    <>
      {notices.map((n) => (
        <button key={n.id} className="notice-row" onClick={() => nav(`/avvisi/${n.id}`)}>
          <span className="row between" style={{ gap: 8 }}>
            <b style={{ fontSize: 17 }}>{n.title}</b>
            {n.fresh && <span className="badge sun" style={{ fontSize: 12 }}>Nuovo</span>}
          </span>
          <span className="muted small">{n.body.length > 60 ? n.body.slice(0, 57) + '…' : n.body}</span>
        </button>
      ))}
    </>
  );
}
