import React from 'react'
import { Check, AlertTriangle, X, Clock, Award } from 'lucide-react'
import type { ReadinessFactor } from '../types/readiness'

interface ReadinessFactorChecklistProps {
  factors: ReadinessFactor[]
  canGrade?: boolean
  onOpenGradingModal?: () => void
}

export const ReadinessFactorChecklist: React.FC<
  ReadinessFactorChecklistProps
> = ({ factors, canGrade = false, onOpenGradingModal }) => {
  const getStatusIcon = (status: ReadinessFactor['status']) => {
    switch (status) {
      case 'passed':
        return (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
            <Check className="h-3.5 w-3.5 text-emerald-700" />
          </span>
        )
      case 'warning':
        return (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-800" />
          </span>
        )
      case 'failed':
        return (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100">
            <X className="h-3.5 w-3.5 text-red-700" />
          </span>
        )
      case 'pending':
        return (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100">
            <Clock className="h-3.5 w-3.5 text-slate-500" />
          </span>
        )
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            DMT Trial Prerequisites &amp; Skills Breakdown
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Multi-factor evaluation based on Sri Lanka driving examination standards
          </p>
        </div>
        <div className="flex items-center gap-2">
          {canGrade && onOpenGradingModal && (
            <button
              type="button"
              onClick={onOpenGradingModal}
              className="inline-flex items-center gap-1 rounded-xl bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-all cursor-pointer shadow-2xs"
            >
              <Award className="h-3.5 w-3.5 text-blue-600" />
              <span>Grade Student</span>
            </button>
          )}
          <span className="text-xs font-mono font-bold text-slate-500">
            Max: 100 Pts
          </span>
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        {factors.map((f) => {
          const isGradableFactor =
            f.key === 'instructor_rating' || f.key === 'skills_mastery'

          return (
            <div key={f.key} className="flex items-start gap-3 py-3">
              <div className="mt-0.5">{getStatusIcon(f.status)}</div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">
                    {f.title}
                  </span>
                  <div className="flex items-center gap-2">
                    {canGrade && isGradableFactor && onOpenGradingModal && (
                      <button
                        type="button"
                        onClick={onOpenGradingModal}
                        className="text-[10px] font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                      >
                        [Edit Marks]
                      </button>
                    )}
                    <span className="text-xs font-mono font-bold text-slate-700">
                      {f.score} / {f.maxScore} pts
                    </span>
                  </div>
                </div>
                <p className="mt-0.5 text-xs text-slate-500">{f.detail}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ReadinessFactorChecklist

