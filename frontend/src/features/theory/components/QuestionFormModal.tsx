import React, { useState, useEffect } from 'react'
import {
  X,
  FileText,
  Layers,
  Upload,
  Image as ImageIcon,
  Trash2,
  Sparkles,
} from 'lucide-react'
import type { TheoryQuestion, TheoryQuestionCategory } from '../types/theory'
import { RoadSignIllustration } from './RoadSignIllustration'

interface QuestionFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (question: TheoryQuestion) => void
  initialQuestion?: TheoryQuestion | null
}

const CATEGORIES: { value: TheoryQuestionCategory; label: string }[] = [
  { value: 'road_signs_regulatory', label: 'Regulatory Road Signs (Mandatory & Prohibitory)' },
  { value: 'road_signs_warning', label: 'Warning Road Signs (Hazards & Caution)' },
  { value: 'road_signs_informative', label: 'Informative & Guide Signs' },
  { value: 'priority_and_junctions', label: 'Priority & Junction Right-of-Way' },
  { value: 'general_road_safety', label: 'General Road Safety & Rules of the Road' },
  { value: 'vehicle_mechanics_controls', label: 'Vehicle Controls & Emergency Procedures' },
]

const QUICK_SIGN_PRESETS = [
  { label: 'Stop Sign', value: '🛑' },
  { label: 'Give Way', value: '▽' },
  { label: '50 km/h', value: '⑯ 50' },
  { label: 'No Entry', value: '⛔' },
  { label: 'Zebra Crossing', value: '⚠️ 🚶' },
  { label: 'Railway Ungated', value: '⚠️ 🚂' },
  { label: 'Roundabout', value: '🔄' },
  { label: 'Hospital', value: '🏥 H' },
]

export const QuestionFormModal: React.FC<QuestionFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialQuestion,
}) => {
  const [category, setCategory] = useState<TheoryQuestionCategory>('road_signs_regulatory')
  
  // Media / Image
  const [imageUrl, setImageUrl] = useState<string>('')
  const [isDragging, setIsDragging] = useState(false)

  // English
  const [questionTextEn, setQuestionTextEn] = useState('')
  const [optionsEn, setOptionsEn] = useState<string[]>(['', '', '', ''])
  const [explanationEn, setExplanationEn] = useState('')
  const [correctIndex, setCorrectIndex] = useState<number>(0)

  // Sinhala
  const [questionTextSi, setQuestionTextSi] = useState('')
  const [optionsSi, setOptionsSi] = useState<string[]>(['', '', '', ''])
  const [explanationSi, setExplanationSi] = useState('')

  // Tamil
  const [questionTextTa, setQuestionTextTa] = useState('')
  const [optionsTa, setOptionsTa] = useState<string[]>(['', '', '', ''])
  const [explanationTa, setExplanationTa] = useState('')

  const [activeLangTab, setActiveLangTab] = useState<'en' | 'si' | 'ta'>('en')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialQuestion) {
      setCategory(initialQuestion.category)
      setImageUrl(initialQuestion.image_url || '')
      setQuestionTextEn(initialQuestion.question_text || '')
      setOptionsEn(
        initialQuestion.options && initialQuestion.options.length === 4
          ? initialQuestion.options
          : ['', '', '', ''],
      )
      setCorrectIndex(initialQuestion.correct_option_index ?? 0)
      setExplanationEn(initialQuestion.explanation || '')

      // Translations
      const si = initialQuestion.translations?.si
      setQuestionTextSi(si?.question_text || '')
      setOptionsSi(si?.options && si.options.length === 4 ? si.options : ['', '', '', ''])
      setExplanationSi(si?.explanation || '')

      const ta = initialQuestion.translations?.ta
      setQuestionTextTa(ta?.question_text || '')
      setOptionsTa(ta?.options && ta.options.length === 4 ? ta.options : ['', '', '', ''])
      setExplanationTa(ta?.explanation || '')
    } else {
      // Reset
      setCategory('road_signs_regulatory')
      setImageUrl('')
      setQuestionTextEn('')
      setOptionsEn(['', '', '', ''])
      setCorrectIndex(0)
      setExplanationEn('')
      setQuestionTextSi('')
      setOptionsSi(['', '', '', ''])
      setExplanationSi('')
      setQuestionTextTa('')
      setOptionsTa(['', '', '', ''])
      setExplanationTa('')
    }
    setError(null)
  }, [initialQuestion, isOpen])

  if (!isOpen) return null

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG, JPG, WebP, SVG)')
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        setImageUrl(e.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleOptionChange = (index: number, value: string, lang: 'en' | 'si' | 'ta') => {
    if (lang === 'en') {
      const next = [...optionsEn]
      next[index] = value
      setOptionsEn(next)
    } else if (lang === 'si') {
      const next = [...optionsSi]
      next[index] = value
      setOptionsSi(next)
    } else {
      const next = [...optionsTa]
      next[index] = value
      setOptionsTa(next)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!questionTextEn.trim()) {
      setError('Please provide the English Question Text.')
      setActiveLangTab('en')
      return
    }

    if (optionsEn.some((opt) => !opt.trim())) {
      setError('Please provide all 4 English option choices.')
      setActiveLangTab('en')
      return
    }

    if (!explanationEn.trim()) {
      setError('Please provide the Highway Code explanation for the correct answer.')
      setActiveLangTab('en')
      return
    }

    const questionId =
      initialQuestion?.id ||
      `q-custom-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`

    const newQuestion: TheoryQuestion = {
      id: questionId,
      category,
      image_url: imageUrl.trim() || undefined,
      question_text: questionTextEn.trim(),
      options: optionsEn.map((o) => o.trim()),
      correct_option_index: correctIndex,
      explanation: explanationEn.trim(),
      translations: {
        en: {
          question_text: questionTextEn.trim(),
          options: optionsEn.map((o) => o.trim()),
          explanation: explanationEn.trim(),
        },
        si: {
          question_text: questionTextSi.trim() || questionTextEn.trim(),
          options: optionsSi.map((o, i) => o.trim() || optionsEn[i].trim()),
          explanation: explanationSi.trim() || explanationEn.trim(),
        },
        ta: {
          question_text: questionTextTa.trim() || questionTextEn.trim(),
          options: optionsTa.map((o, i) => o.trim() || optionsEn[i].trim()),
          explanation: explanationTa.trim() || explanationEn.trim(),
        },
      },
    }

    onSave(newQuestion)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                {initialQuestion ? 'Edit Theory Exam Question' : 'Add New DMT Theory Question'}
              </h2>
              <p className="text-xs text-slate-500">
                Configure question text, image/media attachment, trilingual options, and DMT explanation
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

        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              {error}
            </div>
          )}

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-blue-600" />
              <span>DMT Highway Code Category</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as TheoryQuestionCategory)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Media / Image Attachment (Drag & Drop + File Picker) */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <ImageIcon className="h-3.5 w-3.5 text-indigo-600" />
                <span>Road Sign Image / Media Attachment (Optional)</span>
              </label>
              {imageUrl && (
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 hover:text-red-700 cursor-pointer"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Remove Image</span>
                </button>
              )}
            </div>

            {imageUrl ? (
              <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-3">
                <RoadSignIllustration signCode={imageUrl} className="h-16 w-16" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800">Media Attached</p>
                  <p className="text-[10px] text-slate-400 truncate max-w-md mt-0.5">
                    {imageUrl.startsWith('data:') ? 'Custom Uploaded Image (Base64)' : imageUrl}
                  </p>
                </div>
                <label className="cursor-pointer rounded-lg bg-slate-100 hover:bg-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 transition-all border border-slate-200">
                  <span>Replace</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative rounded-xl border-2 border-dashed p-4 text-center transition-all cursor-pointer ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50/80 scale-[1.01]'
                    : 'border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50'
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center gap-1.5 pointer-events-none">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Upload className="h-4 w-4" />
                  </div>
                  <p className="text-xs font-bold text-slate-700">
                    Drag and drop road sign image here, or <span className="text-blue-600 underline">Browse</span>
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Supports PNG, JPG, WebP, SVG (Max 5MB)
                  </p>
                </div>
              </div>
            )}

            {/* Quick Sign Presets */}
            <div>
              <span className="text-[10px] font-bold text-slate-500 block mb-1.5 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-amber-500" />
                <span>Or select quick standard DMT road sign preset:</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_SIGN_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setImageUrl(preset.value)}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-bold border transition-all cursor-pointer ${
                      imageUrl === preset.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <span>{preset.value}</span> <span className="text-[10px] font-normal text-slate-500">{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Trilingual Language Selector Tabs */}
          <div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
              <span className="text-xs font-bold text-slate-700">Language Content:</span>
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
                  🇱🇰 සිංහල (Sinhala)
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
                  🇱🇰 தமிழ் (Tamil)
                </button>
              </div>
            </div>

            {/* TAB: ENGLISH */}
            {activeLangTab === 'en' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Question Text (English) <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={questionTextEn}
                    onChange={(e) => setQuestionTextEn(e.target.value)}
                    placeholder="e.g. What does a flashing amber traffic light indicate at a pedestrian junction?"
                    className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2.5">
                  <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>Answer Choices (Select radio button for Correct Answer)</span>
                    <span className="text-[11px] text-emerald-600 font-semibold">
                      Option {String.fromCharCode(65 + correctIndex)} is marked correct
                    </span>
                  </label>
                  {optionsEn.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        id={`opt-radio-${i}`}
                        name="correct_option"
                        checked={correctIndex === i}
                        onChange={() => setCorrectIndex(i)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="text-xs font-bold text-slate-500 w-5">
                        {String.fromCharCode(65 + i)}.
                      </span>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => handleOptionChange(i, e.target.value, 'en')}
                        placeholder={`Option ${String.fromCharCode(65 + i)} text`}
                        className={`flex-1 rounded-xl border px-3 py-2 text-xs text-slate-800 focus:outline-none ${
                          correctIndex === i
                            ? 'border-emerald-400 bg-emerald-50/40'
                            : 'border-slate-300 focus:border-blue-500'
                        }`}
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Highway Code Explanation (English) <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={explanationEn}
                    onChange={(e) => setExplanationEn(e.target.value)}
                    placeholder="Official DMT explanation shown to student when reviewing results..."
                    className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {/* TAB: SINHALA */}
            {activeLangTab === 'si' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ප්‍රශ්නය (Sinhala Question Text)
                  </label>
                  <textarea
                    rows={2}
                    value={questionTextSi}
                    onChange={(e) => setQuestionTextSi(e.target.value)}
                    placeholder="සිංහල භාෂාවෙන් ප්‍රශ්නය ඇතුළත් කරන්න..."
                    className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2.5">
                  <label className="block text-xs font-bold text-slate-700">
                    පිළිතුරු විකල්ප (Sinhala Options)
                  </label>
                  {optionsSi.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <span className="text-xs font-bold text-slate-500 w-5">
                        {String.fromCharCode(65 + i)}.
                      </span>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => handleOptionChange(i, e.target.value, 'si')}
                        placeholder={`විකල්පය ${String.fromCharCode(65 + i)}`}
                        className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    මහාමාර්ග සංග්‍රහය පැහැදිලි කිරීම (Sinhala Explanation)
                  </label>
                  <textarea
                    rows={2}
                    value={explanationSi}
                    onChange={(e) => setExplanationSi(e.target.value)}
                    placeholder="නිවැරදි පිළිතුර සඳහා නිල පැහැදිලි කිරීම..."
                    className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {/* TAB: TAMIL */}
            {activeLangTab === 'ta' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    கேள்வி (Tamil Question Text)
                  </label>
                  <textarea
                    rows={2}
                    value={questionTextTa}
                    onChange={(e) => setQuestionTextTa(e.target.value)}
                    placeholder="தமிழ் மொழியில் கேள்வியை உள்ளிடவும்..."
                    className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2.5">
                  <label className="block text-xs font-bold text-slate-700">
                    விடைகள் (Tamil Options)
                  </label>
                  {optionsTa.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <span className="text-xs font-bold text-slate-500 w-5">
                        {String.fromCharCode(65 + i)}.
                      </span>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => handleOptionChange(i, e.target.value, 'ta')}
                        placeholder={`விடை ${String.fromCharCode(65 + i)}`}
                        className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    விளக்கம் (Tamil Explanation)
                  </label>
                  <textarea
                    rows={2}
                    value={explanationTa}
                    onChange={(e) => setExplanationTa(e.target.value)}
                    placeholder="சரியான விடைக்கான அதிகாரப்பூர்வ விளக்கம்..."
                    className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700 shadow-md cursor-pointer"
            >
              {initialQuestion ? 'Save Changes' : 'Create Question'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
