import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../store';

export function AvvisoDettaglio() {
  const { id } = useParams();
  const { notices, done, markDone } = useStore();
  const nav = useNavigate();
  const n = notices.find((x) => x.id === Number(id));
  if (!n) return <Navigate to="/avvisi" replace />;
  const isDone = !!done[n.id];

  return (
    <>
      <button className="back" onClick={() => nav('/avvisi')}>← Avvisi</button>
      <div className="pcard" style={{ padding: 18, gap: 12 }}>
        <h2 style={{ fontSize: 23, lineHeight: 1.15 }}>{n.title}</h2>
        <div style={{ color: '#3b4a66' }}>{n.body}</div>
        {n.action && (
          <button className={`pbtn ${isDone ? 'ok' : 'primary'}`} disabled={isDone} onClick={() => markDone(n.id)}>
            {isDone ? n.doneLabel : n.action}
          </button>
        )}
      </div>
    </>
  );
}
