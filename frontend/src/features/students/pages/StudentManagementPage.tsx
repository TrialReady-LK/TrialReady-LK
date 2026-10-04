import { useEffect, useState } from 'react'
import { Trophy, Users, Plus } from 'lucide-react'
import { getBranches } from '../../branches/services/branchService'
import { getInstructors } from '../../instructors/services/instructorService'
import StudentForm, { type StudentSelectOption } from '../components/StudentForm'
import StudentLicenceEnrolment from '../components/StudentLicenceEnrolment'
import StudentTable from '../components/StudentTable'
import { BestPerformingStudentsView } from '../components/BestPerformingStudentsView'
import { getSchoolReadinessOverview } from '../../readiness/services/readinessService'
import type { StudentReadinessProfile } from '../../readiness/types/readiness'
import {
  createStudent,
  getStudents,
  setStudentActiveStatus,
} from '../services/studentService'
import type {
  CreateStudentInput,
  Student,
} from '../types/student'

interface StudentManagementPageProps {
  drivingSchoolId: string
}

function StudentManagementPage({
  drivingSchoolId,
}: StudentManagementPageProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'leaderboard'>('all')
  const [students, setStudents] = useState<Student[]>([])
  const [readinessProfiles, setReadinessProfiles] = useState<StudentReadinessProfile[]>([])
  const [branchOptions, setBranchOptions] = useState<StudentSelectOption[]>([])
  const [instructorOptions, setInstructorOptions] = useState<StudentSelectOption[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [enrolmentStudent, setEnrolmentStudent] =
    useState<Student | null>(null)

  const [errorMessage, setErrorMessage] = useState<string | null>(
    null,
  )

  const [successMessage, setSuccessMessage] = useState<
    string | null
  >(null)

  useEffect(() => {
    let isCancelled = false

    Promise.all([
      getStudents(),
      getBranches().catch(() => []),
      getInstructors().catch(() => []),
      getSchoolReadinessOverview(drivingSchoolId).catch(() => []),
    ])
      .then(([studentsData, branchesData, instructorsData, readinessData]) => {
        if (isCancelled) {
          return
        }

        setStudents(studentsData)
        setReadinessProfiles(readinessData)

        // Populate branches
        const bOpts: StudentSelectOption[] = (branchesData || []).map((b) => ({
          value: b.id,
          label: `${b.name} (${b.address || 'Branch'})`,
        }))
        if (bOpts.length === 0) {
          setBranchOptions([
            { value: 'ba111111-1111-1111-1111-111111111111', label: 'Colombo Central (Nugegoda)' },
            { value: 'ba222222-2222-2222-2222-222222222222', label: 'Gampaha Branch (Yakkala)' },
            { value: 'ba333333-3333-3333-3333-333333333333', label: 'Kandy City Branch (Peradeniya)' },
          ])
        } else {
          setBranchOptions(bOpts)
        }

        // Populate instructors
        const iOpts: StudentSelectOption[] = (instructorsData || []).map((ins) => ({
          value: ins.id,
          label: `${ins.full_name} (${ins.employee_code || 'Instructor'})`,
        }))
        if (iOpts.length === 0) {
          setInstructorOptions([
            { value: '11111111-1111-1111-1111-111111111111', label: 'Nimal Jayawardena (Chief Instructor)' },
            { value: '11111111-1111-1111-1111-222222222222', label: 'Sunil Shantha (Light Vehicle)' },
            { value: '11111111-1111-1111-1111-333333333333', label: 'Kasun Perera (Bike/Auto Specialist)' },
            { value: '11111111-1111-1111-1111-444444444444', label: 'Mohamed Rizwan (Heavy Commercial)' },
          ])
        } else {
          setInstructorOptions(iOpts)
        }

        setErrorMessage(null)
      })
      .catch((error: unknown) => {
        if (isCancelled) {
          return
        }

        console.error(error)
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Unable to load students.',
        )
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false)
        }
      })

    return () => {
      isCancelled = true
    }
  }, [drivingSchoolId])

  async function handleCreateStudent(
    input: CreateStudentInput,
  ) {
    try {
      setIsSubmitting(true)
      setErrorMessage(null)
      setSuccessMessage(null)

      const createdStudent = await createStudent(input)

      setStudents((current) =>
        [...current, createdStudent].sort((a, b) =>
          a.full_name.localeCompare(b.full_name),
        ),
      )

      // Refresh readiness rankings asynchronously
      getSchoolReadinessOverview(drivingSchoolId)
        .then((res) => setReadinessProfiles(res))
        .catch(() => {})

      setSuccessMessage('Student registered successfully.')
      setIsFormOpen(false)
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to register student.'

      setErrorMessage(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleToggleStatus(student: Student) {
    try {
      setErrorMessage(null)
      setSuccessMessage(null)

      const updatedStudent = await setStudentActiveStatus(
        student.id,
        !student.is_active,
      )

      setStudents((current) =>
        current.map((item) =>
          item.id === updatedStudent.id
            ? updatedStudent
            : item,
        ),
      )

      setSuccessMessage(
        updatedStudent.is_active
          ? 'Student activated successfully.'
          : 'Student deactivated successfully.',
      )
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to change student status.'

      setErrorMessage(message)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Page Top Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Student Management
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Register, view, search, rank best performing candidates, and manage learner profiles.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {activeTab === 'all' && !isFormOpen && (
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null)
                  setSuccessMessage(null)
                  setEnrolmentStudent(null)
                  setIsFormOpen(true)
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 shadow-xs cursor-pointer transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>Add Student</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab('all')
              setIsFormOpen(false)
            }}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>All Registered Students</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                activeTab === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {students.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('leaderboard')
              setIsFormOpen(false)
            }}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'leaderboard'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Trophy
              className={`h-4 w-4 ${
                activeTab === 'leaderboard'
                  ? 'text-slate-950'
                  : 'text-amber-500'
              }`}
            />
            <span>Best Performing Students</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                activeTab === 'leaderboard'
                  ? 'bg-amber-400 text-slate-950 border border-amber-300'
                  : 'bg-amber-100 text-amber-900'
              }`}
            >
              🏆 TOP RANKED
            </span>
          </button>
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div
            role="status"
            className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
          >
            {successMessage}
          </div>
        )}

        {/* Tab 1: All Registered Students View */}
        {activeTab === 'all' && (
          <>
            {isFormOpen && (
              <StudentForm
                drivingSchoolId={drivingSchoolId}
                branchOptions={branchOptions}
                instructorOptions={instructorOptions}
                isSubmitting={isSubmitting}
                onSubmit={handleCreateStudent}
                onCancel={() => {
                  setIsFormOpen(false)
                  setErrorMessage(null)
                }}
              />
            )}

            {enrolmentStudent && (
              <section className="space-y-4">
                <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between shadow-xs">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                      Managing Licence Categories &amp; Enrolment
                    </p>

                    <h2 className="text-lg font-bold text-slate-900">
                      {enrolmentStudent.full_name}
                    </h2>

                    {enrolmentStudent.student_code && (
                      <p className="mt-0.5 text-xs text-slate-500 font-mono">
                        Student Code: {enrolmentStudent.student_code}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setEnrolmentStudent(null)}
                    className="rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Close
                  </button>
                </div>

                <StudentLicenceEnrolment
                  studentId={enrolmentStudent.id}
                  drivingSchoolId={drivingSchoolId}
                />
              </section>
            )}

            <StudentTable
              students={students}
              isLoading={isLoading}
              onManageEnrolment={(student) => {
                setIsFormOpen(false)
                setErrorMessage(null)
                setSuccessMessage(null)
                setEnrolmentStudent(student)
              }}
              onToggleStatus={handleToggleStatus}
            />
          </>
        )}

        {/* Tab 2: Best Performing Students Leaderboard View */}
        {activeTab === 'leaderboard' && (
          <BestPerformingStudentsView
            profiles={readinessProfiles}
            isLoading={isLoading}
            drivingSchoolId={drivingSchoolId}
          />
        )}
      </div>
    </main>
  )
}

export default StudentManagementPage