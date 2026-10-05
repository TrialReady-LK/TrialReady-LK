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
import {
  generate100SriLankanStudents,
  DEMO_STUDENT_AMAYA_ID,
  generateRealisticUuid,
} from '../../demo/data/generateDemo100Data'

const STUDENTS_TABLE = 'students'

export const DEFAULT_STUDENTS: Student[] = [
  {
    id: DEMO_STUDENT_AMAYA_ID,
    driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    branch_id: 'b1a789c2-5d41-4e89-9b12-8f7a63450001',
    primary_instructor_id: 'd41f8a29-7c3e-4b95-a841-3b7c89f10001',
    student_code: 'ADM-2026-0101',
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
    id: generateRealisticUuid('student', 2),
    driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    branch_id: 'b1a789c2-5d41-4e89-9b12-8f7a63450001',
    primary_instructor_id: 'd41f8a29-7c3e-4b95-a841-3b7c89f10002',
    student_code: 'ADM-2026-0102',
    full_name: 'Ravindu Rathnayaka',
    nic: '199923405812',
    date_of_birth: '1999-04-20',
    phone: '+94 71 234 5678',
    email: 'ravindu.rathnayaka@gmail.com',
    address: 'No. 12 Temple Road, Maharagama',
    emergency_contact_name: 'Chitra Rathnayaka (Mother)',
    emergency_contact_phone: '+94 77 333 4444',
    registration_date: '2026-02-01',
    is_active: true,
    created_at: '2026-02-01T08:00:00.000Z',
    updated_at: new Date().toISOString(),
  },
  {
    id: generateRealisticUuid('student', 3),
    driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    branch_id: 'b1a789c2-5d41-4e89-9b12-8f7a63450001',
    primary_instructor_id: 'd41f8a29-7c3e-4b95-a841-3b7c89f10003',
    student_code: 'ADM-2026-0103',
    full_name: 'Sanduni Wickramasinghe',
    nic: '200265109432',
    date_of_birth: '2002-11-05',
    phone: '+94 76 890 1234',
    email: 'sanduni.w@gmail.com',
    address: 'No. 88 Kandy Road, Yakkala, Gampaha',
    emergency_contact_name: 'Kamal Wickramasinghe (Father)',
    emergency_contact_phone: '+94 70 222 1111',
    registration_date: '2026-03-01',
    is_active: true,
    created_at: '2026-03-01T08:00:00.000Z',
    updated_at: new Date().toISOString(),
  },
  {
    id: generateRealisticUuid('student', 4),
    driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    branch_id: 'b2a789c2-5d41-4e89-9b12-8f7a63450002',
    primary_instructor_id: 'd41f8a29-7c3e-4b95-a841-3b7c89f10001',
    student_code: 'ADM-2026-0104',
    full_name: 'Dinesh Perera',
    nic: '199834208914',
    date_of_birth: '1998-06-18',
    phone: '+94 75 678 9012',
    email: 'dinesh.perera@gmail.com',
    address: 'No. 31 High Level Road, Nugegoda',
    emergency_contact_name: 'Sunil Perera (Brother)',
    emergency_contact_phone: '+94 75 444 8888',
    registration_date: '2026-03-15',
    is_active: true,
    created_at: '2026-03-15T08:00:00.000Z',
    updated_at: new Date().toISOString(),
  },
  {
    id: generateRealisticUuid('student', 5),
    driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    branch_id: 'b3a789c2-5d41-4e89-9b12-8f7a63450003',
    primary_instructor_id: 'd41f8a29-7c3e-4b95-a841-3b7c89f10004',
    student_code: 'ADM-2026-0105',
    full_name: 'Kavindi Silva',
    nic: '200384102941',
    date_of_birth: '2003-01-25',
    phone: '+94 78 901 2345',
    email: 'kavindi.silva@gmail.com',
    address: 'No. 204 Peradeniya Road, Kandy',
    emergency_contact_name: 'Malkanthi Silva (Mother)',
    emergency_contact_phone: '+94 71 777 9999',
    registration_date: '2026-02-15',
    is_active: true,
    created_at: '2026-02-15T08:00:00.000Z',
    updated_at: new Date().toISOString(),
  },
]

export async function getStudents(): Promise<Student[]> {
  const branches = getStoredData<any[]>(STORAGE_KEYS.BRANCHES, [])
  const instructors = getStoredData<any[]>(STORAGE_KEYS.INSTRUCTORS, [])
  const schoolId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
  const canonical100 = generate100SriLankanStudents(
    schoolId,
    branches,
    instructors,
  ) as Student[]

  // Deduplicate and index strictly by normalized full_name (lowercase trim)
  const nameMap = new Map<string, Student>()

  // 1. Populate canonical 100 students (100 distinct names guaranteed)
  canonical100.forEach((st) => {
    if (st.full_name) {
      nameMap.set(st.full_name.trim().toLowerCase(), st)
    }
  })

  // 2. Overlay any locally stored students (user edits or updates), matching on name
  const localList = getStoredData<Student[]>(STORAGE_KEYS.STUDENTS, [])
  localList.forEach((st) => {
    if (!st.full_name) return
    const key = st.full_name.trim().toLowerCase()
    if (nameMap.has(key)) {
      nameMap.set(key, { ...nameMap.get(key)!, ...st })
    }
  })

  // 3. Overlay remote students from Supabase if available
  try {
    const { data, error } = await supabase
      .from(STUDENTS_TABLE)
      .select('*')
      .order('full_name', { ascending: true })

    if (!error && data && data.length > 0) {
      for (const r of data as Student[]) {
        if (!r.full_name) continue
        const key = r.full_name.trim().toLowerCase()
        if (nameMap.has(key)) {
          nameMap.set(key, { ...nameMap.get(key)!, ...r })
        }
      }
    }
  } catch (err) {
    console.warn('Supabase fetch students note:', err)
  }

  // Exactly 100 distinct students with mutually unique full names
  const finalMerged = Array.from(nameMap.values()).slice(0, 100)

  // Ensure clean, deduplicated storage state in browser localStorage
  setStoredData(STORAGE_KEYS.STUDENTS, finalMerged)

  return finalMerged.sort((a, b) => a.full_name.localeCompare(b.full_name))
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
    branch_id: payload.branch_id || 'b1a789c2-5d41-4e89-9b12-8f7a63450001',
    primary_instructor_id: payload.primary_instructor_id || 'd41f8a29-7c3e-4b95-a841-3b7c89f10001',
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