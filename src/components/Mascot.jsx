// 귀여운 여우 마스코트 "또박이" — 화면 상황에 맞춰 표정이 바뀐다.
// mood: 'default' | 'cheer' | 'celebrate' | 'oops'

const FACES = {
  default: { eye: 'eye-open', mouth: 'M -10 6 Q 0 12 10 6' },
  cheer: { eye: 'eye-happy', mouth: 'M -12 4 Q 0 16 12 4' },
  celebrate: { eye: 'eye-star', mouth: 'M -12 2 Q 0 18 12 2' },
  oops: { eye: 'eye-worried', mouth: 'M -10 10 Q 0 4 10 10' },
}

export default function Mascot({ mood = 'default', size = 96, className = '' }) {
  const face = FACES[mood] || FACES.default

  return (
    <svg
      className={`mascot ${className}`}
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role="img"
      aria-label="또박이 캐릭터"
    >
      {/* 귀 */}
      <path d="M22 38 L8 8 L42 28 Z" fill="#fa5d00" />
      <path d="M98 38 L112 8 L78 28 Z" fill="#fa5d00" />
      <path d="M26 34 L18 16 L38 28 Z" fill="#fee3b5" />
      <path d="M94 34 L102 16 L82 28 Z" fill="#fee3b5" />

      {/* 얼굴 */}
      <circle cx="60" cy="64" r="40" fill="#fee3b5" />
      <circle cx="60" cy="64" r="40" fill="none" stroke="#fa5d00" strokeWidth="3" />

      {/* 볼터치 */}
      <circle cx="32" cy="74" r="6" fill="#fa5d00" opacity="0.35" />
      <circle cx="88" cy="74" r="6" fill="#fa5d00" opacity="0.35" />

      {/* 주둥이 */}
      <path d="M44 78 Q60 96 76 78 Q60 86 44 78 Z" fill="#ffffff" />

      {/* 눈 */}
      <g transform="translate(44 56)">
        <Eye type={face.eye} />
      </g>
      <g transform="translate(76 56)">
        <Eye type={face.eye} />
      </g>

      {/* 입 */}
      <path d={face.mouth} transform="translate(60 78)" stroke="#1d1e1c" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* 코 */}
      <ellipse cx="60" cy="80" rx="4" ry="3" fill="#1d1e1c" />
    </svg>
  )
}

function Eye({ type }) {
  if (type === 'eye-star') {
    return <path d="M0 -6 L2 -1 L7 -1 L3 2 L4 7 L0 4 L-4 7 L-3 2 L-7 -1 L-2 -1 Z" fill="#fa5d00" />
  }
  if (type === 'eye-happy') {
    return <path d="M-6 0 Q0 -8 6 0" stroke="#1d1e1c" strokeWidth="3" fill="none" strokeLinecap="round" />
  }
  if (type === 'eye-worried') {
    return (
      <>
        <circle cx="0" cy="1" r="4.5" fill="#1d1e1c" />
        <path d="M-6 -6 Q0 -10 6 -6" stroke="#1d1e1c" strokeWidth="2" fill="none" strokeLinecap="round" />
      </>
    )
  }
  return <circle cx="0" cy="0" r="5" fill="#1d1e1c" />
}
