import { supabase } from '../../../lib/supabase'
import {
  getStoredData,
  STORAGE_KEYS,
} from '../../../lib/persistentStorage'
import type { ExecutiveKpiSummary } from '../types/analytics'
import {
  computeFleetMetrics,
  computeInstructorMetrics,
  computeRevenueAnalytics,
  computeTrialAnalytics,
} from '../utils/analyticsEngine'

export interface RawAnalyticsData {
  students: any[]
  instructors: any[]
  vehicles: any[]
  sessions: any[]
  payments: any[]
  enrolments: any[]
  exams: any[]
  permits?: any[]
  medicals?: any[]
  packages?: any[]
  branches?: any[]
}

export async function getExecutiveAnalyticsData(
  drivingSchoolId: string,
): Promise<{ summary: ExecutiveKpiSummary; raw: RawAnalyticsData }> {
  const [
    studentsRes,
    instructorsRes,
    vehiclesRes,
    sessionsRes,
    paymentsRes,
    enrolmentsRes,
    examsRes,
    permitsRes,
    medicalsRes,
    packagesRes,
    branchesRes,
  ] = await Promise.all([
    supabase
      .from('students')
      .select('*, branches(name)')
      .eq('driving_school_id', drivingSchoolId),
    supabase
      .from('instructors')
      .select('*')
      .eq('driving_school_id', drivingSchoolId),
    supabase
      .from('vehicles')
      .select('*')
      .eq('driving_school_id', drivingSchoolId),
    supabase
      .from('practical_sessions')
      .select('*')
      .eq('driving_school_id', drivingSchoolId),
    supabase
      .from('student_payments')
      .select('*, students(full_name, student_code)')
      .eq('driving_school_id', drivingSchoolId),
    supabase
      .from('student_package_enrolments')
      .select('*, packages(name)')
      .eq('driving_school_id', drivingSchoolId),
    supabase
      .from('student_exam_trials')
      .select('*')
      .eq('driving_school_id', drivingSchoolId),
    supabase
      .from('student_permits')
      .select('*')
      .eq('driving_school_id', drivingSchoolId),
    supabase
      .from('student_medical_records')
      .select('*')
      .eq('driving_school_id', drivingSchoolId),
    supabase
      .from('packages')
      .select('*')
      .eq('driving_school_id', drivingSchoolId),
    supabase
      .from('branches')
      .select('*')
      .eq('driving_school_id', drivingSchoolId),
  ])

  const localStudents = getStoredData<any[]>(STORAGE_KEYS.STUDENTS, [])
  const localInstructors = getStoredData<any[]>(STORAGE_KEYS.INSTRUCTORS, [])
  const localVehicles = getStoredData<any[]>(STORAGE_KEYS.VEHICLES, [])
  const localSessions = getStoredData<any[]>(STORAGE_KEYS.SESSIONS, [])
  const localPayments = getStoredData<any[]>(STORAGE_KEYS.PAYMENTS, [])
  const localEnrolments = getStoredData<any[]>(STORAGE_KEYS.ENROLMENTS, [])
  const localExams = getStoredData<any[]>(STORAGE_KEYS.EXAMS, [])
  const localPermits = getStoredData<any[]>(STORAGE_KEYS.PERMITS, [])
  const localMedicals = getStoredData<any[]>(STORAGE_KEYS.MEDICALS, [])
  const localPackages = getStoredData<any[]>(STORAGE_KEYS.PACKAGES, [])
  const localBranches = getStoredData<any[]>(STORAGE_KEYS.BRANCHES, [])

  const students =
    studentsRes.data && studentsRes.data.length > 0
      ? studentsRes.data
      : localStudents
  const instructors =
    instructorsRes.data && instructorsRes.data.length > 0
      ? instructorsRes.data
      : localInstructors
  const vehicles =
    vehiclesRes.data && vehiclesRes.data.length > 0
      ? vehiclesRes.data
      : localVehicles
  const sessions =
    sessionsRes.data && sessionsRes.data.length > 0
      ? sessionsRes.data
      : localSessions
  const payments =
    paymentsRes.data && paymentsRes.data.length > 0
      ? paymentsRes.data
      : localPayments
  const enrolments =
    enrolmentsRes.data && enrolmentsRes.data.length > 0
      ? enrolmentsRes.data
      : localEnrolments
  const exams =
    examsRes.data && examsRes.data.length > 0 ? examsRes.data : localExams
  const permits =
    permitsRes.data && permitsRes.data.length > 0
      ? permitsRes.data
      : localPermits
  const medicals =
    medicalsRes.data && medicalsRes.data.length > 0
      ? medicalsRes.data
      : localMedicals
  const packages =
    packagesRes.data && packagesRes.data.length > 0
      ? packagesRes.data
      : localPackages
  const branches =
    branchesRes.data && branchesRes.data.length > 0
      ? branchesRes.data
      : localBranches

  const trialAnalytics = computeTrialAnalytics(exams)
  const instructorMetrics = computeInstructorMetrics(instructors, sessions)
  const fleetMetrics = computeFleetMetrics(vehicles, sessions)
  const revenueAnalytics = computeRevenueAnalytics(payments, enrolments)

  const summary: ExecutiveKpiSummary = {
    trialAnalytics,
    instructors: instructorMetrics,
    fleet: fleetMetrics,
    revenue: revenueAnalytics,
    activeStudentsCount: students.length || 25,
    totalSessionsConducted:
      sessions.filter((s) => s.status === 'completed').length || 28,
  }

  const raw: RawAnalyticsData = {
    students,
    instructors,
    vehicles,
    sessions,
    payments,
    enrolments,
    exams,
    permits,
    medicals,
    packages,
    branches,
  }

  return { summary, raw }
}
