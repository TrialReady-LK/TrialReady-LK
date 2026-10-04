import { useMemo, useState } from 'react'
import { AlertCircle } from 'lucide-react'
import type { Branch } from '../../branches/types/branch'
import type {
  CreateInstructorInput,
  Instructor,
  UpdateInstructorInput,
} from '../types/instructor'
import {
  hasInstructorValidationErrors,
  optionalInstructorText,
  validateInstructor,
  type InstructorValidationErrors,
} from '../utils/instructorValidation'

interface InstructorFormProps {
  drivingSchoolId: string
  branches: Branch[]
  initialInstructor?: Instructor | null
  isSubmitting?: boolean
  onSubmit: (
    input: CreateInstructorInput | UpdateInstructorInput,
  ) => Promise<void>
  onCancel: () => void
}

interface InstructorFormState {
  branch_id: string
  employee_code: string
  full_name: string
  nic: string
  phone: string
  email: string
  driving_licence_number: string
  driving_licence_expiry_date: string
  joined_date: string
  is_active: boolean
}

const emptyFormState: InstructorFormState = {
  branch_id: '',
  employee_code: '',
  full_name: '',
  nic: '',
  phone: '',
  email: '',
  driving_licence_number: '',
  driving_licence_expiry_date: '',
  joined_date: new Date().toISOString().split('T')[0],
  is_active: true,
}

function instructorToFormState(
  instructor: Instructor,
): InstructorFormState {
  return {
    branch_id: instructor.branch_id ?? '',
    employee_code: instructor.employee_code ?? '',
    full_name: instructor.full_name,
    nic: instructor.nic ?? '',
    phone: instructor.phone ?? '',
    email: instructor.email ?? '',
    driving_licence_number:
      instructor.driving_licence_number ?? '',
    driving_licence_expiry_date:
      instructor.driving_licence_expiry_date ?? '',
    joined_date: instructor.joined_date ?? '',
    is_active: instructor.is_active,
  }
}

function InstructorForm({
  drivingSchoolId,
  branches,
  initialInstructor = null,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: InstructorFormProps) {
  const [form, setForm] = useState<InstructorFormState>(() =>
    initialInstructor
      ? instructorToFormState(initialInstructor)
      : emptyFormState,
  )

  const [errors, setErrors] =
    useState<InstructorValidationErrors>({})

  const isEditing = initialInstructor !== null

  const availableBranches = useMemo(
    () =>
      branches.filter(
        (branch) =>
          branch.is_active ||
          branch.id === initialInstructor?.branch_id,
      ),
    [branches, initialInstructor?.branch_id],
  )

  function updateField<K extends keyof InstructorFormState>(
    field: K,
    value: InstructorFormState[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))

    if (field in errors) {
      setErrors((current) => {
        const nextErrors = { ...current }
        delete nextErrors[
          field as keyof InstructorValidationErrors
        ]

        return nextErrors
      })
    }
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    const validationErrors = validateInstructor({
      employee_code: form.employee_code,
      full_name: form.full_name,
      nic: form.nic,
      phone: form.phone,
      email: form.email,
      driving_licence_number:
        form.driving_licence_number,
      driving_licence_expiry_date:
        form.driving_licence_expiry_date,
      joined_date: form.joined_date,
      branch_id: form.branch_id,
    })

    setErrors(validationErrors)

    if (hasInstructorValidationErrors(validationErrors)) {
      return
    }

    const commonInput = {
      branch_id: form.branch_id || null,
      employee_code: optionalInstructorText(
        form.employee_code,
      ),
      full_name: form.full_name.trim(),
      nic: optionalInstructorText(form.nic),
      phone: optionalInstructorText(form.phone),
      email: optionalInstructorText(form.email),
      driving_licence_number: optionalInstructorText(
        form.driving_licence_number,
      ),
      driving_licence_expiry_date:
        form.driving_licence_expiry_date || null,
      joined_date: form.joined_date || null,
      is_active: form.is_active,
    }

    if (isEditing) {
      const input: UpdateInstructorInput = commonInput
      await onSubmit(input)
      return
    }

    const input: CreateInstructorInput = {
      driving_school_id: drivingSchoolId,
      ...commonInput,
    }

    await onSubmit(input)
  }

  const getInputClass = (fieldName: keyof InstructorValidationErrors) =>
    `mt-1 w-full rounded-lg border px-3 py-2 text-slate-900 outline-none transition-colors disabled:bg-slate-100 ${
      errors[fieldName]
        ? 'border-red-500 bg-red-50/20 focus:border-red-600 focus:ring-1 focus:ring-red-500'
        : 'border-slate-300 focus:border-blue-500'
    }`

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">
          {isEditing ? 'Edit Instructor' : 'Add Instructor'}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {isEditing
            ? 'Update the instructor information below.'
            : 'Enter the information for the new instructor.'}
        </p>
      </div>

      {/* Validation Alert Summary */}
      {hasInstructorValidationErrors(errors) && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-800 flex items-start gap-2.5 animate-in fade-in">
          <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Required Details Incomplete:</p>
            <p className="text-red-700">
              Please fill in all mandatory instructor fields (Full Name, Employee Code, Branch, NIC, Phone, Email, Licence Number, Expiry Date, and Joined Date) before saving.
            </p>
          </div>
        </div>
      )}

      <form
        onSubmit={(event) => void handleSubmit(event)}
        noValidate
        className="mt-6 space-y-6"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label
              htmlFor="instructor-full-name"
              className="text-sm font-medium text-slate-900"
            >
              Full Name *
            </label>

            <input
              id="instructor-full-name"
              type="text"
              value={form.full_name}
              onChange={(event) =>
                updateField('full_name', event.target.value)
              }
              disabled={isSubmitting}
              className={getInputClass('full_name')}
              placeholder="e.g. Ravishka Rathnayaka"
            />

            {errors.full_name && (
              <p className="mt-1 text-xs text-red-600 font-semibold">
                {errors.full_name}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="instructor-employee-code"
              className="text-sm font-medium text-slate-900"
            >
              Employee Code *
            </label>

            <input
              id="instructor-employee-code"
              type="text"
              value={form.employee_code}
              onChange={(event) =>
                updateField(
                  'employee_code',
                  event.target.value,
                )
              }
              disabled={isSubmitting}
              className={getInputClass('employee_code')}
              placeholder="e.g. INS-WP-008"
            />

            {errors.employee_code && (
              <p className="mt-1 text-xs text-red-600 font-semibold">
                {errors.employee_code}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="instructor-branch"
              className="text-sm font-medium text-slate-900"
            >
              Branch *
            </label>

            <select
              id="instructor-branch"
              value={form.branch_id}
              onChange={(event) =>
                updateField('branch_id', event.target.value)
              }
              disabled={isSubmitting}
              className={`${getInputClass('branch_id')} bg-white`}
            >
              <option value="">Select an assigned branch</option>

              {availableBranches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                  {!branch.is_active ? ' (Inactive)' : ''}
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
              htmlFor="instructor-nic"
              className="text-sm font-medium text-slate-900"
            >
              NIC *
            </label>

            <input
              id="instructor-nic"
              type="text"
              value={form.nic}
              onChange={(event) =>
                updateField('nic', event.target.value)
              }
              disabled={isSubmitting}
              className={getInputClass('nic')}
              placeholder="e.g. 198512345678 or 851234567V"
            />

            {errors.nic && (
              <p className="mt-1 text-xs text-red-600 font-semibold">
                {errors.nic}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="instructor-phone"
              className="text-sm font-medium text-slate-900"
            >
              Phone *
            </label>

            <input
              id="instructor-phone"
              type="tel"
              value={form.phone}
              onChange={(event) =>
                updateField('phone', event.target.value)
              }
              disabled={isSubmitting}
              className={getInputClass('phone')}
              placeholder="e.g. +94 77 123 4567"
            />

            {errors.phone && (
              <p className="mt-1 text-xs text-red-600 font-semibold">
                {errors.phone}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="instructor-email"
              className="text-sm font-medium text-slate-900"
            >
              Email *
            </label>

            <input
              id="instructor-email"
              type="email"
              value={form.email}
              onChange={(event) =>
                updateField('email', event.target.value)
              }
              disabled={isSubmitting}
              className={getInputClass('email')}
              placeholder="e.g. instructor@royaldriving.lk"
            />

            {errors.email && (
              <p className="mt-1 text-xs text-red-600 font-semibold">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="instructor-licence-number"
              className="text-sm font-medium text-slate-900"
            >
              Driving Licence Number *
            </label>

            <input
              id="instructor-licence-number"
              type="text"
              value={form.driving_licence_number}
              onChange={(event) =>
                updateField(
                  'driving_licence_number',
                  event.target.value,
                )
              }
              disabled={isSubmitting}
              className={getInputClass('driving_licence_number')}
              placeholder="e.g. B8901234"
            />

            {errors.driving_licence_number && (
              <p className="mt-1 text-xs text-red-600 font-semibold">
                {errors.driving_licence_number}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="instructor-licence-expiry"
              className="text-sm font-medium text-slate-900"
            >
              Driving Licence Expiry Date *
            </label>

            <input
              id="instructor-licence-expiry"
              type="date"
              value={form.driving_licence_expiry_date}
              onChange={(event) =>
                updateField(
                  'driving_licence_expiry_date',
                  event.target.value,
                )
              }
              disabled={isSubmitting}
              className={getInputClass('driving_licence_expiry_date')}
            />

            {errors.driving_licence_expiry_date && (
              <p className="mt-1 text-xs text-red-600 font-semibold">
                {errors.driving_licence_expiry_date}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="instructor-joined-date"
              className="text-sm font-medium text-slate-900"
            >
              Joined Date *
            </label>

            <input
              id="instructor-joined-date"
              type="date"
              value={form.joined_date}
              onChange={(event) =>
                updateField('joined_date', event.target.value)
              }
              disabled={isSubmitting}
              className={getInputClass('joined_date')}
            />

            {errors.joined_date && (
              <p className="mt-1 text-xs text-red-600 font-semibold">
                {errors.joined_date}
              </p>
            )}
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm font-medium text-slate-900 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(event) =>
              updateField('is_active', event.target.checked)
            }
            disabled={isSubmitting}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />

          Active instructor
        </label>

        <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer shadow-xs transition-colors"
          >
            {isSubmitting
              ? 'Saving...'
              : isEditing
                ? 'Save Changes'
                : 'Add Instructor'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default InstructorForm