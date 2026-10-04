import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  FileText,
  Activity,
  BookOpen,
  Car,
  Ticket,
  Printer,
  CreditCard,
  Edit3,
  Save,
  X,
  Key,
} from 'lucide-react'
import { useAuth } from '../../../auth/context/AuthContext'
import { DmtLogbookModal } from '../../../logbook/components/DmtLogbookModal'
import { DmtTrialSlipModal } from '../../../logbook/components/DmtTrialSlipModal'
import { useStudentLogbook } from '../../../logbook/hooks/useStudentLogbook'
import { calculatePermitValidity } from '../../../journey/utils/journeyUtils'
import { StudentPaymentsSection } from '../components/StudentPaymentsSection'
import { useStudentPortal } from '../hooks/useStudentPortal'
import { getStoredData, setStoredData, STORAGE_KEYS } from '../../../../lib/persistentStorage'

interface StudentProfilePageProps {
  drivingSchoolId: string
  studentId?: string
}

export const StudentProfilePage: React.FC<StudentProfilePageProps> = ({
  drivingSchoolId,
  studentId,
}) => {
  const { studentId: paramStudentId } = useParams<{ studentId: string }>()
  const { profile, role } = useAuth()
  const isInstructor = role === 'instructor'
  const effectiveStudentId =
    studentId ||
    paramStudentId ||
    (role === 'student' ? profile?.id || '11111111-1111-1111-1111-111111111111' : undefined)

  const {
    journey,
    ledger,
    completedSessionsCount,
    isLoading,
    errorMessage,
    reloadData,
  } = useStudentPortal(drivingSchoolId, effectiveStudentId)

  const activeStudentId = effectiveStudentId || journey?.student?.id || ''
  const { logbookData, getTrialSlipData } = useStudentLogbook(
    drivingSchoolId,
    activeStudentId,
  )

  const [activeTab, setActiveTab] = useState<
    'personal' | 'security' | 'learner' | 'financials'
  >('personal')

  // Modals
  const [showLogbook, setShowLogbook] = useState(false)
  const [showTrialSlip, setShowTrialSlip] = useState(false)

  // Security tab state
  const [showPassword, setShowPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('Student@123')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  // Personal info edit state
  const [isEditingPersonal, setIsEditingPersonal] = useState(false)
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [emergencyContact, setEmergencyContact] = useState('')
  const [emergencyPhone, setEmergencyPhone] = useState('')
  const [personalSaveSuccess, setPersonalSaveSuccess] = useState<string | null>(null)

  // Initialize editable fields from journey or stored student
  React.useEffect(() => {
    if (journey?.student) {
      const localStudents = getStoredData<any[]>(STORAGE_KEYS.STUDENTS, [])
      const matched = localStudents.find((s) => s.id === journey.student.id)

      setPhone(matched?.phone || journey.student.phone || '+94 77 456 7890')
      setEmail(matched?.email || journey.student.email || 'amaya.fernando@gmail.com')
      setAddress(matched?.address || 'No. 45/2 Galle Road, Colombo 03, Sri Lanka')
      setEmergencyContact(
        matched?.emergency_contact_name || 'Dr. Rohan Fernando (Father)',
      )
      setEmergencyPhone(matched?.emergency_contact_phone || '+94 71 987 6543')
    }
  }, [journey])

  const handleSavePersonal = (e: React.FormEvent) => {
    e.preventDefault()
    if (!journey?.student) return

    const localStudents = getStoredData<any[]>(STORAGE_KEYS.STUDENTS, [])
    const updatedList = localStudents.map((s) => {
      if (s.id === journey.student.id) {
        return {
          ...s,
          phone,
          email,
          address,
          emergency_contact_name: emergencyContact,
          emergency_contact_phone: emergencyPhone,
          updated_at: new Date().toISOString(),
        }
      }
      return s
    })

    setStoredData(STORAGE_KEYS.STUDENTS, updatedList)
    setIsEditingPersonal(false)
    setPersonalSaveSuccess('Personal contact details updated successfully!')
    setTimeout(() => setPersonalSaveSuccess(null), 4000)
    void reloadData()
  }

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError(null)
    setPasswordSuccess(null)

    if (!newPassword || newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.')
      return
    }

    setCurrentPassword(newPassword)
    setNewPassword('')
    setConfirmPassword('')
    setIsChangingPassword(false)
    setPasswordSuccess('Password updated successfully! Keep your credentials safe.')
    setTimeout(() => setPasswordSuccess(null), 5000)
  }

  if (isLoading) {
    return (
      <div className="flex h-72 items-center justify-center rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-xs font-medium text-slate-500">
            Loading your profile &amp; account details...
          </p>
        </div>
      </div>
    )
  }

  if (!journey) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center space-y-3">
        <p className="text-sm font-bold text-slate-800">
          Student profile not found.
        </p>
        <Link
          to="/student/portal"
          className="inline-block rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
        >
          ← Return to Student Portal
        </Link>
      </div>
    )
  }

  const student = journey.student
  const permit = journey.permit
  const medical = journey.medical
  const passedTheory = journey.theoryExams.find((e) => e.status === 'passed')
  const passedTrial = journey.practicalTrials.find((t) => t.status === 'passed')
  const permitVal = calculatePermitValidity(permit?.expiry_date)

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="rounded-3xl border border-slate-200 bg-linear-to-br from-slate-900 via-slate-800 to-blue-950 p-6 text-white shadow-xl sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-blue-600 text-2xl sm:text-3xl font-black text-white shadow-lg border-2 border-white/20">
              {student.full_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  {student.full_name}
                </h1>
                <span className="rounded-full bg-emerald-400/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-400/30">
                  ● Verified Learner
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-300">
                Admission: <strong className="font-mono text-white">{student.admission_number}</strong> • Registered: {student.registration_date}
              </p>
              <p className="text-xs text-blue-300 mt-0.5">
                {student.branch_name || 'Colombo Central (Nugegoda Branch)'} • Class B Dual Combo
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              to={role === 'student' ? '/student/portal' : role === 'instructor' ? '/instructor/portal' : '/students'}
              className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/20 transition-all cursor-pointer"
            >
              {role === 'student' ? '← Back to Portal' : '← Back'}
            </Link>
            <Link
              to={role === 'student' ? '/student/journey' : `/students/${student.id}/journey`}
              className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-lg hover:bg-blue-500 transition-all cursor-pointer"
            >
              Full Journey Roadmap →
            </Link>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-white/10 pt-4">
          <button
            type="button"
            onClick={() => setActiveTab('personal')}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'personal'
                ? 'bg-white text-slate-900 shadow-md'
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            <User className="h-3.5 w-3.5" />
            <span>Personal Information</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'security'
                ? 'bg-white text-slate-900 shadow-md'
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            <Shield className="h-3.5 w-3.5" />
            <span>Account &amp; Security (Email/Password)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('learner')}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'learner'
                ? 'bg-white text-slate-900 shadow-md'
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            <Car className="h-3.5 w-3.5" />
            <span>DMT Learner Records</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('financials')}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'financials'
                ? 'bg-white text-slate-900 shadow-md'
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            <CreditCard className="h-3.5 w-3.5" />
            <span>Fee &amp; Payments</span>
          </button>
        </div>
      </div>

      {/* Alerts */}
      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700">
          {errorMessage}
        </div>
      )}

      {personalSaveSuccess && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800 font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{personalSaveSuccess}</span>
        </div>
      )}

      {passwordSuccess && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800 font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{passwordSuccess}</span>
        </div>
      )}

      {/* TAB 1: Personal Information */}
      {activeTab === 'personal' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Info Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Student Personal Profile
                </h2>
                <p className="text-xs text-slate-500">
                  {isInstructor
                    ? 'Student identification and contact records (Administration Managed)'
                    : 'Your registered student identification and contact details'}
                </p>
              </div>

              {!isInstructor && !isEditingPersonal ? (
                <button
                  type="button"
                  onClick={() => setIsEditingPersonal(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer shadow-xs"
                >
                  <Edit3 className="h-3.5 w-3.5 text-blue-600" />
                  <span>Edit Contact Details</span>
                </button>
              ) : !isInstructor && isEditingPersonal ? (
                <button
                  type="button"
                  onClick={() => setIsEditingPersonal(false)}
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>Cancel</span>
                </button>
              ) : isInstructor ? (
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600 border border-slate-200">
                  Read-Only View
                </span>
              ) : null}
            </div>

            {isInstructor && (
              <div className="rounded-xl border border-blue-200 bg-blue-50/80 p-3 text-xs text-blue-900 flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-600 shrink-0" />
                <span>
                  <strong>Instructor Policy Notice:</strong> Student personal details and contact records are securely managed by Academy Administration.
                </span>
              </div>
            )}

            {!isInstructor && isEditingPersonal ? (
              <form onSubmit={handleSavePersonal} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Phone / Mobile Number
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Residential Address
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Emergency Contact Person
                    </label>
                    <input
                      type="text"
                      value={emergencyContact}
                      onChange={(e) => setEmergencyContact(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Emergency Contact Phone
                    </label>
                    <input
                      type="text"
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-all cursor-pointer"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>Save Contact Changes</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
                <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                  <span className="text-slate-400 font-medium">Full Legal Name</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">
                    {student.full_name}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                  <span className="text-slate-400 font-medium">Admission Number</span>
                  <p className="font-bold font-mono text-blue-700 text-sm mt-0.5">
                    {student.admission_number}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                  <span className="text-slate-400 font-medium">National Identity Card (NIC)</span>
                  <p className="font-bold font-mono text-slate-900 text-sm mt-0.5">
                    200178401923
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                  <span className="text-slate-400 font-medium">Date of Birth &amp; Age</span>
                  <p className="font-bold text-slate-900 mt-0.5">
                    2001-08-14 (25 Years)
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                  <span className="text-slate-400 font-medium">Contact Phone</span>
                  <p className="font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-blue-600" />
                    <span>{phone}</span>
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                  <span className="text-slate-400 font-medium">Email Address</span>
                  <p className="font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-blue-600" />
                    <span>{email}</span>
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100 sm:col-span-2">
                  <span className="text-slate-400 font-medium">Residential Address</span>
                  <p className="font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-blue-600" />
                    <span>{address}</span>
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100 sm:col-span-2">
                  <span className="text-slate-400 font-medium">Emergency Contact</span>
                  <p className="font-bold text-slate-900 mt-0.5">
                    {emergencyContact} • <strong className="font-mono text-blue-700">{emergencyPhone}</strong>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Academy Affiliation Sidebar Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Driving Academy Affiliation
            </h3>

            <div className="rounded-xl bg-blue-50/50 border border-blue-100 p-4 space-y-3 text-xs">
              <div>
                <span className="text-slate-400 font-medium">Driving Academy</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">
                  Royal Driving Academy (Pvt) Ltd
                </p>
                <p className="text-[11px] text-slate-500 font-mono">
                  DMT Reg: DS-WP-2026-0042
                </p>
              </div>

              <div className="border-t border-blue-100 pt-2">
                <span className="text-slate-400 font-medium">Branch Campus</span>
                <p className="font-bold text-slate-900 mt-0.5">
                  Colombo Central (Nugegoda Branch)
                </p>
              </div>

              <div className="border-t border-blue-100 pt-2">
                <span className="text-slate-400 font-medium">Assigned Primary Instructor</span>
                <p className="font-bold text-blue-700 mt-0.5">
                  Nimal Jayawardena (INS-WP-001)
                </p>
                <p className="text-[11px] text-slate-500 font-mono">
                  +94 77 123 4567
                </p>
              </div>

              <div className="border-t border-blue-100 pt-2">
                <span className="text-slate-400 font-medium">Enrolled Course Package</span>
                <p className="font-bold text-slate-900 mt-0.5">
                  Dual Combo (Car B Manual + Bike A)
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Account & Security (Email & Password) */}
      {activeTab === 'security' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Login Credentials Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 border border-blue-100 text-blue-600">
                <Key className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Login &amp; Security Credentials
                </h2>
                <p className="text-xs text-slate-500">
                  Your platform access email, password, and security details
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              {/* Login Email */}
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 font-medium block">
                    Account Login Email
                  </span>
                  <strong className="text-slate-900 font-mono text-sm mt-0.5 block">
                    {email}
                  </strong>
                  <span className="text-[11px] text-slate-400">
                    Used to sign in to the Student Portal &amp; Mock Exam simulators
                  </span>
                </div>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                  ✔ Verified
                </span>
              </div>

              {/* Login Password */}
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">
                    Current Password
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                  >
                    {showPassword ? (
                      <>
                        <EyeOff className="h-3.5 w-3.5" />
                        <span>Hide</span>
                      </>
                    ) : (
                      <>
                        <Eye className="h-3.5 w-3.5" />
                        <span>Show Password</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg w-full">
                    {showPassword ? currentPassword : '••••••••••••'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Demo Test Credentials for Amaya Fernando: <code className="font-mono text-slate-700 bg-slate-200 px-1 py-0.5 rounded">Student@123</code>
                </p>
              </div>

              {/* Account Role & Access */}
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 font-medium">Account Role</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">
                    Student Learner
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Account Status</span>
                  <p className="font-bold text-emerald-700 text-sm mt-0.5">
                    Active &amp; Enrolled
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Change Password Card / Instructor Policy Card */}
          {isInstructor ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 border border-slate-200 text-slate-600">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Security &amp; Credentials Access Policy
                  </h2>
                  <p className="text-xs text-slate-500">
                    Student account authentication policy
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-xs text-slate-700 space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <Lock className="h-4 w-4 text-slate-600" />
                  <span>Instructor Role Restriction</span>
                </div>
                <p className="leading-relaxed">
                  Student passwords and authentication credentials cannot be modified by instructors. Password resets or login modifications must be performed directly by the student or by Academy Administration.
                </p>
                <div className="rounded-lg bg-blue-50 border border-blue-100 p-3 text-blue-900 text-[11px]">
                  💡 If the student is having trouble logging in, please refer them to school administration or have them use the standard login credential reset procedure.
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 border border-purple-100 text-purple-600">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Change Account Password
                  </h2>
                  <p className="text-xs text-slate-500">
                    Update your security password for portal access
                  </p>
                </div>
              </div>

              {passwordError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                  {passwordError}
                </div>
              )}

              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min. 6 characters)"
                    required
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type new password"
                    required
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-blue-500"
                  />
                </div>

                <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 text-[11px] text-slate-500">
                  <p>
                    🔒 Ensure your password is easy for you to remember but hard for others to guess.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50 transition-all cursor-pointer"
                >
                  Update Password
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DMT Learner Records */}
      {activeTab === 'learner' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* DMT Permits & Medical Status */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <FileText className="h-5 w-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  DMT Government Driving Authorization
                </h3>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-bold border ${permitVal.badgeClass}`}
              >
                {permitVal.label}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                <span className="text-slate-400 font-medium">Permit Number</span>
                <p className="font-bold font-mono text-slate-900 text-sm mt-0.5">
                  {permit?.permit_number || 'WP-992140'}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                <span className="text-slate-400 font-medium">DMT Reference #</span>
                <p className="font-bold font-mono text-slate-700 mt-0.5">
                  {permit?.dmt_reference || 'WER-2026-PER-0042'}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                <span className="text-slate-400 font-medium">Issue Date</span>
                <p className="font-semibold text-slate-800 mt-0.5">
                  {permit?.issue_date || '2026-05-15'}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                <span className="text-slate-400 font-medium">Permit Expiry</span>
                <p className="font-semibold text-slate-800 mt-0.5">
                  {permit?.expiry_date || '2026-11-15'}
                </p>
              </div>
            </div>

            {/* Medical Info */}
            <div className="border-t border-slate-100 pt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Activity className="h-4 w-4 text-emerald-600" />
                  <span>NTMI Medical Fitness Certificate</span>
                </span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                  Fitness Cleared
                </span>
              </div>
              <div className="rounded-xl bg-emerald-50/50 p-3 border border-emerald-100 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 font-medium">Certificate #</span>
                  <p className="font-mono font-bold text-slate-900">
                    {medical?.certificate_number || 'MED-NTMI-9812'}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">NTMI Center</span>
                  <p className="font-bold text-slate-900">
                    {medical?.ntmi_branch || 'Nugegoda NTMI Center'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Exam & Practical Trial Progress */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <BookOpen className="h-5 w-5 text-purple-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Exam Milestones &amp; Trial Readiness
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              {/* Theory Exam */}
              <div className="rounded-xl bg-purple-50/50 p-3.5 border border-purple-100 flex items-center justify-between">
                <div>
                  <span className="text-purple-900 font-bold block">
                    DMT Computerized Theory Exam
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    Passed on {passedTheory?.scheduled_date || '2026-05-20'}
                  </span>
                </div>
                <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-bold text-purple-800 border border-purple-200">
                  Score: {passedTheory?.score || 92}%
                </span>
              </div>

              {/* Practical Lessons */}
              <div className="rounded-xl bg-blue-50/50 p-3.5 border border-blue-100 flex items-center justify-between">
                <div>
                  <span className="text-blue-900 font-bold block">
                    Practical Driving Lessons
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    {completedSessionsCount || 16} Sessions Completed (10 Required)
                  </span>
                </div>
                <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800 border border-blue-200">
                  ✔ Training Complete
                </span>
              </div>

              {/* Practical Trial */}
              <div className="rounded-xl bg-amber-50/50 p-3.5 border border-amber-100 flex items-center justify-between">
                <div>
                  <span className="text-amber-900 font-bold block">
                    DMT Practical Trial Examination
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    Werahera DMT Test Grounds
                  </span>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-bold border ${
                    passedTrial
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      : 'bg-amber-100 text-amber-800 border-amber-200'
                  }`}
                >
                  {passedTrial ? '✔ Trial Passed' : 'Trial Eligible'}
                </span>
              </div>
            </div>

            {/* Official DMT Logbook Print Actions */}
            <div className="border-t border-slate-100 pt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setShowLogbook(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-blue-300 bg-blue-50 px-3.5 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-all cursor-pointer"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>View DMT Logbook</span>
              </button>
              <button
                type="button"
                onClick={() => setShowTrialSlip(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition-all cursor-pointer"
              >
                <Ticket className="h-3.5 w-3.5" />
                <span>Print Trial Pass</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Fee & Payments */}
      {activeTab === 'financials' && (
        <StudentPaymentsSection
          ledger={ledger}
          drivingSchoolId={drivingSchoolId}
          onPaymentRecorded={() => void reloadData()}
        />
      )}

      {/* DMT Modals */}
      {logbookData && (
        <>
          <DmtLogbookModal
            isOpen={showLogbook}
            onClose={() => setShowLogbook(false)}
            data={logbookData}
          />
          {(() => {
            const slipData = getTrialSlipData()
            return slipData ? (
              <DmtTrialSlipModal
                isOpen={showTrialSlip}
                onClose={() => setShowTrialSlip(false)}
                data={slipData}
              />
            ) : null
          })()}
        </>
      )}
    </div>
  )
}

export default StudentProfilePage
