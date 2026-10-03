import { supabase } from '../../../lib/supabase'
import {
  getStoredData,
  setStoredData,
  STORAGE_KEYS,
  upsertStoredItem,
} from '../../../lib/persistentStorage'
import type {
  CreateInstructorInput,
  Instructor,
  UpdateInstructorInput,
} from '../types/instructor'

const INSTRUCTORS_TABLE = 'instructors'

export const DEFAULT_INSTRUCTORS: Instructor[] = [
  {
    id: '33333333-3333-3333-3333-111111111111',
    driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    branch_id: 'ba111111-1111-1111-1111-111111111111',
    employee_code: 'INS-WP-001',
    full_name: 'Nimal Jayasuriya',
    nic: '197812345678',
    phone: '+94 77 234 5678',
    email: 'nimal@royaldriving.lk',
    driving_licence_number: 'B8291032',
    driving_licence_expiry_date: '2028-12-31',
    joined_date: '2020-01-15',
    is_active: true,
    created_at: '2020-01-15T00:00:00.000Z',
    updated_at: new Date().toISOString(),
  },
  {
    id: '33333333-3333-3333-3333-222222222222',
    driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    branch_id: 'ba111111-1111-1111-1111-111111111111',
    employee_code: 'INS-WP-002',
    full_name: 'Sunil Perera',
    nic: '198234567890',
    phone: '+94 71 345 6789',
    email: 'sunil@royaldriving.lk',
    driving_licence_number: 'B7192019',
    driving_licence_expiry_date: '2027-08-30',
    joined_date: '2021-03-01',
    is_active: true,
    created_at: '2021-03-01T00:00:00.000Z',
    updated_at: new Date().toISOString(),
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    branch_id: 'ba222222-2222-2222-2222-222222222222',
    employee_code: 'INS-WP-003',
    full_name: 'Chaminda Silva',
    nic: '198545678901',
    phone: '+94 76 456 7890',
    email: 'chaminda@royaldriving.lk',
    driving_licence_number: 'B6491028',
    driving_licence_expiry_date: '2029-05-15',
    joined_date: '2022-06-10',
    is_active: true,
    created_at: '2022-06-10T00:00:00.000Z',
    updated_at: new Date().toISOString(),
  },
  {
    id: '33333333-3333-3333-3333-444444444444',
    driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    branch_id: 'ba333333-3333-3333-3333-333333333333',
    employee_code: 'INS-WP-004',
    full_name: 'Kanthi Wickramasinghe',
    nic: '198056789012',
    phone: '+94 70 567 8901',
    email: 'kanthi@royaldriving.lk',
    driving_licence_number: 'B9102938',
    driving_licence_expiry_date: '2027-11-20',
    joined_date: '2023-01-05',
    is_active: true,
    created_at: '2023-01-05T00:00:00.000Z',
    updated_at: new Date().toISOString(),
  },
]

export async function getInstructors(): Promise<Instructor[]> {
  const localList = getStoredData<Instructor[]>(
    STORAGE_KEYS.INSTRUCTORS,
    DEFAULT_INSTRUCTORS,
  )

  try {
    const { data, error } = await supabase
      .from(INSTRUCTORS_TABLE)
      .select('*')
      .order('full_name', { ascending: true })

    if (error || !data || data.length === 0) {
      if (localList.length === 0) {
        setStoredData(STORAGE_KEYS.INSTRUCTORS, DEFAULT_INSTRUCTORS)
        return DEFAULT_INSTRUCTORS
      }
      return localList.sort((a, b) => a.full_name.localeCompare(b.full_name))
    }

    const remoteInstructors = data as Instructor[]
    const merged = [...localList]
    for (const r of remoteInstructors) {
      const idx = merged.findIndex(
        (m) => m.id === r.id || (m.employee_code && m.employee_code === r.employee_code),
      )
      if (idx !== -1) {
        merged[idx] = { ...r, ...merged[idx] }
      } else {
        merged.push(r)
      }
    }

    setStoredData(STORAGE_KEYS.INSTRUCTORS, merged)
    return merged.sort((a, b) => a.full_name.localeCompare(b.full_name))
  } catch {
    return localList.length > 0 ? localList : DEFAULT_INSTRUCTORS
  }
}

export async function getInstructorById(
  instructorId: string,
): Promise<Instructor> {
  const localList = getStoredData<Instructor[]>(
    STORAGE_KEYS.INSTRUCTORS,
    DEFAULT_INSTRUCTORS,
  )
  const cached = localList.find((i) => i.id === instructorId)

  try {
    const { data, error } = await supabase
      .from(INSTRUCTORS_TABLE)
      .select('*')
      .eq('id', instructorId)
      .single()

    if (error) {
      if (cached) return cached
      throw new Error(`Unable to load instructor: ${error.message}`)
    }

    const remote = data as Instructor
    upsertStoredItem(STORAGE_KEYS.INSTRUCTORS, remote)
    return remote
  } catch (err) {
    if (cached) return cached
    throw err
  }
}

export async function createInstructor(
  input: CreateInstructorInput,
): Promise<Instructor> {
  const fallbackSchoolId =
    input.driving_school_id || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
  const payload = {
    ...input,
    driving_school_id: fallbackSchoolId,
  }

  const generatedId = crypto.randomUUID ? crypto.randomUUID() : `ins-${Date.now()}`
  const newInstructor: Instructor = {
    id: generatedId,
    driving_school_id: payload.driving_school_id,
    branch_id: payload.branch_id || 'ba111111-1111-1111-1111-111111111111',
    employee_code:
      payload.employee_code ||
      `INS-WP-00${Math.floor(5 + Math.random() * 5)}`,
    full_name: payload.full_name,
    nic: payload.nic || null,
    phone: payload.phone || null,
    email: payload.email || null,
    driving_licence_number: payload.driving_licence_number || null,
    driving_licence_expiry_date: payload.driving_licence_expiry_date || null,
    joined_date:
      payload.joined_date || new Date().toISOString().split('T')[0],
    is_active: payload.is_active ?? true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  upsertStoredItem(STORAGE_KEYS.INSTRUCTORS, newInstructor)

  try {
    const { data: created } = await supabase
      .from(INSTRUCTORS_TABLE)
      .insert({
        ...payload,
        id: generatedId,
      })
      .select('*')
      .single()

    if (created) {
      upsertStoredItem(STORAGE_KEYS.INSTRUCTORS, created as Instructor)
      return created as Instructor
    }
  } catch (err) {
    console.warn('Supabase instructor insert fallback to persistent store:', err)
  }

  return newInstructor
}

export async function updateInstructor(
  instructorId: string,
  input: UpdateInstructorInput,
): Promise<Instructor> {
  const localList = getStoredData<Instructor[]>(
    STORAGE_KEYS.INSTRUCTORS,
    DEFAULT_INSTRUCTORS,
  )
  const existing = localList.find((i) => i.id === instructorId) || DEFAULT_INSTRUCTORS[0]

  const updated: Instructor = {
    ...existing,
    ...input,
    updated_at: new Date().toISOString(),
  }

  upsertStoredItem(STORAGE_KEYS.INSTRUCTORS, updated)

  try {
    await supabase.from(INSTRUCTORS_TABLE).update(input).eq('id', instructorId)
  } catch (err) {
    console.warn('Supabase instructor update fallback:', err)
  }

  return updated
}

export async function setInstructorActiveStatus(
  instructorId: string,
  isActive: boolean,
): Promise<Instructor> {
  return updateInstructor(instructorId, {
    is_active: isActive,
  })
}