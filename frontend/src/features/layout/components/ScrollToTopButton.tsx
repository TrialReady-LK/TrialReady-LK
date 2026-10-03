import React, { useState, useEffect, useCallback } from 'react'
import { ArrowUp } from 'lucide-react'
import { useLocation } from 'react-router-dom'

export const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)
  const location = useLocation()

  // Reset scroll position to top when changing routes/sections
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0

    const scrollableElements = document.querySelectorAll<HTMLElement>(
      'main, .overflow-y-auto, .overflow-auto'
    )
    scrollableElements.forEach((el) => {
      el.scrollTop = 0
    })
  }, [location.pathname])

  const checkScrollPosition = useCallback(() => {
    const windowScroll =
      window.scrollY ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0

    let maxElementScroll = 0
    const scrollableElements = document.querySelectorAll<HTMLElement>(
      'main, .overflow-y-auto, .overflow-auto'
    )
    scrollableElements.forEach((el) => {
      if (el.scrollTop > maxElementScroll) {
        maxElementScroll = el.scrollTop
      }
    })

    const currentScroll = Math.max(windowScroll, maxElementScroll)
    setIsVisible(currentScroll > 180)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', checkScrollPosition, { passive: true })
    document.addEventListener('scroll', checkScrollPosition, {
      passive: true,
      capture: true,
    })

    // Poll periodically to catch dynamic data loads or container resize
    const interval = setInterval(checkScrollPosition, 300)

    return () => {
      window.removeEventListener('scroll', checkScrollPosition)
      document.removeEventListener('scroll', checkScrollPosition, {
        capture: true,
      })
      clearInterval(interval)
    }
  }, [checkScrollPosition])

  const scrollToTop = () => {
    // Smooth scroll for window and root document
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    document.body.scrollTo({ top: 0, left: 0, behavior: 'smooth' })

    // Smooth scroll for any scrollable sub-containers or main viewport
    const scrollableElements = document.querySelectorAll<HTMLElement>(
      'main, .overflow-y-auto, .overflow-auto'
    )
    scrollableElements.forEach((el) => {
      el.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    })
  }

  return (
    <div
      className={`fixed bottom-22 right-6 z-40 print:hidden transition-all duration-300 ease-in-out ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Scroll back to top"
        title="Scroll to top"
        className="group relative flex h-11 w-11 items-center justify-center rounded-full bg-slate-900/90 text-white shadow-lg backdrop-blur-md border border-slate-700/50 hover:bg-blue-600 hover:border-blue-500 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all cursor-pointer"
      >
        <ArrowUp className="h-5 w-5 text-white transition-transform duration-200 group-hover:-translate-y-0.5" />

        {/* Tooltip on hover */}
        <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900/95 px-2 py-1 text-[11px] font-semibold text-white shadow-md opacity-0 transition-opacity duration-150 group-hover:opacity-100">
          Back to top
        </span>
      </button>
    </div>
  )
}

export default ScrollToTopButton
