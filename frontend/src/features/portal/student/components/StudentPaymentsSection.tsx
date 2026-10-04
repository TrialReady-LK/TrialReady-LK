import React, { useState, useRef } from 'react'
import {
  CreditCard,
  CheckCircle2,
  Clock,
  Printer,
  Copy,
  Check,
  Building2,
  Receipt,
  Calendar,
  DollarSign,
  Wallet,
  UploadCloud,
  FileText,
  Image as ImageIcon,
  Trash2,
  Lock,
  ShieldCheck,
  AlertCircle,
  X,
  FileCheck,
  Globe,
  Sparkles,
  Zap,
  Percent,
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
  const [payMethod, setPayMethod] = useState<'card' | 'bank_transfer' | 'paypal' | 'koko' | 'mintpay'>('card')
  const [payReference, setPayReference] = useState('')
  const [payNotes, setPayNotes] = useState('Online Course Installment')
  const [isSubmittingPay, setIsSubmittingPay] = useState(false)
  const [paySuccessMsg, setPaySuccessMsg] = useState<string | null>(null)
  const [formErrorMsg, setFormErrorMsg] = useState<string | null>(null)

  // Card Details State
  const [cardHolder, setCardHolder] = useState(ledger?.student.full_name || '')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [saveCard, setSaveCard] = useState(true)

  // PayPal Details State
  const [paypalEmail, setPaypalEmail] = useState(
    ledger?.student ? `${ledger.student.admission_number.toLowerCase().replace(/[^a-z0-9]/g, '') || 'student'}@gmail.com` : 'student@gmail.com',
  )
  const [paypalFundingSource, setPaypalFundingSource] = useState<'balance' | 'linked_card'>('balance')

  // Koko BNPL Details State
  const [kokoPhone, setKokoPhone] = useState(ledger?.student.phone || '077 123 4567')
  const [kokoCardType, setKokoCardType] = useState<'debit' | 'credit'>('debit')

  // Mintpay BNPL Details State
  const [mintpayPhone, setMintpayPhone] = useState(ledger?.student.phone || '077 123 4567')
  const [mintpayCardType, setMintpayCardType] = useState<'debit' | 'credit'>('debit')

  // Bank Slip Upload State
  const [bankName, setBankName] = useState('Commercial Bank of Ceylon PLC')
  const [depositDate, setDepositDate] = useState(new Date().toISOString().split('T')[0])
  const [slipFile, setSlipFile] = useState<File | null>(null)
  const [slipPreviewUrl, setSlipPreviewUrl] = useState<string | null>(null)
  const [isDraggingFile, setIsDraggingFile] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const detectCardBrand = (num: string) => {
    const clean = num.replace(/\s+/g, '')
    if (clean.startsWith('4')) return { brand: 'Visa', badge: 'VISA', bg: 'bg-blue-600 text-white' }
    if (/^5[1-5]/.test(clean) || /^2[2-7]/.test(clean)) return { brand: 'MasterCard', badge: 'Mastercard', bg: 'bg-orange-600 text-white' }
    if (/^3[47]/.test(clean)) return { brand: 'Amex', badge: 'AMEX', bg: 'bg-sky-600 text-white' }
    if (clean.startsWith('6')) return { brand: 'LankaPay', badge: 'LankaPay', bg: 'bg-emerald-600 text-white' }
    return { brand: 'Card', badge: 'Card', bg: 'bg-slate-700 text-white' }
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16)
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw
    setCardNumber(formatted)
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4)
    if (val.length >= 3) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`
    }
    setCardExpiry(val)
  }

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4)
    setCardCvv(val)
  }

  const handleFileSelect = (file: File | null) => {
    if (!file) return
    const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
    if (!allowed.includes(file.type)) {
      setFormErrorMsg('Invalid file format. Please upload a PNG, JPG, or PDF bank deposit slip.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setFormErrorMsg('File exceeds 5MB limit. Please upload a smaller deposit slip.')
      return
    }
    setFormErrorMsg(null)
    setSlipFile(file)
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setSlipPreviewUrl(ev.target?.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setSlipPreviewUrl(null)
    }
  }

  const handleRemoveFile = () => {
    setSlipFile(null)
    setSlipPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleOpenPayModal = (
    amount?: number,
    defaultMethod?: 'card' | 'bank_transfer' | 'paypal' | 'koko' | 'mintpay',
  ) => {
    setPayAmount(amount !== undefined ? amount : (ledger.balance > 0 ? ledger.balance : 20000))
    if (defaultMethod) setPayMethod(defaultMethod)
    setCardHolder(ledger.student.full_name || '')
    setCardNumber('')
    setCardExpiry('')
    setCardCvv('')
    setPaypalEmail(
      ledger?.student ? `${ledger.student.admission_number.toLowerCase().replace(/[^a-z0-9]/g, '') || 'student'}@gmail.com` : 'student@gmail.com',
    )
    setKokoPhone(ledger?.student.phone || '077 123 4567')
    setMintpayPhone(ledger?.student.phone || '077 123 4567')
    setSlipFile(null)
    setSlipPreviewUrl(null)
    setFormErrorMsg(null)
    setPaySuccessMsg(null)
    setPayReference('')
    setPayNotes('Online Course Installment')
    setIsPayOnlineModalOpen(true)
  }

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
    setFormErrorMsg(null)

    if (payAmount <= 0) {
      setFormErrorMsg('Please enter a valid payment amount greater than LKR 0.')
      return
    }

    if (payMethod === 'card') {
      const clean = cardNumber.replace(/\s+/g, '')
      if (clean.length < 15) {
        setFormErrorMsg('Please enter a valid 16-digit credit/debit card number.')
        return
      }
      if (!cardExpiry || cardExpiry.length < 5) {
        setFormErrorMsg('Please enter a valid card expiry date (MM/YY).')
        return
      }
      if (!cardCvv || cardCvv.length < 3) {
        setFormErrorMsg('Please enter a valid 3 or 4-digit CVV security code.')
        return
      }
    }

    if (payMethod === 'bank_transfer') {
      if (!payReference && !slipFile) {
        setFormErrorMsg('Please provide the Bank Transaction Reference ID or attach your deposit slip.')
        return
      }
    }

    if (payMethod === 'paypal') {
      if (!paypalEmail || !paypalEmail.includes('@')) {
        setFormErrorMsg('Please enter a valid PayPal account email address.')
        return
      }
    }

    if (payMethod === 'koko') {
      const cleanPhone = kokoPhone.replace(/\s+/g, '')
      if (!cleanPhone || cleanPhone.length < 9) {
        setFormErrorMsg('Please enter a valid Koko-registered Sri Lankan mobile number.')
        return
      }
    }

    if (payMethod === 'mintpay') {
      const cleanPhone = mintpayPhone.replace(/\s+/g, '')
      if (!cleanPhone || cleanPhone.length < 9) {
        setFormErrorMsg('Please enter a valid Mintpay-registered mobile number.')
        return
      }
    }

    try {
      setIsSubmittingPay(true)

      const cardInfo = detectCardBrand(cardNumber)
      const cleanCard = cardNumber.replace(/\s+/g, '')
      const last4 = cleanCard.slice(-4) || '4412'

      const generatedReference =
        payMethod === 'card'
          ? (payReference.trim() || `CARD-${cardInfo.badge.toUpperCase()}-${last4}-${Date.now().toString().slice(-4)}`)
          : payMethod === 'bank_transfer'
          ? (payReference.trim() || `DEP-${bankName.split(' ')[0].toUpperCase()}-${Date.now().toString().slice(-6)}`)
          : payMethod === 'paypal'
          ? (payReference.trim() || `PP-EXP-${Date.now().toString().slice(-6)}`)
          : payMethod === 'koko'
          ? (payReference.trim() || `KOKO-3X-${Date.now().toString().slice(-6)}`)
          : (payReference.trim() || `MINTPAY-3X-${Date.now().toString().slice(-6)}`)

      const installmentPart = Math.round(payAmount / 3)
      const generatedNotes =
        payMethod === 'card'
          ? `${payNotes || 'Online Card Payment'} [${cardInfo.brand} •••• ${last4} | Holder: ${cardHolder || ledger.student.full_name}]`
          : payMethod === 'bank_transfer'
          ? `${payNotes || 'Tuition Bank Deposit'} [${bankName} | Date: ${depositDate}${slipFile ? ` | Slip: ${slipFile.name}` : ''}]`
          : payMethod === 'paypal'
          ? `${payNotes || 'PayPal Express Checkout'} [Account: ${paypalEmail} | Source: ${paypalFundingSource === 'balance' ? 'PayPal Balance' : 'Linked Card'} | Amount: ${formatLKR(payAmount)}]`
          : payMethod === 'koko'
          ? `${payNotes || 'Koko BNPL (3x Installments)'} [Phone: ${kokoPhone} | 1st Inst: ${formatLKR(installmentPart)} | 3x ${formatLKR(installmentPart)} | ${kokoCardType.toUpperCase()}]`
          : `${payNotes || 'Mintpay BNPL (3x Installments)'} [Account: ${mintpayPhone} | 3x ${formatLKR(installmentPart)} | ${mintpayCardType.toUpperCase()}]`

      const recorded = await recordStudentPayment({
        driving_school_id: drivingSchoolId,
        student_id: ledger.student.id,
        enrolment_id: ledger.enrolment?.id,
        amount: payAmount,
        payment_date: payMethod === 'bank_transfer' ? depositDate : new Date().toISOString().split('T')[0],
        payment_method: payMethod,
        payment_reference: generatedReference,
        notes: generatedNotes,
      })

      setPaySuccessMsg(`Payment of ${formatLKR(payAmount)} processed successfully via ${formatPaymentMethod(payMethod)}! Receipt: ${recorded.receipt_number}`)
      setTimeout(() => {
        setPaySuccessMsg(null)
        setIsPayOnlineModalOpen(false)
        if (onPaymentRecorded) onPaymentRecorded()
        handleOpenReceipt(recorded)
      }, 1500)
    } catch {
      setFormErrorMsg('Failed to process payment. Please verify your details and try again.')
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
              onClick={() => handleOpenPayModal(ledger.balance, 'card')}
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

              <button
                type="button"
                onClick={() => handleOpenPayModal(ledger.balance > 0 ? ledger.balance : 15000, 'bank_transfer')}
                className="w-full rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <UploadCloud className="h-3.5 w-3.5" />
                <span>Attach &amp; Submit Bank Transfer Slip</span>
              </button>
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
                  onClick={() => handleOpenPayModal(ledger.balance > 0 ? ledger.balance : 15000, 'card')}
                  className="w-full rounded-xl bg-purple-600 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-purple-700 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <CreditCard className="h-3.5 w-3.5" />
                  <span>Launch Online Card Portal</span>
                </button>
              </div>
            </div>

            {/* Channel 4: PayPal Express & International Payments */}
            <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Globe className="h-4 w-4 text-blue-600" />
                  <span>4. PayPal Express (International Checkout)</span>
                </div>
                <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">
                  Global / USD &amp; LKR
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Pay tuition instantly using your PayPal balance, linked overseas bank cards, or PayPal Credit:
              </p>

              <div className="rounded-xl border border-blue-100 bg-white p-3.5 space-y-3 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Funding Options:</span>
                  <span className="font-bold text-slate-800">PayPal Balance • Visa/Master/Amex • PayPal Credit</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Current Balance Due:</span>
                  <strong className="text-blue-900 text-sm">{formatLKR(ledger.balance)}</strong>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenPayModal(ledger.balance > 0 ? ledger.balance : 15000, 'paypal')}
                  className="w-full rounded-xl bg-gradient-to-r from-blue-700 to-sky-600 py-2.5 text-xs font-bold text-white shadow-xs hover:from-blue-800 hover:to-sky-700 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Globe className="h-3.5 w-3.5" />
                  <span>Launch PayPal Checkout</span>
                </button>
              </div>
            </div>

            {/* Channel 5: Koko BNPL (3x Interest-Free Installments) */}
            <div className="rounded-2xl border border-pink-200 bg-pink-50/40 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Sparkles className="h-4 w-4 text-pink-600" />
                  <span>5. Koko: Buy Now, Pay Later (3x Installments)</span>
                </div>
                <span className="rounded-md bg-pink-100 px-2 py-0.5 text-[10px] font-bold text-pink-700">
                  0% Interest
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Split your driving academy tuition into 3 easy monthly payments with zero interest using your Debit or Credit Card:
              </p>

              <div className="rounded-xl border border-pink-100 bg-white p-3.5 space-y-3 text-xs">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-pink-50/70 p-2 border border-pink-100">
                    <span className="text-[10px] font-bold text-pink-800 block">Today (1/3)</span>
                    <span className="text-xs font-black text-pink-900 mt-0.5 block">
                      {formatLKR(Math.round((ledger.balance > 0 ? ledger.balance : 15000) / 3))}
                    </span>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-2 border border-slate-100">
                    <span className="text-[10px] font-semibold text-slate-500 block">In 30 Days</span>
                    <span className="text-xs font-bold text-slate-700 mt-0.5 block">
                      {formatLKR(Math.round((ledger.balance > 0 ? ledger.balance : 15000) / 3))}
                    </span>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-2 border border-slate-100">
                    <span className="text-[10px] font-semibold text-slate-500 block">In 60 Days</span>
                    <span className="text-xs font-bold text-slate-700 mt-0.5 block">
                      {formatLKR(Math.round((ledger.balance > 0 ? ledger.balance : 15000) / 3))}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenPayModal(ledger.balance > 0 ? ledger.balance : 15000, 'koko')}
                  className="w-full rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 py-2.5 text-xs font-bold text-white shadow-xs hover:from-pink-700 hover:to-rose-700 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Percent className="h-3.5 w-3.5" />
                  <span>Pay with Koko (3x Installments)</span>
                </button>
              </div>
            </div>

            {/* Channel 6: Mintpay BNPL (3x Installments) */}
            <div className="rounded-2xl border border-teal-200 bg-teal-50/40 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Zap className="h-4 w-4 text-teal-600" />
                  <span>6. Mintpay: Split in 3 (Debit / Credit)</span>
                </div>
                <span className="rounded-md bg-teal-100 px-2 py-0.5 text-[10px] font-bold text-teal-800">
                  Instant Approval + Cashback
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Pay in 3 equal monthly installments. Works seamlessly with any Sri Lankan debit or credit card:
              </p>

              <div className="rounded-xl border border-teal-100 bg-white p-3.5 space-y-3 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Pay Today (1st Part):</span>
                  <strong className="text-teal-900 text-sm">
                    {formatLKR(Math.round((ledger.balance > 0 ? ledger.balance : 15000) / 3))}
                  </strong>
                </div>
                <div className="flex items-center justify-between text-[11px] text-teal-700 font-medium">
                  <span>• 0% Interest Guaranteed</span>
                  <span>• Automatic Monthly Deductions</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenPayModal(ledger.balance > 0 ? ledger.balance : 15000, 'mintpay')}
                  className="w-full rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 py-2.5 text-xs font-bold text-white shadow-xs hover:from-teal-700 hover:to-emerald-700 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Zap className="h-3.5 w-3.5" />
                  <span>Pay with Mintpay (Split in 3)</span>
                </button>
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

      {/* Online Payment & Bank Slip Gateway Modal */}
      {isPayOnlineModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
                    payMethod === 'card'
                      ? 'bg-purple-50 text-purple-600 border-purple-200'
                      : payMethod === 'bank_transfer'
                      ? 'bg-blue-50 text-blue-600 border-blue-200'
                      : payMethod === 'paypal'
                      ? 'bg-sky-50 text-sky-700 border-sky-200'
                      : payMethod === 'koko'
                      ? 'bg-pink-50 text-pink-600 border-pink-200'
                      : 'bg-teal-50 text-teal-700 border-teal-200'
                  }`}
                >
                  {payMethod === 'card' ? (
                    <CreditCard className="h-5 w-5" />
                  ) : payMethod === 'bank_transfer' ? (
                    <UploadCloud className="h-5 w-5" />
                  ) : payMethod === 'paypal' ? (
                    <Globe className="h-5 w-5" />
                  ) : payMethod === 'koko' ? (
                    <Sparkles className="h-5 w-5" />
                  ) : (
                    <Zap className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Online Tuition Payment Gateway
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {payMethod === 'card'
                      ? 'Instant Secure Credit/Debit Card Checkout'
                      : payMethod === 'bank_transfer'
                      ? 'Bank Transfer & Slip Verification Portal'
                      : payMethod === 'paypal'
                      ? 'PayPal Express & International Checkout'
                      : payMethod === 'koko'
                      ? 'Koko Pay - 3x Interest-Free Monthly Installments'
                      : 'Mintpay - Split Tuition into 3 Equal Monthly Payments'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPayOnlineModalOpen(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Success & Error Banners */}
            {paySuccessMsg && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 flex items-start gap-2.5">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">{paySuccessMsg}</p>
                  <p className="text-[11px] text-emerald-700 mt-0.5">Generating your official receipt voucher...</p>
                </div>
              </div>
            )}

            {formErrorMsg && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-semibold text-rose-800 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                <span>{formErrorMsg}</span>
              </div>
            )}

            {/* Student & Course Badge Bar */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Learner Profile</span>
                <p className="font-bold text-slate-900">{ledger.student.full_name} <span className="font-mono font-normal text-slate-500">({ledger.student.admission_number})</span></p>
              </div>
              <div className="text-right space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Outstanding Balance</span>
                <p className="font-black text-amber-600 text-sm">{formatLKR(ledger.balance)}</p>
              </div>
            </div>

            <form onSubmit={handleExecuteOnlinePayment} className="space-y-4 text-xs">
              {/* Payment Amount */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Payment Amount (LKR) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-black text-slate-400 text-sm">
                    Rs.
                  </span>
                  <input
                    type="number"
                    min="500"
                    step="500"
                    required
                    value={payAmount}
                    onChange={(e) => setPayAmount(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 pl-11 pr-3 py-2.5 text-sm font-black text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                {ledger.balance > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <button
                      type="button"
                      onClick={() => setPayAmount(ledger.balance)}
                      className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                    >
                      Full Balance ({formatLKR(ledger.balance)})
                    </button>
                    {ledger.balance > 10000 && (
                      <button
                        type="button"
                        onClick={() => setPayAmount(Math.round(ledger.balance / 2))}
                        className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                      >
                        50% ({formatLKR(Math.round(ledger.balance / 2))})
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setPayAmount(10000)}
                      className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                    >
                      LKR 10,000
                    </button>
                    <button
                      type="button"
                      onClick={() => setPayAmount(20000)}
                      className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                    >
                      LKR 20,000
                    </button>
                  </div>
                )}
              </div>

              {/* Payment Method Selector (5 Options) */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Select Payment Option *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {/* Option 1: Card */}
                  <button
                    type="button"
                    onClick={() => {
                      setPayMethod('card')
                      setFormErrorMsg(null)
                    }}
                    className={`rounded-xl p-3 text-left border cursor-pointer transition-all flex flex-col justify-between gap-1 ${
                      payMethod === 'card'
                        ? 'border-purple-600 bg-purple-50/80 text-purple-950 ring-2 ring-purple-600/20 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold flex items-center gap-1.5 text-xs text-purple-900">
                        <CreditCard className="h-4 w-4 text-purple-600 shrink-0" />
                        <span>Card (Visa/Master)</span>
                      </span>
                      {payMethod === 'card' && <CheckCircle2 className="h-3.5 w-3.5 text-purple-600" />}
                    </div>
                    <span className="text-[10px] text-slate-500">Instant gateway clearance</span>
                  </button>

                  {/* Option 2: Bank Transfer */}
                  <button
                    type="button"
                    onClick={() => {
                      setPayMethod('bank_transfer')
                      setFormErrorMsg(null)
                    }}
                    className={`rounded-xl p-3 text-left border cursor-pointer transition-all flex flex-col justify-between gap-1 ${
                      payMethod === 'bank_transfer'
                        ? 'border-blue-600 bg-blue-50/80 text-blue-950 ring-2 ring-blue-600/20 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold flex items-center gap-1.5 text-xs text-blue-900">
                        <Building2 className="h-4 w-4 text-blue-600 shrink-0" />
                        <span>Bank Transfer Slip</span>
                      </span>
                      {payMethod === 'bank_transfer' && <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />}
                    </div>
                    <span className="text-[10px] text-slate-500">Attach deposit receipt</span>
                  </button>

                  {/* Option 3: PayPal */}
                  <button
                    type="button"
                    onClick={() => {
                      setPayMethod('paypal')
                      setFormErrorMsg(null)
                    }}
                    className={`rounded-xl p-3 text-left border cursor-pointer transition-all flex flex-col justify-between gap-1 ${
                      payMethod === 'paypal'
                        ? 'border-sky-600 bg-sky-50/80 text-sky-950 ring-2 ring-sky-600/20 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold flex items-center gap-1.5 text-xs text-sky-900">
                        <Globe className="h-4 w-4 text-sky-600 shrink-0" />
                        <span>PayPal Express</span>
                      </span>
                      {payMethod === 'paypal' && <CheckCircle2 className="h-3.5 w-3.5 text-sky-600" />}
                    </div>
                    <span className="text-[10px] text-slate-500">Global &amp; USD checkout</span>
                  </button>

                  {/* Option 4: Koko BNPL */}
                  <button
                    type="button"
                    onClick={() => {
                      setPayMethod('koko')
                      setFormErrorMsg(null)
                    }}
                    className={`rounded-xl p-3 text-left border cursor-pointer transition-all flex flex-col justify-between gap-1 ${
                      payMethod === 'koko'
                        ? 'border-pink-600 bg-pink-50/80 text-pink-950 ring-2 ring-pink-600/20 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold flex items-center gap-1.5 text-xs text-pink-900">
                        <Sparkles className="h-4 w-4 text-pink-600 shrink-0" />
                        <span>Koko (3x BNPL)</span>
                      </span>
                      {payMethod === 'koko' && <CheckCircle2 className="h-3.5 w-3.5 text-pink-600" />}
                    </div>
                    <span className="text-[10px] text-pink-700 font-semibold">3 interest-free parts</span>
                  </button>

                  {/* Option 5: Mintpay BNPL */}
                  <button
                    type="button"
                    onClick={() => {
                      setPayMethod('mintpay')
                      setFormErrorMsg(null)
                    }}
                    className={`rounded-xl p-3 text-left border cursor-pointer transition-all flex flex-col justify-between gap-1 ${
                      payMethod === 'mintpay'
                        ? 'border-teal-600 bg-teal-50/80 text-teal-950 ring-2 ring-teal-600/20 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold flex items-center gap-1.5 text-xs text-teal-900">
                        <Zap className="h-4 w-4 text-teal-600 shrink-0" />
                        <span>Mintpay (BNPL)</span>
                      </span>
                      {payMethod === 'mintpay' && <CheckCircle2 className="h-3.5 w-3.5 text-teal-600" />}
                    </div>
                    <span className="text-[10px] text-teal-700 font-semibold">Split in 3 + Cashback</span>
                  </button>
                </div>
              </div>

              {/* ========================================================= */}
              {/* CONDITIONAL SECTION 1: CARD DETAILS (Visa / Master / LP)  */}
              {/* ========================================================= */}
              {payMethod === 'card' && (
                <div className="space-y-3.5 rounded-2xl border border-purple-100 bg-purple-50/30 p-4 transition-all animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-purple-100 pb-2">
                    <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                      <CreditCard className="h-3.5 w-3.5 text-purple-600" />
                      Card Details &amp; Verification
                    </span>
                    <span className="text-[10px] font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">
                      Visa • Mastercard • LankaPay
                    </span>
                  </div>

                  {/* Cardholder Name */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Cardholder Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. K. L. Ravishka Rathnayaka"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>

                  {/* Card Number with Brand Badge */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Card Number *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={19}
                        required
                        placeholder="4532 •••• •••• 8821"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 pr-20 text-xs font-mono font-bold text-slate-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none tracking-wider"
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        {cardNumber ? (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${detectCardBrand(cardNumber).bg}`}>
                            {detectCardBrand(cardNumber).badge}
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-bold text-slate-400">
                            CARD
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expiry Date & CVV (2 Columns) */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Expiry Date (MM/YY) *
                      </label>
                      <input
                        type="text"
                        maxLength={5}
                        required
                        placeholder="MM / YY"
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none text-center"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block font-semibold text-slate-700">
                          CVV / CVC *
                        </label>
                        <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                          <Lock className="h-2.5 w-2.5" /> 3-4 digits
                        </span>
                      </div>
                      <input
                        type="password"
                        maxLength={4}
                        required
                        placeholder="•••"
                        value={cardCvv}
                        onChange={handleCvvChange}
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none text-center"
                      />
                    </div>
                  </div>

                  {/* Save Card Toggle */}
                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={saveCard}
                      onChange={(e) => setSaveCard(e.target.checked)}
                      className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 h-3.5 w-3.5"
                    />
                    <span className="text-[11px] text-slate-600">
                      Save card token safely for upcoming milestone installment settlements
                    </span>
                  </label>

                  {/* Security Banner */}
                  <div className="flex items-center gap-2 rounded-xl bg-purple-100/60 p-2.5 text-[11px] text-purple-900">
                    <ShieldCheck className="h-4 w-4 text-purple-700 shrink-0" />
                    <span>256-bit SSL Bank-Grade Encryption • Direct LankaPay Switch</span>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* CONDITIONAL SECTION 2: BANK TRANSFER SLIP ATTACHMENT      */}
              {/* ========================================================= */}
              {payMethod === 'bank_transfer' && (
                <div className="space-y-3.5 rounded-2xl border border-blue-100 bg-blue-50/30 p-4 transition-all animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-blue-100 pb-2">
                    <span className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-blue-600" />
                      Bank Transfer Details &amp; Slip Attachment
                    </span>
                    <span className="text-[10px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                      CEFT / SLIPS / Counter Deposit
                    </span>
                  </div>

                  {/* Bank Name Selector & Deposit Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Deposited / Transferred Bank *
                      </label>
                      <select
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="Commercial Bank of Ceylon PLC">Commercial Bank of Ceylon PLC</option>
                        <option value="Bank of Ceylon (BOC)">Bank of Ceylon (BOC)</option>
                        <option value="Sampath Bank PLC">Sampath Bank PLC</option>
                        <option value="Hatton National Bank (HNB)">Hatton National Bank (HNB)</option>
                        <option value="People's Bank">People&apos;s Bank</option>
                        <option value="Nations Trust Bank (NTB)">Nations Trust Bank (NTB)</option>
                        <option value="Seylan Bank PLC">Seylan Bank PLC</option>
                        <option value="National Savings Bank (NSB)">National Savings Bank (NSB)</option>
                        <option value="Other Bank / Online Transfer">Other Bank / Online Transfer</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Deposit / Transfer Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={depositDate}
                        max={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setDepositDate(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Transaction Reference Number */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Bank Reference / Transaction / Deposit ID *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. BOC-TXN-881920 or COMB-DEP-09412"
                      value={payReference}
                      onChange={(e) => setPayReference(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Bank Deposit Slip Attachment Area */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">
                      Attach Bank Slip / Screenshot *
                    </label>

                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/png, image/jpeg, image/jpg, application/pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null
                        handleFileSelect(file)
                      }}
                    />

                    {!slipFile ? (
                      <div
                        onDragOver={(e) => {
                          e.preventDefault()
                          setIsDraggingFile(true)
                        }}
                        onDragLeave={() => setIsDraggingFile(false)}
                        onDrop={(e) => {
                          e.preventDefault()
                          setIsDraggingFile(false)
                          const file = e.dataTransfer.files?.[0] || null
                          handleFileSelect(file)
                        }}
                        onClick={() => fileInputRef.current?.click()}
                        className={`rounded-2xl border-2 border-dashed p-4 text-center cursor-pointer transition-all ${
                          isDraggingFile
                            ? 'border-blue-500 bg-blue-100/50'
                            : 'border-slate-300 bg-white hover:border-blue-400 hover:bg-slate-50'
                        }`}
                      >
                        <UploadCloud className="mx-auto h-8 w-8 text-blue-500" />
                        <p className="mt-1 font-bold text-slate-800">
                          Click to browse or drag &amp; drop bank slip here
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Supports PNG, JPG, JPEG, or PDF receipt (Max 5MB)
                        </p>
                        <button
                          type="button"
                          className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 border border-blue-200 hover:bg-blue-100"
                        >
                          <ImageIcon className="h-3 w-3" />
                          <span>Choose Slip Document</span>
                        </button>
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-3.5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 overflow-hidden">
                          {slipPreviewUrl ? (
                            <img
                              src={slipPreviewUrl}
                              alt="Slip Preview"
                              className="h-14 w-14 rounded-xl object-cover border border-emerald-300 shrink-0 bg-white"
                            />
                          ) : (
                            <div className="h-14 w-14 rounded-xl bg-emerald-100 border border-emerald-300 flex flex-col items-center justify-center shrink-0 text-emerald-800">
                              <FileText className="h-6 w-6" />
                              <span className="text-[9px] font-black uppercase">PDF</span>
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                              <FileCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                              <span className="truncate">{slipFile.name}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {(slipFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for audit submission
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          className="rounded-xl border border-rose-200 bg-rose-50 p-2 text-rose-600 hover:bg-rose-100 transition-colors shrink-0 cursor-pointer"
                          title="Remove attached slip"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Verification Notice */}
                  <div className="flex items-start gap-2 rounded-xl bg-blue-100/60 p-2.5 text-[11px] text-blue-900">
                    <AlertCircle className="h-4 w-4 text-blue-700 shrink-0 mt-0.5" />
                    <span>
                      Your attached deposit slip will be cross-checked by the academy bursar within 2-4 business hours. The official receipt will be generated automatically.
                    </span>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* CONDITIONAL SECTION 3: PAYPAL EXPRESS CHECKOUT            */}
              {/* ========================================================= */}
              {payMethod === 'paypal' && (
                <div className="space-y-3.5 rounded-2xl border border-sky-200 bg-sky-50/30 p-4 transition-all animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-sky-100 pb-2">
                    <span className="text-xs font-bold text-sky-950 flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5 text-sky-600" />
                      PayPal Express &amp; Global Account Details
                    </span>
                    <span className="text-[10px] font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded-md">
                      PayPal Verified • Global Access
                    </span>
                  </div>

                  {/* PayPal Email */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      PayPal Account Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. yourname@gmail.com"
                      value={paypalEmail}
                      onChange={(e) => setPaypalEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  {/* Funding Source Selector */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">
                      Preferred PayPal Funding Source
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <label className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer ${
                        paypalFundingSource === 'balance' ? 'border-sky-500 bg-sky-50/80 text-sky-900 font-bold' : 'border-slate-200 bg-white text-slate-600'
                      }`}>
                        <input
                          type="radio"
                          name="paypal_funding"
                          checked={paypalFundingSource === 'balance'}
                          onChange={() => setPaypalFundingSource('balance')}
                          className="text-sky-600 focus:ring-sky-500"
                        />
                        <span className="text-[11px]">PayPal Balance</span>
                      </label>
                      <label className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer ${
                        paypalFundingSource === 'linked_card' ? 'border-sky-500 bg-sky-50/80 text-sky-900 font-bold' : 'border-slate-200 bg-white text-slate-600'
                      }`}>
                        <input
                          type="radio"
                          name="paypal_funding"
                          checked={paypalFundingSource === 'linked_card'}
                          onChange={() => setPaypalFundingSource('linked_card')}
                          className="text-sky-600 focus:ring-sky-500"
                        />
                        <span className="text-[11px]">Linked International Card</span>
                      </label>
                    </div>
                  </div>

                  {/* USD Conversion Estimate */}
                  <div className="rounded-xl bg-white border border-sky-100 p-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Estimated USD Amount</span>
                      <strong className="text-sky-900 text-sm font-black">
                        ${(payAmount / 300).toFixed(2)} USD
                      </strong>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      Standard FX rate @ 1 USD ≈ 300 LKR
                    </span>
                  </div>

                  {/* PayPal Security Banner */}
                  <div className="flex items-center gap-2 rounded-xl bg-sky-100/60 p-2.5 text-[11px] text-sky-900">
                    <ShieldCheck className="h-4 w-4 text-sky-700 shrink-0" />
                    <span>PayPal Buyer Protection • Instant Automated Receipt Voucher</span>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* CONDITIONAL SECTION 4: KOKO BNPL (3x INSTALLMENTS)        */}
              {/* ========================================================= */}
              {payMethod === 'koko' && (
                <div className="space-y-3.5 rounded-2xl border border-pink-200 bg-pink-50/30 p-4 transition-all animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-pink-100 pb-2">
                    <span className="text-xs font-bold text-pink-950 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-pink-600" />
                      Koko 3-Step Interest-Free Installment Plan
                    </span>
                    <span className="text-[10px] font-bold text-pink-700 bg-pink-100 px-2 py-0.5 rounded-md">
                      0% Interest • No Fees
                    </span>
                  </div>

                  {/* 3-Step Installment Timeline */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-xl bg-pink-100/80 p-2.5 border border-pink-200 shadow-xs">
                      <span className="text-[10px] font-bold text-pink-800 uppercase block">1. Today</span>
                      <strong className="text-xs font-black text-pink-950 mt-0.5 block">
                        {formatLKR(Math.round(payAmount / 3))}
                      </strong>
                      <span className="text-[9px] text-pink-700 font-semibold mt-0.5 block">Charged Now</span>
                    </div>
                    <div className="rounded-xl bg-white p-2.5 border border-slate-200">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase block">2. In 30 Days</span>
                      <strong className="text-xs font-bold text-slate-800 mt-0.5 block">
                        {formatLKR(Math.round(payAmount / 3))}
                      </strong>
                      <span className="text-[9px] text-slate-400 mt-0.5 block">Auto-Debit</span>
                    </div>
                    <div className="rounded-xl bg-white p-2.5 border border-slate-200">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase block">3. In 60 Days</span>
                      <strong className="text-xs font-bold text-slate-800 mt-0.5 block">
                        {formatLKR(payAmount - Math.round(payAmount / 3) * 2)}
                      </strong>
                      <span className="text-[9px] text-slate-400 mt-0.5 block">Auto-Debit</span>
                    </div>
                  </div>

                  {/* Koko Registered Mobile */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Koko Registered Sri Lankan Mobile Number *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs">
                        🇱🇰 +94
                      </span>
                      <input
                        type="tel"
                        required
                        placeholder="77 123 4567"
                        value={kokoPhone}
                        onChange={(e) => setKokoPhone(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-white pl-16 pr-3 py-2 text-xs font-mono font-bold text-slate-900 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Card Choice for Koko Deductions */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">
                      Select Card for Koko Auto-Debit
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <label className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer ${
                        kokoCardType === 'debit' ? 'border-pink-500 bg-pink-50/80 text-pink-900 font-bold' : 'border-slate-200 bg-white text-slate-600'
                      }`}>
                        <input
                          type="radio"
                          name="koko_card"
                          checked={kokoCardType === 'debit'}
                          onChange={() => setKokoCardType('debit')}
                          className="text-pink-600 focus:ring-pink-500"
                        />
                        <span className="text-[11px]">Debit Card (Commercial/BOC/Sampath)</span>
                      </label>
                      <label className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer ${
                        kokoCardType === 'credit' ? 'border-pink-500 bg-pink-50/80 text-pink-900 font-bold' : 'border-slate-200 bg-white text-slate-600'
                      }`}>
                        <input
                          type="radio"
                          name="koko_card"
                          checked={kokoCardType === 'credit'}
                          onChange={() => setKokoCardType('credit')}
                          className="text-pink-600 focus:ring-pink-500"
                        />
                        <span className="text-[11px]">Credit Card (Any Bank)</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-xl bg-pink-100/60 p-2.5 text-[11px] text-pink-900">
                    <ShieldCheck className="h-4 w-4 text-pink-700 shrink-0" />
                    <span>Instant Koko Approval via SMS OTP • 0% Interest Guaranteed</span>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* CONDITIONAL SECTION 5: MINTPAY BNPL (3x INSTALLMENTS)     */}
              {/* ========================================================= */}
              {payMethod === 'mintpay' && (
                <div className="space-y-3.5 rounded-2xl border border-teal-200 bg-teal-50/30 p-4 transition-all animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-teal-100 pb-2">
                    <span className="text-xs font-bold text-teal-950 flex items-center gap-1.5">
                      <Zap className="h-3.5 w-3.5 text-teal-600" />
                      Mintpay 3-Part Installment Checkout &amp; Rewards
                    </span>
                    <span className="text-[10px] font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-md">
                      1% Tuition Cashback
                    </span>
                  </div>

                  {/* 3-Step Installment Timeline */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-xl bg-teal-100/80 p-2.5 border border-teal-200 shadow-xs">
                      <span className="text-[10px] font-bold text-teal-800 uppercase block">1. Part 1 (Today)</span>
                      <strong className="text-xs font-black text-teal-950 mt-0.5 block">
                        {formatLKR(Math.round(payAmount / 3))}
                      </strong>
                      <span className="text-[9px] text-teal-700 font-semibold mt-0.5 block">Paid Instantly</span>
                    </div>
                    <div className="rounded-xl bg-white p-2.5 border border-slate-200">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase block">2. Part 2 (30d)</span>
                      <strong className="text-xs font-bold text-slate-800 mt-0.5 block">
                        {formatLKR(Math.round(payAmount / 3))}
                      </strong>
                      <span className="text-[9px] text-slate-400 mt-0.5 block">Auto-Deducted</span>
                    </div>
                    <div className="rounded-xl bg-white p-2.5 border border-slate-200">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase block">3. Part 3 (60d)</span>
                      <strong className="text-xs font-bold text-slate-800 mt-0.5 block">
                        {formatLKR(payAmount - Math.round(payAmount / 3) * 2)}
                      </strong>
                      <span className="text-[9px] text-slate-400 mt-0.5 block">Auto-Deducted</span>
                    </div>
                  </div>

                  {/* Mintpay Registered Mobile or Account */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Mintpay Registered Mobile Number *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs">
                        🇱🇰 +94
                      </span>
                      <input
                        type="tel"
                        required
                        placeholder="77 123 4567"
                        value={mintpayPhone}
                        onChange={(e) => setMintpayPhone(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-white pl-16 pr-3 py-2 text-xs font-mono font-bold text-slate-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Card Choice for Mintpay */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">
                      Card Preference
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <label className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer ${
                        mintpayCardType === 'debit' ? 'border-teal-500 bg-teal-50/80 text-teal-900 font-bold' : 'border-slate-200 bg-white text-slate-600'
                      }`}>
                        <input
                          type="radio"
                          name="mintpay_card"
                          checked={mintpayCardType === 'debit'}
                          onChange={() => setMintpayCardType('debit')}
                          className="text-teal-600 focus:ring-teal-500"
                        />
                        <span className="text-[11px]">Debit Card</span>
                      </label>
                      <label className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer ${
                        mintpayCardType === 'credit' ? 'border-teal-500 bg-teal-50/80 text-teal-900 font-bold' : 'border-slate-200 bg-white text-slate-600'
                      }`}>
                        <input
                          type="radio"
                          name="mintpay_card"
                          checked={mintpayCardType === 'credit'}
                          onChange={() => setMintpayCardType('credit')}
                          className="text-teal-600 focus:ring-teal-500"
                        />
                        <span className="text-[11px]">Credit Card</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-xl bg-teal-100/60 p-2.5 text-[11px] text-teal-900">
                    <ShieldCheck className="h-4 w-4 text-teal-700 shrink-0" />
                    <span>Official Mintpay Education Merchant • Direct LMS Integration</span>
                  </div>
                </div>
              )}

              {/* Remarks / Purpose */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Payment Remarks / Notes
                </label>
                <input
                  type="text"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  placeholder="e.g. Stage 1 Enrolment / Stage 2 Permit Fee"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Form Action Buttons */}
              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPayOnlineModalOpen(false)}
                  className="w-1/3 rounded-xl border border-slate-300 py-2.5 font-bold text-slate-600 hover:bg-slate-50 cursor-pointer text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPay}
                  className={`w-2/3 rounded-xl py-2.5 font-bold text-white shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5 text-xs ${
                    payMethod === 'card'
                      ? 'bg-purple-600 hover:bg-purple-700'
                      : payMethod === 'bank_transfer'
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : payMethod === 'paypal'
                      ? 'bg-sky-600 hover:bg-sky-700'
                      : payMethod === 'koko'
                      ? 'bg-pink-600 hover:bg-pink-700'
                      : 'bg-teal-600 hover:bg-teal-700'
                  }`}
                >
                  {isSubmittingPay ? (
                    <span>Processing Payment...</span>
                  ) : payMethod === 'card' ? (
                    <>
                      <CreditCard className="h-4 w-4" />
                      <span>Confirm &amp; Pay {formatLKR(payAmount)}</span>
                    </>
                  ) : payMethod === 'bank_transfer' ? (
                    <>
                      <UploadCloud className="h-4 w-4" />
                      <span>Submit Slip &amp; Pay {formatLKR(payAmount)}</span>
                    </>
                  ) : payMethod === 'paypal' ? (
                    <>
                      <Globe className="h-4 w-4" />
                      <span>Pay with PayPal (${(payAmount / 300).toFixed(2)} USD)</span>
                    </>
                  ) : payMethod === 'koko' ? (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>Pay 1st Installment with Koko ({formatLKR(Math.round(payAmount / 3))})</span>
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4" />
                      <span>Pay Part 1 with Mintpay ({formatLKR(Math.round(payAmount / 3))})</span>
                    </>
                  )}
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
