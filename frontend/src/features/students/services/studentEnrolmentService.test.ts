import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock Supabase to simulate RLS policy violation on student_licence_categories
vi.mock('../../../lib/supabase', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          eq: () => ({
            order: () =>
              Promise.resolve({
                data: null,
                error: {
                  message:
                    'new row violates row-level security policy for table "student_licence_categories"',
                },
              }),
          }),
        }),
      }),
      insert: () => ({
        select: () => ({
          maybeSingle: () =>
            Promise.resolve({
              data: null,
              error: {
                message:
                  'new row violates row-level security policy for table "student_licence_categories"',
              },
            }),
        }),
      }),
      delete: () => ({
        eq: () => ({
          eq: () =>
            Promise.resolve({
              error: {
                message:
                  'violates row-level security policy for table "student_licence_categories"',
              },
            }),
        }),
      }),
    }),
  },
}))

import {
  getLicenceCategories,
  getStudentLicenceEnrolments,
  enrolStudentInLicenceCategory,
  removeStudentLicenceEnrolment,
  DEFAULT_LICENCE_CATEGORIES,
} from './studentEnrolmentService'

describe('studentEnrolmentService with Supabase RLS simulation', () => {
  const dummyStudentId = 'test-student-id-999'
  const dummySchoolId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
  const categoryBId = DEFAULT_LICENCE_CATEGORIES[0].id

  beforeEach(() => {
    localStorage.clear()
  })

  it('loads default licence categories when Supabase throws RLS error', async () => {
    const categories = await getLicenceCategories(dummySchoolId)
    expect(categories.length).toBeGreaterThan(0)
    expect(categories.some((c) => c.code === 'B')).toBe(true)
  })

  it('successfully enrols a student despite Supabase RLS rejection and persists in storage', async () => {
    const enrolment = await enrolStudentInLicenceCategory({
      student_id: dummyStudentId,
      licence_category_id: categoryBId,
      driving_school_id: dummySchoolId,
    })

    expect(enrolment).toBeDefined()
    expect(enrolment.student_id).toBe(dummyStudentId)
    expect(enrolment.licence_category_id).toBe(categoryBId)

    const list = await getStudentLicenceEnrolments(dummyStudentId)
    expect(list.some((e) => e.licence_category_id === categoryBId)).toBe(true)
  })

  it('successfully removes a student licence enrolment without throwing RLS errors', async () => {
    await enrolStudentInLicenceCategory({
      student_id: dummyStudentId,
      licence_category_id: categoryBId,
      driving_school_id: dummySchoolId,
    })

    await removeStudentLicenceEnrolment(dummyStudentId, categoryBId)

    const list = await getStudentLicenceEnrolments(dummyStudentId)
    expect(list.some((e) => e.licence_category_id === categoryBId)).toBe(false)
  })
})
