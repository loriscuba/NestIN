import { SCHOOL } from './data';

/**
 * Marchio provvisorio (sole + colline). Per usare il logo ufficiale della scuola
 * metti il file in `apps/<app>/public/logo-vadone.jpg` e passa `logoSrc="./logo-vadone.jpg"`.
 */
export function BrandMark({ logoSrc, height = 52 }: { logoSrc?: string; height?: number }) {
  if (logoSrc) {
    return <img src={logoSrc} alt={SCHOOL.name} style={{ height, width: 'auto', display: 'block' }} />;
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <svg width={height * 0.85} height={height * 0.85} viewBox="0 0 44 44" fill="none" aria-hidden="true">
        <circle cx="30" cy="14" r="8" fill="#E8A62B" />
        <path d="M2 40C2 28 12 20 22 24C30 27 38 26 42 30V40H2Z" fill="#2A7347" />
        <path d="M2 40C8 34 16 33 24 36C30 38 36 37 42 36V40H2Z" fill="#1F3A2B" />
      </svg>
      <div style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, fontSize: 18, lineHeight: 1.1, color: '#17305E' }}>
        Asilo G.B. Vadone
        <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontWeight: 600, fontSize: 12, color: '#5B5247' }}>Quiliano (SV)</div>
      </div>
    </div>
  );
}
