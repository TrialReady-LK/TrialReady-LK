import React from 'react'
import { LoginForm } from '../components/LoginForm'

export const LoginPage: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full bg-[#08152c] bg-[url('/login-cover.png')] bg-cover bg-center bg-no-repeat flex items-center justify-center lg:justify-end p-4 sm:p-6 lg:p-12 xl:p-16 overflow-y-auto">
      {/* Background soft ambient gradient layer for mobile contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40 lg:hidden pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">
        {/* Left Area: Spacer for the customized graphic artwork (Car, Headline & Badges) */}
        <div className="hidden lg:block lg:flex-1 max-w-xl min-h-[420px]" />

        {/* Right Area: Login Form Card */}
        <div className="w-full lg:w-auto flex justify-center lg:justify-end shrink-0">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}

export default LoginPage
