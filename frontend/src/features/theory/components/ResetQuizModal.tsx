import React from 'react'
import { RotateCcw, X, AlertTriangle } from 'lucide-react'

interface ResetQuizModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isResetting?: boolean
}

export const ResetQuizModal: React.FC<ResetQuizModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isResetting,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm">
              <RotateCcw className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Reset Theory Quiz &amp; Questions
              </h2>
              <p className="text-xs text-slate-500">
                Restore questions to default DMT Highway Code standards
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs text-slate-600">
          <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 flex items-start gap-2.5 text-amber-900">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-950">Confirm Quiz Questions Reset</p>
              <p className="mt-1 leading-relaxed text-amber-800 text-[11px]">
                This action will regenerate and reload the standard Sri Lankan Department of Motor Traffic (DMT) Highway Code questions, restoring all category distributions and translations.
              </p>
            </div>
          </div>

          <p className="text-slate-500 leading-relaxed">
            Any custom changes will be refreshed to match the authentic statutory exam syllabus. Are you sure you want to proceed?
          </p>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isResetting}
              className="rounded-xl border border-slate-300 px-4 py-2.5 font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isResetting}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-bold text-white hover:bg-blue-700 shadow-md cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className={`h-4 w-4 ${isResetting ? 'animate-spin' : ''}`} />
              <span>{isResetting ? 'Resetting...' : 'Reset Quiz'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
