import React, { useState } from 'react'

interface RoadSignIllustrationProps {
  signCode?: string
  className?: string
}

export const RoadSignIllustration: React.FC<RoadSignIllustrationProps> = ({
  signCode,
  className = 'h-24 w-24',
}) => {
  const [imgError, setImgError] = useState(false)

  if (!signCode) return null

  const code = signCode.trim()
  const lower = code.toLowerCase()

  // 1. Direct Image URL, Base64 DataURL, SVG DataURL, or Blob
  if (
    !imgError &&
    (code.startsWith('data:image/') ||
      code.startsWith('http://') ||
      code.startsWith('https://') ||
      code.startsWith('/') ||
      code.startsWith('blob:'))
  ) {
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-white p-1 shadow-xs border border-slate-200 ${className}`}
      >
        <img
          src={code}
          alt="Road Sign / Question Media"
          className="h-full w-full object-contain"
          onError={() => setImgError(true)}
        />
      </div>
    )
  }

  // 2. STOP sign (Octagon, Red)
  if (code.includes('🛑') || lower.includes('stop') || lower === 'sign-stop') {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-md">
          <polygon
            points="30,5 70,5 95,30 95,70 70,95 30,95 5,70 5,30"
            fill="#dc2626"
            stroke="#ffffff"
            strokeWidth="3"
          />
          <text
            x="50"
            y="57"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="21"
            fontWeight="900"
            fontFamily="Arial, sans-serif"
            letterSpacing="1"
          >
            STOP
          </text>
        </svg>
      </div>
    )
  }

  // 3. GIVE WAY sign (Inverted Triangle)
  if (
    code.includes('▽') ||
    lower.includes('give') ||
    lower.includes('yield') ||
    lower === 'sign-give-way'
  ) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-md">
          <polygon
            points="50,92 8,16 92,16"
            fill="#ffffff"
            stroke="#dc2626"
            strokeWidth="10"
          />
          <text
            x="50"
            y="36"
            textAnchor="middle"
            fill="#0f172a"
            fontSize="12"
            fontWeight="900"
            fontFamily="Arial, sans-serif"
          >
            GIVE
          </text>
          <text
            x="50"
            y="50"
            textAnchor="middle"
            fill="#0f172a"
            fontSize="12"
            fontWeight="900"
            fontFamily="Arial, sans-serif"
          >
            WAY
          </text>
        </svg>
      </div>
    )
  }

  // 4. NO ENTRY sign (Solid Red Circle with White Horizontal Bar)
  if (
    code.includes('⛔') ||
    lower.includes('no-entry') ||
    lower.includes('no entry') ||
    lower === 'sign-no-entry'
  ) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-md">
          <circle cx="50" cy="50" r="45" fill="#dc2626" />
          <rect x="16" y="42" width="68" height="16" rx="3" fill="#ffffff" />
        </svg>
      </div>
    )
  }

  // 5. NO PARKING sign (Blue Circle with Red Border and Red Diagonal Slash)
  if (
    lower.includes('no-parking') ||
    lower.includes('no parking') ||
    lower === 'sign-no-parking' ||
    code.includes('🚫🅿️')
  ) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-md">
          <circle cx="50" cy="50" r="45" fill="#2563eb" stroke="#dc2626" strokeWidth="10" />
          <line x1="20" y1="20" x2="80" y2="80" stroke="#dc2626" strokeWidth="9" />
          <text
            x="50"
            y="64"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="40"
            fontWeight="900"
            fontFamily="Arial, sans-serif"
          >
            P
          </text>
        </svg>
      </div>
    )
  }

  // 6. NO OVERTAKING sign (Red circle with two cars)
  if (
    lower.includes('overtaking') ||
    lower === 'sign-no-overtaking' ||
    code.includes('🚫🚗')
  ) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-md">
          <circle cx="50" cy="50" r="45" fill="#ffffff" stroke="#dc2626" strokeWidth="8" />
          {/* Right car (red - overtaking) */}
          <rect x="23" y="40" width="22" height="26" rx="4" fill="#dc2626" />
          <circle cx="28" cy="45" r="2" fill="#ffffff" />
          <circle cx="40" cy="45" r="2" fill="#ffffff" />
          {/* Left car (black) */}
          <rect x="54" y="40" width="22" height="26" rx="4" fill="#0f172a" />
          <circle cx="59" cy="45" r="2" fill="#ffffff" />
          <circle cx="71" cy="45" r="2" fill="#ffffff" />
        </svg>
      </div>
    )
  }

  // 7. EXPRESSWAY / HIGHWAY SIGN
  if (
    lower.includes('expressway') ||
    lower.includes('highway') ||
    lower === 'sign-expressway' ||
    code.includes('🛣️')
  ) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-md">
          <rect x="5" y="10" width="90" height="80" rx="8" fill="#1e3a8a" stroke="#ffffff" strokeWidth="3" />
          {/* Expressway Bridge & Road Lines */}
          <path d="M25 80 L38 35 L62 35 L75 80" fill="none" stroke="#ffffff" strokeWidth="4" />
          <line x1="50" y1="42" x2="50" y2="78" stroke="#ffffff" strokeWidth="3" strokeDasharray="4 3" />
          {/* Overpass horizontal bar */}
          <rect x="18" y="28" width="64" height="7" rx="2" fill="#38bdf8" />
          <text
            x="50"
            y="23"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="10"
            fontWeight="900"
            fontFamily="Arial, sans-serif"
          >
            E-01
          </text>
        </svg>
      </div>
    )
  }

  // 8. SPEED LIMIT SIGNS (100, 70, 50, 40, 30, etc.)
  const speedMatch = code.match(/(\d{2,3})/)
  if (
    speedMatch ||
    lower.includes('speed') ||
    lower.includes('⑯') ||
    lower.includes('100') ||
    lower.includes('50') ||
    lower.includes('70')
  ) {
    const speedVal = speedMatch ? speedMatch[1] : lower.includes('100') ? '100' : lower.includes('70') ? '70' : '50'
    const fontSize = speedVal.length >= 3 ? '30' : '36'
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-md">
          <circle cx="50" cy="50" r="45" fill="#ffffff" stroke="#dc2626" strokeWidth="10" />
          <text
            x="50"
            y={speedVal.length >= 3 ? '60' : '62'}
            textAnchor="middle"
            fill="#0f172a"
            fontSize={fontSize}
            fontWeight="900"
            fontFamily="Arial, sans-serif"
          >
            {speedVal}
          </text>
        </svg>
      </div>
    )
  }

  // 9. PEDESTRIAN CROSSING (Warning Triangle with pedestrian figure & zebra lines)
  if (
    code.includes('🚶') ||
    lower.includes('pedestrian') ||
    lower.includes('zebra') ||
    lower === 'sign-pedestrian'
  ) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-md">
          <polygon
            points="50,10 92,86 8,86"
            fill="#fef08a"
            stroke="#dc2626"
            strokeWidth="8"
            strokeLinejoin="round"
          />
          <line x1="28" y1="78" x2="72" y2="78" stroke="#0f172a" strokeWidth="4" />
          <circle cx="50" cy="38" r="4.5" fill="#0f172a" />
          <path
            d="M50,42 L50,58 M50,48 L42,55 M50,48 L58,52 M50,58 L43,72 M50,58 L57,72"
            stroke="#0f172a"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>
    )
  }

  // 10. RAILWAY LEVEL CROSSING (Warning Triangle with Locomotive)
  if (
    code.includes('🚂') ||
    lower.includes('railway') ||
    lower.includes('train') ||
    lower === 'sign-railway'
  ) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-md">
          <polygon
            points="50,10 92,86 8,86"
            fill="#fef08a"
            stroke="#dc2626"
            strokeWidth="8"
            strokeLinejoin="round"
          />
          {/* Steam Train Icon */}
          <rect x="34" y="44" width="32" height="24" rx="2" fill="#0f172a" />
          <rect x="52" y="48" width="10" height="8" fill="#ffffff" />
          <circle cx="42" cy="71" r="5" fill="#0f172a" />
          <circle cx="58" cy="71" r="5" fill="#0f172a" />
          <rect x="36" y="38" width="6" height="6" fill="#0f172a" />
        </svg>
      </div>
    )
  }

  // 11. ROUNDABOUT AHEAD (Warning Triangle with 3 circular arrows)
  if (
    code.includes('🔄') ||
    lower.includes('roundabout') ||
    lower === 'sign-roundabout'
  ) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-md">
          <polygon
            points="50,10 92,86 8,86"
            fill="#ffffff"
            stroke="#dc2626"
            strokeWidth="8"
            strokeLinejoin="round"
          />
          <g fill="none" stroke="#0f172a" strokeWidth="4" strokeLinecap="round">
            <path d="M42,46 A14,14 0 0,1 62,54" />
            <path d="M62,58 A14,14 0 0,1 46,68" />
            <path d="M42,66 A14,14 0 0,1 38,50" />
            <polyline points="58,50 64,54 62,60" fill="#0f172a" />
            <polyline points="50,69 44,70 44,64" fill="#0f172a" />
            <polyline points="40,54 36,48 42,48" fill="#0f172a" />
          </g>
        </svg>
      </div>
    )
  }

  // 12. TRAFFIC LIGHTS AHEAD
  if (
    code.includes('🚦') ||
    lower.includes('traffic-lights') ||
    lower.includes('traffic light') ||
    lower === 'sign-traffic-lights'
  ) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-md">
          <polygon
            points="50,10 92,86 8,86"
            fill="#ffffff"
            stroke="#dc2626"
            strokeWidth="8"
            strokeLinejoin="round"
          />
          <rect x="42" y="38" width="16" height="34" rx="3" fill="#0f172a" />
          <circle cx="50" cy="44" r="3.5" fill="#dc2626" />
          <circle cx="50" cy="55" r="3.5" fill="#f59e0b" />
          <circle cx="50" cy="66" r="3.5" fill="#10b981" />
        </svg>
      </div>
    )
  }

  // 13. HOSPITAL FACILITY (Blue Rectangle with H and Red Cross)
  if (
    code.includes('🏥') ||
    lower.includes('hospital') ||
    lower === 'sign-hospital' ||
    code.trim() === 'H'
  ) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-md">
          <rect x="10" y="10" width="80" height="80" rx="8" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
          <rect x="20" y="20" width="60" height="60" rx="4" fill="#ffffff" />
          <text
            x="50"
            y="65"
            textAnchor="middle"
            fill="#2563eb"
            fontSize="44"
            fontWeight="900"
            fontFamily="Arial, sans-serif"
          >
            H
          </text>
          {/* Small Red Cross in top-right corner */}
          <rect x="64" y="24" width="10" height="3" fill="#dc2626" />
          <rect x="67.5" y="20.5" width="3" height="10" fill="#dc2626" />
        </svg>
      </div>
    )
  }

  // 14. SLIPPERY ROAD
  if (lower.includes('slippery') || lower === 'sign-slippery-road' || code.includes('〰️')) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-md">
          <polygon
            points="50,10 92,86 8,86"
            fill="#fef08a"
            stroke="#dc2626"
            strokeWidth="8"
            strokeLinejoin="round"
          />
          <rect x="42" y="44" width="16" height="22" rx="3" fill="#0f172a" />
          <path
            d="M34 76 Q 44 68, 48 76 T 66 76"
            fill="none"
            stroke="#0f172a"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>
    )
  }

  // 15. MANDATORY TURN (Blue circle with white arrow)
  if (
    code.includes('⬅️') ||
    code.includes('➡️') ||
    lower.includes('turn-left') ||
    lower.includes('turn-right') ||
    lower.includes('mandatory-left') ||
    lower.includes('mandatory-right')
  ) {
    const isRight = code.includes('➡️') || lower.includes('right')
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-md">
          <circle cx="50" cy="50" r="45" fill="#2563eb" stroke="#ffffff" strokeWidth="3" />
          {isRight ? (
            <path
              d="M36 50 L64 50 M52 38 L64 50 L52 62"
              stroke="#ffffff"
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          ) : (
            <path
              d="M64 50 L36 50 M48 38 L36 50 L48 62"
              stroke="#ffffff"
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          )}
        </svg>
      </div>
    )
  }

  // 16. GATED RAILWAY CROSSING / BARRIER (Fence gate)
  if (
    code.includes('🚧') ||
    lower.includes('gated') ||
    lower.includes('barrier') ||
    lower === 'sign-railway-gated'
  ) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-md">
          <polygon
            points="50,10 92,86 8,86"
            fill="#fef08a"
            stroke="#dc2626"
            strokeWidth="8"
            strokeLinejoin="round"
          />
          {/* Fence structure */}
          <line x1="30" y1="52" x2="70" y2="52" stroke="#0f172a" strokeWidth="4" />
          <line x1="30" y1="66" x2="70" y2="66" stroke="#0f172a" strokeWidth="4" />
          <line x1="35" y1="44" x2="35" y2="74" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
          <line x1="50" y1="44" x2="50" y2="74" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
          <line x1="65" y1="44" x2="65" y2="74" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </div>
    )
  }

  // 17. PRIORITY ROAD (Yellow Diamond with White Border)
  if (code.includes('◆') || lower.includes('priority-road') || lower === 'sign-priority-road') {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-md">
          <polygon points="50,10 90,50 50,90 10,50" fill="#facc15" stroke="#ffffff" strokeWidth="8" />
          <polygon points="50,18 82,50 50,82 18,50" fill="#facc15" stroke="#0f172a" strokeWidth="2" />
        </svg>
      </div>
    )
  }

  // 18. STEEP HILL / DOWNWARD SLOPE
  if (code.includes('📉') || lower.includes('steep') || lower === 'sign-steep-hill') {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-md">
          <polygon
            points="50,10 92,86 8,86"
            fill="#fef08a"
            stroke="#dc2626"
            strokeWidth="8"
            strokeLinejoin="round"
          />
          <polygon points="26,76 74,76 74,52" fill="#0f172a" />
          <text
            x="48"
            y="68"
            fill="#ffffff"
            fontSize="10"
            fontWeight="bold"
            fontFamily="Arial, sans-serif"
          >
            10%
          </text>
        </svg>
      </div>
    )
  }

  // 19. ROAD NARROWS
  if (code.includes('║') || lower.includes('narrows') || lower === 'sign-road-narrows') {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-md">
          <polygon
            points="50,10 92,86 8,86"
            fill="#fef08a"
            stroke="#dc2626"
            strokeWidth="8"
            strokeLinejoin="round"
          />
          <path
            d="M34 76 L34 60 L44 46 L44 38 M66 76 L66 60 L56 46 L56 38"
            fill="none"
            stroke="#0f172a"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    )
  }

  // 20. Default Clean Badge
  return (
    <div
      className={`flex items-center justify-center rounded-2xl bg-slate-100 font-bold text-slate-800 border border-slate-300 p-2 text-center text-[11px] shadow-xs ${className}`}
    >
      <span className="truncate max-w-full font-mono">{code}</span>
    </div>
  )
}

export default RoadSignIllustration
