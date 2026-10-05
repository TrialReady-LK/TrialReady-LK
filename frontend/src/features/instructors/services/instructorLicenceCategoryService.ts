import { supabase } from '../../../lib/supabase'
import {
  getStoredData,
  setStoredData,
  mergeAndStoreList,
  STORAGE_KEYS,
} from '../../../lib/persistentStorage'
import { DEFAULT_LICENCE_CATEGORIES } from '../../students/services/studentEnrolmentService'
import type {
  AssignInstructorLicenceCategoryInput,
  InstructorLicenceCategory,
  InstructorLicenceCategoryWithDetails,
  LicenceCategory,
} from '../types/instructorLicenceCategory'

const LICENCE_CATEGORIES_TABLE = 'licence_categories'
const INSTRUCTOR_LICENCE_CATEGORIES_TABLE = 'instructor_licence_categories'

export const DEFAULT_INSTRUCTOR_LICENCE_CATEGORIES: InstructorLicenceCategoryWithDetails[] =
  [
    {
      instructor_id: 'd41f8a29-7c3e-4b95-a841-3b7c89f10001',
      licence_category_id: 'c1a789c2-5d41-4e89-9b12-8f7a63450001',
      driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      created_at: '2026-08-01T00:00:00Z',
      licence_category: {
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
    },
    {
      instructor_id: 'd41f8a29-7c3e-4b95-a841-3b7c89f10001',
      licence_category_id: 'c1a789c2-5d41-4e89-9b12-8f7a63450002',
      driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      created_at: '2026-08-01T00:00:00Z',
      licence_category: {
        id: 'c1a789c2-5d41-4e89-9b12-8f7a63450002',
        driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        code: 'B1',
        name: 'Light Motor Cycle & Three Wheeler',
        description: 'Motor tricycles and light motorcycles',
        is_active: true,
        created_at: '2026-08-01T00:00:00Z',
        updated_at: '2026-08-01T00:00:00Z',
      },
    },
    {
      instructor_id: 'd41f8a29-7c3e-4b95-a841-3b7c89f10002',
      licence_category_id: 'c1a789c2-5d41-4e89-9b12-8f7a63450001',
      driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      created_at: '2026-08-01T00:00:00Z',
      licence_category: {
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
    },
  ]

export async function getActiveLicenceCategories(
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

export async function getInstructorLicenceCategories(
  instructorId: string,
  drivingSchoolId: string,
): Promise<InstructorLicenceCategoryWithDetails[]> {
  const allStored = getStoredData<InstructorLicenceCategoryWithDetails[]>(
    STORAGE_KEYS.INSTRUCTOR_LICENCE_CATEGORIES,
    DEFAULT_INSTRUCTOR_LICENCE_CATEGORIES,
  )
  const instructorStored = allStored.filter(
    (item) => item.instructor_id === instructorId,
  )

  try {
    const { data, error } = await supabase
      .from(INSTRUCTOR_LICENCE_CATEGORIES_TABLE)
      .select(`
        instructor_id,
        licence_category_id,
        driving_school_id,
        created_at,
        licence_category:licence_categories (
          id,
          driving_school_id,
          code,
          name,
          description,
          is_active,
          created_at,
          updated_at
        )
      `)
      .eq('instructor_id', instructorId)
      .eq('driving_school_id', drivingSchoolId)

    if (!error && data) {
      const remote = (data ??
        []) as unknown as InstructorLicenceCategoryWithDetails[]
      const remoteMap = new Map(
        remote.map((item) => [item.licence_category_id, item]),
      )

      for (const loc of instructorStored) {
        if (!remoteMap.has(loc.licence_category_id)) {
          remoteMap.set(loc.licence_category_id, loc)
        }
      }

      const combined = Array.from(remoteMap.values()).sort((first, second) =>
        first.licence_category.code.localeCompare(
          second.licence_category.code,
        ),
      )

      const otherStored = allStored.filter(
        (item) => item.instructor_id !== instructorId,
      )
      setStoredData(STORAGE_KEYS.INSTRUCTOR_LICENCE_CATEGORIES, [
        ...otherStored,
        ...combined,
      ])
      return combined
    }
  } catch (err) {
    console.warn(
      'Unable to load instructor licence categories from Supabase, using persistent store:',
      err,
    )
  }

  return instructorStored.sort((first, second) =>
    first.licence_category.code.localeCompare(second.licence_category.code),
  )
}

export async function assignInstructorLicenceCategory(
  input: AssignInstructorLicenceCategoryInput,
): Promise<InstructorLicenceCategory> {
  const categories = getStoredData<LicenceCategory[]>(
    STORAGE_KEYS.LICENCE_CATEGORIES,
    DEFAULT_LICENCE_CATEGORIES,
  )
  const matchedCategory = categories.find(
    (c) => c.id === input.licence_category_id,
  ) || {
    id: input.licence_category_id,
    driving_school_id: input.driving_school_id,
    code: 'B',
    name: 'Licence Category',
    description: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const newAssignment: InstructorLicenceCategoryWithDetails = {
    ...input,
    created_at: new Date().toISOString(),
    licence_category: matchedCategory,
  }

  // 1. Immediately persist to localStorage
  const allStored = getStoredData<InstructorLicenceCategoryWithDetails[]>(
    STORAGE_KEYS.INSTRUCTOR_LICENCE_CATEGORIES,
    DEFAULT_INSTRUCTOR_LICENCE_CATEGORIES,
  )
  const existingIdx = allStored.findIndex(
    (item) =>
      item.instructor_id === input.instructor_id &&
      item.licence_category_id === input.licence_category_id,
  )
  if (existingIdx !== -1) {
    allStored[existingIdx] = newAssignment
  } else {
    allStored.push(newAssignment)
  }
  setStoredData(STORAGE_KEYS.INSTRUCTOR_LICENCE_CATEGORIES, allStored)

  // 2. Safely attempt Supabase insertion
  try {
    const { data, error } = await supabase
      .from(INSTRUCTOR_LICENCE_CATEGORIES_TABLE)
      .insert(input)
      .select('*')
      .maybeSingle()

    if (!error && data) {
      return data as InstructorLicenceCategory
    } else if (error) {
      console.warn(
        'Supabase RLS notice for instructor licence category assignment (saved locally):',
        error.message,
      )
    }
  } catch (err) {
    console.warn(
      'Network or Supabase exception during instructor licence category assignment (saved locally):',
      err,
    )
  }

  return newAssignment
}

export async function removeInstructorLicenceCategory(
  instructorId: string,
  licenceCategoryId: string,
  drivingSchoolId: string,
): Promise<void> {
  // 1. Immediately remove from local persistent store
  const allStored = getStoredData<InstructorLicenceCategoryWithDetails[]>(
    STORAGE_KEYS.INSTRUCTOR_LICENCE_CATEGORIES,
    DEFAULT_INSTRUCTOR_LICENCE_CATEGORIES,
  )
  const filtered = allStored.filter(
    (item) =>
      !(
        item.instructor_id === instructorId &&
        item.licence_category_id === licenceCategoryId
      ),
  )
  setStoredData(STORAGE_KEYS.INSTRUCTOR_LICENCE_CATEGORIES, filtered)

  // 2. Safely attempt Supabase deletion
  try {
    const { error } = await supabase
      .from(INSTRUCTOR_LICENCE_CATEGORIES_TABLE)
      .delete()
      .eq('instructor_id', instructorId)
      .eq('licence_category_id', licenceCategoryId)
      .eq('driving_school_id', drivingSchoolId)

    if (error) {
      console.warn(
        'Supabase RLS notice for instructor licence category removal (removed locally):',
        error.message,
      )
    }
  } catch (err) {
    console.warn(
      'Network or Supabase exception during instructor licence category removal (removed locally):',
      err,
    )
  }
}