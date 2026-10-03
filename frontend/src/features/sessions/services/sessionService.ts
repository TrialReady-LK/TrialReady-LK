import { supabase } from '../../../lib/supabase'
import {
  getStoredData,
  setStoredData,
  STORAGE_KEYS,
  upsertStoredItem,
} from '../../../lib/persistentStorage'
import type {
  CreatePracticalSessionInput,
  PracticalSessionWithRelations,
  RecordAttendanceInput,
  SessionBranchSummary,
  SessionCategorySummary,
  SessionInstructorSummary,
  SessionStudentSummary,
  SessionVehicleSummary,
  UpdatePracticalSessionInput,
} from '../types/session'

const SESSIONS_TABLE = 'practical_sessions'

const SESSION_SELECT_RELATIONS = `
  id,
  driving_school_id,
  branch_id,
  student_id,
  instructor_id,
  vehicle_id,
  licence_category_id,
  session_date,
  start_time,
  end_time,
  status,
  attendance_status,
  instructor_feedback,
  student_rating,
  cancellation_reason,
  skills_covered,
  created_at,
  updated_at,
  student:students(id, full_name, student_code, phone),
  instructor:instructors(id, full_name, employee_code, phone),
  vehicle:vehicles(id, registration_number, display_name, manufacturer, model, transmission_type),
  licence_category:licence_categories(id, code, name),
  branch:branches(id, name)
`

export function getDefaultSessions(): PracticalSessionWithRelations[] {
  const todayStr = new Date().toISOString().split('T')[0]
  return [
    {
      id: 'ses-001',
      driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      branch_id: 'ba111111-1111-1111-1111-111111111111',
      student_id: '11111111-1111-1111-1111-111111111111',
      instructor_id: '33333333-3333-3333-3333-111111111111',
      vehicle_id: '22222222-2222-2222-2222-111111111111',
      licence_category_id: 'ca111111-1111-1111-1111-111111111111',
      session_date: '2026-08-10',
      start_time: '08:00:00',
      end_time: '09:15:00',
      status: 'completed',
      attendance_status: 'present',
      instructor_feedback: 'Excellent clutch control and hill start.',
      student_rating: 5,
      cancellation_reason: null,
      skills_covered: ['Clutch Control & Gears', 'Hill Start / Gradient'],
      created_at: '2026-08-10T08:00:00.000Z',
      updated_at: new Date().toISOString(),
      student: { id: '11111111-1111-1111-1111-111111111111', full_name: 'Amaya Fernando', admission_number: 'ADM-2026-0042', phone: '+94 77 123 4567' },
      instructor: { id: '33333333-3333-3333-3333-111111111111', full_name: 'Nimal Jayasuriya', staff_number: 'INS-WP-001', phone: '+94 77 234 5678' },
      vehicle: { id: '22222222-2222-2222-2222-111111111111', registration_number: 'WP CAB-4921', make: 'Toyota', model: 'Vitz Dual-Control', transmission_type: 'manual' },
      licence_category: { id: 'ca111111-1111-1111-1111-111111111111', code: 'B', name: 'Dual Purpose / Light Motor Car (Auto & Manual)' },
      branch: { id: 'ba111111-1111-1111-1111-111111111111', name: 'Colombo Central (Nugegoda)', code: 'COL-01' },
    },
    {
      id: 'ses-002',
      driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      branch_id: 'ba111111-1111-1111-1111-111111111111',
      student_id: '11111111-1111-1111-1111-111111111111',
      instructor_id: '33333333-3333-3333-3333-111111111111',
      vehicle_id: '22222222-2222-2222-2222-111111111111',
      licence_category_id: 'ca111111-1111-1111-1111-111111111111',
      session_date: '2026-08-14',
      start_time: '08:00:00',
      end_time: '09:15:00',
      status: 'completed',
      attendance_status: 'present',
      instructor_feedback: 'Clean parallel parking on both sides.',
      student_rating: 5,
      cancellation_reason: null,
      skills_covered: ['Parallel Parking', '3-Point Turn'],
      created_at: '2026-08-14T08:00:00.000Z',
      updated_at: new Date().toISOString(),
      student: { id: '11111111-1111-1111-1111-111111111111', full_name: 'Amaya Fernando', admission_number: 'ADM-2026-0042', phone: '+94 77 123 4567' },
      instructor: { id: '33333333-3333-3333-3333-111111111111', full_name: 'Nimal Jayasuriya', staff_number: 'INS-WP-001', phone: '+94 77 234 5678' },
      vehicle: { id: '22222222-2222-2222-2222-111111111111', registration_number: 'WP CAB-4921', make: 'Toyota', model: 'Vitz Dual-Control', transmission_type: 'manual' },
      licence_category: { id: 'ca111111-1111-1111-1111-111111111111', code: 'B', name: 'Dual Purpose / Light Motor Car (Auto & Manual)' },
      branch: { id: 'ba111111-1111-1111-1111-111111111111', name: 'Colombo Central (Nugegoda)', code: 'COL-01' },
    },
    {
      id: 'ses-003',
      driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      branch_id: 'ba111111-1111-1111-1111-111111111111',
      student_id: '11111111-1111-1111-1111-111111111111',
      instructor_id: '33333333-3333-3333-3333-111111111111',
      vehicle_id: '22222222-2222-2222-2222-111111111111',
      licence_category_id: 'ca111111-1111-1111-1111-111111111111',
      session_date: todayStr,
      start_time: '08:30:00',
      end_time: '09:45:00',
      status: 'scheduled',
      attendance_status: 'unmarked',
      instructor_feedback: null,
      student_rating: null,
      cancellation_reason: null,
      skills_covered: ['Mock DMT Trial Simulation', 'Reverse S-Bend Master'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      student: { id: '11111111-1111-1111-1111-111111111111', full_name: 'Amaya Fernando', admission_number: 'ADM-2026-0042', phone: '+94 77 123 4567' },
      instructor: { id: '33333333-3333-3333-3333-111111111111', full_name: 'Nimal Jayasuriya', staff_number: 'INS-WP-001', phone: '+94 77 234 5678' },
      vehicle: { id: '22222222-2222-2222-2222-111111111111', registration_number: 'WP CAB-4921', make: 'Toyota', model: 'Vitz Dual-Control', transmission_type: 'manual' },
      licence_category: { id: 'ca111111-1111-1111-1111-111111111111', code: 'B', name: 'Dual Purpose / Light Motor Car (Auto & Manual)' },
      branch: { id: 'ba111111-1111-1111-1111-111111111111', name: 'Colombo Central (Nugegoda)', code: 'COL-01' },
    },
    {
      id: 'ses-004',
      driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      branch_id: 'ba111111-1111-1111-1111-111111111111',
      student_id: '11111111-1111-1111-1111-222222222222',
      instructor_id: '33333333-3333-3333-3333-111111111111',
      vehicle_id: '22222222-2222-2222-2222-222222222222',
      licence_category_id: 'ca111111-1111-1111-1111-111111111111',
      session_date: todayStr,
      start_time: '10:00:00',
      end_time: '11:15:00',
      status: 'scheduled',
      attendance_status: 'unmarked',
      instructor_feedback: null,
      student_rating: null,
      cancellation_reason: null,
      skills_covered: ['Reverse S-Bend', 'Hill Start Clutch Balance'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      student: { id: '11111111-1111-1111-1111-222222222222', full_name: 'Ravindu Wickramasinghe', admission_number: 'ADM-2026-0058', phone: '+94 71 456 7890' },
      instructor: { id: '33333333-3333-3333-3333-111111111111', full_name: 'Nimal Jayasuriya', staff_number: 'INS-WP-001', phone: '+94 77 234 5678' },
      vehicle: { id: '22222222-2222-2222-2222-222222222222', registration_number: 'WP CBC-8821', make: 'Suzuki', model: 'Swift Auto Dual-Control', transmission_type: 'automatic' },
      licence_category: { id: 'ca111111-1111-1111-1111-111111111111', code: 'B', name: 'Dual Purpose / Light Motor Car (Auto & Manual)' },
      branch: { id: 'ba111111-1111-1111-1111-111111111111', name: 'Colombo Central (Nugegoda)', code: 'COL-01' },
    },
  ]
}

export async function getPracticalSessions(
  drivingSchoolId: string,
  options?: {
    startDate?: string
    endDate?: string
    branchId?: string
    instructorId?: string
    studentId?: string
    vehicleId?: string
  },
): Promise<PracticalSessionWithRelations[]> {
  const defaults = getDefaultSessions()
  const localList = getStoredData<PracticalSessionWithRelations[]>(
    STORAGE_KEYS.SESSIONS,
    defaults,
  )

  try {
    let query = supabase
      .from(SESSIONS_TABLE)
      .select(SESSION_SELECT_RELATIONS)
      .eq('driving_school_id', drivingSchoolId)
      .order('session_date', { ascending: true })
      .order('start_time', { ascending: true })

    if (options?.startDate) query = query.gte('session_date', options.startDate)
    if (options?.endDate) query = query.lte('session_date', options.endDate)
    if (options?.branchId) query = query.eq('branch_id', options.branchId)
    if (options?.instructorId) query = query.eq('instructor_id', options.instructorId)
    if (options?.studentId) query = query.eq('student_id', options.studentId)
    if (options?.vehicleId) query = query.eq('vehicle_id', options.vehicleId)

    const { data, error } = await query

    if (error || !data || data.length === 0) {
      return filterSessionsLocally(localList, options)
    }

    const remote = data as unknown as PracticalSessionWithRelations[]
    const merged = [...localList]
    for (const r of remote) {
      const idx = merged.findIndex((m) => m.id === r.id)
      if (idx !== -1) {
        merged[idx] = { ...r, ...merged[idx] }
      } else {
        merged.push(r)
      }
    }
    setStoredData(STORAGE_KEYS.SESSIONS, merged)
    return filterSessionsLocally(merged, options)
  } catch {
    return filterSessionsLocally(localList, options)
  }
}

function filterSessionsLocally(
  list: PracticalSessionWithRelations[],
  options?: {
    startDate?: string
    endDate?: string
    branchId?: string
    instructorId?: string
    studentId?: string
    vehicleId?: string
  },
): PracticalSessionWithRelations[] {
  let filtered = [...list]
  if (options?.startDate) {
    filtered = filtered.filter((s) => s.session_date >= options.startDate!)
  }
  if (options?.endDate) {
    filtered = filtered.filter((s) => s.session_date <= options.endDate!)
  }
  if (options?.branchId) {
    filtered = filtered.filter((s) => s.branch_id === options.branchId)
  }
  if (options?.instructorId) {
    filtered = filtered.filter((s) => s.instructor_id === options.instructorId)
  }
  if (options?.studentId) {
    filtered = filtered.filter((s) => s.student_id === options.studentId)
  }
  if (options?.vehicleId) {
    filtered = filtered.filter((s) => s.vehicle_id === options.vehicleId)
  }
  return filtered
}

export async function getPracticalSessionById(
  sessionId: string,
): Promise<PracticalSessionWithRelations> {
  const localList = getStoredData<PracticalSessionWithRelations[]>(
    STORAGE_KEYS.SESSIONS,
    getDefaultSessions(),
  )
  const cached = localList.find((s) => s.id === sessionId)

  try {
    const { data } = await supabase
      .from(SESSIONS_TABLE)
      .select(SESSION_SELECT_RELATIONS)
      .eq('id', sessionId)
      .single()

    if (data) {
      const remote = data as unknown as PracticalSessionWithRelations
      upsertStoredItem(STORAGE_KEYS.SESSIONS, remote)
      return remote
    }
  } catch {
    // fallback
  }

  if (cached) return cached
  throw new Error('Practical session not found')
}

export async function createPracticalSession(
  input: CreatePracticalSessionInput,
): Promise<PracticalSessionWithRelations> {
  const generatedId = crypto.randomUUID ? crypto.randomUUID() : `ses-${Date.now()}`
  const newSession: PracticalSessionWithRelations = {
    id: generatedId,
    driving_school_id: input.driving_school_id,
    branch_id: input.branch_id,
    student_id: input.student_id,
    instructor_id: input.instructor_id,
    vehicle_id: input.vehicle_id || null,
    licence_category_id: input.licence_category_id,
    session_date: input.session_date,
    start_time: input.start_time,
    end_time: input.end_time,
    status: 'scheduled',
    attendance_status: 'unmarked',
    instructor_feedback: null,
    student_rating: null,
    cancellation_reason: null,
    skills_covered: input.skills_covered || [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    student: { id: input.student_id, full_name: 'Amaya Fernando', admission_number: 'ADM-2026-0042', phone: '+94 77 123 4567' },
    instructor: { id: input.instructor_id, full_name: 'Nimal Jayasuriya', staff_number: 'INS-WP-001', phone: '+94 77 234 5678' },
    vehicle: input.vehicle_id
      ? { id: input.vehicle_id, registration_number: 'WP CAB-4921', make: 'Toyota', model: 'Vitz Dual-Control', transmission_type: 'manual' }
      : null,
    licence_category: { id: input.licence_category_id, code: 'B', name: 'Dual Purpose / Light Motor Car (Auto & Manual)' },
    branch: { id: input.branch_id, name: 'Colombo Central (Nugegoda)', code: 'COL-01' },
  }

  upsertStoredItem(STORAGE_KEYS.SESSIONS, newSession)

  try {
    await supabase.from(SESSIONS_TABLE).insert([
      {
        id: generatedId,
        driving_school_id: input.driving_school_id,
        branch_id: input.branch_id,
        student_id: input.student_id,
        instructor_id: input.instructor_id,
        vehicle_id: input.vehicle_id || null,
        licence_category_id: input.licence_category_id,
        session_date: input.session_date,
        start_time: input.start_time,
        end_time: input.end_time,
        status: 'scheduled',
        attendance_status: 'unmarked',
        skills_covered: input.skills_covered || [],
      },
    ])
  } catch (err) {
    console.warn('Supabase session schedule notice:', err)
  }

  return newSession
}

export async function updatePracticalSession(
  sessionId: string,
  input: UpdatePracticalSessionInput,
): Promise<PracticalSessionWithRelations> {
  const localList = getStoredData<PracticalSessionWithRelations[]>(
    STORAGE_KEYS.SESSIONS,
    getDefaultSessions(),
  )
  const existing = localList.find((s) => s.id === sessionId) || getDefaultSessions()[0]

  const updated: PracticalSessionWithRelations = {
    ...existing,
    ...input,
    updated_at: new Date().toISOString(),
  }

  upsertStoredItem(STORAGE_KEYS.SESSIONS, updated)

  try {
    await supabase.from(SESSIONS_TABLE).update(input).eq('id', sessionId)
  } catch (err) {
    console.warn('Supabase session update notice:', err)
  }

  return updated
}

export async function recordSessionAttendance(
  sessionId: string,
  input: RecordAttendanceInput,
): Promise<PracticalSessionWithRelations> {
  const updatePayload: UpdatePracticalSessionInput = {
    attendance_status: input.attendance_status,
    status: input.attendance_status === 'present' ? 'completed' : 'scheduled',
    instructor_feedback: input.instructor_feedback ?? null,
    student_rating: input.student_rating ?? null,
    skills_covered: input.skills_covered,
  }

  return updatePracticalSession(sessionId, updatePayload)
}

export async function cancelPracticalSession(
  sessionId: string,
  cancellationReason: string,
): Promise<PracticalSessionWithRelations> {
  return updatePracticalSession(sessionId, {
    status: 'cancelled',
    cancellation_reason: cancellationReason,
  })
}

export async function deletePracticalSession(sessionId: string): Promise<void> {
  const localList = getStoredData<PracticalSessionWithRelations[]>(
    STORAGE_KEYS.SESSIONS,
    getDefaultSessions(),
  )
  setStoredData(
    STORAGE_KEYS.SESSIONS,
    localList.filter((s) => s.id !== sessionId),
  )

  try {
    await supabase.from(SESSIONS_TABLE).delete().eq('id', sessionId)
  } catch (err) {
    console.warn('Supabase delete session notice:', err)
  }
}

export async function getBranchesForSessions(
  _drivingSchoolId: string,
): Promise<SessionBranchSummary[]> {
  return [
    { id: 'ba111111-1111-1111-1111-111111111111', name: 'Colombo Central (Nugegoda)', code: 'COL-01' },
    { id: 'ba222222-2222-2222-2222-222222222222', name: 'Gampaha Branch (Yakkala)', code: 'GAM-01' },
    { id: 'ba333333-3333-3333-3333-333333333333', name: 'Kandy City Branch (Peradeniya)', code: 'KAN-01' },
  ]
}

export async function getCategoriesForSessions(
  _drivingSchoolId: string,
): Promise<SessionCategorySummary[]> {
  return [
    { id: 'ca111111-1111-1111-1111-111111111111', code: 'B', name: 'Dual Purpose / Light Motor Car (Auto & Manual)' },
    { id: 'ca222222-2222-2222-2222-222222222222', code: 'B1', name: 'Light Motor Cycle & Three Wheeler' },
    { id: 'ca333333-3333-3333-3333-333333333333', code: 'A', name: 'Heavy Motor Cycle (> 250cc)' },
    { id: 'ca444444-4444-4444-4444-444444444444', code: 'C', name: 'Dual Control Heavy Commercial Truck' },
  ]
}

export async function getInstructorsForSessions(
  _drivingSchoolId: string,
): Promise<SessionInstructorSummary[]> {
  return [
    { id: '33333333-3333-3333-3333-111111111111', full_name: 'Nimal Jayasuriya', staff_number: 'INS-WP-001', phone: '+94 77 234 5678' },
    { id: '33333333-3333-3333-3333-222222222222', full_name: 'Sunil Perera', staff_number: 'INS-WP-002', phone: '+94 71 345 6789' },
    { id: '33333333-3333-3333-3333-333333333333', full_name: 'Chaminda Silva', staff_number: 'INS-WP-003', phone: '+94 76 456 7890' },
    { id: '33333333-3333-3333-3333-444444444444', full_name: 'Kanthi Wickramasinghe', staff_number: 'INS-WP-004', phone: '+94 70 567 8901' },
  ]
}

export async function getStudentsForSessions(
  _drivingSchoolId: string,
): Promise<SessionStudentSummary[]> {
  return [
    { id: '11111111-1111-1111-1111-111111111111', full_name: 'Amaya Fernando', admission_number: 'ADM-2026-0042', phone: '+94 77 123 4567' },
    { id: '11111111-1111-1111-1111-222222222222', full_name: 'Ravindu Wickramasinghe', admission_number: 'ADM-2026-0058', phone: '+94 71 456 7890' },
    { id: '11111111-1111-1111-1111-333333333333', full_name: 'Sanduni Jayawardena', admission_number: 'ADM-2026-0071', phone: '+94 76 890 1234' },
    { id: '11111111-1111-1111-1111-444444444444', full_name: 'Dinesh Kumara', admission_number: 'ADM-2026-0089', phone: '+94 72 345 6789' },
    { id: '11111111-1111-1111-1111-555555555555', full_name: 'Kavindi Perera', admission_number: 'ADM-2026-0094', phone: '+94 78 901 2345' },
  ]
}

export async function getVehiclesForSessions(
  _drivingSchoolId: string,
): Promise<SessionVehicleSummary[]> {
  return [
    { id: '22222222-2222-2222-2222-111111111111', registration_number: 'WP CAB-4921', make: 'Toyota', model: 'Vitz Dual-Control', transmission_type: 'manual' },
    { id: '22222222-2222-2222-2222-222222222222', registration_number: 'WP CBC-8821', make: 'Suzuki', model: 'Swift Auto Dual-Control', transmission_type: 'automatic' },
    { id: '22222222-2222-2222-2222-333333333333', registration_number: 'CP BC-3042', make: 'Yamaha', model: 'FZ 150', transmission_type: 'manual' },
    { id: '22222222-2222-2222-2222-444444444444', registration_number: 'WP LY-9120', make: 'Bajaj', model: 'RE 205 Auto', transmission_type: 'manual' },
    { id: '22222222-2222-2222-2222-555555555555', registration_number: 'WP GA-7712', make: 'Isuzu', model: 'Elf NPR Dual-Control', transmission_type: 'manual' },
  ]
}
