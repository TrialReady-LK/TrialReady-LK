import React from 'react'
import { LoginForm } from '../components/LoginForm'

export const LoginPage: React.FC = () => {
  return (
    <div className="relative min-h-[100dvh] w-full bg-[#08152c] flex flex-col justify-center items-center lg:items-end p-4 sm:p-6 lg:p-12 xl:p-16 overflow-x-hidden antialiased">
      {/* Desktop Background: 1920x1080 Full HD Widescreen Cover Artwork */}
      <div
        className="hidden lg:block absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{
          backgroundImage: "url('/login-cover.png')",
          backgroundPosition: 'center right',
        }}
      />

      {/* Mobile/Tablet Atmospheric Ambient Backdrop */}
      <div
        className="lg:hidden absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none filter blur-md scale-110 opacity-25"
        style={{
          backgroundImage: "url('/login-cover.png')",
        }}
      />
      <div className="lg:hidden absolute inset-0 bg-gradient-to-b from-[#08152c] via-[#091833]/90 to-[#060f1f] pointer-events-none" />

      {/* Main Responsive Layout Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-4 sm:gap-6 lg:gap-16 my-auto py-2 sm:py-6">
        {/* Left Side (Desktop Only): Transparent Spacer for Custom Graphic Typography & Badges */}
        <div className="hidden lg:block lg:flex-1 max-w-xl min-h-[440px]" />

        {/* Mobile-Only Header Brand Tag */}
        <div className="lg:hidden text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3.5 py-1 text-xs font-semibold text-blue-300 border border-blue-400/30 shadow-xs">
            <span>🇱🇰</span>
            <span>Sri Lanka Driving Academy Platform</span>
          </div>
        </div>

        {/* Right Side: Responsive Login Form Card */}
        <div className="w-full max-w-sm sm:max-w-md lg:w-auto flex justify-center lg:justify-end shrink-0">
          <LoginForm />
        </div>

        {/* Mobile Footer Caption */}
        <div className="lg:hidden text-center text-[10px] text-slate-400">
          <p>© {new Date().getFullYear()} TrialReady LK • Official DMT Trial Readiness</p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
