import React, { useState, useEffect, useRef } from 'react'
import {
  X,
  Upload,
  Image as ImageIcon,
  Check,
  AlertCircle,
  HelpCircle,
  Layers,
} from 'lucide-react'
import type { RoadSignItem, RoadSignCategory } from '../types/roadSign'
import { RoadSignIllustration } from './RoadSignIllustration'

interface RoadSignModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (sign: RoadSignItem) => void
  initialSign?: RoadSignItem | null
}

const CATEGORIES: { value: RoadSignCategory; label: string }[] = [
  { value: 'regulatory', label: 'Regulatory Signs (Mandatory / Prohibitory)' },
  { value: 'warning', label: 'Warning Signs (Hazards & Caution)' },
  { value: 'priority', label: 'Priority Signs (Right of Way & Yield)' },
  { value: 'informative', label: 'Informative & Guide Signs' },
]

const PRESET_ICONS = [
  { label: 'Stop Sign', value: '🛑' },
  { label: 'No Entry', value: '⛔' },
  { label: 'Give Way', value: '▽' },
  { label: 'Speed Limit 50', value: '50' },
  { label: 'Speed Limit 70', value: '70' },
  { label: 'No Parking', value: '🚫🅿️' },
  { label: 'No Overtaking', value: '🚫🚗' },
  { label: 'Pedestrian Crossing', value: '🚶‍♂️' },
  { label: 'Steep Hill Down', value: '⚠️📉' },
  { label: 'Roundabout Ahead', value: '🔄' },
  { label: 'Road Narrows', value: '⚠️║' },
  { label: 'Railway Crossing', value: '🚂' },
  { label: 'Hospital Zone', value: '🏥' },
  { label: 'Expressway Route', value: '🛣️' },
]

export const RoadSignModal: React.FC<RoadSignModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialSign,
}) => {
  const [category, setCategory] = useState<RoadSignCategory>('regulatory')
  const [nameEn, setNameEn] = useState('')
  const [nameSi, setNameSi] = useState('')
  const [nameTa, setNameTa] = useState('')
  const [meaningEn, setMeaningEn] = useState('')
  const [meaningSi, setMeaningSi] = useState('')
  const [meaningTa, setMeaningTa] = useState('')
  const [fineOrPoints, setFineOrPoints] = useState('')
  const [imageUrl, setImageUrl] = useState('🛑')
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null)
  const [activeLangTab, setActiveLangTab] = useState<'en' | 'si' | 'ta'>('en')
  const [error, setError] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (initialSign) {
      setCategory(initialSign.category)
      setNameEn(initialSign.name || '')
      setNameSi(initialSign.name_si || '')
      setNameTa(initialSign.name_ta || '')
      setMeaningEn(initialSign.meaning || '')
      setMeaningSi(initialSign.meaning_si || '')
      setMeaningTa(initialSign.meaning_ta || '')
      setFineOrPoints(initialSign.fine_or_points || '')
      setImageUrl(initialSign.image_url || '🛑')
      setPreviewDataUrl(
        initialSign.image_url.startsWith('data:') ||
          initialSign.image_url.startsWith('http') ||
          initialSign.image_url.startsWith('/')
          ? initialSign.image_url
          : null,
      )
    } else {
      setCategory('regulatory')
      setNameEn('')
      setNameSi('')
      setNameTa('')
      setMeaningEn('')
      setMeaningSi('')
      setMeaningTa('')
      setFineOrPoints('')
      setImageUrl('🛑')
      setPreviewDataUrl(null)
    }
    setError(null)
  }, [initialSign, isOpen])

  if (!isOpen) return null

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG, JPG, SVG, WebP).')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      setPreviewDataUrl(result)
      setImageUrl(result)
      setError(null)
    }
    reader.readAsDataURL(file)
  }

  const handlePresetSelect = (preset: string) => {
    setImageUrl(preset)
    setPreviewDataUrl(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!nameEn.trim()) {
      setError('Please enter the Road Sign Name in English.')
      setActiveLangTab('en')
      return
    }

    if (!meaningEn.trim()) {
      setError('Please provide the official Highway Code meaning / rule.')
      setActiveLangTab('en')
      return
    }

    const signId =
      initialSign?.id ||
      `sign-custom-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`

    const newSign: RoadSignItem = {
      id: signId,
      name: nameEn.trim(),
      name_si: nameSi.trim() || nameEn.trim(),
      name_ta: nameTa.trim() || nameEn.trim(),
      category,
      meaning: meaningEn.trim(),
      meaning_si: meaningSi.trim() || meaningEn.trim(),
      meaning_ta: meaningTa.trim() || meaningEn.trim(),
      image_url: imageUrl,
      fine_or_points: fineOrPoints.trim() || undefined,
      is_custom_upload: Boolean(previewDataUrl),
    }

    onSave(newSign)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <ImageIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                {initialSign ? 'Edit Sri Lanka Road Sign' : 'Upload / Add New Road Sign'}
              </h2>
              <p className="text-xs text-slate-500">
                Upload authentic DMT sign illustrations and configure trilingual meanings
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Sign Image Upload & Preview Section */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
            <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Upload className="h-3.5 w-3.5 text-blue-600" />
              <span>Road Sign Graphic / Image</span>
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Preview Box */}
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border-2 border-slate-200 bg-white shadow-xs p-2 overflow-hidden">
                {previewDataUrl ? (
                  <img
                    src={previewDataUrl}
                    alt="Uploaded Sign Preview"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <RoadSignIllustration signCode={imageUrl} className="h-16 w-16" />
                )}
              </div>

              {/* Upload Action */}
              <div className="flex-1 space-y-2 text-center sm:text-left">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-700 cursor-pointer shadow-xs"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>Upload Sign Image File</span>
                  </button>
                  {previewDataUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewDataUrl(null)
                        setImageUrl('🛑')
                      }}
                      className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                    >
                      Use Standard Preset
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  Upload official DMT vector/PNG illustrations or pick a standard preset below.
                </p>
              </div>
            </div>

            {/* Presets Row */}
            <div className="pt-2 border-t border-slate-200">
              <span className="text-[11px] font-bold text-slate-600 block mb-1.5">
                Or choose from Standard Sri Lanka DMT Presets:
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-white rounded-xl border border-slate-200">
                {PRESET_ICONS.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => handlePresetSelect(p.value)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                      imageUrl === p.value && !previewDataUrl
                        ? 'bg-blue-600 text-white font-bold'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>{p.value}</span>
                    <span>{p.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Category & Fine Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <Layers className="h-3.5 w-3.5 text-blue-600" />
                <span>Road Sign Category</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as RoadSignCategory)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs font-medium text-slate-800 focus:border-blue-500 focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Statutory Fine or Demerit Points
              </label>
              <input
                type="text"
                value={fineOrPoints}
                onChange={(e) => setFineOrPoints(e.target.value)}
                placeholder="e.g. Spot Fine: LKR 2,000 + 3 Points"
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Trilingual Tabs */}
          <div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
              <span className="text-xs font-bold text-slate-700">Trilingual Meaning:</span>
              <div className="flex rounded-lg bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => setActiveLangTab('en')}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                    activeLangTab === 'en'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🇬🇧 English
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLangTab('si')}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                    activeLangTab === 'si'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🇱🇰 සිංහල
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLangTab('ta')}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                    activeLangTab === 'ta'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🇱🇰 தமிழ்
                </button>
              </div>
            </div>

            {/* TAB: ENGLISH */}
            {activeLangTab === 'en' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Sign Name (English) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="e.g. Pedestrian Crossing Ahead (Zebra Crossing)"
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <HelpCircle className="h-3.5 w-3.5 text-slate-500" />
                    <span>Official DMT Meaning &amp; Driving Rule (English) <span className="text-red-500">*</span></span>
                  </label>
                  <textarea
                    rows={2}
                    value={meaningEn}
                    onChange={(e) => setMeaningEn(e.target.value)}
                    placeholder="Explain what the driver must do when seeing this sign..."
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* TAB: SINHALA */}
            {activeLangTab === 'si' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    සංඥාවේ නම (Sinhala Name)
                  </label>
                  <input
                    type="text"
                    value={nameSi}
                    onChange={(e) => setNameSi(e.target.value)}
                    placeholder="උදා: පදික මාරුව ඉදිරියෙන්"
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    මහාමාර්ග නීතිය සහ අර්ථය (Sinhala Meaning)
                  </label>
                  <textarea
                    rows={2}
                    value={meaningSi}
                    onChange={(e) => setMeaningSi(e.target.value)}
                    placeholder="රියදුරු පිළිපැදිය යුතු උපදෙස්..."
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* TAB: TAMIL */}
            {activeLangTab === 'ta' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    சைகையின் பெயர் (Tamil Name)
                  </label>
                  <input
                    type="text"
                    value={nameTa}
                    onChange={(e) => setNameTa(e.target.value)}
                    placeholder="உதாரணம்: பாதசாரி கடவை முன்னால்"
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    நெடுஞ்சாலை விதி மற்றும் விளக்கம் (Tamil Meaning)
                  </label>
                  <textarea
                    rows={2}
                    value={meaningTa}
                    onChange={(e) => setMeaningTa(e.target.value)}
                    placeholder="சாரதி பின்பற்ற வேண்டிய அறிவுறுத்தல்கள்..."
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700 shadow-md cursor-pointer"
            >
              <Check className="h-4 w-4" />
              <span>{initialSign ? 'Update Road Sign' : 'Save Road Sign'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
