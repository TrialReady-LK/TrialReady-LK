import type { CreateStudentInput } from '../types/student'

export type StudentValidationErrors = Partial<
  Record<keyof CreateStudentInput | 'branch_id', string>
>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_PATTERN = /^[0-9+\-()\s]{7,15}$/
const NIC_PATTERN = /^(\d{9}[vVxX]|\d{12})$/

export function validateStudentInput(
  input: CreateStudentInput & { branch_id?: string | null },
): StudentValidationErrors {
  const errors: StudentValidationErrors = {}

  if (!input.driving_school_id?.trim()) {
    errors.driving_school_id = 'Driving school is required.'
  }

  if (!input.full_name?.trim()) {
    errors.full_name = 'Full name is required.'
  } else if (input.full_name.trim().length < 2) {
    errors.full_name = 'Full name must contain at least 2 characters.'
  }

  if (!input.nic?.trim()) {
    errors.nic = 'National Identity Card (NIC) is required.'
  } else if (!NIC_PATTERN.test(input.nic.trim())) {
    errors.nic = 'Enter a valid NIC number (e.g. 200012345678 or 987654321V).'
  }

  if (!input.date_of_birth?.trim()) {
    errors.date_of_birth = 'Date of birth is required.'
  } else {
    const dateOfBirth = new Date(`${input.date_of_birth}T00:00:00`)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (Number.isNaN(dateOfBirth.getTime())) {
      errors.date_of_birth = 'Enter a valid date of birth.'
    } else if (dateOfBirth > today) {
      errors.date_of_birth = 'Date of birth cannot be in the future.'
    } else {
      const ageDiff = today.getFullYear() - dateOfBirth.getFullYear()
      const m = today.getMonth() - dateOfBirth.getMonth()
      const isPastBirthday =
        m > 0 || (m === 0 && today.getDate() >= dateOfBirth.getDate())
      const calculatedAge = isPastBirthday ? ageDiff : ageDiff - 1

      if (calculatedAge < 16) {
        errors.date_of_birth =
          'Student must be at least 16 years old for driving academy registration.'
      }
    }
  }

  if (!input.phone?.trim()) {
    errors.phone = 'Phone number is required.'
  } else if (!PHONE_PATTERN.test(input.phone.trim())) {
    errors.phone =
      'Enter a valid contact phone number (e.g. 0771234567 or +94771234567).'
  }

  if (!input.email?.trim()) {
    errors.email = 'Email address is required.'
  } else if (!EMAIL_PATTERN.test(input.email.trim())) {
    errors.email = 'Enter a valid email address (e.g. student@example.com).'
  }

  if (!input.address?.trim()) {
    errors.address = 'Residential address is required.'
  } else if (input.address.trim().length < 5) {
    errors.address = 'Address must contain at least 5 characters.'
  }

  if (!input.registration_date) {
    errors.registration_date = 'Registration date is required.'
  }

  return errors
}

export function hasStudentValidationErrors(
  errors: StudentValidationErrors,
): boolean {
  return Object.keys(errors).length > 0
}

export function normalizeOptionalText(
  value: string | null | undefined,
): string | null {
  if (value == null) {
    return null
  }

  const normalizedValue = value.trim()

  return normalizedValue.length > 0 ? normalizedValue : null
}