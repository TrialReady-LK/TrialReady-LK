import { useState, type FormEvent, type DragEvent } from 'react'
import { Upload, Trash2, Camera, AlertCircle } from 'lucide-react'
import type { CreateStudentInput, Student } from '../types/student'
import {
  hasStudentValidationErrors,
  normalizeOptionalText,
  validateStudentInput,
  type StudentValidationErrors,
} from '../utils/studentValidation'

export interface StudentSelectOption {
  value: string
  label: string
}

interface StudentFormProps {
  drivingSchoolId: string
  branchOptions?: StudentSelectOption[]
  instructorOptions?: StudentSelectOption[]
  initialStudent?: Student | null
  isSubmitting?: boolean
  onSubmit: (student: CreateStudentInput) => Promise<void> | void
  onCancel?: () => void
}

interface StudentFormState {
  branch_id: string
  primary_instructor_id: string
  student_code: string
  full_name: string
  nic: string
  date_of_birth: string
  phone: string
  email: string
  address: string
  emergency_contact_name: string
  emergency_contact_phone: string
  registration_date: string
  is_active: boolean
}

function getTodayDate(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const initialFormState: StudentFormState = {
  branch_id: '',
  primary_instructor_id: '',
  student_code: '',
  full_name: '',
  nic: '',
  date_of_birth: '',
  phone: '',
  email: '',
  address: '',
  emergency_contact_name: '',
  emergency_contact_phone: '',
  registration_date: getTodayDate(),
  is_active: true,
}

function studentToFormState(student: Student): StudentFormState {
  return {
    branch_id: student.branch_id ?? '',
    primary_instructor_id: student.primary_instructor_id ?? '',
    student_code: student.student_code ?? '',
    full_name: student.full_name,
    nic: student.nic ?? '',
    date_of_birth: student.date_of_birth ?? '',
    phone: student.phone ?? '',
    email: student.email ?? '',
    address: student.address ?? '',
    emergency_contact_name: student.emergency_contact_name ?? '',
    emergency_contact_phone: student.emergency_contact_phone ?? '',
    registration_date: student.registration_date,
    is_active: student.is_active,
  }
}

function StudentForm({
  drivingSchoolId,
  branchOptions = [],
  instructorOptions = [],
  initialStudent = null,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: StudentFormProps) {
  const [form, setForm] = useState<StudentFormState>(() =>
    initialStudent ? studentToFormState(initialStudent) : initialFormState,
  )

  const [errors, setErrors] = useState<StudentValidationErrors>({})
  const [photoUrl, setPhotoUrl] = useState<string>('')
  const [isDraggingPhoto, setIsDraggingPhoto] = useState(false)

  const handlePhotoFile = (file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        setPhotoUrl(e.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  }

  const handlePhotoDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDraggingPhoto(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handlePhotoFile(e.dataTransfer.files[0])
    }
  }

  function updateField<K extends keyof StudentFormState>(
    field: K,
    value: StudentFormState[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const studentInput: CreateStudentInput & { branch_id?: string | null } = {
      driving_school_id: drivingSchoolId,
      branch_id: normalizeOptionalText(form.branch_id),
      primary_instructor_id: normalizeOptionalText(
        form.primary_instructor_id,
      ),
      student_code: normalizeOptionalText(form.student_code),
      full_name: form.full_name.trim(),
      nic: normalizeOptionalText(form.nic),
      date_of_birth: normalizeOptionalText(form.date_of_birth),
      phone: normalizeOptionalText(form.phone),
      email: normalizeOptionalText(form.email),
      address: normalizeOptionalText(form.address),
      emergency_contact_name: normalizeOptionalText(
        form.emergency_contact_name,
      ),
      emergency_contact_phone: normalizeOptionalText(
        form.emergency_contact_phone,
      ),
      registration_date: form.registration_date,
      is_active: form.is_active,
    }

    const validationErrors = validateStudentInput(studentInput)

    if (branchOptions.length > 0 && !form.branch_id) {
      validationErrors.branch_id = 'Please select a driving school branch.'
    }

    if (hasStudentValidationErrors(validationErrors)) {
      setErrors(validationErrors)
      return
    }

    setErrors({})
    await onSubmit(studentInput)
  }

  const getInputClass = (fieldName: keyof StudentValidationErrors) =>
    `w-full rounded-lg border px-3 py-2 text-sm text-slate-900 outline-none transition-colors ${
      errors[fieldName]
        ? 'border-red-500 bg-red-50/20 focus:border-red-600 focus:ring-1 focus:ring-red-500'
        : 'border-slate-300 focus:border-blue-500'
    }`

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-8 rounded-2xl bg-white p-6 shadow-sm"
    >
      <div>
        <h2 className="text-xl font-semibold text-slate-900">
          Student Registration
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Enter the student's personal, photo media, and registration information.
        </p>
      </div>

      {/* Validation Alert Banner */}
      {hasStudentValidationErrors(errors) && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-800 flex items-start gap-2.5 animate-in fade-in">
          <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Required Details Incomplete:</p>
            <p className="text-red-700">
              Please fill in all mandatory fields (Full Name, NIC, Date of Birth, Phone, Email, Address, Branch, and Registration Date) before saving.
            </p>
          </div>
        </div>
      )}

      {/* Student Photo & Media Drag and Drop Upload */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Camera className="h-3.5 w-3.5 text-blue-600" />
            <span>Student Photo / Document Media (Drag &amp; Drop)</span>
          </label>
          {photoUrl && (
            <button
              type="button"
              onClick={() => setPhotoUrl('')}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 hover:text-red-700 cursor-pointer"
            >
              <Trash2 className="h-3 w-3" />
              <span>Remove Photo</span>
            </button>
          )}
        </div>

        {photoUrl ? (
          <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-3">
            <img
              src={photoUrl}
              alt="Student Preview"
              className="h-16 w-16 rounded-xl object-cover border border-slate-200 shadow-xs"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-800">Student Profile Photo Loaded</p>
              <p className="text-[10px] text-slate-400 truncate max-w-md mt-0.5">
                Ready for identity verification &amp; DMT registration logbook
              </p>
            </div>
            <label className="cursor-pointer rounded-lg bg-slate-100 hover:bg-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 transition-all border border-slate-200">
              <span>Change</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handlePhotoFile(e.target.files[0])
                  }
                }}
                className="hidden"
              />
            </label>
          </div>
        ) : (
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setIsDraggingPhoto(true)
            }}
            onDragLeave={() => setIsDraggingPhoto(false)}
            onDrop={handlePhotoDrop}
            className={`relative rounded-xl border-2 border-dashed p-4 text-center transition-all cursor-pointer ${
              isDraggingPhoto
                ? 'border-blue-500 bg-blue-50/80 scale-[1.01]'
                : 'border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50'
            }`}
          >
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handlePhotoFile(e.target.files[0])
                }
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center gap-1.5 pointer-events-none">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Upload className="h-4 w-4" />
              </div>
              <p className="text-xs font-bold text-slate-700">
                Drag and drop student photo or NIC image here, or <span className="text-blue-600 underline">Browse</span>
              </p>
              <p className="text-[10px] text-slate-400">
                Supports PNG, JPG, WebP (Max 5MB)
              </p>
            </div>
          </div>
        )}
      </div>

      <section>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Student Information
        </h3>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="full_name"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Full Name *
            </label>

            <input
              id="full_name"
              type="text"
              value={form.full_name}
              onChange={(event) =>
                updateField('full_name', event.target.value)
              }
              className={getInputClass('full_name')}
              placeholder="Enter student's full name"
            />

            {errors.full_name && (
              <p className="mt-1 text-xs text-red-600 font-semibold">
                {errors.full_name}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="student_code"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Student Code
            </label>

            <input
              id="student_code"
              type="text"
              value={form.student_code}
              onChange={(event) =>
                updateField('student_code', event.target.value)
              }
              className={getInputClass('student_code')}
              placeholder="e.g. STU-2026-0042"
            />
          </div>

          <div>
            <label
              htmlFor="nic"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              NIC *
            </label>

            <input
              id="nic"
              type="text"
              value={form.nic}
              onChange={(event) => updateField('nic', event.target.value)}
              className={getInputClass('nic')}
              placeholder="Enter NIC number (e.g. 200012345678 or 987654321V)"
            />

            {errors.nic && (
              <p className="mt-1 text-xs text-red-600 font-semibold">
                {errors.nic}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="date_of_birth"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Date of Birth *
            </label>

            <input
              id="date_of_birth"
              type="date"
              value={form.date_of_birth}
              onChange={(event) =>
                updateField('date_of_birth', event.target.value)
              }
              className={getInputClass('date_of_birth')}
            />

            {errors.date_of_birth && (
              <p className="mt-1 text-xs text-red-600 font-semibold">
                {errors.date_of_birth}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Phone *
            </label>

            <input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={(event) =>
                updateField('phone', event.target.value)
              }
              className={getInputClass('phone')}
              placeholder="e.g. 077 123 4567"
            />

            {errors.phone && (
              <p className="mt-1 text-xs text-red-600 font-semibold">
                {errors.phone}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Email *
            </label>

            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(event) =>
                updateField('email', event.target.value)
              }
              className={getInputClass('email')}
              placeholder="student@example.com"
            />

            {errors.email && (
              <p className="mt-1 text-xs text-red-600 font-semibold">
                {errors.email}
              </p>
            )}
          </div>
        </div>

        <div className="mt-5">
          <label
            htmlFor="address"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Address *
          </label>

          <textarea
            id="address"
            rows={3}
            value={form.address}
            onChange={(event) =>
              updateField('address', event.target.value)
            }
            className={getInputClass('address')}
            placeholder="Enter residential address for DMT permit registry"
          />

          {errors.address && (
            <p className="mt-1 text-xs text-red-600 font-semibold">
              {errors.address}
            </p>
          )}
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Driving School Information
        </h3>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="branch_id"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Branch *
            </label>

            <select
              id="branch_id"
              value={form.branch_id}
              onChange={(event) =>
                updateField('branch_id', event.target.value)
              }
              className={getInputClass('branch_id')}
            >
              <option value="">Select a branch</option>

              {branchOptions.map((branch) => (
                <option key={branch.value} value={branch.value}>
                  {branch.label}
                </option>
              ))}
            </select>

            {errors.branch_id && (
              <p className="mt-1 text-xs text-red-600 font-semibold">
                {errors.branch_id}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="primary_instructor_id"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Primary Instructor
            </label>

            <select
              id="primary_instructor_id"
              value={form.primary_instructor_id}
              onChange={(event) =>
                updateField(
                  'primary_instructor_id',
                  event.target.value,
                )
              }
              className={getInputClass('primary_instructor_id')}
            >
              <option value="">Not assigned (Assign later)</option>

              {instructorOptions.map((instructor) => (
                <option
                  key={instructor.value}
                  value={instructor.value}
                >
                  {instructor.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="registration_date"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Registration Date *
            </label>

            <input
              id="registration_date"
              type="date"
              value={form.registration_date}
              onChange={(event) =>
                updateField('registration_date', event.target.value)
              }
              className={getInputClass('registration_date')}
            />

            {errors.registration_date && (
              <p className="mt-1 text-xs text-red-600 font-semibold">
                {errors.registration_date}
              </p>
            )}
          </div>

          <div className="flex items-center pt-7">
            <input
              id="is_active"
              type="checkbox"
              checked={form.is_active}
              onChange={(event) =>
                updateField('is_active', event.target.checked)
              }
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />

            <label
              htmlFor="is_active"
              className="ml-2 text-sm font-medium text-slate-700 cursor-pointer select-none"
            >
              Active student
            </label>
          </div>
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Emergency Contact (Optional)
        </h3>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="emergency_contact_name"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Contact Name
            </label>

            <input
              id="emergency_contact_name"
              type="text"
              value={form.emergency_contact_name}
              onChange={(event) =>
                updateField(
                  'emergency_contact_name',
                  event.target.value,
                )
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              placeholder="Emergency contact name"
            />
          </div>

          <div>
            <label
              htmlFor="emergency_contact_phone"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Contact Phone
            </label>

            <input
              id="emergency_contact_phone"
              type="tel"
              value={form.emergency_contact_phone}
              onChange={(event) =>
                updateField(
                  'emergency_contact_phone',
                  event.target.value,
                )
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              placeholder="Emergency contact number"
            />
          </div>
        </div>
      </section>

      {errors.driving_school_id && (
        <p className="text-xs font-semibold text-red-600">
          {errors.driving_school_id}
        </p>
      )}

      <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer shadow-xs transition-colors"
        >
          {isSubmitting ? 'Saving...' : initialStudent ? 'Save Changes' : 'Register Student'}
        </button>
      </div>
    </form>
  )
}

export default StudentForm