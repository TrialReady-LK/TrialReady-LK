import React, { useState, useEffect } from 'react'
import {
  Octagon,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { RoadSignIllustration } from './RoadSignIllustration'
import { useTheoryLanguage } from '../context/TheoryLanguageContext'
import type { RoadSignItem, RoadSignCategory } from '../types/roadSign'
import { getRoadSigns } from '../services/roadSignService'

export const RoadSignsFlashcards: React.FC = () => {
  const { language } = useTheoryLanguage()
  const [signs, setSigns] = useState<RoadSignItem[]>([])
  const [categoryFilter, setCategoryFilter] = useState<RoadSignCategory | 'all'>('all')
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  useEffect(() => {
    void getRoadSigns().then((data) => setSigns(data))
  }, [])

  const filteredSigns = signs.filter((s) => {
    if (categoryFilter === 'all') return true
    return s.category === categoryFilter
  })

  const currentSign = filteredSigns[currentCardIndex] || filteredSigns[0]

  const handleNext = () => {
    setIsFlipped(false)
    setCurrentCardIndex((prev) => (prev + 1) % (filteredSigns.length || 1))
  }

  const handlePrev = () => {
    setIsFlipped(false)
    setCurrentCardIndex(
      (prev) => (prev - 1 + (filteredSigns.length || 1)) % (filteredSigns.length || 1),
    )
  }

  const handleCategoryChange = (cat: RoadSignCategory | 'all') => {
    setCategoryFilter(cat)
    setCurrentCardIndex(0)
    setIsFlipped(false)
  }

  if (!currentSign) return null

  const displayName =
    language === 'si' && currentSign.name_si
      ? currentSign.name_si
      : language === 'ta' && currentSign.name_ta
        ? currentSign.name_ta
        : currentSign.name

  const displayMeaning =
    language === 'si' && currentSign.meaning_si
      ? currentSign.meaning_si
      : language === 'ta' && currentSign.meaning_ta
        ? currentSign.meaning_ta
        : currentSign.meaning

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
      {/* Header & Categories */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Road Signs &amp; Highway Code Flashcards
          </h3>
          <p className="text-xs text-slate-500">
            Click the flashcard to flip and reveal the official DMT meaning
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => handleCategoryChange('all')}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold cursor-pointer ${
              categoryFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Signs
          </button>
          <button
            type="button"
            onClick={() => handleCategoryChange('regulatory')}
            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold cursor-pointer ${
              categoryFilter === 'regulatory'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Octagon className="h-3 w-3" />
            <span>Regulatory</span>
          </button>
          <button
            type="button"
            onClick={() => handleCategoryChange('warning')}
            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold cursor-pointer ${
              categoryFilter === 'warning'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <AlertTriangle className="h-3 w-3" />
            <span>Warning</span>
          </button>
          <button
            type="button"
            onClick={() => handleCategoryChange('priority')}
            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold cursor-pointer ${
              categoryFilter === 'priority'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Sparkles className="h-3 w-3" />
            <span>Priority</span>
          </button>
        </div>
      </div>

      {/* Main Flashcard View */}
      <div className="flex flex-col items-center justify-center py-2">
        <div className="w-full max-w-xl text-right mb-2">
          <span className="text-[11px] font-mono text-slate-400">
            Card {currentCardIndex + 1} of {filteredSigns.length} • Click to Flip
          </span>
        </div>

        {/* Card Box */}
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className={`w-full max-w-xl min-h-64 rounded-3xl border-2 p-8 flex flex-col items-center justify-center text-center cursor-pointer shadow-sm transition-all duration-300 select-none ${
            isFlipped
              ? 'border-emerald-300 bg-linear-to-b from-emerald-50/40 to-white'
              : 'border-blue-200 bg-linear-to-b from-blue-50/30 to-white hover:border-blue-400'
          }`}
        >
          {!isFlipped ? (
            /* Front of card */
            <div className="space-y-4">
              <div className="h-24 flex items-center justify-center">
                {currentSign.image_url.startsWith('data:') ||
                currentSign.image_url.startsWith('http') ||
                currentSign.image_url.startsWith('/') ? (
                  <img
                    src={currentSign.image_url}
                    alt={currentSign.name}
                    className="h-24 w-auto object-contain drop-shadow-md"
                  />
                ) : (
                  <RoadSignIllustration
                    signCode={currentSign.image_url}
                    className="h-24 w-24"
                  />
                )}
              </div>
              <h4 className="text-sm font-extrabold text-slate-900 leading-snug">
                {displayName}
              </h4>
              <p className="text-xs text-blue-600 font-bold">
                Show Meaning &amp; Rule ↓
              </p>
            </div>
          ) : (
            /* Back of card */
            <div className="space-y-3">
              <span className="inline-block rounded-full bg-blue-100 text-blue-800 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider">
                {currentSign.category} Sign
              </span>
              <p className="text-sm font-bold text-slate-900 leading-relaxed max-w-md">
                {displayMeaning}
              </p>
              {currentSign.fine_or_points && (
                <div className="pt-1">
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                    {currentSign.fine_or_points}
                  </span>
                </div>
              )}
              <p className="text-[11px] text-slate-400 mt-2">Click to flip back ↑</p>
            </div>
          )}
        </div>

        {/* Carousel Prev/Next Controls */}
        <div className="flex items-center justify-between w-full max-w-xl mt-6">
          <button
            type="button"
            onClick={handlePrev}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous Sign</span>
          </button>

          <span className="text-xs font-bold text-slate-500">
            {currentCardIndex + 1} / {filteredSigns.length}
          </span>

          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-xs cursor-pointer"
          >
            <span>Next Sign</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
