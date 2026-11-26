import logoUrl from './logo.png';

/** Logo ufficiale della scuola con nome e località. */
export function BrandMark({ height = 52 }: { height?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <img src={logoUrl} alt="" width={Math.round(height * 0.98)} height={height} style={{ display: 'block' }} />
      <div style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, fontSize: 18, lineHeight: 1.1, color: '#17305E' }}>
        Asilo G.B. Vadone
        <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontWeight: 600, fontSize: 12, color: '#5B5247' }}>Quiliano (SV)</div>
      </div>
    </div>
  );
}
