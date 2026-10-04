import React, { useState } from 'react'
import {
  CreditCard,
  CheckCircle2,
  Clock,
  Printer,
  Copy,
  Check,
  Building2,
  QrCode,
  Receipt,
  Calendar,
  DollarSign,
  Wallet,
} from 'lucide-react'
import type { StudentFinancialLedger, StudentPayment } from '../../../financials/types/financials'
import { formatLKR, formatPaymentMethod, getPaymentStatus } from '../../../financials/utils/financialUtils'
import { PaymentReceiptModal } from '../../../financials/components/PaymentReceiptModal'
import { recordStudentPayment } from '../../../financials/services/financialService'

interface StudentPaymentsSectionProps {
  ledger: StudentFinancialLedger | null
  drivingSchoolId: string
  onPaymentRecorded?: () => void
}

export const StudentPaymentsSection: React.FC<StudentPaymentsSectionProps> = ({
  ledger,
  drivingSchoolId,
  onPaymentRecorded,
}) => {
  const [activeTab, setActiveTab] = useState<'history' | 'milestones' | 'options'>('history')
  const [selectedPaymentForReceipt, setSelectedPaymentForReceipt] = useState<StudentPayment | null>(null)
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false)
  const [copiedBankNo, setCopiedBankNo] = useState(false)

  // Online Payment Simulation State
  const [isPayOnlineModalOpen, setIsPayOnlineModalOpen] = useState(false)
  const [payAmount, setPayAmount] = useState<number>(ledger?.balance || 20000)
  const [payMethod, setPayMethod] = useState<'card' | 'bank_transfer'>('card')
  const [payReference, setPayReference] = useState('')
  const [payNotes, setPayNotes] = useState('Online Course Installment')
  const [isSubmittingPay, setIsSubmittingPay] = useState(false)
  const [paySuccessMsg, setPaySuccessMsg] = useState<string | null>(null)

  if (!ledger) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs text-center">
        <Receipt className="mx-auto h-8 w-8 text-slate-400" />
        <h3 className="mt-2 text-sm font-bold text-slate-800">Fee & Payment Records</h3>
        <p className="mt-1 text-xs text-slate-500">No active course payment ledger found for your profile.</p>
      </div>
    )
  }

  const statusInfo = getPaymentStatus(ledger.totalFee, ledger.totalPaid)
  const payments = ledger.payments || []
  const packageName = ledger.enrolment?.package.name || 'Dual Combo (Car B Manual + Bike A)'

  // Generate dynamic milestones based on total fee and payments
  const totalFee = ledger.totalFee || 65000
  const milestone1Amount = Math.round(totalFee * 0.4) // 40% Enrolment
  const milestone2Amount = Math.round(totalFee * 0.35) // 35% Theory & Permit
  const milestone3Amount = totalFee - milestone1Amount - milestone2Amount // 25% Final Trial

  const paidAmount = ledger.totalPaid || 0

  const m1Paid = paidAmount >= milestone1Amount
  const m2Paid = paidAmount >= (milestone1Amount + milestone2Amount)
  const m3Paid = paidAmount >= totalFee

  const milestones = [
    {
      title: '1. Registration & Enrolment Advance (40%)',
      amount: milestone1Amount,
      description: 'Initial academy onboarding, admission processing & theory manual kit',
      dueDate: 'Upon Enrolment',
      status: m1Paid ? 'completed' : 'due',
      completedDate: payments.length > 0 ? payments[payments.length - 1].payment_date : '2026-06-10',
      method: payments.length > 0 ? formatPaymentMethod(payments[payments.length - 1].payment_method) : 'Bank Transfer',
    },
    {
      title: '2. NTMI Medical & DMT Permit Stage (35%)',
      amount: milestone2Amount,
      description: 'Medical fitness verification & 6-month DMT Learner Permit filing',
      dueDate: 'Before DMT Theory Exam',
      status: m2Paid ? 'completed' : m1Paid ? 'due' : 'upcoming',
      completedDate: m2Paid && payments.length > 1 ? payments[payments.length - 2].payment_date : undefined,
      method: m2Paid && payments.length > 1 ? formatPaymentMethod(payments[payments.length - 2].payment_method) : undefined,
    },
    {
      title: '3. Practical Training & Final Trial Settlement (25%)',
      amount: milestone3Amount,
      description: 'Dual-control practical road training hours & official DMT practical trial pass',
      dueDate: 'Before DMT Practical Trial',
      status: m3Paid ? 'completed' : m2Paid ? 'due' : 'upcoming',
      completedDate: m3Paid && payments.length > 0 ? payments[0].payment_date : undefined,
      method: m3Paid && payments.length > 0 ? formatPaymentMethod(payments[0].payment_method) : undefined,
    },
  ]

  const handleCopyAccountNo = () => {
    navigator.clipboard.writeText('1000 2489 7712')
    setCopiedBankNo(true)
    setTimeout(() => setCopiedBankNo(false), 3000)
  }

  const handleOpenReceipt = (payment: StudentPayment) => {
    setSelectedPaymentForReceipt(payment)
    setIsReceiptModalOpen(true)
  }

  const handleExecuteOnlinePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (payAmount <= 0) return

    try {
      setIsSubmittingPay(true)
      const recorded = await recordStudentPayment({
        driving_school_id: drivingSchoolId,
        student_id: ledger.student.id,
        enrolment_id: ledger.enrolment?.id,
        amount: payAmount,
        payment_date: new Date().toISOString().split('T')[0],
        payment_method: payMethod,
        payment_reference: payReference || `ONLINE-${Date.now().toString().slice(-6)}`,
        notes: payNotes,
      })

      setPaySuccessMsg(`Payment of ${formatLKR(payAmount)} processed successfully! Receipt: ${recorded.receipt_number}`)
      setTimeout(() => {
        setPaySuccessMsg(null)
        setIsPayOnlineModalOpen(false)
        if (onPaymentRecorded) onPaymentRecorded()
        handleOpenReceipt(recorded)
      }, 1500)
    } catch {
      setPaySuccessMsg('Failed to process payment. Please try again.')
    } finally {
      setIsSubmittingPay(false)
    }
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-6 sm:p-8">
      {/* 1. Header with Title, Status & Quick Action */}
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
              <CreditCard className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
              Student Financial Hub
            </span>
          </div>
          <h2 className="mt-1 text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
            My Course Fees, Payments &amp; Installments
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Enrolled in <strong className="font-semibold text-slate-700">{packageName}</strong> • Admission: <span className="font-mono text-slate-700">{ledger.student.admission_number}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border ${statusInfo.badgeClass}`}>
            {statusInfo.status === 'fully_paid' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
            {statusInfo.label}
          </span>

          {ledger.balance > 0 && (
            <button
              type="button"
              onClick={() => {
                setPayAmount(ledger.balance)
                setIsPayOnlineModalOpen(true)
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-all cursor-pointer"
            >
              <Wallet className="h-3.5 w-3.5" />
              <span>Pay Balance Online ({formatLKR(ledger.balance)})</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Top Metric Cards (4 Cards) */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total Fee */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4.5 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Total Package Fee
          </span>
          <p className="text-2xl font-black text-slate-900">
            {formatLKR(ledger.totalFee)}
          </p>
          <p className="text-[11px] text-slate-500">
            {ledger.enrolment?.package.code || 'PKG-COMBO'}
          </p>
        </div>

        {/* Card 2: Total Paid */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4.5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
              Total Paid to Date
            </span>
            <span className="rounded-full bg-emerald-100 px-2 py-0.2 text-[10px] font-bold text-emerald-800 border border-emerald-300">
              {ledger.percentagePaid}% Paid
            </span>
          </div>
          <p className="text-2xl font-black text-emerald-700">
            {formatLKR(ledger.totalPaid)}
          </p>
          <div className="h-1.5 w-full rounded-full bg-emerald-200 overflow-hidden mt-1">
            <div
              className="h-full bg-emerald-600 rounded-full"
              style={{ width: `${ledger.percentagePaid}%` }}
            />
          </div>
        </div>

        {/* Card 3: Available / Outstanding Balance */}
        <div className={`rounded-2xl border p-4.5 space-y-1 ${
          ledger.balance === 0
            ? 'border-blue-200 bg-blue-50/40 text-blue-900'
            : 'border-amber-200 bg-amber-50/50 text-amber-950'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Still Available / Due
            </span>
            <span className={`rounded-full px-2 py-0.2 text-[10px] font-bold border ${
              ledger.balance === 0
                ? 'bg-blue-100 text-blue-800 border-blue-300'
                : 'bg-amber-100 text-amber-800 border-amber-300'
            }`}>
              {ledger.balance === 0 ? 'Fully Cleared' : 'Pending Due'}
            </span>
          </div>
          <p className="text-2xl font-black">
            {formatLKR(ledger.balance)}
          </p>
          <p className="text-[11px] opacity-80">
            {ledger.balance === 0 ? 'No outstanding fees pending' : 'Payable prior to final DMT trial'}
          </p>
        </div>

        {/* Card 4: Next Milestone Due */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4.5 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Next Milestone Schedule
          </span>
          <p className="text-base font-bold text-slate-900 mt-1">
            {ledger.balance === 0 ? 'All Dues Cleared' : 'Stage 3 Settlement'}
          </p>
          <p className="text-[11px] text-slate-500 flex items-center gap-1">
            <Calendar className="h-3 w-3 text-slate-400" />
            <span>{ledger.balance === 0 ? '100% Completed' : 'Due: Before Practical Trial'}</span>
          </p>
        </div>
      </div>

      {/* 3. Tab Switcher Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'history'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Receipt className="h-3.5 w-3.5" />
          <span>Payment History &amp; Receipts ({payments.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('milestones')}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'milestones'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Calendar className="h-3.5 w-3.5" />
          <span>Installment Milestones &amp; Due Dates</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('options')}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'options'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Building2 className="h-3.5 w-3.5" />
          <span>Payment Options &amp; Bank Details</span>
        </button>
      </div>

      {/* 4. Tab 1: Payment History & Official Receipts */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Cleared Payment Transactions ({payments.length})
            </h3>
            <p className="text-xs text-slate-500">
              Click &quot;View / Print Receipt&quot; to open the official academy voucher
            </p>
          </div>

          {payments.length === 0 ? (
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 text-center text-xs text-slate-500">
              No payment transactions recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Receipt No</th>
                    <th className="px-4 py-3">Payment Date</th>
                    <th className="px-4 py-3">Amount (LKR)</th>
                    <th className="px-4 py-3">Method</th>
                    <th className="px-4 py-3">Reference / Notes</th>
                    <th className="px-4 py-3 text-right">Official Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3.5 font-mono font-bold text-slate-900">
                        {p.receipt_number}
                      </td>
                      <td className="px-4 py-3.5 text-slate-600">
                        {p.payment_date}
                      </td>
                      <td className="px-4 py-3.5 font-black text-emerald-700 text-sm">
                        {formatLKR(p.amount)}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700 border border-slate-200">
                          {formatPaymentMethod(p.payment_method)}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-500">
                        {p.payment_reference ? (
                          <span className="font-mono text-[11px] text-slate-700 block">{p.payment_reference}</span>
                        ) : null}
                        <span>{p.notes || 'Course Tuition Fee'}</span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenReceipt(p)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-all cursor-pointer"
                        >
                          <Printer className="h-3 w-3" />
                          <span>View Receipt</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 5. Tab 2: Installment Milestones & Due Dates */}
      {activeTab === 'milestones' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Tuition Fee Milestone Installments
            </h3>
            <span className="text-xs text-slate-500">
              Standard 3-Stage Milestone Model
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3.5 md:grid-cols-3">
            {milestones.map((m, idx) => (
              <div
                key={idx}
                className={`rounded-2xl border p-5 space-y-3 transition-all ${
                  m.status === 'completed'
                    ? 'border-emerald-200 bg-emerald-50/40'
                    : m.status === 'due'
                      ? 'border-amber-300 bg-amber-50/50 shadow-sm'
                      : 'border-slate-200 bg-slate-50/50 opacity-75'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900">
                    Stage {idx + 1}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase border ${
                      m.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        : m.status === 'due'
                          ? 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {m.status === 'completed' ? '✔ Cleared' : m.status === 'due' ? '⚠ Due Now' : 'Upcoming'}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 leading-tight">
                    {m.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {m.description}
                  </p>
                </div>

                <div className="border-t border-slate-200/60 pt-3 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Installment Amount:</span>
                    <strong className="font-bold text-slate-900">{formatLKR(m.amount)}</strong>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Target Due Date:</span>
                    <span className="font-semibold text-slate-700">{m.dueDate}</span>
                  </div>

                  {m.completedDate && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Completed On:</span>
                      <span>{m.completedDate}</span>
                    </div>
                  )}

                  {m.method && (
                    <div className="flex justify-between text-slate-500">
                      <span>Channel:</span>
                      <span>{m.method}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Tab 3: Payment Options & Bank Details */}
      {activeTab === 'options' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Accepted Payment Channels &amp; Instructions
            </h3>
            <span className="text-xs text-slate-500">
              Royal Driving Academy (Pvt) Ltd
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Channel 1: Bank Transfer */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Building2 className="h-4 w-4 text-blue-600" />
                <span>1. Direct Bank Transfer / Online Banking</span>
              </div>
              <p className="text-xs text-slate-500">
                Transfer via your mobile banking app (CEFT / SLIPS / Online Transfer) to our official account:
              </p>

              <div className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Bank Name:</span>
                  <strong className="text-slate-900">Commercial Bank of Ceylon PLC</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Account Name:</span>
                  <strong className="text-slate-900">Royal Driving Academy (Pvt) Ltd</strong>
                </div>
                <div className="flex items-center justify-between bg-blue-50/60 p-2 rounded-lg border border-blue-100">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-blue-700 block">Account Number</span>
                    <strong className="font-mono text-sm text-blue-950">1000 2489 7712</strong>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyAccountNo}
                    className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-blue-700 cursor-pointer transition-all"
                  >
                    {copiedBankNo ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedBankNo ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Branch:</span>
                  <span className="text-slate-800 font-semibold">Nugegoda Branch (Branch Code: 042)</span>
                </div>
                <div className="border-t border-slate-100 pt-1.5 text-[11px] text-amber-800">
                  ⚠️ <strong>Important:</strong> Put your Admission Number (<strong>{ledger.student.admission_number}</strong>) in the transaction reference/remarks.
                </div>
              </div>
            </div>

            {/* Channel 2: Front Desk & POS */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <DollarSign className="h-4 w-4 text-emerald-600" />
                <span>2. Cash &amp; Card at Academy Front Desk</span>
              </div>
              <p className="text-xs text-slate-500">
                Visit any of our registered academy branches to pay via cash, debit card, or credit card POS:
              </p>

              <div className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-2.5 text-xs">
                <div className="space-y-1">
                  <span className="text-slate-500 font-semibold block">Main Campus (Nugegoda):</span>
                  <p className="text-slate-800 font-medium">No. 142 High Level Road, Nugegoda • Tel: 011 281 9000</p>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-500 font-semibold block">Counter Operating Hours:</span>
                  <ul className="list-disc pl-4 text-slate-700 space-y-0.5 text-[11px]">
                    <li>Monday – Saturday: 8:00 AM – 5:30 PM</li>
                    <li>Sunday: 8:30 AM – 1:00 PM (Theory Class Days)</li>
                  </ul>
                </div>

                <div className="border-t border-slate-100 pt-1.5 text-[11px] text-slate-500">
                  Instant printed physical receipt is issued immediately at the reception counter.
                </div>
              </div>
            </div>

            {/* Channel 3: Online Gateway Card Payment */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <CreditCard className="h-4 w-4 text-purple-600" />
                <span>3. Online Card Payment Gateway (Instant Clearance)</span>
              </div>
              <p className="text-xs text-slate-500">
                Pay directly from the student portal with Visa, MasterCard, or LankaPay:
              </p>

              <div className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-3 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Supported Cards:</span>
                  <span className="font-bold text-slate-800">Visa • MasterCard • LankaPay</span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span>Outstanding Balance:</span>
                  <strong className="text-slate-900 text-sm">{formatLKR(ledger.balance)}</strong>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setPayAmount(ledger.balance > 0 ? ledger.balance : 15000)
                    setIsPayOnlineModalOpen(true)
                  }}
                  className="w-full rounded-xl bg-purple-600 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-purple-700 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <CreditCard className="h-3.5 w-3.5" />
                  <span>Launch Online Payment Portal</span>
                </button>
              </div>
            </div>

            {/* Channel 4: LankaQR Scan */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <QrCode className="h-4 w-4 text-emerald-600" />
                <span>4. LankaQR Instant Mobile Payment</span>
              </div>
              <p className="text-xs text-slate-500">
                Scan with your favorite banking app (Commercial Bank Q+, Flash, FriMi, Genie, iPay):
              </p>

              <div className="rounded-xl border border-slate-200 bg-white p-3.5 flex items-center gap-4 text-xs">
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-slate-900 text-white shrink-0">
                  <QrCode className="h-10 w-10" />
                </div>
                <div className="space-y-1">
                  <strong className="text-slate-900 block">LankaQR National Standard</strong>
                  <p className="text-[11px] text-slate-500">
                    Merchant ID: <span className="font-mono font-bold text-slate-700">LQR-9810-ROYAL</span>
                  </p>
                  <p className="text-[10px] text-emerald-700 font-semibold">
                    Zero transaction fee for student tuition
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Receipt Modal */}
      {selectedPaymentForReceipt && (
        <PaymentReceiptModal
          isOpen={isReceiptModalOpen}
          onClose={() => {
            setIsReceiptModalOpen(false)
            setSelectedPaymentForReceipt(null)
          }}
          payment={selectedPaymentForReceipt}
          ledger={ledger}
        />
      )}

      {/* Online Payment Simulator Modal */}
      {isPayOnlineModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Online Tuition Payment Gateway
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPayOnlineModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {paySuccessMsg && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800">
                {paySuccessMsg}
              </div>
            )}

            <form onSubmit={handleExecuteOnlinePayment} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Student Name &amp; Admission
                </label>
                <input
                  type="text"
                  disabled
                  value={`${ledger.student.full_name} (${ledger.student.admission_number})`}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Payment Amount (LKR) *
                </label>
                <input
                  type="number"
                  min="1000"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-black text-slate-900 focus:border-blue-500 focus:outline-none"
                />
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Outstanding balance: {formatLKR(ledger.balance)}
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Payment Method *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPayMethod('card')}
                    className={`rounded-xl p-2.5 text-center font-bold border cursor-pointer transition-all ${
                      payMethod === 'card'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    💳 Card (Visa/Master)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayMethod('bank_transfer')}
                    className={`rounded-xl p-2.5 text-center font-bold border cursor-pointer transition-all ${
                      payMethod === 'bank_transfer'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    🏦 Bank Transfer Slip
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Transaction Reference / Card Last 4
                </label>
                <input
                  type="text"
                  placeholder="e.g. BOC-TXN-881920 or Card ending 4412"
                  value={payReference}
                  onChange={(e) => setPayReference(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Remarks / Purpose
                </label>
                <input
                  type="text"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPayOnlineModalOpen(false)}
                  className="w-1/2 rounded-xl border border-slate-300 py-2.5 font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPay}
                  className="w-1/2 rounded-xl bg-emerald-600 py-2.5 font-bold text-white shadow-md hover:bg-emerald-700 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingPay ? 'Processing...' : `Confirm & Pay ${formatLKR(payAmount)}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}

export default StudentPaymentsSection
