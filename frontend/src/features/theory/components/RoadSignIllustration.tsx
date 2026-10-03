import React from 'react'

interface RoadSignIllustrationProps {
  signCode?: string
  className?: string
}

export const RoadSignIllustration: React.FC<RoadSignIllustrationProps> = ({
  signCode,
  className = 'h-24 w-24',
}) => {
  if (!signCode) return null

  // Stop sign
  if (signCode.includes('🛑') || signCode.toLowerCase().includes('stop')) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-md">
          {/* Octagon */}
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
            fontSize="22"
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

  // Give Way sign
  if (signCode.includes('▽') || signCode.toLowerCase().includes('give')) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-md">
          {/* Inverted triangle */}
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
            fill="#1e293b"
            fontSize="11"
            fontWeight="900"
            fontFamily="Arial, sans-serif"
          >
            GIVE
          </text>
          <text
            x="50"
            y="49"
            textAnchor="middle"
            fill="#1e293b"
            fontSize="11"
            fontWeight="900"
            fontFamily="Arial, sans-serif"
          >
            WAY
          </text>
        </svg>
      </div>
    )
  }

  // 50 Speed Limit sign
  if (signCode.includes('50') || signCode.includes('⑯')) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-md">
          {/* Circular restriction */}
          <circle cx="50" cy="50" r="44" fill="#ffffff" stroke="#dc2626" strokeWidth="10" />
          <text
            x="50"
            y="61"
            textAnchor="middle"
            fill="#0f172a"
            fontSize="36"
            fontWeight="900"
            fontFamily="Arial, sans-serif"
          >
            50
          </text>
        </svg>
      </div>
    )
  }

  // No Entry sign
  if (signCode.includes('⛔') || signCode.toLowerCase().includes('entry')) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-md">
          <circle cx="50" cy="50" r="45" fill="#dc2626" />
          <rect x="18" y="42" width="64" height="16" rx="2" fill="#ffffff" />
        </svg>
      </div>
    )
  }

  // Pedestrian Crossing warning sign
  if (signCode.includes('🚶')) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-md">
          {/* Warning triangle */}
          <polygon
            points="50,10 92,86 8,86"
            fill="#fef08a"
            stroke="#dc2626"
            strokeWidth="8"
            strokeLinejoin="round"
          />
          {/* Zebra stripes */}
          <line x1="28" y1="78" x2="72" y2="78" stroke="#0f172a" strokeWidth="4" />
          {/* Pedestrian walking figure */}
          <circle cx="50" cy="40" r="4" fill="#0f172a" />
          <path
            d="M50,44 L50,58 M50,50 L42,56 M50,50 L58,54 M50,58 L44,72 M50,58 L56,72"
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

  // Roundabout warning sign
  if (signCode.includes('🔄')) {
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
          {/* Circular roundabout arrows */}
          <g fill="none" stroke="#0f172a" strokeWidth="4" strokeLinecap="round">
            <path d="M42,46 A14,14 0 0,1 62,54" />
            <path d="M62,58 A14,14 0 0,1 46,68" />
            <path d="M42,66 A14,14 0 0,1 38,50" />
            {/* Arrow heads */}
            <polyline points="58,50 64,54 62,60" fill="#0f172a" />
            <polyline points="50,69 44,70 44,64" fill="#0f172a" />
            <polyline points="40,54 36,48 42,48" fill="#0f172a" />
          </g>
        </svg>
      </div>
    )
  }

  return (
    <div className={`flex items-center justify-center rounded-2xl bg-slate-100 font-bold text-slate-700 ${className}`}>
      {signCode}
    </div>
  )
}

export default RoadSignIllustration
