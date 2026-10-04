import React from 'react'

export const PayPalLogo: React.FC<{ className?: string }> = ({ className = 'h-6' }) => (
  <div className={`inline-flex items-center gap-1.5 ${className}`}>
    <svg viewBox="0 0 110 32" className="h-6 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10.8 24.8L13.9 5.2C14.1 3.8 15.4 2.8 16.8 2.8H26.2C31.2 2.8 34.6 3.9 36 6.3C37 8 37 10.3 36 12.8C34.5 16.6 31.3 19 26.5 19H20.6C19.6 19 18.9 19.6 18.6 20.6L17.2 29.5C17.1 30.1 16.6 30.6 16 30.6H11.8C10.9 30.6 10.3 29.8 10.4 29L10.8 24.8Z"
        fill="#003087"
      />
      <path
        d="M19 19.7L21 6.8C21.2 5.4 22.5 4.4 23.9 4.4H33.3C38.3 4.4 41.7 5.5 43.1 7.9C44.1 9.6 44.1 11.9 43.1 14.4C41.6 18.2 38.4 20.6 33.6 20.6H27.7C26.7 20.6 26 21.2 25.7 22.2L24.3 31.1C24.2 31.7 23.7 32.2 23.1 32.2H18.9C18 32.2 17.4 31.4 17.5 30.6L19 19.7Z"
        fill="#0079C1"
      />
      <text
        x="48"
        y="23"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="900"
        fontSize="21"
        fontStyle="italic"
        fill="#003087"
        letterSpacing="-0.5"
      >
        Pay<tspan fill="#0079C1">Pal</tspan>
      </text>
    </svg>
  </div>
)

export const KokoLogo: React.FC<{ className?: string }> = ({ className = 'h-6' }) => (
  <div className={`inline-flex items-center gap-1 ${className}`}>
    <span className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-pink-600 via-pink-500 to-rose-600 px-2.5 py-1 text-white font-black text-xs tracking-wide shadow-xs border border-pink-400/40">
      koko
    </span>
  </div>
)

export const MintpayLogo: React.FC<{ className?: string }> = ({ className = 'h-6' }) => (
  <div className={`inline-flex items-center gap-1 ${className}`}>
    <span className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-emerald-600 via-teal-600 to-teal-700 px-2.5 py-1 text-white font-black text-xs tracking-wide shadow-xs border border-emerald-400/40">
      mint<span className="text-emerald-200">pay</span>
    </span>
  </div>
)
