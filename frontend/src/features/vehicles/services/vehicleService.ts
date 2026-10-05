import { supabase } from '../../../lib/supabase'
import {
  getStoredData,
  setStoredData,
  STORAGE_KEYS,
  upsertStoredItem,
} from '../../../lib/persistentStorage'
import type {
  CreateVehicleInput,
  UpdateVehicleInput,
  VehicleAvailabilityStatus,
  VehicleBranchSummary,
  VehicleLicenceCategorySummary,
  VehicleOperationalStatus,
  VehicleWithRelations,
} from '../types/vehicle'
import type {
  VehicleDefectSwitchInput,
  VehicleDefectSwitchResult,
} from '../types/vehicleDefect'
import { COMMON_VEHICLE_DEFECTS } from '../types/vehicleDefect'

const VEHICLES_TABLE = 'vehicles'
const BRANCHES_TABLE = 'branches'
const LICENCE_CATEGORIES_TABLE = 'licence_categories'

const VEHICLE_SELECT_RELATIONS = `
  *,
  branch:branches(id, name),
  licence_category:licence_categories(id, code, name)
`

export const DEFAULT_FLEET_VEHICLES: VehicleWithRelations[] = [
  {
    id: 'f1a789c2-5d41-4e89-9b12-8f7a63450001',
    driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    branch_id: 'b1a789c2-5d41-4e89-9b12-8f7a63450001',
    licence_category_id: 'c1a789c2-5d41-4e89-9b12-8f7a63450001',
    registration_number: 'WP CAB-4921',
    display_name: 'Toyota Vitz Dual-Control',
    manufacturer: 'Toyota',
    model: 'Vitz Dual-Control',
    year_of_manufacture: 2020,
    transmission_type: 'manual',
    fuel_type: 'petrol',
    photo_path: null,
    date_added: '2025-01-15',
    training_use_enabled: true,
    operational_status: 'active',
    availability_status: 'available',
    current_odometer_km: 42150,
    next_service_date: '2026-11-15',
    internal_notes: 'Primary manual training hatchback in Colombo Central.',
    deactivation_reason: null,
    deactivated_at: null,
    branch: { id: 'b1a789c2-5d41-4e89-9b12-8f7a63450001', name: 'Colombo Central (Nugegoda)' },
    licence_category: { id: 'c1a789c2-5d41-4e89-9b12-8f7a63450001', code: 'B', name: 'Dual Purpose / Light Motor Car (Auto & Manual)' },
    created_at: '2025-01-15T08:00:00.000Z',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'f1a789c2-5d41-4e89-9b12-8f7a63450002',
    driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    branch_id: 'b1a789c2-5d41-4e89-9b12-8f7a63450001',
    licence_category_id: 'c1a789c2-5d41-4e89-9b12-8f7a63450001',
    registration_number: 'WP CBC-8821',
    display_name: 'Suzuki Swift Auto Dual-Control',
    manufacturer: 'Suzuki',
    model: 'Swift Auto Dual-Control',
    year_of_manufacture: 2022,
    transmission_type: 'automatic',
    fuel_type: 'petrol',
    photo_path: null,
    date_added: '2025-03-10',
    training_use_enabled: true,
    operational_status: 'active',
    availability_status: 'available',
    current_odometer_km: 28400,
    next_service_date: '2026-12-01',
    internal_notes: 'Primary auto training car in Colombo Central.',
    deactivation_reason: null,
    deactivated_at: null,
    branch: { id: 'b1a789c2-5d41-4e89-9b12-8f7a63450001', name: 'Colombo Central (Nugegoda)' },
    licence_category: { id: 'c1a789c2-5d41-4e89-9b12-8f7a63450001', code: 'B', name: 'Dual Purpose / Light Motor Car (Auto & Manual)' },
    created_at: '2025-03-10T08:00:00.000Z',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'f1a789c2-5d41-4e89-9b12-8f7a63450003',
    driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    branch_id: 'b1a789c2-5d41-4e89-9b12-8f7a63450001',
    licence_category_id: 'c3a789c2-5d41-4e89-9b12-8f7a63450003',
    registration_number: 'CP BC-3042',
    display_name: 'Yamaha FZ 150 Training Bike',
    manufacturer: 'Yamaha',
    model: 'FZ 150',
    year_of_manufacture: 2021,
    transmission_type: 'manual',
    fuel_type: 'petrol',
    photo_path: null,
    date_added: '2025-04-01',
    training_use_enabled: true,
    operational_status: 'active',
    availability_status: 'available',
    current_odometer_km: 19800,
    next_service_date: '2026-10-30',
    internal_notes: 'Category A motorcycle practical training.',
    deactivation_reason: null,
    deactivated_at: null,
    branch: { id: 'b1a789c2-5d41-4e89-9b12-8f7a63450001', name: 'Colombo Central (Nugegoda)' },
    licence_category: { id: 'c3a789c2-5d41-4e89-9b12-8f7a63450003', code: 'A', name: 'Heavy Motor Cycle (> 250cc)' },
    created_at: '2025-04-01T08:00:00.000Z',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'f1a789c2-5d41-4e89-9b12-8f7a63450004',
    driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    branch_id: 'b2a789c2-5d41-4e89-9b12-8f7a63450002',
    licence_category_id: 'c2a789c2-5d41-4e89-9b12-8f7a63450002',
    registration_number: 'WP LY-9120',
    display_name: 'Bajaj RE 4-Stroke Three Wheeler',
    manufacturer: 'Bajaj',
    model: 'RE 205 Auto',
    year_of_manufacture: 2020,
    transmission_type: 'manual',
    fuel_type: 'petrol',
    photo_path: null,
    date_added: '2025-05-15',
    training_use_enabled: true,
    operational_status: 'active',
    availability_status: 'available',
    current_odometer_km: 31200,
    next_service_date: '2026-11-20',
    internal_notes: 'Category B1 three wheeler training in Gampaha.',
    deactivation_reason: null,
    deactivated_at: null,
    branch: { id: 'b2a789c2-5d41-4e89-9b12-8f7a63450002', name: 'Gampaha Branch (Yakkala)' },
    licence_category: { id: 'c2a789c2-5d41-4e89-9b12-8f7a63450002', code: 'B1', name: 'Light Motor Cycle & Three Wheeler' },
    created_at: '2025-05-15T08:00:00.000Z',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'f1a789c2-5d41-4e89-9b12-8f7a63450005',
    driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    branch_id: 'b3a789c2-5d41-4e89-9b12-8f7a63450003',
    licence_category_id: 'c4a789c2-5d41-4e89-9b12-8f7a63450004',
    registration_number: 'WP GA-7712',
    display_name: 'Isuzu Elf Heavy Dual-Control Lorry',
    manufacturer: 'Isuzu',
    model: 'Elf NPR Dual-Control',
    year_of_manufacture: 2017,
    transmission_type: 'manual',
    fuel_type: 'diesel',
    photo_path: null,
    date_added: '2025-06-01',
    training_use_enabled: true,
    operational_status: 'active',
    availability_status: 'available',
    current_odometer_km: 84300,
    next_service_date: '2026-10-28',
    internal_notes: 'Category C heavy vehicle training in Kandy City.',
    deactivation_reason: null,
    deactivated_at: null,
    branch: { id: 'b3a789c2-5d41-4e89-9b12-8f7a63450003', name: 'Kandy City Branch (Peradeniya)' },
    licence_category: { id: 'c4a789c2-5d41-4e89-9b12-8f7a63450004', code: 'C', name: 'Dual Control Heavy Commercial Truck' },
    created_at: '2025-06-01T08:00:00.000Z',
    updated_at: new Date().toISOString(),
  },
]

export async function getVehicles(
  drivingSchoolId?: string,
): Promise<VehicleWithRelations[]> {
  const localList = getStoredData<VehicleWithRelations[]>(
    STORAGE_KEYS.VEHICLES,
    DEFAULT_FLEET_VEHICLES,
  )

  try {
    let query = supabase
      .from(VEHICLES_TABLE)
      .select(VEHICLE_SELECT_RELATIONS)
      .order('registration_number', { ascending: true })

    if (drivingSchoolId) {
      query = query.eq('driving_school_id', drivingSchoolId)
    }

    const { data, error } = await query

    if (error || !data || data.length === 0) {
      if (localList.length === 0) {
        setStoredData(STORAGE_KEYS.VEHICLES, DEFAULT_FLEET_VEHICLES)
        return DEFAULT_FLEET_VEHICLES
      }
      return localList
    }

    const remoteVehicles = data as unknown as VehicleWithRelations[]
    // Merge: preserve local-only additions and user edits
    const merged = [...localList]
    for (const r of remoteVehicles) {
      const idx = merged.findIndex(
        (m) => m.id === r.id || m.registration_number === r.registration_number,
      )
      if (idx !== -1) {
        merged[idx] = { ...r, ...merged[idx] }
      } else {
        merged.push(r)
      }
    }

    setStoredData(STORAGE_KEYS.VEHICLES, merged)
    return merged
  } catch {
    return localList.length > 0 ? localList : DEFAULT_FLEET_VEHICLES
  }
}

export async function getVehicleById(
  id: string,
): Promise<VehicleWithRelations> {
  const localList = getStoredData<VehicleWithRelations[]>(
    STORAGE_KEYS.VEHICLES,
    DEFAULT_FLEET_VEHICLES,
  )
  const cached = localList.find((v) => v.id === id)

  try {
    const { data, error } = await supabase
      .from(VEHICLES_TABLE)
      .select(VEHICLE_SELECT_RELATIONS)
      .eq('id', id)
      .single()

    if (error) {
      if (cached) return cached
      throw new Error(`Unable to load vehicle: ${error.message}`)
    }

    const remote = data as unknown as VehicleWithRelations
    upsertStoredItem(STORAGE_KEYS.VEHICLES, remote)
    return remote
  } catch (err) {
    if (cached) return cached
    throw err
  }
}

export async function createVehicle(
  input: CreateVehicleInput,
): Promise<VehicleWithRelations> {
  const fallbackSchoolId =
    input.driving_school_id || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
  const payload = {
    ...input,
    driving_school_id: fallbackSchoolId,
  }

  const generatedId = crypto.randomUUID ? crypto.randomUUID() : `veh-${Date.now()}`

  const branchSummary: VehicleBranchSummary = payload.branch_id
    ? {
        id: payload.branch_id,
        name: payload.branch_id.endsWith('0005')
          ? 'Gampaha Branch (Yakkala)'
          : payload.branch_id.endsWith('0002')
          ? 'Kandy City Branch (Peradeniya)'
          : 'Colombo Central (Nugegoda)',
      }
    : { id: 'b1a789c2-5d41-4e89-9b12-8f7a63450001', name: 'Colombo Central (Nugegoda)' }

  const categorySummary: VehicleLicenceCategorySummary = payload.licence_category_id
    ? {
        id: payload.licence_category_id,
        code: payload.licence_category_id.endsWith('0002')
          ? 'B1'
          : payload.licence_category_id.endsWith('0003')
          ? 'A'
          : payload.licence_category_id.endsWith('0004')
          ? 'C'
          : 'B',
        name: payload.licence_category_id.endsWith('0002')
          ? 'Light Motor Cycle & Three Wheeler'
          : payload.licence_category_id.endsWith('0003')
          ? 'Heavy Motor Cycle (> 250cc)'
          : payload.licence_category_id.endsWith('0004')
          ? 'Dual Control Heavy Commercial Truck'
          : 'Dual Purpose / Light Motor Car (Auto & Manual)',
      }
    : {
        id: 'c1a789c2-5d41-4e89-9b12-8f7a63450001',
        code: 'B',
        name: 'Dual Purpose / Light Motor Car (Auto & Manual)',
      }

  const newVehicle: VehicleWithRelations = {
    id: generatedId,
    driving_school_id: payload.driving_school_id,
    branch_id: payload.branch_id || branchSummary.id,
    licence_category_id: payload.licence_category_id || categorySummary.id,
    registration_number: payload.registration_number,
    display_name: payload.display_name || null,
    manufacturer: payload.manufacturer,
    model: payload.model,
    year_of_manufacture: payload.year_of_manufacture || 2024,
    transmission_type: payload.transmission_type || 'manual',
    fuel_type: payload.fuel_type || 'petrol',
    photo_path: payload.photo_path || null,
    date_added: payload.date_added || new Date().toISOString().split('T')[0],
    training_use_enabled: payload.training_use_enabled ?? true,
    operational_status: payload.operational_status || 'active',
    availability_status: payload.availability_status || 'available',
    current_odometer_km: payload.current_odometer_km || null,
    next_service_date: payload.next_service_date || null,
    internal_notes: payload.internal_notes || null,
    deactivation_reason: null,
    deactivated_at: null,
    branch: branchSummary,
    licence_category: categorySummary,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  // Always write immediately to persistent storage
  upsertStoredItem(STORAGE_KEYS.VEHICLES, newVehicle)

  // Asynchronously attempt Supabase insert
  try {
    const { data: created } = await supabase
      .from(VEHICLES_TABLE)
      .insert({
        ...payload,
        id: generatedId,
      })
      .select('id')
      .single()

    if (created?.id) {
      const fresh = await getVehicleById(created.id)
      upsertStoredItem(STORAGE_KEYS.VEHICLES, fresh)
      return fresh
    }
  } catch (err) {
    console.warn('Supabase vehicle insert fallback to persistent store:', err)
  }

  return newVehicle
}

export async function updateVehicle(
  id: string,
  input: UpdateVehicleInput,
): Promise<VehicleWithRelations> {
  const localList = getStoredData<VehicleWithRelations[]>(
    STORAGE_KEYS.VEHICLES,
    DEFAULT_FLEET_VEHICLES,
  )
  const existing = localList.find((v) => v.id === id) || DEFAULT_FLEET_VEHICLES[0]

  const updated: VehicleWithRelations = {
    ...existing,
    ...input,
    registration_number: input.registration_number ?? existing.registration_number,
    manufacturer: input.manufacturer ?? existing.manufacturer,
    model: input.model ?? existing.model,
    year_of_manufacture: input.year_of_manufacture ?? existing.year_of_manufacture,
    branch_id: input.branch_id !== undefined ? input.branch_id : existing.branch_id,
    licence_category_id: input.licence_category_id ?? existing.licence_category_id,
    branch: input.branch_id
      ? {
          id: input.branch_id,
          name: input.branch_id.includes('2222')
            ? 'Gampaha Branch (Yakkala)'
            : input.branch_id.includes('3333')
            ? 'Kandy City Branch (Peradeniya)'
            : 'Colombo Central (Nugegoda)',
        }
      : input.branch_id === null
      ? null
      : existing.branch,
    licence_category: input.licence_category_id
      ? {
          id: input.licence_category_id,
          code: input.licence_category_id.includes('2222')
            ? 'B1'
            : input.licence_category_id.includes('3333')
            ? 'A'
            : input.licence_category_id.includes('4444')
            ? 'C'
            : 'B',
          name: input.licence_category_id.includes('2222')
            ? 'Light Motor Cycle & Three Wheeler'
            : input.licence_category_id.includes('3333')
            ? 'Heavy Motor Cycle (> 250cc)'
            : input.licence_category_id.includes('4444')
            ? 'Dual Control Heavy Commercial Truck'
            : 'Dual Purpose / Light Motor Car (Auto & Manual)',
        }
      : existing.licence_category,
    updated_at: new Date().toISOString(),
  }

  // Update persistent storage
  upsertStoredItem(STORAGE_KEYS.VEHICLES, updated)

  // Asynchronously attempt remote DB update
  try {
    await supabase.from(VEHICLES_TABLE).update(input).eq('id', id)
  } catch (err) {
    console.warn('Supabase vehicle update fallback:', err)
  }

  return updated
}

export async function setVehicleOperationalStatus(
  id: string,
  status: VehicleOperationalStatus,
  deactivationReason?: string | null,
): Promise<VehicleWithRelations> {
  const updatePayload: UpdateVehicleInput = {
    operational_status: status,
    deactivation_reason:
      status === 'active' ? null : deactivationReason ?? null,
    deactivated_at: status === 'active' ? null : new Date().toISOString(),
  }

  if (status !== 'active') {
    updatePayload.availability_status = 'unavailable'
  }

  return updateVehicle(id, updatePayload)
}

export async function setVehicleAvailabilityStatus(
  id: string,
  status: VehicleAvailabilityStatus,
): Promise<VehicleWithRelations> {
  return updateVehicle(id, { availability_status: status })
}

export async function getBranchesForSchool(
  drivingSchoolId: string,
): Promise<VehicleBranchSummary[]> {
  try {
    const { data, error } = await supabase
      .from(BRANCHES_TABLE)
      .select('id, name')
      .eq('driving_school_id', drivingSchoolId)
      .eq('is_active', true)
      .order('name', { ascending: true })

    if (error || !data || data.length === 0) {
      return [
        { id: 'b1a789c2-5d41-4e89-9b12-8f7a63450001', name: 'Colombo Central (Nugegoda)' },
        { id: 'b1a789c2-5d41-4e89-9b12-8f7a63450005', name: 'Gampaha Branch (Yakkala)' },
        { id: 'b1a789c2-5d41-4e89-9b12-8f7a63450002', name: 'Kandy City Branch (Peradeniya)' },
      ]
    }

    return data as VehicleBranchSummary[]
  } catch {
    return [
      { id: 'b1a789c2-5d41-4e89-9b12-8f7a63450001', name: 'Colombo Central (Nugegoda)' },
      { id: 'b1a789c2-5d41-4e89-9b12-8f7a63450005', name: 'Gampaha Branch (Yakkala)' },
      { id: 'b1a789c2-5d41-4e89-9b12-8f7a63450002', name: 'Kandy City Branch (Peradeniya)' },
    ]
  }
}

export async function getLicenceCategoriesForSchool(
  drivingSchoolId: string,
): Promise<VehicleLicenceCategorySummary[]> {
  try {
    const { data, error } = await supabase
      .from(LICENCE_CATEGORIES_TABLE)
      .select('id, code, name')
      .eq('driving_school_id', drivingSchoolId)
      .eq('is_active', true)
      .order('code', { ascending: true })

    if (error || !data || data.length === 0) {
      return [
        { id: 'c1a789c2-5d41-4e89-9b12-8f7a63450001', code: 'B', name: 'Dual Purpose / Light Motor Car (Auto & Manual)' },
        { id: 'c1a789c2-5d41-4e89-9b12-8f7a63450002', code: 'B1', name: 'Light Motor Cycle & Three Wheeler' },
        { id: 'c1a789c2-5d41-4e89-9b12-8f7a63450003', code: 'A', name: 'Heavy Motor Cycle (> 250cc)' },
        { id: 'c1a789c2-5d41-4e89-9b12-8f7a63450004', code: 'C', name: 'Dual Control Heavy Commercial Truck' },
      ]
    }

    return data as VehicleLicenceCategorySummary[]
  } catch {
    return [
      { id: 'c1a789c2-5d41-4e89-9b12-8f7a63450001', code: 'B', name: 'Dual Purpose / Light Motor Car (Auto & Manual)' },
      { id: 'c1a789c2-5d41-4e89-9b12-8f7a63450002', code: 'B1', name: 'Light Motor Cycle & Three Wheeler' },
      { id: 'c1a789c2-5d41-4e89-9b12-8f7a63450003', code: 'A', name: 'Heavy Motor Cycle (> 250cc)' },
      { id: 'c1a789c2-5d41-4e89-9b12-8f7a63450004', code: 'C', name: 'Dual Control Heavy Commercial Truck' },
    ]
  }
}

export async function reportVehicleDefectAndSwitch(
  input: VehicleDefectSwitchInput,
): Promise<VehicleDefectSwitchResult> {
  const defectPreset = COMMON_VEHICLE_DEFECTS.find((d) => d.id === input.defectCategory)
  const categoryLabel = defectPreset ? defectPreset.label : input.defectCategory
  const timestamp = new Date().toISOString()
  const dateStr = timestamp.split('T')[0]
  const instructorLabel = input.instructorName || 'Instructor'

  // 1. Update defective vehicle status
  const defectiveVehiclesList = getStoredData<VehicleWithRelations[]>(
    STORAGE_KEYS.VEHICLES,
    DEFAULT_FLEET_VEHICLES,
  )
  const targetVehicle = defectiveVehiclesList.find(
    (v) => v.id === input.defectiveVehicleId,
  )

  const faultNote = `[DEFECT REPORTED - ${dateStr}]: ${categoryLabel} (Severity: ${input.severity.toUpperCase()}) - ${input.description}. Reported by: ${instructorLabel}.`

  const updatedDefective: Partial<VehicleWithRelations> = {
    availability_status: 'in_maintenance',
    operational_status: input.severity === 'minor' ? 'active' : 'suspended',
    current_odometer_km:
      input.odometerReadingKm ?? targetVehicle?.current_odometer_km ?? null,
    internal_notes: targetVehicle?.internal_notes
      ? `${targetVehicle.internal_notes}\n\n${faultNote}`
      : faultNote,
    updated_at: timestamp,
  }

  await updateVehicle(
    input.defectiveVehicleId,
    updatedDefective as UpdateVehicleInput,
  )

  // 2. If replacement vehicle is chosen, ensure it is active and available
  let replacementVeh: VehicleWithRelations | undefined
  if (input.replacementVehicleId) {
    const refreshedList = getStoredData<VehicleWithRelations[]>(
      STORAGE_KEYS.VEHICLES,
      DEFAULT_FLEET_VEHICLES,
    )
    replacementVeh = refreshedList.find(
      (v) => v.id === input.replacementVehicleId,
    )
    if (replacementVeh) {
      await updateVehicle(input.replacementVehicleId, {
        availability_status: 'available',
        operational_status: 'active',
      })
    }
  }

  // 3. Log a maintenance record
  const maintenanceId =
    crypto.randomUUID ? crypto.randomUUID() : `maint-${Date.now()}`
  const maintenanceRecord = {
    id: maintenanceId,
    vehicle_id: input.defectiveVehicleId,
    driving_school_id:
      targetVehicle?.driving_school_id || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    maintenance_date: dateStr,
    maintenance_type: categoryLabel,
    description: `${input.description} [Severity: ${input.severity.toUpperCase()}]`,
    service_provider: 'Fleet Workshop / On-duty Inspection',
    cost: null,
    odometer_reading_km:
      input.odometerReadingKm ?? targetVehicle?.current_odometer_km ?? null,
    status: 'in_progress',
    next_recommended_service_date: null,
    unavailable_from: dateStr,
    unavailable_until: null,
    notes: `Fault logged by ${instructorLabel}.${
      replacementVeh
        ? ` Assigned substitute vehicle: ${replacementVeh.registration_number} (${replacementVeh.model}).`
        : ' No replacement vehicle assigned.'
    }`,
    created_at: timestamp,
    updated_at: timestamp,
  }

  // Persist maintenance record to local store and DB
  try {
    const storedMaint = getStoredData<unknown[]>(
      'trialready_vehicle_maintenance',
      [],
    )
    setStoredData('trialready_vehicle_maintenance', [
      maintenanceRecord,
      ...storedMaint,
    ])
    await supabase
      .from('vehicle_maintenance_records')
      .insert(maintenanceRecord)
  } catch (err) {
    console.warn('Maintenance record persist notice:', err)
  }

  // 4. If a sessionId was passed, reassign that session to the replacement vehicle
  let sessionUpdated = false
  if (input.sessionId && replacementVeh) {
    try {
      const storedSessions = getStoredData<any[]>(STORAGE_KEYS.SESSIONS, [])
      const sessionIdx = storedSessions.findIndex(
        (s) => s.id === input.sessionId,
      )
      if (sessionIdx !== -1) {
        storedSessions[sessionIdx] = {
          ...storedSessions[sessionIdx],
          vehicle_id: replacementVeh.id,
          vehicle: {
            id: replacementVeh.id,
            registration_number: replacementVeh.registration_number,
            display_name: replacementVeh.display_name,
            manufacturer: replacementVeh.manufacturer,
            model: replacementVeh.model,
            transmission_type: replacementVeh.transmission_type,
          },
          updated_at: timestamp,
        }
        setStoredData(STORAGE_KEYS.SESSIONS, storedSessions)
        sessionUpdated = true
        await supabase
          .from('practical_sessions')
          .update({
            vehicle_id: replacementVeh.id,
            updated_at: timestamp,
          })
          .eq('id', input.sessionId)
      }
    } catch (err) {
      console.warn('Session vehicle switch notice:', err)
    }
  }

  // 5. Broadcast real-time events for reactive UI updating across views
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('trialready-vehicles-updated'))
    window.dispatchEvent(new CustomEvent('trialready-sessions-updated'))
    window.dispatchEvent(new CustomEvent('trialready-maintenance-updated'))
  }

  return {
    defectiveVehicleId: input.defectiveVehicleId,
    replacementVehicleId: input.replacementVehicleId || null,
    maintenanceRecordId: maintenanceId,
    sessionUpdated,
  }
}

