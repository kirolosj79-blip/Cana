import { useId, type ReactNode } from 'react'

/** Colourful, glossy illustration icons (original artwork, SVG) used on the bold screens. */
type P = { size?: number; className?: string }

function make(draw: (u: string) => ReactNode) {
  return function Illus({ size = 48, className }: P) {
    const u = useId().replace(/[^a-zA-Z0-9]/g, '')
    const grad = (id: string, a: string, b: string) => (
      <linearGradient id={`${u}${id}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={a} />
        <stop offset="1" stopColor={b} />
      </linearGradient>
    )
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" className={className} style={{ filter: 'drop-shadow(0 2px 2px rgba(10,25,60,.28))' }} aria-hidden>
        <defs>
          {grad('b', '#6DB4FF', '#2262DC')}
          {grad('n', '#3C62B8', '#12295A')}
          {grad('g', '#FFE066', '#F2A200')}
          {grad('r', '#FF7A7A', '#D01E3C')}
          {grad('e', '#6BE79A', '#1BA356')}
          {grad('p', '#A987F2', '#6A36C9')}
          {grad('s', '#FFD2A3', '#F09A55')}
          {grad('l', '#F4F8FF', '#C7DBFB')}
          {grad('k', '#9ED4FF', '#4C9BFF')}
        </defs>
        {draw(u)}
      </svg>
    )
  }
}
const f = (u: string, id: string) => `url(#${u}${id})`
const Ban = ({ cx, cy, r }: { cx: number; cy: number; r: number }) => (
  <g>
    <circle cx={cx} cy={cy} r={r} fill="rgba(255,255,255,.92)" stroke="#E0233F" strokeWidth="4.5" />
    <line x1={cx - r * 0.7} y1={cy - r * 0.7} x2={cx + r * 0.7} y2={cy + r * 0.7} stroke="#E0233F" strokeWidth="4.5" strokeLinecap="round" />
  </g>
)
const Person = ({ x, y, fill }: { x: number; y: number; fill: string }) => (
  <g fill={fill}>
    <circle cx={x} cy={y} r="5" />
    <path d={`M${x - 9} ${y + 17} a9 9 0 0 1 18 0 z`} />
  </g>
)
const HEART = 'M32 56 C8 38 6 22 18 14 C25 10 31 14 32 20 C33 14 39 10 46 14 C58 22 56 38 32 56z'

export const IlPhoneLock = make((u) => (
  <>
    <rect x="12" y="4" width="32" height="52" rx="6" fill={f(u, 'n')} />
    <rect x="15.5" y="9" width="25" height="42" rx="3" fill={f(u, 'k')} />
    <Person x={28} y={25} fill={f(u, 'b')} />
    <path d="M42 40 v-5 a6 6 0 0 1 12 0 v5" stroke="#D99400" strokeWidth="3.6" fill="none" />
    <rect x="38" y="39" width="20" height="16" rx="4" fill={f(u, 'g')} />
    <circle cx="48" cy="46" r="2.3" fill="#7A4B00" />
  </>
))
export const IlPhotoBan = make((u) => (
  <>
    <rect x="5" y="14" width="40" height="32" rx="4" fill={f(u, 'b')} transform="rotate(-8 25 30)" />
    <rect x="8" y="12" width="42" height="34" rx="4" fill="#fff" />
    <rect x="11" y="15" width="36" height="28" rx="2" fill={f(u, 'k')} />
    <circle cx="40" cy="22" r="4" fill={f(u, 'g')} />
    <path d="M11 43 L22 28 L30 38 L36 32 L47 43 z" fill="#1F5FCC" />
    <Ban cx={46} cy={44} r={12} />
  </>
))
export const IlMoneyBan = make((u) => (
  <>
    <rect x="3" y="18" width="44" height="26" rx="4" fill={f(u, 'e')} stroke="#157A3F" strokeWidth="2" />
    <circle cx="25" cy="31" r="8" fill="#C4F6D6" stroke="#157A3F" strokeWidth="1.5" />
    <text x="25" y="36" textAnchor="middle" fontSize="13" fontWeight="800" fill="#157A3F">$</text>
    <circle cx="48" cy="17" r="7" fill={f(u, 'g')} stroke="#C98A00" strokeWidth="1.5" />
    <Ban cx={46} cy={44} r={12} />
  </>
))
export const IlBank = make((u) => (
  <>
    <path d="M32 5 L58 20 H6 z" fill={f(u, 'b')} />
    <circle cx="32" cy="14" r="3" fill="#fff" />
    <rect x="6" y="20" width="52" height="5" rx="1.5" fill={f(u, 'n')} />
    {[10, 22.3, 34.6, 47].map((x) => <rect key={x} x={x} y="27" width="7" height="22" rx="1.5" fill={f(u, 'l')} stroke="#7FA8EA" strokeWidth="1" />)}
    <rect x="6" y="49" width="52" height="5" rx="1.5" fill={f(u, 'b')} />
    <rect x="3" y="54" width="58" height="5" rx="1.5" fill={f(u, 'n')} />
  </>
))
export const IlClock = make((u) => (
  <>
    <circle cx="32" cy="32" r="28" fill={f(u, 'b')} />
    <circle cx="32" cy="32" r="22" fill="#fff" />
    {[[32, 13, 32, 18], [32, 46, 32, 51], [13, 32, 18, 32], [46, 32, 51, 32]].map((l, i) => <line key={i} x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} stroke="#12295A" strokeWidth="2.6" strokeLinecap="round" />)}
    <path d="M32 32 V20 M32 32 L42 37" stroke="#12295A" strokeWidth="3.6" strokeLinecap="round" fill="none" />
    <circle cx="32" cy="32" r="3" fill={f(u, 'g')} />
  </>
))
const SHIELD = 'M32 4 L56 12 V30 C56 44 46 54 32 60 C18 54 8 44 8 30 V12 Z'
export const IlShieldCheck = make((u) => (
  <>
    <path d={SHIELD} fill={f(u, 'b')} stroke="#1B4FB8" strokeWidth="2" />
    <path d="M32 9 L51 15 V30 C51 41 43 49 32 54 z" fill="rgba(255,255,255,.18)" />
    <path d="M21 31 l8 8 l14 -16" stroke="#fff" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </>
))
export const IlShieldPeople = make((u) => (
  <>
    <g transform="translate(-2 -2) scale(.86)">
      <path d={SHIELD} fill={f(u, 'b')} stroke="#1B4FB8" strokeWidth="2" />
      <path d="M21 31 l8 8 l14 -16" stroke="#fff" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </g>
    <g><circle cx="41" cy="42" r="5" fill={f(u, 'e')} /><path d="M32 59 a9 9 0 0 1 18 0 z" fill={f(u, 'e')} /></g>
    <g><circle cx="52" cy="44" r="5" fill={f(u, 'g')} /><path d="M43 61 a9 9 0 0 1 18 0 z" fill={f(u, 'g')} /></g>
  </>
))
export const IlIdCard = make((u) => (
  <>
    <rect x="3" y="11" width="48" height="36" rx="6" fill={f(u, 'b')} />
    <rect x="7" y="15" width="40" height="28" rx="3" fill={f(u, 'l')} />
    <Person x={18} y={26} fill={f(u, 'b')} />
    {[[31, 22, 14], [31, 29, 14], [31, 36, 9]].map((r, i) => <rect key={i} x={r[0]} y={r[1]} width={r[2]} height="3" rx="1.5" fill="#7FB0F5" />)}
    <circle cx="48" cy="44" r="11" fill={f(u, 'e')} stroke="#fff" strokeWidth="2.5" />
    <path d="M42.5 44 l4 4 l7 -8" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </>
))
export const IlRedLock = make((u) => (
  <>
    <path d={SHIELD} fill={f(u, 'r')} stroke="#A9132D" strokeWidth="2" />
    <path d="M32 9 L51 15 V30 C51 41 43 49 32 54 z" fill="rgba(255,255,255,.16)" />
    <path d="M25 30 v-5 a7 7 0 0 1 14 0 v5" stroke="#fff" strokeWidth="4" fill="none" />
    <rect x="21" y="29" width="22" height="17" rx="3.5" fill="#fff" />
    <circle cx="32" cy="36.5" r="2.6" fill="#D01E3C" />
    <rect x="31" y="37" width="2" height="5" fill="#D01E3C" />
  </>
))
export const IlChat = make((u) => (
  <>
    <rect x="3" y="7" width="40" height="29" rx="12" fill={f(u, 'b')} />
    <path d="M13 33 L9 46 L25 35 z" fill="#2B6BE0" />
    {[16, 23, 30].map((x) => <circle key={x} cx={x} cy="21.5" r="2.8" fill="#fff" />)}
    <rect x="23" y="27" width="37" height="25" rx="11" fill={f(u, 'n')} />
    <path d="M47 50 L53 60 L41 51 z" fill="#1B3B7D" />
    <rect x="31" y="35" width="21" height="3" rx="1.5" fill="#fff" />
    <rect x="31" y="42" width="14" height="3" rx="1.5" fill="#fff" />
  </>
))
export const IlReturn = make((u) => (
  <>
    <path d="M14 40 A20 20 0 1 1 22 50" stroke={f(u, 'p')} strokeWidth="7" strokeLinecap="round" fill="none" />
    <polygon points="14,46 27,45 20,58" fill="#6A36C9" />
    <Person x={27} y={28} fill={f(u, 'n')} />
    <g><circle cx="38" cy="31" r="4.5" fill={f(u, 'b')} /><path d="M30 46 a8 8 0 0 1 16 0 z" fill={f(u, 'b')} /></g>
  </>
))
export const IlWarn = make((u) => (
  <>
    <path d="M32 7 L59 53 H5 z" fill={f(u, 'g')} stroke="#F2A200" strokeWidth="6" strokeLinejoin="round" />
    <rect x="29.5" y="22" width="5" height="18" rx="2.5" fill="#4A3000" />
    <circle cx="32" cy="46" r="3.2" fill="#4A3000" />
  </>
))
export const IlBadge = make((u) => (
  <>
    <circle cx="32" cy="32" r="27" fill={f(u, 'e')} stroke="#fff" strokeWidth="3" />
    <path d="M18 33 l9 9 l19 -20" stroke="#fff" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </>
))
export const IlHeart = make((u) => (
  <>
    <path d={HEART} fill={f(u, 'b')} stroke="#1B4FB8" strokeWidth="2" />
    <path d="M17 20 C20 15 26 16 28 21" stroke="rgba(255,255,255,.6)" strokeWidth="3" strokeLinecap="round" fill="none" />
  </>
))
export const IlHandshake = make((u) => (
  <>
    <rect x="1" y="20" width="11" height="26" rx="3" fill={f(u, 'n')} />
    <rect x="52" y="20" width="11" height="26" rx="3" fill={f(u, 'b')} />
    <path d="M12 24 L27 19 L39 27 L52 24 V42 L40 53 L28 51 L12 42 z" fill={f(u, 's')} stroke="#C26A2B" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M29 33 L39 40 M32 29 L43 36 M26 37 L34 43" stroke="#C26A2B" strokeWidth="2" strokeLinecap="round" />
  </>
))
export const IlMail = make((u) => (
  <>
    <rect x="5" y="14" width="54" height="38" rx="5" fill={f(u, 'l')} stroke="#9FBCE6" strokeWidth="1.5" />
    <path d="M5 18 L32 38 L59 18" fill="#E3ECFA" stroke="#9FBCE6" strokeWidth="1.5" strokeLinejoin="round" />
    <g transform="translate(17 17) scale(.5)"><path d={HEART} fill={f(u, 'r')} stroke="#fff" strokeWidth="3" /></g>
  </>
))
export const IlSearchId = make((u) => (
  <>
    <rect x="3" y="24" width="40" height="30" rx="4" fill={f(u, 'k')} />
    <Person x={16} y={35} fill="#fff" />
    <rect x="26" y="38" width="12" height="3" rx="1.5" fill="#fff" />
    <circle cx="37" cy="25" r="16" fill="rgba(255,255,255,.55)" stroke={f(u, 'n')} strokeWidth="5" />
    <g transform="translate(29 18) scale(.25)"><path d={HEART} fill={f(u, 'r')} /></g>
    <line x1="48.5" y1="37" x2="59" y2="52" stroke="#12295A" strokeWidth="6.5" strokeLinecap="round" />
  </>
))
export const IlPeoplePlus = make((u) => (
  <>
    <g><circle cx="13" cy="25" r="6" fill={f(u, 's')} /><path d="M2 52 C2 38 24 38 24 52 z" fill="#D95B9B" /></g>
    <g><circle cx="49" cy="25" r="6" fill={f(u, 's')} /><path d="M38 52 C38 38 60 38 60 52 z" fill={f(u, 'p')} /></g>
    <g><circle cx="31" cy="19" r="8" fill={f(u, 's')} /><path d="M15 56 C15 36 47 36 47 56 z" fill={f(u, 'n')} /><path d="M26 38 L31 46 L36 38 z" fill="#fff" /></g>
    <circle cx="52" cy="50" r="9.5" fill={f(u, 'e')} stroke="#fff" strokeWidth="2.5" />
    <path d="M52 45 v10 M47 50 h10" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" />
  </>
))
export const IlChatHeart = make((u) => (
  <>
    <rect x="3" y="7" width="46" height="34" rx="12" fill={f(u, 'b')} />
    <path d="M12 38 L8 52 L26 40 z" fill="#2B6BE0" />
    <rect x="12" y="17" width="26" height="3.5" rx="1.75" fill="#fff" />
    <rect x="12" y="25" width="20" height="3.5" rx="1.75" fill="#fff" />
    <g transform="translate(33 27) scale(.42)"><path d={HEART} fill={f(u, 'r')} stroke="#fff" strokeWidth="5" /></g>
  </>
))
export const IlClockCal = make((u) => (
  <>
    <rect x="28" y="24" width="33" height="34" rx="5" fill="#fff" stroke="#E0A100" strokeWidth="2" />
    <rect x="28" y="24" width="33" height="10" rx="5" fill={f(u, 'g')} />
    {[0, 1, 2].flatMap((r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={32 + c * 10} y={38 + r * 7} width="6" height="4.5" rx="1" fill="#F2A200" />))}
    <circle cx="24" cy="30" r="21" fill={f(u, 'b')} />
    <circle cx="24" cy="30" r="16" fill="#fff" />
    <path d="M24 30 V19 M24 30 L32 34" stroke="#12295A" strokeWidth="3.2" strokeLinecap="round" fill="none" />
    <circle cx="24" cy="30" r="2.4" fill={f(u, 'g')} />
  </>
))
