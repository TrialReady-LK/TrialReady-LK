import { supabase } from '../../../lib/supabase'
import {
  getStoredData,
  setStoredData,
  STORAGE_KEYS,
  upsertStoredItem,
} from '../../../lib/persistentStorage'
import type {
  CreateStudentInput,
  Student,
  UpdateStudentInput,
} from '../types/student'

const STUDENTS_TABLE = 'students'

export const DEFAULT_STUDENTS: Student[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    branch_id: 'ba111111-1111-1111-1111-111111111111',
    primary_instructor_id: '33333333-3333-3333-3333-111111111111',
    student_code: 'ADM-2026-0042',
    full_name: 'Amaya Fernando',
    nic: '200178901234',
    date_of_birth: '2001-08-14',
    phone: '+94 77 123 4567',
    email: 'amaya.fernando@gmail.com',
    address: 'No. 45/2 Galle Road, Colombo 03',
    emergency_contact_name: 'Dr. Rohan Fernando (Father)',
    emergency_contact_phone: '+94 71 987 6543',
    registration_date: '2026-01-10',
    is_active: true,
    created_at: '2026-01-10T08:00:00.000Z',
    updated_at: new Date().toISOString(),
  },
  {
    id: '11111111-1111-1111-1111-222222222222',
    driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    branch_id: 'ba111111-1111-1111-1111-111111111111',
    primary_instructor_id: '33333333-3333-3333-3333-222222222222',
    student_code: 'ADM-2026-0058',
    full_name: 'Ravindu Wickramasinghe',
    nic: '199923405678',
    date_of_birth: '1999-04-20',
    phone: '+94 71 456 7890',
    email: 'ravindu.wick@gmail.com',
    address: 'No. 12 Temple Road, Maharagama',
    emergency_contact_name: 'Chitra Wickramasinghe (Mother)',
    emergency_contact_phone: '+94 77 333 4444',
    registration_date: '2026-02-01',
    is_active: true,
    created_at: '2026-02-01T08:00:00.000Z',
    updated_at: new Date().toISOString(),
  },
  {
    id: '11111111-1111-1111-1111-333333333333',
    driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    branch_id: 'ba222222-2222-2222-2222-222222222222',
    primary_instructor_id: '33333333-3333-3333-3333-333333333333',
    student_code: 'ADM-2026-0071',
    full_name: 'Sanduni Jayawardena',
    nic: '200256708912',
    date_of_birth: '2002-11-05',
    phone: '+94 76 890 1234',
    email: 'sanduni.jaya@yahoo.com',
    address: 'No. 88 Kandy Road, Yakkala, Gampaha',
    emergency_contact_name: 'Kamal Jayawardena (Father)',
    emergency_contact_phone: '+94 70 222 1111',
    registration_date: '2026-03-01',
    is_active: true,
    created_at: '2026-03-01T08:00:00.000Z',
    updated_at: new Date().toISOString(),
  },
  {
    id: '11111111-1111-1111-1111-444444444444',
    driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    branch_id: 'ba111111-1111-1111-1111-111111111111',
    primary_instructor_id: '33333333-3333-3333-3333-111111111111',
    student_code: 'ADM-2026-0089',
    full_name: 'Dinesh Kumara',
    nic: '200012304567',
    date_of_birth: '2000-06-18',
    phone: '+94 72 345 6789',
    email: 'dinesh.kumara@outlook.com',
    address: 'No. 31 High Level Road, Nugegoda',
    emergency_contact_name: 'Sunil Kumara (Brother)',
    emergency_contact_phone: '+94 75 444 8888',
    registration_date: '2026-03-15',
    is_active: true,
    created_at: '2026-03-15T08:00:00.000Z',
    updated_at: new Date().toISOString(),
  },
  {
    id: '11111111-1111-1111-1111-555555555555',
    driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    branch_id: 'ba333333-3333-3333-3333-333333333333',
    primary_instructor_id: '33333333-3333-3333-3333-444444444444',
    student_code: 'ADM-2026-0094',
    full_name: 'Kavindi Perera',
    nic: '200389012345',
    date_of_birth: '2003-01-25',
    phone: '+94 78 901 2345',
    email: 'kavindi.perera@gmail.com',
    address: 'No. 204 Peradeniya Road, Kandy',
    emergency_contact_name: 'Malkanthi Perera (Mother)',
    emergency_contact_phone: '+94 71 777 9999',
    registration_date: '2026-02-15',
    is_active: true,
    created_at: '2026-02-15T08:00:00.000Z',
    updated_at: new Date().toISOString(),
  },
]

export async function getStudents(): Promise<Student[]> {
  const localList = getStoredData<Student[]>(
    STORAGE_KEYS.STUDENTS,
    DEFAULT_STUDENTS,
  )

  try {
    const { data, error } = await supabase
      .from(STUDENTS_TABLE)
      .select('*')
      .order('full_name', { ascending: true })

    if (error || !data || data.length === 0) {
      if (localList.length === 0) {
        setStoredData(STORAGE_KEYS.STUDENTS, DEFAULT_STUDENTS)
        return DEFAULT_STUDENTS
      }
      return localList.sort((a, b) => a.full_name.localeCompare(b.full_name))
    }

    const remoteStudents = data as Student[]
    const merged = [...localList]
    for (const r of remoteStudents) {
      const idx = merged.findIndex(
        (m) => m.id === r.id || (m.student_code && m.student_code === r.student_code),
      )
      if (idx !== -1) {
        merged[idx] = { ...r, ...merged[idx] }
      } else {
        merged.push(r)
      }
    }

    setStoredData(STORAGE_KEYS.STUDENTS, merged)
    return merged.sort((a, b) => a.full_name.localeCompare(b.full_name))
  } catch {
    return localList.length > 0 ? localList : DEFAULT_STUDENTS
  }
}

export async function getStudentById(id: string): Promise<Student> {
  const localList = getStoredData<Student[]>(
    STORAGE_KEYS.STUDENTS,
    DEFAULT_STUDENTS,
  )
  const cached = localList.find((s) => s.id === id)

  try {
    const { data, error } = await supabase
      .from(STUDENTS_TABLE)
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (cached) return cached
      throw new Error(`Unable to load student: ${error.message}`)
    }

    const remote = data as Student
    upsertStoredItem(STORAGE_KEYS.STUDENTS, remote)
    return remote
  } catch (err) {
    if (cached) return cached
    throw err
  }
}

export async function createStudent(
  input: CreateStudentInput,
): Promise<Student> {
  const fallbackSchoolId =
    input.driving_school_id || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
  const payload = {
    ...input,
    driving_school_id: fallbackSchoolId,
  }

  const generatedId = crypto.randomUUID ? crypto.randomUUID() : `stud-${Date.now()}`

  const newStudent: Student = {
    id: generatedId,
    driving_school_id: payload.driving_school_id,
    branch_id: payload.branch_id || 'ba111111-1111-1111-1111-111111111111',
    primary_instructor_id: payload.primary_instructor_id || '33333333-3333-3333-3333-111111111111',
    student_code:
      payload.student_code ||
      `ADM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    full_name: payload.full_name,
    nic: payload.nic || null,
    date_of_birth: payload.date_of_birth || null,
    phone: payload.phone || null,
    email: payload.email || null,
    address: payload.address || null,
    emergency_contact_name: payload.emergency_contact_name || null,
    emergency_contact_phone: payload.emergency_contact_phone || null,
    registration_date:
      payload.registration_date || new Date().toISOString().split('T')[0],
    is_active: payload.is_active ?? true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  // Always save immediately to persistent storage
  upsertStoredItem(STORAGE_KEYS.STUDENTS, newStudent)

  try {
    const { data: created } = await supabase
      .from(STUDENTS_TABLE)
      .insert({
        ...payload,
        id: generatedId,
      })
      .select('*')
      .single()

    if (created) {
      upsertStoredItem(STORAGE_KEYS.STUDENTS, created as Student)
      return created as Student
    }
  } catch (err) {
    console.warn('Supabase student insert fallback to persistent store:', err)
  }

  return newStudent
}

export async function updateStudent(
  id: string,
  input: UpdateStudentInput,
): Promise<Student> {
  const localList = getStoredData<Student[]>(
    STORAGE_KEYS.STUDENTS,
    DEFAULT_STUDENTS,
  )
  const existing = localList.find((s) => s.id === id) || DEFAULT_STUDENTS[0]

  const updated: Student = {
    ...existing,
    ...input,
    updated_at: new Date().toISOString(),
  }

  upsertStoredItem(STORAGE_KEYS.STUDENTS, updated)

  try {
    await supabase.from(STUDENTS_TABLE).update(input).eq('id', id)
  } catch (err) {
    console.warn('Supabase student update fallback:', err)
  }

  return updated
}

export async function setStudentActiveStatus(
  id: string,
  isActive: boolean,
): Promise<Student> {
  return updateStudent(id, { is_active: isActive })
}