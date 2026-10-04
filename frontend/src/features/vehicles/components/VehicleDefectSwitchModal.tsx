import React, { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  Gauge,
  Info,
  ShieldAlert,
  Wrench,
  X,
} from 'lucide-react'
import {
  COMMON_VEHICLE_DEFECTS,
  type VehicleDefectCategory,
  type VehicleDefectSeverity,
} from '../types/vehicleDefect'
import type { VehicleWithRelations } from '../types/vehicle'
import { reportVehicleDefectAndSwitch } from '../services/vehicleService'

interface VehicleDefectSwitchModalProps {
  isOpen: boolean
  onClose: () => void
  vehicle: VehicleWithRelations | null
  availableVehicles: VehicleWithRelations[]
  instructorName?: string
  sessionId?: string | null
  sessionStudentName?: string | null
  onSuccess?: (defectiveReg: string, replacementReg: string | null) => void
}

export const VehicleDefectSwitchModal: React.FC<
  VehicleDefectSwitchModalProps
> = ({
  isOpen,
  onClose,
  vehicle,
  availableVehicles,
  instructorName = 'On-Duty Instructor',
  sessionId = null,
  sessionStudentName = null,
  onSuccess,
}) => {
  const [selectedCategory, setSelectedCategory] =
    useState<VehicleDefectCategory>('dual_control')
  const [severity, setSeverity] = useState<VehicleDefectSeverity>('critical')
  const [description, setDescription] = useState('')
  const [odometerKm, setOdometerKm] = useState<number | ''>(
    vehicle?.current_odometer_km ?? '',
  )
  const [selectedReplacementId, setSelectedReplacementId] = useState<
    string | 'none'
  >('none')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Initialize or reset when modal opens or vehicle changes
  useEffect(() => {
    if (vehicle) {
      setOdometerKm(vehicle.current_odometer_km ?? '')
      setSelectedCategory('dual_control')
      setSeverity('critical')
      setDescription(
        'Dual-control passenger pedals are not responding with correct tension during practical instruction.',
      )
      setErrorMessage(null)
    }
  }, [vehicle, isOpen])

  // Filter available candidate replacement vehicles
  // Prioritize vehicles that match the defective vehicle's licence category & transmission
  const replacementCandidates = useMemo(() => {
    if (!vehicle) return []

    const others = availableVehicles.filter(
      (v) =>
        v.id !== vehicle.id &&
        v.operational_status === 'active' &&
        v.availability_status === 'available',
    )

    return others.sort((a, b) => {
      const aMatchesCat =
        a.licence_category_id === vehicle.licence_category_id ? 1 : 0
      const bMatchesCat =
        b.licence_category_id === vehicle.licence_category_id ? 1 : 0
      const aMatchesTrans =
        a.transmission_type === vehicle.transmission_type ? 1 : 0
      const bMatchesTrans =
        b.transmission_type === vehicle.transmission_type ? 1 : 0

      const aScore = aMatchesCat * 2 + aMatchesTrans
      const bScore = bMatchesCat * 2 + bMatchesTrans
      return bScore - aScore
    })
  }, [vehicle, availableVehicles])

  // Automatically pre-select the best replacement vehicle if available
  useEffect(() => {
    if (replacementCandidates.length > 0 && selectedReplacementId === 'none') {
      setSelectedReplacementId(replacementCandidates[0].id)
    }
  }, [replacementCandidates, selectedReplacementId])

  if (!isOpen || !vehicle) return null

  const handleSelectCategory = (catId: VehicleDefectCategory) => {
    setSelectedCategory(catId)
    const preset = COMMON_VEHICLE_DEFECTS.find((d) => d.id === catId)
    if (preset) {
      setSeverity(preset.defaultSeverity)
      setDescription(preset.description)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!description.trim()) {
      setErrorMessage('Please provide a brief description of the defect.')
      return
    }

    try {
      setIsSubmitting(true)
      setErrorMessage(null)

      const replacementVehId =
        selectedReplacementId === 'none' ? null : selectedReplacementId

      const result = await reportVehicleDefectAndSwitch({
        defectiveVehicleId: vehicle.id,
        defectCategory: selectedCategory,
        severity,
        description: description.trim(),
        odometerReadingKm: typeof odometerKm === 'number' ? odometerKm : null,
        replacementVehicleId: replacementVehId,
        sessionId,
        instructorName,
      })

      const chosenReplacement = availableVehicles.find(
        (v) => v.id === result.replacementVehicleId,
      )

      onSuccess?.(
        vehicle.registration_number,
        chosenReplacement?.registration_number ?? null,
      )
      onClose()
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Failed to record defect and switch vehicle.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 bg-amber-50/70 p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-amber-500 p-2.5 text-white shadow-sm">
              <Wrench className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">
                  Report Defect & Switch Vehicle
                </h3>
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800 border border-amber-200">
                  Instructor Form
                </span>
              </div>
              <p className="mt-0.5 text-xs text-slate-600">
                Log mechanical issues on your assigned vehicle and pick an
                active replacement from the fleet.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-slate-700 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mx-6 mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Current Vehicle Summary */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Currently Assigned Defective Vehicle
            </span>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-black text-slate-900">
                    {vehicle.registration_number}
                  </span>
                  <span className="text-xs font-semibold text-slate-700">
                    {vehicle.manufacturer} {vehicle.model}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500">
                  <span className="rounded bg-blue-100 px-1.5 py-0.5 font-semibold text-blue-800 text-[11px]">
                    {vehicle.licence_category?.code ?? 'B'} –{' '}
                    {vehicle.licence_category?.name ?? 'Car'}
                  </span>
                  <span>•</span>
                  <span className="capitalize font-medium text-slate-700">
                    {vehicle.transmission_type.replace('_', ' ')}
                  </span>
                  <span>•</span>
                  <span>
                    {vehicle.branch?.name ?? 'Colombo Central Branch'}
                  </span>
                </div>
              </div>

              {sessionStudentName && (
                <div className="rounded-lg bg-white border border-slate-200 p-2 text-xs">
                  <span className="text-[10px] text-slate-400 block font-bold">
                    Active Lesson Student
                  </span>
                  <span className="font-semibold text-slate-900">
                    {sessionStudentName}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Common Vehicle Issues Preset Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Select Common Vehicle Issue / Fault Preset{' '}
              <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {COMMON_VEHICLE_DEFECTS.map((defect) => {
                const isSelected = selectedCategory === defect.id
                return (
                  <button
                    key={defect.id}
                    type="button"
                    onClick={() => handleSelectCategory(defect.id)}
                    className={`flex flex-col text-left p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-1 ring-blue-600'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold ${
                          isSelected ? 'text-blue-900' : 'text-slate-900'
                        }`}
                      >
                        {defect.label}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-snug">
                      {defect.description}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Fault Severity Level */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Defect Severity & Operational Impact{' '}
              <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <label
                className={`flex items-center gap-2.5 rounded-xl border p-3 cursor-pointer transition-all ${
                  severity === 'critical'
                    ? 'border-red-500 bg-red-50/80 ring-1 ring-red-500'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="severity"
                  value="critical"
                  checked={severity === 'critical'}
                  onChange={() => setSeverity('critical')}
                  className="text-red-600 focus:ring-red-500"
                />
                <div>
                  <span className="text-xs font-bold text-red-900 block">
                    🚨 Critical / Safety Risk
                  </span>
                  <span className="text-[10px] text-red-700">
                    Stop driving immediately. Requires vehicle swap.
                  </span>
                </div>
              </label>

              <label
                className={`flex items-center gap-2.5 rounded-xl border p-3 cursor-pointer transition-all ${
                  severity === 'moderate'
                    ? 'border-amber-500 bg-amber-50/80 ring-1 ring-amber-500'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="severity"
                  value="moderate"
                  checked={severity === 'moderate'}
                  onChange={() => setSeverity('moderate')}
                  className="text-amber-600 focus:ring-amber-500"
                />
                <div>
                  <span className="text-xs font-bold text-amber-900 block">
                    ⚠️ Moderate Fault
                  </span>
                  <span className="text-[10px] text-amber-700">
                    Needs garage service today. Swap vehicle now.
                  </span>
                </div>
              </label>

              <label
                className={`flex items-center gap-2.5 rounded-xl border p-3 cursor-pointer transition-all ${
                  severity === 'minor'
                    ? 'border-blue-500 bg-blue-50/80 ring-1 ring-blue-500'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="severity"
                  value="minor"
                  checked={severity === 'minor'}
                  onChange={() => setSeverity('minor')}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="text-xs font-bold text-blue-900 block">
                    ℹ️ Minor / Service Note
                  </span>
                  <span className="text-[10px] text-blue-700">
                    Non-urgent fault. Log for routine service.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Odometer & Detailed Description */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Current Odometer (km)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  value={odometerKm}
                  onChange={(e) =>
                    setOdometerKm(
                      e.target.value === '' ? '' : Number(e.target.value),
                    )
                  }
                  placeholder="e.g. 42150"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-mono text-slate-900 outline-none focus:border-blue-500"
                />
                <Gauge className="absolute right-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Defect Symptoms & Explanation{' '}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what failed, warning lights, sounds, or safety issues..."
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 outline-none focus:border-blue-500 resize-none"
                required
              />
            </div>
          </div>

          {/* Select Replacement Vehicle from Fleet */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-800">
                Select Replacement Vehicle (Field & Category Matched)
              </label>
              <span className="text-[11px] text-slate-500 font-medium">
                {replacementCandidates.length} available replacement(s)
              </span>
            </div>

            {replacementCandidates.length === 0 ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-800 flex items-start gap-2">
                <Info className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-bold">No active spare vehicles available</p>
                  <p className="mt-0.5 text-[11px]">
                    All other fleet vehicles for Category{' '}
                    {vehicle.licence_category?.code ?? 'B'} (
                    {vehicle.transmission_type}) are currently assigned or in
                    service. The defective vehicle will be placed in maintenance.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {replacementCandidates.map((rep) => {
                  const isMatchCat =
                    rep.licence_category_id === vehicle.licence_category_id
                  const isMatchTrans =
                    rep.transmission_type === vehicle.transmission_type
                  const isSelected = selectedReplacementId === rep.id

                  return (
                    <label
                      key={rep.id}
                      className={`flex items-center justify-between rounded-xl border p-3 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-600'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="replacementVehicle"
                          value={rep.id}
                          checked={isSelected}
                          onChange={() => setSelectedReplacementId(rep.id)}
                          className="text-emerald-600 focus:ring-emerald-500"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-slate-900">
                              {rep.registration_number}
                            </span>
                            <span className="text-xs font-medium text-slate-700">
                              {rep.manufacturer} {rep.model}
                            </span>
                            {isMatchCat && isMatchTrans && (
                              <span className="rounded-full bg-emerald-100 px-2 py-0.2 text-[10px] font-bold text-emerald-800">
                                Exact Match
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {rep.licence_category?.code ?? 'Cat B'} •{' '}
                            <span className="capitalize">
                              {rep.transmission_type}
                            </span>{' '}
                            • {rep.branch?.name ?? 'Main Branch'}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                          Ready & Available
                        </span>
                      </div>
                    </label>
                  )
                })}

                <label
                  className={`flex items-center gap-3 rounded-xl border p-2.5 cursor-pointer transition-all ${
                    selectedReplacementId === 'none'
                      ? 'border-slate-400 bg-slate-100'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="replacementVehicle"
                    value="none"
                    checked={selectedReplacementId === 'none'}
                    onChange={() => setSelectedReplacementId('none')}
                    className="text-slate-600"
                  />
                  <span className="text-xs font-medium text-slate-600">
                    Do not assign a replacement vehicle (take out of service
                    only)
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-amber-700 transition-all cursor-pointer disabled:opacity-50"
            >
              <ShieldAlert className="h-4 w-4" />
              <span>
                {isSubmitting
                  ? 'Saving Fault & Switching...'
                  : 'Confirm Defect & Switch Vehicle'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default VehicleDefectSwitchModal
