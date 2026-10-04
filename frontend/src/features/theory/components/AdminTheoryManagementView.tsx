import React, { useState, useEffect, useMemo } from 'react'
import {
  FileText,
  Plus,
  Search,
  Edit2,
  Trash2,
  Copy,
  CheckCircle2,
  XCircle,
  HelpCircle,
  BookOpen,
  RotateCcw,
  Award,
  Users,
  Eye,
  TrendingUp,
  SlidersHorizontal,
  Shuffle,
} from 'lucide-react'
import type {
  TheoryQuestion,
  TheoryQuestionCategory,
  TheoryLanguage,
} from '../types/theory'
import {
  getTheoryQuestions,
  saveTheoryQuestion,
  deleteTheoryQuestion,
  resetQuestionBankToDefault,
  shuffleTheoryQuestions,
  getAllAcademyMockAttempts,
  type ExtendedMockAttempt,
} from '../services/theoryService'
import { QuestionFormModal } from './QuestionFormModal'
import { ResetQuizModal } from './ResetQuizModal'
import { AdminRoadSignsManager } from './AdminRoadSignsManager'
import { RoadSignIllustration } from './RoadSignIllustration'
import { TheoryPracticeHubContent } from '../pages/TheoryPracticeHubPage'

interface AdminTheoryManagementViewProps {
  drivingSchoolId: string
}

const CATEGORY_MAP: Record<
  TheoryQuestionCategory | 'all',
  { label: string; badgeColor: string }
> = {
  all: { label: 'All Categories', badgeColor: 'bg-slate-100 text-slate-800' },
  road_signs_regulatory: {
    label: 'Regulatory Signs',
    badgeColor: 'bg-red-50 text-red-700 border-red-200',
  },
  road_signs_warning: {
    label: 'Warning Signs',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  road_signs_informative: {
    label: 'Informative Signs',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  priority_and_junctions: {
    label: 'Priority & Junctions',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  general_road_safety: {
    label: 'General Safety Rules',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  vehicle_mechanics_controls: {
    label: 'Vehicle Controls & Emergency',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
}

export const AdminTheoryManagementView: React.FC<
  AdminTheoryManagementViewProps
> = ({ drivingSchoolId }) => {
  const [questions, setQuestions] = useState<TheoryQuestion[]>([])
  const [attempts, setAttempts] = useState<ExtendedMockAttempt[]>([])
  const [loading, setLoading] = useState(true)

  // Filters & State
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [previewLanguage, setPreviewLanguage] = useState<TheoryLanguage>('en')
  const [activeTab, setActiveTab] = useState<
    'questions' | 'results' | 'signs' | 'student_simulator'
  >('questions')

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isResetModalOpen, setIsResetModalOpen] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<TheoryQuestion | null>(
    null,
  )
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [notification, setNotification] = useState<string | null>(null)

  const loadData = async () => {
    try {
      setLoading(true)
      const [qs, atts] = await Promise.all([
        getTheoryQuestions(),
        getAllAcademyMockAttempts(drivingSchoolId),
      ])
      setQuestions(qs)
      setAttempts(atts)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadData()

    const handleUpdate = () => {
      void loadData()
    }

    window.addEventListener('trialready-theory-updated', handleUpdate)
    window.addEventListener('trialready-signs-updated', handleUpdate)
    window.addEventListener('storage', handleUpdate)

    return () => {
      window.removeEventListener('trialready-theory-updated', handleUpdate)
      window.removeEventListener('trialready-signs-updated', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [drivingSchoolId])

  const showToast = (msg: string) => {
    setNotification(msg)
    setTimeout(() => setNotification(null), 3500)
  }

  // Question CRUD Handlers
  const handleCreateNew = () => {
    setEditingQuestion(null)
    setIsModalOpen(true)
  }

  const handleEdit = (q: TheoryQuestion) => {
    setEditingQuestion(q)
    setIsModalOpen(true)
  }

  const handleDuplicate = async (q: TheoryQuestion) => {
    const copy: TheoryQuestion = {
      ...q,
      id: `q-copy-${Date.now().toString(36)}`,
      question_text: `[COPY] ${q.question_text}`,
      translations: q.translations
        ? {
            en: {
              ...q.translations.en!,
              question_text: `[COPY] ${q.translations.en?.question_text || q.question_text}`,
            },
            si: q.translations.si
              ? {
                  ...q.translations.si,
                  question_text: `[පිටපත] ${q.translations.si.question_text}`,
                }
              : undefined,
            ta: q.translations.ta
              ? {
                  ...q.translations.ta,
                  question_text: `[நகல்] ${q.translations.ta.question_text}`,
                }
              : undefined,
          }
        : undefined,
    }
    await saveTheoryQuestion(copy)
    await loadData()
    showToast('Question duplicated successfully.')
  }

  const handleDelete = async (id: string) => {
    await deleteTheoryQuestion(id)
    setDeleteConfirmId(null)
    await loadData()
    showToast('Question deleted from questions pool.')
  }

  const handleSaveQuestion = async (saved: TheoryQuestion) => {
    await saveTheoryQuestion(saved)
    await loadData()
    showToast(
      editingQuestion
        ? 'Question updated successfully.'
        : 'New question added to quiz questions.',
    )
  }

  const handleConfirmResetQuiz = async () => {
    try {
      setIsResetting(true)
      try {
        localStorage.removeItem('trialready_theory_questions')
      } catch {}
      const freshQuestions = await resetQuestionBankToDefault()
      setQuestions([...freshQuestions])
      setIsResetModalOpen(false)
      showToast(
        `Quiz reset! Loaded ${freshQuestions.length} randomized DMT Highway Code questions.`,
      )
    } catch (err) {
      console.error(err)
      showToast('Error resetting quiz questions.')
    } finally {
      setIsResetting(false)
    }
  }

  const handleShuffleQuestions = async () => {
    const shuffled = await shuffleTheoryQuestions()
    setQuestions([...shuffled])
    showToast(`Questions pool shuffled! ${shuffled.length} questions re-ordered.`)
  }

  // Filtered Questions
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchesCategory =
        selectedCategory === 'all' || q.category === selectedCategory
      const query = searchQuery.toLowerCase().trim()
      if (!query) return matchesCategory

      const textMatch =
        q.question_text.toLowerCase().includes(query) ||
        q.explanation?.toLowerCase().includes(query) ||
        q.id.toLowerCase().includes(query) ||
        q.translations?.si?.question_text.toLowerCase().includes(query) ||
        q.translations?.ta?.question_text.toLowerCase().includes(query)

      return matchesCategory && textMatch
    })
  }, [questions, selectedCategory, searchQuery])

  // Aggregate Stats
  const totalAttemptsCount = attempts.length
  const passedAttemptsCount = attempts.filter((a) => a.passed).length
  const passRate =
    totalAttemptsCount > 0
      ? Math.round((passedAttemptsCount / totalAttemptsCount) * 100)
      : 0
  const avgScore =
    totalAttemptsCount > 0
      ? Math.round(
          attempts.reduce((acc, a) => acc + (a.score_percentage || 0), 0) /
            totalAttemptsCount,
        )
      : 0

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 rounded-2xl bg-slate-900 text-white px-5 py-3 text-xs font-bold shadow-2xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Admin Hero Header */}
      <div className="rounded-3xl border border-blue-200 bg-linear-to-r from-slate-900 via-blue-950 to-indigo-950 p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300 border border-blue-400/30">
              <SlidersHorizontal className="h-3 w-3" />
              <span>Administrator Control Center</span>
            </span>
            <span className="inline-block rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 border border-emerald-400/30">
              DMT Exam Standard (≥ 75% Pass)
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
            DMT Theory Exam &amp; Questions Manager
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Manage authentic Highway Code questions, edit trilingual translations (English, සිංහල, தமிழ்), audit student mock exam performance, and configure road sign flashcards.
          </p>
        </div>

        <div className="shrink-0 flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={handleCreateNew}
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-xs font-bold text-white shadow-lg hover:bg-blue-500 hover:scale-105 transition-all cursor-pointer border border-blue-400/40"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Question</span>
          </button>
          <button
            type="button"
            onClick={handleShuffleQuestions}
            className="inline-flex items-center gap-1.5 rounded-2xl bg-indigo-600/90 px-4 py-3 text-xs font-semibold text-white hover:bg-indigo-500 transition-all cursor-pointer border border-indigo-400/40 shadow-sm"
            title="Instantly shuffle and randomize question order"
          >
            <Shuffle className="h-3.5 w-3.5" />
            <span>Shuffle Order</span>
          </button>
          <button
            type="button"
            onClick={handleConfirmResetQuiz}
            disabled={isResetting}
            className="inline-flex items-center gap-1.5 rounded-2xl bg-slate-800/90 px-4 py-3 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-all cursor-pointer border border-slate-700 disabled:opacity-50"
            title="Reset and refresh quiz questions to authentic Sri Lanka DMT syllabus"
          >
            <RotateCcw className={`h-3.5 w-3.5 ${isResetting ? 'animate-spin' : ''}`} />
            <span>{isResetting ? 'Resetting...' : 'Reset Quiz'}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Active Questions
            </span>
            <BookOpen className="h-4 w-4 text-blue-600" />
          </div>
          <p className="mt-1.5 text-2xl font-black text-slate-900">
            {questions.length}
          </p>
          <span className="text-[10px] text-slate-500 font-medium">
            Across 6 Highway Categories
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Student Attempts
            </span>
            <Users className="h-4 w-4 text-purple-600" />
          </div>
          <p className="mt-1.5 text-2xl font-black text-slate-900">
            {totalAttemptsCount}
          </p>
          <span className="text-[10px] text-slate-500 font-medium">
            {passedAttemptsCount} Cleared (≥ 75%)
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Academy Pass Rate
            </span>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="mt-1.5 text-2xl font-black text-emerald-600">
            {passRate}%
          </p>
          <span className="text-[10px] text-emerald-700 font-bold">
            DMT Mock Exam Standard
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Average Student Score
            </span>
            <Award className="h-4 w-4 text-amber-500" />
          </div>
          <p className="mt-1.5 text-2xl font-black text-slate-900">
            {avgScore}%
          </p>
          <span className="text-[10px] text-slate-500 font-medium">
            Across All Exam Sessions
          </span>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="border-b border-slate-200 bg-white rounded-2xl shadow-xs p-1.5 flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => setActiveTab('questions')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'questions'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Questions ({questions.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('results')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'results'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Award className="h-4 w-4" />
          <span>Student Submissions &amp; Results ({attempts.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('signs')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'signs'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>Road Signs &amp; Flashcards Library</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('student_simulator')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'student_simulator'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Eye className="h-4 w-4" />
          <span>Student Practice Simulator Preview</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: QUESTIONS MANAGER                                       */}
      {/* ============================================================== */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          {/* Filter Toolbar */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search questions or Highway Code rules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 py-2 text-xs text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Category Dropdown & Language Switcher */}
            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 focus:bg-white focus:border-blue-500 focus:outline-none"
              >
                {Object.entries(CATEGORY_MAP).map(([key, info]) => (
                  <option key={key} value={key}>
                    {info.label}
                  </option>
                ))}
              </select>

              {/* Language Preview Pill */}
              <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setPreviewLanguage('en')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                    previewLanguage === 'en'
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewLanguage('si')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                    previewLanguage === 'si'
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  සිංහල
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewLanguage('ta')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                    previewLanguage === 'ta'
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  தமிழ்
                </button>
              </div>
            </div>
          </div>

          {/* Questions List */}
          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-500">
              Loading questions...
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center space-y-3">
              <HelpCircle className="h-10 w-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">No questions found</p>
              <p className="text-xs text-slate-400">
                Try clearing your search query or add a new question to the pool.
              </p>
              <button
                type="button"
                onClick={handleCreateNew}
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Question</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredQuestions.map((q, idx) => {
                const translation = q.translations?.[previewLanguage]
                const displayText = translation?.question_text || q.question_text
                const displayOptions =
                  translation?.options && translation.options.length === 4
                    ? translation.options
                    : q.options
                const displayExplanation =
                  translation?.explanation || q.explanation

                return (
                  <div
                    key={q.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-blue-300 transition-all space-y-3.5"
                  >
                    {/* Top Row: Category & Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-50 text-[11px] font-black text-blue-700 border border-blue-200">
                          {idx + 1}
                        </span>
                        <span
                          className={`rounded-md px-2 py-0.5 text-[10px] font-bold border uppercase tracking-wider ${
                            CATEGORY_MAP[q.category]?.badgeColor ||
                            'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {CATEGORY_MAP[q.category]?.label || q.category}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {q.id}
                        </span>
                      </div>

                      {/* Admin Action Buttons */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleEdit(q)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 cursor-pointer"
                        >
                          <Edit2 className="h-3 w-3" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDuplicate(q)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                          title="Duplicate Question"
                        >
                          <Copy className="h-3 w-3" />
                          <span>Copy</span>
                        </button>
                        {deleteConfirmId === q.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleDelete(q.id)}
                              className="rounded-lg bg-red-600 px-2 py-1 text-[10px] font-black text-white hover:bg-red-700 cursor-pointer"
                            >
                              Confirm
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(null)}
                              className="rounded-lg bg-slate-200 px-2 py-1 text-[10px] font-bold text-slate-700 cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(q.id)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-red-600 hover:bg-red-50 hover:border-red-300 cursor-pointer"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>Delete</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Question Body with Image illustration if present */}
                    <div className="flex items-start gap-3.5">
                      {q.image_url && (
                        <div className="shrink-0">
                          <RoadSignIllustration
                            signCode={q.image_url}
                            className="h-14 w-14"
                          />
                        </div>
                      )}
                      <div className="text-xs font-bold text-slate-900 leading-relaxed flex-1">
                        {displayText}
                      </div>
                    </div>

                    {/* 4 Options Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {displayOptions.map((opt, optIdx) => {
                        const isCorrect = optIdx === q.correct_option_index
                        return (
                          <div
                            key={optIdx}
                            className={`flex items-start gap-2 rounded-xl p-2.5 border transition-all ${
                              isCorrect
                                ? 'border-emerald-400 bg-emerald-50/60 font-semibold text-emerald-900'
                                : 'border-slate-200 bg-slate-50/50 text-slate-700'
                            }`}
                          >
                            <span
                              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-black mt-0.5 ${
                                isCorrect
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-slate-200 text-slate-600'
                              }`}
                            >
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="flex-1">{opt}</span>
                            {isCorrect && (
                              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                            )}
                          </div>
                        )
                      })}
                    </div>

                    {/* Explanation */}
                    <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-2.5 text-[11px] text-slate-700 flex items-start gap-2">
                      <HelpCircle className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-blue-900">
                          Highway Code Rule &amp; Rationale:
                        </span>{' '}
                        <span>{displayExplanation}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: STUDENT RESULTS & SUBMISSIONS                           */}
      {/* ============================================================== */}
      {activeTab === 'results' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-black text-slate-900">
                Academy Student Mock Exam Submissions
              </h2>
              <p className="text-xs text-slate-500">
                Real-time computerized theory examination records across all enrolled learner drivers
              </p>
            </div>
            <span className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 border border-blue-200">
              {attempts.length} Submissions
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <tr>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Admission No</th>
                  <th className="p-3">Branch</th>
                  <th className="p-3">Exam Date</th>
                  <th className="p-3">Correct / Total</th>
                  <th className="p-3">Score (%)</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Time Spent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attempts.map((att) => (
                  <tr key={att.id} className="hover:bg-slate-50/80">
                    <td className="p-3 font-bold text-slate-900">
                      {att.student_name || 'Learner Driver'}
                    </td>
                    <td className="p-3 font-mono text-slate-600">
                      {att.admission_number || 'ADM-2026-0001'}
                    </td>
                    <td className="p-3 text-slate-600">{att.branch_name || 'Main Branch'}</td>
                    <td className="p-3 text-slate-500">
                      {new Date(att.attempted_at).toLocaleDateString('en-LK', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="p-3 font-bold text-slate-800">
                      {att.correct_answers_count} / {att.total_questions}
                    </td>
                    <td className="p-3">
                      <span
                        className={`font-black ${
                          att.passed ? 'text-emerald-600' : 'text-amber-600'
                        }`}
                      >
                        {att.score_percentage}%
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                          att.passed
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {att.passed ? (
                          <>
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Passed</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3" />
                            <span>Needs Practice</span>
                          </>
                        )}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-slate-500">
                      {Math.floor(att.time_spent_seconds / 60)}m {att.time_spent_seconds % 60}s
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: ROAD SIGNS & FLASHCARDS MANAGEMENT LIBRARY               */}
      {/* ============================================================== */}
      {activeTab === 'signs' && <AdminRoadSignsManager />}

      {/* ============================================================== */}
      {/* TAB 4: STUDENT SIMULATOR PREVIEW                               */}
      {/* ============================================================== */}
      {activeTab === 'student_simulator' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-blue-200 bg-blue-50/80 p-4 text-xs text-blue-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-blue-700 shrink-0" />
              <span>
                <strong>Administrator Preview Mode:</strong> This is the interactive test simulator screen as experienced by learner drivers.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('questions')}
              className="rounded-lg bg-white px-3 py-1 text-xs font-bold text-blue-700 border border-blue-300 hover:bg-blue-100 cursor-pointer"
            >
              Back to Questions
            </button>
          </div>
          <TheoryPracticeHubContent drivingSchoolId={drivingSchoolId} />
        </div>
      )}

      {/* Question Form Modal */}
      <QuestionFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveQuestion}
        initialQuestion={editingQuestion}
      />

      {/* Professional Reset Quiz Modal */}
      <ResetQuizModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleConfirmResetQuiz}
        isResetting={isResetting}
      />
    </div>
  )
}
