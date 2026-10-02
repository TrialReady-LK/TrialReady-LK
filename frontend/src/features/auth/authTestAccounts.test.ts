import { describe, expect, it } from 'vitest'
import {
  SYSTEM_TEST_ACCOUNTS,
  getPortalRouteForRole,
} from './constants/testAccounts'
import type { AppRole } from './types/auth'

describe('TrialReady-LK Dedicated Test Accounts Verification', () => {
  it('defines valid, distinct test accounts for all 3 system roles', () => {
    const roles: AppRole[] = ['administrator', 'instructor', 'student']

    roles.forEach((role) => {
      const account = SYSTEM_TEST_ACCOUNTS[role]
      expect(account).toBeDefined()
      expect(account.role).toBe(role)
      expect(account.email).toContain('@')
      expect(account.password.length).toBeGreaterThan(6)
      expect(account.profileId).toBeDefined()
      expect(account.portalPath).toBeDefined()
      expect(account.name).toBeTruthy()
    })
  })

  it('configures the Admin test account with master academy parameters', () => {
    const admin = SYSTEM_TEST_ACCOUNTS.administrator
    expect(admin.email).toBe('admin@drivingschool.lk')
    expect(admin.password).toBe('Admin@123')
    expect(admin.portalPath).toBe('/dashboard')
    expect(admin.profileId).toBe('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11')
    expect(admin.name).toContain('Admin')
  })

  it('configures the Instructor test account with Nimal Jayawardena database persona', () => {
    const instructor = SYSTEM_TEST_ACCOUNTS.instructor
    expect(instructor.email).toBe('instructor@drivingschool.lk')
    expect(instructor.password).toBe('Instructor@123')
    expect(instructor.portalPath).toBe('/instructor/portal')
    expect(instructor.profileId).toBe('11111111-1111-1111-1111-111111111111')
    expect(instructor.name).toBe('Nimal Jayawardena')
  })

  it('configures the Student test account with Amaya Fernando database persona', () => {
    const student = SYSTEM_TEST_ACCOUNTS.student
    expect(student.email).toBe('student@drivingschool.lk')
    expect(student.password).toBe('Student@123')
    expect(student.portalPath).toBe('/student/portal')
    expect(student.profileId).toBe('33333333-3333-3333-3333-111111111111')
    expect(student.name).toBe('Amaya Fernando')
  })

  it('correctly maps roles to their designated portal routes via getPortalRouteForRole', () => {
    expect(getPortalRouteForRole('administrator')).toBe('/dashboard')
    expect(getPortalRouteForRole('instructor')).toBe('/instructor/portal')
    expect(getPortalRouteForRole('student')).toBe('/student/portal')
  })
})
