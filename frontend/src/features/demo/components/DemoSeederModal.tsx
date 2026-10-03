import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { Sparkles, X, Building2, Car, Users, CreditCard } from 'lucide-react'
import { seedDemoAcademyData } from '../services/demoSeedService'

interface DemoSeederModalProps {
  isOpen: boolean
  drivingSchoolId: string
  onClose: () => void
  onSuccess?: () => void
}

export const DemoSeederModal: React.FC<DemoSeederModalProps> = ({
  isOpen,
  drivingSchoolId,
  onClose,
  onSuccess,
}) => {
  const [isSeeding, setIsSeeding] = useState(false)
  const [progressStep, setProgressStep] = useState<string>('')
  const [percentage, setPercentage] = useState<number>(0)
  const [result, setResult] = useState<{
    success: boolean
    message: string
  } | null>(null)

  if (!isOpen) return null

  const handleStartSeeding = async () => {
    try {
      setIsSeeding(true)
      setResult(null)
      const res = await seedDemoAcademyData(
        drivingSchoolId,
        (step, pct) => {
          setProgressStep(step)
          setPercentage(pct)
        },
      )
      setResult(res)
      if (res.success) {
        onSuccess?.()
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      }
    } catch (err) {
      setResult({
        success: false,
        message: err instanceof Error ? err.message : 'Unknown error seeding data',
      })
    } finally {
      setIsSeeding(false)
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 space-y-5 sm:p-7 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-emerald-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Interactive Demo Academy Seeder
              </h3>
              <p className="text-xs text-slate-500">
                Populate complete Sri Lankan driving academy records in 1 click
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Modal"
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Dataset Summary Cards */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-2xl bg-blue-50/60 p-3 border border-blue-100 space-y-1">
            <span className="font-bold text-blue-900 flex items-center gap-1.5">
              <Building2 className="h-4 w-4 text-blue-600" />
              5 Regional Branches
            </span>
            <p className="text-[11px] text-slate-600">
              Colombo, Gampaha, Kandy, Kurunegala, and Galle training centres.
            </p>
          </div>

          <div className="rounded-2xl bg-emerald-50/60 p-3 border border-emerald-100 space-y-1">
            <span className="font-bold text-emerald-900 flex items-center gap-1.5">
              <Car className="h-4 w-4 text-emerald-600" />
              Fleet & DMT Instructors
            </span>
            <p className="text-[11px] text-slate-600">
              Dual-control cars, bikes, 3-wheelers & licensed DMT senior instructors.
            </p>
          </div>

          <div className="rounded-2xl bg-purple-50/60 p-3 border border-purple-100 space-y-1">
            <span className="font-bold text-purple-900 flex items-center gap-1.5">
              <Users className="h-4 w-4 text-purple-600" />
              100 Unique Learners
            </span>
            <p className="text-[11px] text-slate-600">
              Active Sri Lankan candidate profiles across all 5 branches.
            </p>
          </div>

          <div className="rounded-2xl bg-amber-50/60 p-3 border border-amber-100 space-y-1">
            <span className="font-bold text-amber-900 flex items-center gap-1.5">
              <CreditCard className="h-4 w-4 text-amber-600" />
              Fees, Permits & Trials
            </span>
            <p className="text-[11px] text-slate-600">
              Course fee instalments, receipts, medical certificates & DMT trial logs.
            </p>
          </div>
        </div>

        {/* Seeding Progress Bar */}
        {isSeeding && (
          <div className="space-y-2 rounded-2xl bg-slate-50 p-4 border border-slate-100">
            <div className="flex justify-between text-xs font-semibold text-slate-700">
              <span>{progressStep}</span>
              <span>{percentage}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Result Message */}
        {result && (
          <div
            className={`rounded-2xl p-4 text-xs font-medium border ${
              result.success
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-red-50 text-red-800 border-red-200'
            }`}
          >
            {result.message} {result.success && '(Refreshing page...)'}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isSeeding}
            className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleStartSeeding}
            disabled={isSeeding}
            className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="h-4 w-4" />
            <span>{isSeeding ? 'Populating Data...' : 'Load Full Demo Data'}</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default DemoSeederModal

