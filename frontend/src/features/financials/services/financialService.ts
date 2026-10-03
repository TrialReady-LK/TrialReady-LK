import { supabase } from '../../../lib/supabase'
import {
  getStoredData,
  setStoredData,
  STORAGE_KEYS,
  upsertStoredItem,
} from '../../../lib/persistentStorage'
import type {
  CreatePackageInput,
  EnrolStudentPackageInput,
  Package,
  RecordPaymentInput,
  StudentFinancialLedger,
  StudentPackageEnrolment,
  StudentPayment,
  UpdatePackageInput,
} from '../types/financials'
import { generateReceiptNumber, getPaymentStatus } from '../utils/financialUtils'

export const DEFAULT_PACKAGES: Package[] = [
  {
    id: 'pa111111-1111-1111-1111-111111111111',
    driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    name: 'Dual Combo (Car B Manual + Bike A)',
    code: 'PKG-COMBO-BM',
    description: 'Comprehensive package with 20 practical driving hours, 5 theory classes, and DMT exam trial preparation.',
    fee: 65000,
    practical_hours_included: 20,
    theory_classes_included: 5,
    is_active: true,
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'pa222222-2222-2222-2222-222222222222',
    driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    name: 'Light Motor Car (Auto Only)',
    code: 'PKG-CAR-AUTO',
    description: '15 practical sessions in automatic dual-control hatchback with complete Highway Code classes.',
    fee: 48000,
    practical_hours_included: 15,
    theory_classes_included: 5,
    is_active: true,
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'pa333333-3333-3333-3333-333333333333',
    driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    name: 'Motorcycle & Three Wheeler (B1 + A)',
    code: 'PKG-BIKE-3WH',
    description: '10 practical riding & maneuvering sessions, NTMI medical support, and trial vehicle provision.',
    fee: 32000,
    practical_hours_included: 10,
    theory_classes_included: 3,
    is_active: true,
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: new Date().toISOString(),
  },
]

export const DEFAULT_PAYMENTS: StudentPayment[] = [
  {
    id: 'pay-001',
    driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    student_id: '11111111-1111-1111-1111-111111111111',
    enrolment_id: 'ea111111-1111-1111-1111-111111111111',
    receipt_number: 'REC-20260610-0101',
    payment_date: '2026-06-10',
    amount: 45000,
    payment_method: 'bank_transfer',
    payment_reference: 'BOC-TXN-881920',
    collected_by: null,
    notes: 'Advance Registration Fee',
    created_at: '2026-06-10T10:00:00.000Z',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'pay-002',
    driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    student_id: '11111111-1111-1111-1111-111111111111',
    enrolment_id: 'ea111111-1111-1111-1111-111111111111',
    receipt_number: 'REC-20260715-0102',
    payment_date: '2026-07-15',
    amount: 20000,
    payment_method: 'cash',
    payment_reference: null,
    collected_by: null,
    notes: 'Final Settlement (Fully Paid)',
    created_at: '2026-07-15T10:00:00.000Z',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'pay-003',
    driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    student_id: '11111111-1111-1111-1111-222222222222',
    enrolment_id: 'ea222222-2222-2222-2222-222222222222',
    receipt_number: 'REC-20260601-0201',
    payment_date: '2026-06-01',
    amount: 30000,
    payment_method: 'card',
    payment_reference: 'POS-AUTH-44129',
    collected_by: null,
    notes: '1st & 2nd Instalment',
    created_at: '2026-06-01T10:00:00.000Z',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'pay-004',
    driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    student_id: '11111111-1111-1111-1111-333333333333',
    enrolment_id: 'ea333333-3333-3333-3333-333333333333',
    receipt_number: 'REC-20260715-0301',
    payment_date: '2026-07-15',
    amount: 20000,
    payment_method: 'cash',
    payment_reference: null,
    collected_by: null,
    notes: 'Advance Fee Payment',
    created_at: '2026-07-15T10:00:00.000Z',
    updated_at: new Date().toISOString(),
  },
]

// ==========================================
// 1. Packages
// ==========================================

export async function getPackages(
  drivingSchoolId: string,
): Promise<Package[]> {
  const localList = getStoredData<Package[]>(
    STORAGE_KEYS.PACKAGES,
    DEFAULT_PACKAGES,
  )

  try {
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .eq('driving_school_id', drivingSchoolId)
      .order('created_at', { ascending: true })

    if (error || !data || data.length === 0) {
      if (localList.length === 0) {
        setStoredData(STORAGE_KEYS.PACKAGES, DEFAULT_PACKAGES)
        return DEFAULT_PACKAGES
      }
      return localList
    }

    const remotePackages = data as Package[]
    const merged = [...localList]
    for (const r of remotePackages) {
      const idx = merged.findIndex((m) => m.id === r.id || m.code === r.code)
      if (idx !== -1) {
        merged[idx] = { ...r, ...merged[idx] }
      } else {
        merged.push(r)
      }
    }

    setStoredData(STORAGE_KEYS.PACKAGES, merged)
    return merged
  } catch {
    return localList.length > 0 ? localList : DEFAULT_PACKAGES
  }
}

export async function createPackage(
  input: CreatePackageInput,
): Promise<Package> {
  const generatedId = crypto.randomUUID ? crypto.randomUUID() : `pkg-${Date.now()}`
  const newPackage: Package = {
    id: generatedId,
    driving_school_id: input.driving_school_id,
    name: input.name,
    code: input.code.toUpperCase(),
    description: input.description ?? null,
    fee: input.fee,
    practical_hours_included: input.practical_hours_included ?? 15,
    theory_classes_included: input.theory_classes_included ?? 5,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  upsertStoredItem(STORAGE_KEYS.PACKAGES, newPackage)

  try {
    const { data } = await supabase
      .from('packages')
      .insert([
        {
          ...newPackage,
        },
      ])
      .select()
      .single()

    if (data) {
      upsertStoredItem(STORAGE_KEYS.PACKAGES, data as Package)
      return data as Package
    }
  } catch (err) {
    console.warn('Supabase package create notice:', err)
  }

  return newPackage
}

export async function updatePackage(
  id: string,
  input: UpdatePackageInput,
): Promise<Package> {
  const localList = getStoredData<Package[]>(
    STORAGE_KEYS.PACKAGES,
    DEFAULT_PACKAGES,
  )
  const existing = localList.find((p) => p.id === id) || DEFAULT_PACKAGES[0]

  const updated: Package = {
    ...existing,
    ...input,
    updated_at: new Date().toISOString(),
  }

  upsertStoredItem(STORAGE_KEYS.PACKAGES, updated)

  try {
    await supabase.from('packages').update(input).eq('id', id)
  } catch (err) {
    console.warn('Supabase package update notice:', err)
  }

  return updated
}

export async function deletePackage(id: string): Promise<void> {
  const localList = getStoredData<Package[]>(
    STORAGE_KEYS.PACKAGES,
    DEFAULT_PACKAGES,
  )
  setStoredData(
    STORAGE_KEYS.PACKAGES,
    localList.filter((p) => p.id !== id),
  )

  try {
    await supabase.from('packages').delete().eq('id', id)
  } catch (err) {
    console.warn('Supabase package delete notice:', err)
  }
}

// ==========================================
// 2. Student Package Enrolments
// ==========================================

export async function getStudentEnrolment(
  studentId: string,
): Promise<(StudentPackageEnrolment & { package: Package }) | null> {
  const localEnrolments = getStoredData<StudentPackageEnrolment[]>(
    STORAGE_KEYS.ENROLMENTS,
    [],
  )
  const localPackages = getStoredData<Package[]>(
    STORAGE_KEYS.PACKAGES,
    DEFAULT_PACKAGES,
  )

  const cached = localEnrolments.find(
    (e) => e.student_id === studentId && e.status === 'active',
  )
  if (cached) {
    const pkg =
      localPackages.find((p) => p.id === cached.package_id) || DEFAULT_PACKAGES[0]
    return { ...cached, package: pkg }
  }

  try {
    const { data } = await supabase
      .from('student_package_enrolments')
      .select('*, package:packages(*)')
      .eq('student_id', studentId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .maybeSingle()

    if (data) {
      return data as (StudentPackageEnrolment & { package: Package })
    }
  } catch (err) {
    console.warn('Supabase enrolment notice:', err)
  }

  // Fallback default enrolment for demo
  const fallbackPkg = DEFAULT_PACKAGES[0]
  return {
    id: `enr-${studentId}`,
    driving_school_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    student_id: studentId,
    package_id: fallbackPkg.id,
    enrolled_date: '2026-01-15',
    agreed_total_fee: fallbackPkg.fee,
    discount_amount: 0,
    status: 'active',
    notes: 'Default Demo Enrolment',
    created_at: '2026-01-15T00:00:00.000Z',
    updated_at: new Date().toISOString(),
    package: fallbackPkg,
  }
}

export async function enrolStudentPackage(
  input: EnrolStudentPackageInput,
): Promise<StudentPackageEnrolment> {
  const generatedId = crypto.randomUUID ? crypto.randomUUID() : `enr-${Date.now()}`
  const newEnrolment: StudentPackageEnrolment = {
    id: generatedId,
    driving_school_id: input.driving_school_id,
    student_id: input.student_id,
    package_id: input.package_id,
    enrolled_date: new Date().toISOString().split('T')[0],
    agreed_total_fee: input.agreed_total_fee,
    discount_amount: input.discount_amount ?? 0,
    status: 'active',
    notes: input.notes ?? null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  upsertStoredItem(STORAGE_KEYS.ENROLMENTS, newEnrolment)

  try {
    await supabase
      .from('student_package_enrolments')
      .update({ status: 'completed' })
      .eq('student_id', input.student_id)

    await supabase.from('student_package_enrolments').insert([newEnrolment])
  } catch (err) {
    console.warn('Supabase student package enrolment notice:', err)
  }

  return newEnrolment
}

// ==========================================
// 3. Student Payments
// ==========================================

export async function getStudentPayments(
  studentId: string,
): Promise<StudentPayment[]> {
  const localPayments = getStoredData<StudentPayment[]>(
    STORAGE_KEYS.PAYMENTS,
    DEFAULT_PAYMENTS,
  )
  const studentLocal = localPayments.filter((p) => p.student_id === studentId)

  try {
    const { data, error } = await supabase
      .from('student_payments')
      .select('*')
      .eq('student_id', studentId)
      .order('payment_date', { ascending: false })

    if (error || !data || data.length === 0) {
      return studentLocal
    }

    const remotePayments = data as StudentPayment[]
    const merged = [...studentLocal]
    for (const r of remotePayments) {
      if (!merged.some((m) => m.id === r.id || m.receipt_number === r.receipt_number)) {
        merged.push(r)
      }
    }

    return merged
  } catch {
    return studentLocal
  }
}

export async function recordStudentPayment(
  input: RecordPaymentInput,
): Promise<StudentPayment> {
  const receiptNum = input.receipt_number || generateReceiptNumber()
  const generatedId = crypto.randomUUID ? crypto.randomUUID() : `pay-${Date.now()}`

  const newPayment: StudentPayment = {
    id: generatedId,
    driving_school_id: input.driving_school_id,
    student_id: input.student_id,
    enrolment_id: input.enrolment_id ?? null,
    receipt_number: receiptNum,
    payment_date: input.payment_date,
    amount: input.amount,
    payment_method: input.payment_method,
    payment_reference: input.payment_reference ?? null,
    collected_by: null,
    notes: input.notes ?? null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  upsertStoredItem(STORAGE_KEYS.PAYMENTS, newPayment)

  try {
    await supabase.from('student_payments').insert([newPayment])
  } catch (err) {
    console.warn('Supabase payment insert notice:', err)
  }

  return newPayment
}

export async function deletePayment(id: string): Promise<void> {
  const localList = getStoredData<StudentPayment[]>(
    STORAGE_KEYS.PAYMENTS,
    DEFAULT_PAYMENTS,
  )
  setStoredData(
    STORAGE_KEYS.PAYMENTS,
    localList.filter((p) => p.id !== id),
  )

  try {
    await supabase.from('student_payments').delete().eq('id', id)
  } catch (err) {
    console.warn('Supabase payment delete notice:', err)
  }
}

// ==========================================
// 4. Financial Ledgers & Overviews
// ==========================================

export async function getStudentFinancialLedger(
  studentId: string,
): Promise<StudentFinancialLedger> {
  const [enrolment, payments] = await Promise.all([
    getStudentEnrolment(studentId),
    getStudentPayments(studentId),
  ])

  let studentData = {
    id: studentId,
    full_name: 'Student',
    admission_number: 'ADM-2026-0042',
    phone: '+94 77 123 4567',
    email: 'student@royaldriving.lk',
    branch_name: 'Colombo Central (Nugegoda)',
  }

  try {
    const { data: s } = await supabase
      .from('students')
      .select('id, full_name, student_code, phone, email, branches(name)')
      .eq('id', studentId)
      .maybeSingle()

    if (s) {
      studentData = {
        id: s.id,
        full_name: s.full_name,
        admission_number: (s as any).student_code ?? 'ADM-2026-0042',
        phone: s.phone ?? null,
        email: s.email ?? null,
        branch_name: (s.branches as any)?.name ?? 'Colombo Central (Nugegoda)',
      }
    } else {
      const localStudents = getStoredData<any[]>(STORAGE_KEYS.STUDENTS, [])
      const localS = localStudents.find((st) => st.id === studentId)
      if (localS) {
        studentData = {
          id: localS.id,
          full_name: localS.full_name,
          admission_number: localS.student_code ?? 'ADM-2026-0042',
          phone: localS.phone ?? null,
          email: localS.email ?? null,
          branch_name: localS.branch?.name ?? 'Colombo Central (Nugegoda)',
        }
      }
    }
  } catch {
    const localStudents = getStoredData<any[]>(STORAGE_KEYS.STUDENTS, [])
    const localS = localStudents.find((st) => st.id === studentId)
    if (localS) {
      studentData = {
        id: localS.id,
        full_name: localS.full_name,
        admission_number: localS.student_code ?? 'ADM-2026-0042',
        phone: localS.phone ?? null,
        email: localS.email ?? null,
        branch_name: localS.branch?.name ?? 'Colombo Central (Nugegoda)',
      }
    }
  }

  const totalFee = enrolment
    ? Math.max(
        0,
        Number(enrolment.agreed_total_fee) -
          Number(enrolment.discount_amount || 0),
      )
    : 65000

  const totalPaid = payments.reduce((acc, p) => acc + Number(p.amount), 0)
  const balance = Math.max(0, totalFee - totalPaid)
  const statusInfo = getPaymentStatus(totalFee, totalPaid)
  const percentagePaid =
    totalFee > 0 ? Math.min(100, Math.round((totalPaid / totalFee) * 100)) : 0

  return {
    student: studentData,
    enrolment,
    payments,
    totalFee,
    totalPaid,
    balance,
    paymentStatus: statusInfo.status,
    percentagePaid,
  }
}

export async function getAllFinancialLedgers(
  drivingSchoolId: string,
): Promise<StudentFinancialLedger[]> {
  const localStudents = getStoredData<any[]>(STORAGE_KEYS.STUDENTS, [])
  const fallbackIds =
    localStudents.length > 0
      ? localStudents.map((s) => s.id)
      : [
          '11111111-1111-1111-1111-111111111111',
          '11111111-1111-1111-1111-222222222222',
          '11111111-1111-1111-1111-333333333333',
          '11111111-1111-1111-1111-444444444444',
          '11111111-1111-1111-1111-555555555555',
        ]

  try {
    const { data: students, error: studError } = await supabase
      .from('students')
      .select('id, full_name, student_code, phone, email, branches(name)')
      .eq('driving_school_id', drivingSchoolId)
      .eq('is_active', true)
      .order('full_name', { ascending: true })

    if (studError || !students || students.length === 0) {
      return Promise.all(fallbackIds.map((id) => getStudentFinancialLedger(id)))
    }

    const combinedIds = Array.from(
      new Set([...students.map((s) => s.id), ...fallbackIds]),
    )
    return Promise.all(combinedIds.map((id) => getStudentFinancialLedger(id)))
  } catch {
    return Promise.all(fallbackIds.map((id) => getStudentFinancialLedger(id)))
  }
}

export async function getAllRecentPayments(
  _drivingSchoolId: string,
): Promise<StudentPayment[]> {
  const localPayments = getStoredData<StudentPayment[]>(
    STORAGE_KEYS.PAYMENTS,
    DEFAULT_PAYMENTS,
  )

  try {
    const { data, error } = await supabase
      .from('student_payments')
      .select('*, student:students(id, full_name, student_code, phone)')
      .order('payment_date', { ascending: false })
      .limit(100)

    if (error || !data || data.length === 0) {
      return localPayments
    }

    return (data as unknown as StudentPayment[]) ?? localPayments
  } catch {
    return localPayments
  }
}
