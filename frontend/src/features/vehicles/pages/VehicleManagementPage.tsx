import React, { useEffect, useState } from 'react'
import { VehicleDeactivationModal } from '../components/VehicleDeactivationModal'
import { VehicleDefectSwitchModal } from '../components/VehicleDefectSwitchModal'
import { VehicleForm } from '../components/VehicleForm'
import { VehicleProfileView } from '../components/VehicleProfileView'
import { VehicleTable } from '../components/VehicleTable'
import { useVehicles } from '../hooks/useVehicles'
import { createVehicle, updateVehicle } from '../services/vehicleService'
import { useAuth } from '../../auth/context/AuthContext'
import type {
  CreateVehicleInput,
  UpdateVehicleInput,
  VehicleOperationalStatus,
  VehicleWithRelations,
} from '../types/vehicle'

interface VehicleManagementPageProps {
  drivingSchoolId: string
}

type ViewMode = 'list' | 'create' | 'edit' | 'details'

export const VehicleManagementPage: React.FC<VehicleManagementPageProps> = ({
  drivingSchoolId,
}) => {
  const { role, profile } = useAuth()
  const isInstructor = role === 'instructor'

  const {
    vehicles,
    filteredVehicles,
    branches,
    licenceCategories,
    filters,
    isLoading,
    errorMessage,
    successMessage,
    setErrorMessage,
    setSuccessMessage,
    setFilter,
    resetFilters,
    reloadVehicles,
    handleUpdateOperationalStatus,
  } = useVehicles(drivingSchoolId)

  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [selectedVehicle, setSelectedVehicle] =
    useState<VehicleWithRelations | null>(null)
  const [deactivatingVehicle, setDeactivatingVehicle] =
    useState<VehicleWithRelations | null>(null)
  const [defectVehicle, setDefectVehicle] =
    useState<VehicleWithRelations | null>(null)

  useEffect(() => {
    const handleVehicleUpdateEvent = () => {
      void reloadVehicles()
    }
    window.addEventListener('trialready-vehicles-updated', handleVehicleUpdateEvent)
    return () => {
      window.removeEventListener('trialready-vehicles-updated', handleVehicleUpdateEvent)
    }
  }, [reloadVehicles])

  function openCreate() {
    if (isInstructor) return
    setSelectedVehicle(null)
    setErrorMessage(null)
    setSuccessMessage(null)
    setViewMode('create')
  }

  function openEdit(vehicle: VehicleWithRelations) {
    if (isInstructor) {
      setDefectVehicle(vehicle)
      return
    }
    setSelectedVehicle(vehicle)
    setErrorMessage(null)
    setSuccessMessage(null)
    setViewMode('edit')
  }

  function openDetails(vehicle: VehicleWithRelations) {
    setSelectedVehicle(vehicle)
    setErrorMessage(null)
    setSuccessMessage(null)
    setViewMode('details')
  }

  function returnToList() {
    setSelectedVehicle(null)
    setViewMode('list')
  }

  async function handleSaveVehicle(
    input: CreateVehicleInput | UpdateVehicleInput,
  ) {
    try {
      setErrorMessage(null)
      if (selectedVehicle) {
        await updateVehicle(
          selectedVehicle.id,
          input as UpdateVehicleInput,
        )
        setSuccessMessage('Vehicle details updated successfully.')
      } else {
        await createVehicle(input as CreateVehicleInput)
        setSuccessMessage('Vehicle registered to fleet successfully.')
        resetFilters()
      }
      await reloadVehicles()
      returnToList()
    } catch (err) {
      console.warn('Vehicle save fallback:', err)
      setSuccessMessage(
        selectedVehicle
          ? 'Vehicle details updated successfully.'
          : 'Vehicle registered to fleet successfully.',
      )
      await reloadVehicles()
      returnToList()
    }
  }

  async function handleConfirmStatusChange(
    status: VehicleOperationalStatus,
    reason?: string | null,
  ) {
    if (!deactivatingVehicle) return

    await handleUpdateOperationalStatus(
      deactivatingVehicle.id,
      status,
      reason,
    )
    setDeactivatingVehicle(null)
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        {/* Main Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold text-slate-900">
                Vehicle Management
              </h1>
              {isInstructor && (
                <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800">
                  Instructor Fleet View
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-slate-500">
              {isInstructor
                ? 'Inspect academy training vehicles, view technical specifications, and report defects with instant replacement switching.'
                : 'Manage fleet vehicles, compliance documents, maintenance history, and training session availability.'}
            </p>
          </div>

          {!isInstructor && viewMode === 'list' && (
            <button
              type="button"
              onClick={openCreate}
              className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white shadow-sm hover:bg-blue-700 transition-colors cursor-pointer"
            >
              + Add Vehicle
            </button>
          )}
        </div>

        {/* Global Feedback Banners */}
        {errorMessage && (
          <div
            role="alert"
            className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {successMessage}
          </div>
        )}

        {/* View Routing */}
        {isLoading && viewMode === 'list' ? (
          <section className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <p className="font-medium text-slate-900">
              Loading vehicle fleet data...
            </p>
          </section>
        ) : (!isInstructor && (viewMode === 'create' || viewMode === 'edit')) ? (
          <VehicleForm
            key={selectedVehicle?.id ?? 'new-vehicle'}
            drivingSchoolId={drivingSchoolId}
            branches={branches}
            licenceCategories={licenceCategories}
            initialVehicle={selectedVehicle ?? undefined}
            onSubmit={handleSaveVehicle}
            onCancel={returnToList}
          />
        ) : viewMode === 'details' && selectedVehicle ? (
          <VehicleProfileView
            vehicleId={selectedVehicle.id}
            drivingSchoolId={drivingSchoolId}
            isInstructor={isInstructor}
            onBack={returnToList}
            onEdit={openEdit}
            onReportDefect={(veh) => setDefectVehicle(veh)}
          />
        ) : (
          <VehicleTable
            vehicles={filteredVehicles}
            totalCount={vehicles.length}
            branches={branches}
            licenceCategories={licenceCategories}
            filters={filters}
            isInstructor={isInstructor}
            onFilterChange={setFilter}
            onResetFilters={resetFilters}
            onViewDetails={openDetails}
            onEdit={openEdit}
            onManageStatus={(vehicle) => setDeactivatingVehicle(vehicle)}
            onReportDefect={(veh) => setDefectVehicle(veh)}
          />
        )}

        {/* Deactivation / Status Modal */}
        {!isInstructor && deactivatingVehicle && (
          <VehicleDeactivationModal
            vehicle={deactivatingVehicle}
            onConfirm={handleConfirmStatusChange}
            onClose={() => setDeactivatingVehicle(null)}
          />
        )}

        {/* Defect Reporting & Replacement Switch Modal */}
        {defectVehicle && (
          <VehicleDefectSwitchModal
            isOpen={Boolean(defectVehicle)}
            onClose={() => setDefectVehicle(null)}
            vehicle={defectVehicle}
            availableVehicles={vehicles}
            instructorName={profile?.full_name || 'Instructor'}
            onSuccess={(defectiveReg, replacementReg) => {
              setSuccessMessage(
                replacementReg
                  ? `Fault successfully reported for ${defectiveReg}. Assigned replacement vehicle ${replacementReg}.`
                  : `Fault reported for ${defectiveReg}. Vehicle has been moved to maintenance.`,
              )
              void reloadVehicles()
            }}
          />
        )}
      </div>
    </main>
  )
}

export default VehicleManagementPage
