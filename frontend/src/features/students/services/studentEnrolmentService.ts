import { supabase } from '../../../lib/supabase'
import {
  getStoredData,
  setStoredData,
  mergeAndStoreList,
  STORAGE_KEYS,
} from '../../../lib/persistentStorage'
import type {
  CreateStudentLicenceEnrolmentInput,
  LicenceCategory,
  StudentLicenceEnrolment,
} from '../types/studentEnrolment'

import {
  DEMO_STUDENT_AMAYA_ID,
  generateRealisticUuid,
} from '../../demo/data/generateDemo100Data'

const LICENCE_CATEGORIES_TABLE = 'licence_categories'
const STUDENT_LICENCE_CATEGORIES_TABLE = 'student_licence_categories'

export const DEFAULT_LICENCE_CATEGORIES: LicenceCategory[] = [
  {
    id: 'c1a789c2-5d41-4e89-9b12-8f7a63450001',
    driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    code: 'B',
    name: 'Dual Purpose / Light Motor Car (Auto & Manual)',
    description:
      'Motor vehicles with seating capacity not exceeding 9 persons and gross weight up to 3,500 kg',
    is_active: true,
    created_at: '2026-08-01T00:00:00Z',
    updated_at: '2026-08-01T00:00:00Z',
  },
  {
    id: 'c1a789c2-5d41-4e89-9b12-8f7a63450002',
    driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    code: 'B1',
    name: 'Light Motor Cycle & Three Wheeler',
    description: 'Motor tricycles and light motorcycles',
    is_active: true,
    created_at: '2026-08-01T00:00:00Z',
    updated_at: '2026-08-01T00:00:00Z',
  },
  {
    id: 'c1a789c2-5d41-4e89-9b12-8f7a63450003',
    driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    code: 'A',
    name: 'Heavy Motor Cycle (> 250cc)',
    description: 'Motorcycles with engine capacity exceeding 250cc',
    is_active: true,
    created_at: '2026-08-01T00:00:00Z',
    updated_at: '2026-08-01T00:00:00Z',
  },
  {
    id: 'c1a789c2-5d41-4e89-9b12-8f7a63450004',
    driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    code: 'C',
    name: 'Dual Control Heavy Commercial Truck',
    description:
      'Heavy motor lorries with gross vehicle weight exceeding 3,500 kg',
    is_active: true,
    created_at: '2026-08-01T00:00:00Z',
    updated_at: '2026-08-01T00:00:00Z',
  },
]

export const DEFAULT_STUDENT_LICENCE_ENROLMENTS: StudentLicenceEnrolment[] = [
  {
    student_id: DEMO_STUDENT_AMAYA_ID,
    licence_category_id: 'c1a789c2-5d41-4e89-9b12-8f7a63450001',
    driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    enrolled_at: '2026-01-15T00:00:00Z',
    is_active: true,
  },
  {
    student_id: DEMO_STUDENT_AMAYA_ID,
    licence_category_id: 'c1a789c2-5d41-4e89-9b12-8f7a63450003',
    driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    enrolled_at: '2026-01-15T00:00:00Z',
    is_active: true,
  },
  {
    student_id: generateRealisticUuid('student', 2),
    licence_category_id: 'c1a789c2-5d41-4e89-9b12-8f7a63450001',
    driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    enrolled_at: '2026-01-18T00:00:00Z',
    is_active: true,
  },
  {
    student_id: generateRealisticUuid('student', 3),
    licence_category_id: 'c1a789c2-5d41-4e89-9b12-8f7a63450002',
    driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    enrolled_at: '2026-02-01T00:00:00Z',
    is_active: true,
  },
]

export async function getLicenceCategories(
  drivingSchoolId: string,
): Promise<LicenceCategory[]> {
  const local = getStoredData<LicenceCategory[]>(
    STORAGE_KEYS.LICENCE_CATEGORIES,
    DEFAULT_LICENCE_CATEGORIES,
  )

  try {
    const { data, error } = await supabase
      .from(LICENCE_CATEGORIES_TABLE)
      .select('*')
      .eq('driving_school_id', drivingSchoolId)
      .eq('is_active', true)
      .order('code', { ascending: true })

    if (!error && data && data.length > 0) {
      const merged = mergeAndStoreList(
        STORAGE_KEYS.LICENCE_CATEGORIES,
        data as LicenceCategory[],
        'code',
      )
      return merged
    }
  } catch (err) {
    console.warn(
      'Unable to load licence categories from Supabase, using persistent store:',
      err,
    )
  }

  return local.filter(
    (c) =>
      c.driving_school_id === drivingSchoolId ||
      !c.driving_school_id ||
      drivingSchoolId === 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  )
}

export async function getStudentLicenceEnrolments(
  studentId: string,
): Promise<StudentLicenceEnrolment[]> {
  const allStored = getStoredData<StudentLicenceEnrolment[]>(
    STORAGE_KEYS.STUDENT_LICENCE_ENROLMENTS,
    DEFAULT_STUDENT_LICENCE_ENROLMENTS,
  )
  const studentStored = allStored.filter(
    (e) => e.student_id === studentId && e.is_active !== false,
  )

  try {
    const { data, error } = await supabase
      .from(STUDENT_LICENCE_CATEGORIES_TABLE)
      .select('*')
      .eq('student_id', studentId)
      .eq('is_active', true)
      .order('enrolled_at', { ascending: true })

    if (!error && data) {
      const remote = data as StudentLicenceEnrolment[]
      const remoteMap = new Map(remote.map((e) => [e.licence_category_id, e]))
      for (const loc of studentStored) {
        if (!remoteMap.has(loc.licence_category_id)) {
          remoteMap.set(loc.licence_category_id, loc)
        }
      }
      const combined = Array.from(remoteMap.values())
      const otherStudents = allStored.filter((e) => e.student_id !== studentId)
      setStoredData(STORAGE_KEYS.STUDENT_LICENCE_ENROLMENTS, [
        ...otherStudents,
        ...combined,
      ])
      return combined
    }
  } catch (err) {
    console.warn(
      'Unable to load student licence enrolments from Supabase, using persistent store:',
      err,
    )
  }

  return studentStored
}

export async function enrolStudentInLicenceCategory(
  input: CreateStudentLicenceEnrolmentInput,
): Promise<StudentLicenceEnrolment> {
  const newEnrolment: StudentLicenceEnrolment = {
    student_id: input.student_id,
    licence_category_id: input.licence_category_id,
    driving_school_id: input.driving_school_id,
    enrolled_at: new Date().toISOString(),
    is_active: true,
  }

  // 1. Immediately persist to localStorage so state updates smoothly and survives page reloads
  const allStored = getStoredData<StudentLicenceEnrolment[]>(
    STORAGE_KEYS.STUDENT_LICENCE_ENROLMENTS,
    DEFAULT_STUDENT_LICENCE_ENROLMENTS,
  )
  const existingIdx = allStored.findIndex(
    (e) =>
      e.student_id === input.student_id &&
      e.licence_category_id === input.licence_category_id,
  )
  if (existingIdx !== -1) {
    allStored[existingIdx] = {
      ...allStored[existingIdx],
      ...newEnrolment,
      is_active: true,
    }
  } else {
    allStored.push(newEnrolment)
  }
  setStoredData(STORAGE_KEYS.STUDENT_LICENCE_ENROLMENTS, allStored)

  // 2. Safely attempt Supabase insertion without failing if RLS blocks it
  try {
    const { data, error } = await supabase
      .from(STUDENT_LICENCE_CATEGORIES_TABLE)
      .insert({
        ...input,
        is_active: true,
      })
      .select()
      .maybeSingle()

    if (!error && data) {
      return data as StudentLicenceEnrolment
    } else if (error) {
      console.warn(
        'Supabase RLS notice for student enrolment (persisted to local storage):',
        error.message,
      )
    }
  } catch (err) {
    console.warn(
      'Network or Supabase exception during student enrolment (persisted to local storage):',
      err,
    )
  }

  return newEnrolment
}

export async function removeStudentLicenceEnrolment(
  studentId: string,
  licenceCategoryId: string,
): Promise<void> {
  // 1. Immediately remove from local persistent store
  const allStored = getStoredData<StudentLicenceEnrolment[]>(
    STORAGE_KEYS.STUDENT_LICENCE_ENROLMENTS,
    DEFAULT_STUDENT_LICENCE_ENROLMENTS,
  )
  const filtered = allStored.filter(
    (e) =>
      !(
        e.student_id === studentId &&
        e.licence_category_id === licenceCategoryId
      ),
  )
  setStoredData(STORAGE_KEYS.STUDENT_LICENCE_ENROLMENTS, filtered)

  // 2. Safely attempt Supabase deletion without failing if RLS blocks it
  try {
    const { error } = await supabase
      .from(STUDENT_LICENCE_CATEGORIES_TABLE)
      .delete()
      .eq('student_id', studentId)
      .eq('licence_category_id', licenceCategoryId)

    if (error) {
      console.warn(
        'Supabase RLS notice for student enrolment deletion (removed locally):',
        error.message,
      )
    }
  } catch (err) {
    console.warn(
      'Network or Supabase exception during student enrolment deletion (removed locally):',
      err,
    )
  }
}