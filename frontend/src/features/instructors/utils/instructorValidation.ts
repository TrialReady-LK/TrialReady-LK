export interface InstructorValidationInput {
  employee_code: string
  full_name: string
  nic: string
  phone: string
  email: string
  driving_licence_number: string
  driving_licence_expiry_date: string
  joined_date: string
  branch_id?: string
}

export type InstructorValidationErrors = Partial<
  Record<keyof InstructorValidationInput, string>
>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_PATTERN = /^[0-9+\-()\s]{7,15}$/
const NIC_PATTERN = /^(\d{9}[vVxX]|\d{12})$/

export function validateInstructor(
  input: InstructorValidationInput,
): InstructorValidationErrors {
  const errors: InstructorValidationErrors = {}

  if (!input.full_name?.trim()) {
    errors.full_name = 'Instructor full name is required.'
  } else if (input.full_name.trim().length < 2) {
    errors.full_name = 'Instructor full name must contain at least 2 characters.'
  }

  if (!input.employee_code?.trim()) {
    errors.employee_code = 'Employee code is required (e.g. INS-WP-008).'
  }

  if (input.branch_id !== undefined && !input.branch_id) {
    errors.branch_id = 'Please select an assigned branch for this instructor.'
  }

  if (!input.nic?.trim()) {
    errors.nic = 'NIC number is required.'
  } else if (!NIC_PATTERN.test(input.nic.trim())) {
    errors.nic = 'Enter a valid NIC number (e.g. 198512345678 or 851234567V).'
  }

  if (!input.phone?.trim()) {
    errors.phone = 'Contact phone number is required.'
  } else if (!PHONE_PATTERN.test(input.phone.trim())) {
    errors.phone = 'Enter a valid contact phone number (e.g. 0771234567 or +94771234567).'
  }

  if (!input.email?.trim()) {
    errors.email = 'Email address is required.'
  } else if (!EMAIL_PATTERN.test(input.email.trim())) {
    errors.email = 'Enter a valid email address (e.g. instructor@royaldriving.lk).'
  }

  if (!input.driving_licence_number?.trim()) {
    errors.driving_licence_number = 'Driving licence number is required.'
  }

  if (!input.driving_licence_expiry_date?.trim()) {
    errors.driving_licence_expiry_date = 'Driving licence expiry date is required.'
  } else if (
    input.joined_date &&
    input.driving_licence_expiry_date < input.joined_date
  ) {
    errors.driving_licence_expiry_date =
      'Licence expiry date cannot be before the joined date.'
  }

  if (!input.joined_date?.trim()) {
    errors.joined_date = 'Joined date is required.'
  }

  return errors
}

export function hasInstructorValidationErrors(
  errors: InstructorValidationErrors,
): boolean {
  return Object.keys(errors).length > 0
}

export function optionalInstructorText(
  value: string,
): string | null {
  const trimmedValue = value.trim()

  return trimmedValue ? trimmedValue : null
}