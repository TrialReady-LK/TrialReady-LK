import React, { useState, useEffect, useMemo, useRef } from 'react'
import {
  Plus,
  Upload,
  Search,
  Edit2,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  Octagon,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from 'lucide-react'
import type { RoadSignItem, RoadSignCategory } from '../types/roadSign'
import {
  getRoadSigns,
  saveRoadSign,
  deleteRoadSign,
  resetRoadSignsToDefault,
} from '../services/roadSignService'
import { RoadSignModal } from './RoadSignModal'
import { RoadSignIllustration } from './RoadSignIllustration'

const CATEGORY_TABS: { value: RoadSignCategory | 'all'; label: string; icon: React.ReactNode; color: string }[] = [
  { value: 'all', label: 'All Road Signs', icon: <Sparkles className="h-3.5 w-3.5" />, color: 'bg-slate-100 text-slate-800' },
  { value: 'regulatory', label: 'Regulatory Signs', icon: <Octagon className="h-3.5 w-3.5 text-red-600" />, color: 'bg-red-50 text-red-700 border-red-200' },
  { value: 'warning', label: 'Warning Signs', icon: <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />, color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { value: 'priority', label: 'Priority Signs', icon: <Octagon className="h-3.5 w-3.5 text-purple-600" />, color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { value: 'informative', label: 'Informative Signs', icon: <Sparkles className="h-3.5 w-3.5 text-blue-600" />, color: 'bg-blue-50 text-blue-700 border-blue-200' },
]

export const AdminRoadSignsManager: React.FC = () => {
  const [signs, setSigns] = useState<RoadSignItem[]>([])
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState<RoadSignCategory | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [previewLanguage, setPreviewLanguage] = useState<'en' | 'si' | 'ta'>('en')
  const [viewMode, setViewMode] = useState<'grid' | 'flashcard'>('grid')

  // Flashcard Test Mode state
  const [flashcardIndex, setFlashcardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSign, setEditingSign] = useState<RoadSignItem | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // File replacement ref
  const replaceInputRef = useRef<HTMLInputElement>(null)
  const [replaceTargetId, setReplaceTargetId] = useState<string | null>(null)

  const loadSigns = async () => {
    try {
      setLoading(true)
      const data = await getRoadSigns()
      setSigns(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadSigns()
  }, [])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleCreateNew = () => {
    setEditingSign(null)
    setIsModalOpen(true)
  }

  const handleEdit = (sign: RoadSignItem) => {
    setEditingSign(sign)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    await deleteRoadSign(id)
    setDeleteConfirmId(null)
    await loadSigns()
    showToast('Road sign deleted from library.')
  }

  const handleSaveSign = async (saved: RoadSignItem) => {
    await saveRoadSign(saved)
    await loadSigns()
    showToast(editingSign ? 'Road sign updated successfully.' : 'New road sign uploaded & added.')
  }

  const handleResetSigns = async () => {
    await resetRoadSignsToDefault()
    await loadSigns()
    showToast('Road signs library reset to authentic Sri Lanka DMT standards.')
  }

  const handleTriggerReplaceImage = (signId: string) => {
    setReplaceTargetId(signId)
    replaceInputRef.current?.click()
  }

  const handleReplaceImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !replaceTargetId) return

    const targetSign = signs.find((s) => s.id === replaceTargetId)
    if (!targetSign) return

    const reader = new FileReader()
    reader.onload = async (event) => {
      const result = event.target?.result as string
      const updated: RoadSignItem = {
        ...targetSign,
        image_url: result,
        is_custom_upload: true,
      }
      await saveRoadSign(updated)
      await loadSigns()
      showToast(`Image replaced for ${targetSign.name}`)
      setReplaceTargetId(null)
    }
    reader.readAsDataURL(file)
  }

  // Filtered list
  const filteredSigns = useMemo(() => {
    return signs.filter((s) => {
      const matchesCat = categoryFilter === 'all' || s.category === categoryFilter
      const query = searchQuery.toLowerCase().trim()
      if (!query) return matchesCat

      const matchesText =
        s.name.toLowerCase().includes(query) ||
        s.meaning.toLowerCase().includes(query) ||
        s.name_si?.toLowerCase().includes(query) ||
        s.meaning_si?.toLowerCase().includes(query) ||
        s.name_ta?.toLowerCase().includes(query) ||
        s.meaning_ta?.toLowerCase().includes(query)

      return matchesCat && matchesText
    })
  }, [signs, categoryFilter, searchQuery])

  const currentFlashcard = filteredSigns[flashcardIndex] || filteredSigns[0]

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 rounded-2xl bg-slate-900 text-white px-5 py-3 text-xs font-bold shadow-2xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hidden file input for quick image replacement */}
      <input
        type="file"
        ref={replaceInputRef}
        onChange={handleReplaceImageFile}
        accept="image/*"
        className="hidden"
      />

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-black text-slate-900">
              Sri Lanka DMT Road Signs &amp; Flashcards Management
            </h2>
            <span className="rounded-full bg-blue-100 text-blue-800 px-2.5 py-0.5 text-xs font-black">
              {signs.length} Signs
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Upload authentic road sign illustrations, customize trilingual driving rules, and manage candidate flashcards
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'grid' ? 'flashcard' : 'grid')}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'flashcard'
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            <span>{viewMode === 'grid' ? 'Preview Flashcard Mode' : 'Switch to Sign Editor Grid'}</span>
          </button>

          <button
            type="button"
            onClick={handleCreateNew}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-sm transition-all cursor-pointer"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Upload New Sign</span>
          </button>

          <button
            type="button"
            onClick={handleResetSigns}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
            title="Reset road signs to authentic standard DMT catalog"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Signs</span>
          </button>
        </div>
      </div>

      {/* Toolbar: Search, Categories & Language */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search sign name, meaning, or penalty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 py-2 text-xs text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => {
                setCategoryFilter(tab.value)
                setFlashcardIndex(0)
                setIsFlipped(false)
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                categoryFilter === tab.value
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Language Preview Switch */}
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

      {/* ============================================================== */}
      {/* VIEW MODE 1: ADMIN MANAGEMENT GRID (UPLOAD/EDIT/DELETE/REPLACE)*/}
      {/* ============================================================== */}
      {viewMode === 'grid' && (
        <>
          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-500">
              Loading road signs library...
            </div>
          ) : filteredSigns.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center space-y-3">
              <ImageIcon className="h-10 w-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">No road signs found</p>
              <p className="text-xs text-slate-400">
                Try clearing your search query or upload a new road sign.
              </p>
              <button
                type="button"
                onClick={handleCreateNew}
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Upload New Sign</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSigns.map((sign) => {
                const displayName =
                  previewLanguage === 'si' && sign.name_si
                    ? sign.name_si
                    : previewLanguage === 'ta' && sign.name_ta
                      ? sign.name_ta
                      : sign.name

                const displayMeaning =
                  previewLanguage === 'si' && sign.meaning_si
                    ? sign.meaning_si
                    : previewLanguage === 'ta' && sign.meaning_ta
                      ? sign.meaning_ta
                      : sign.meaning

                const categoryInfo =
                  CATEGORY_TABS.find((t) => t.value === sign.category) ||
                  CATEGORY_TABS[1]

                return (
                  <div
                    key={sign.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between space-y-4 group"
                  >
                    <div>
                      {/* Top Bar: Category & Actions */}
                      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-3">
                        <span
                          className={`rounded-md px-2 py-0.5 text-[10px] font-bold border uppercase tracking-wider ${categoryInfo.color}`}
                        >
                          {categoryInfo.label}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleTriggerReplaceImage(sign.id)}
                            className="rounded-lg p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 cursor-pointer"
                            title="Replace Image File"
                          >
                            <RefreshCw className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleEdit(sign)}
                            className="rounded-lg p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 cursor-pointer"
                            title="Edit Sign Details"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          {deleteConfirmId === sign.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleDelete(sign.id)}
                                className="rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white hover:bg-red-700"
                              >
                                Confirm
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteConfirmId(null)}
                                className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-bold text-slate-700"
                              >
                                X
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(sign.id)}
                              className="rounded-lg p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                              title="Delete Sign"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Sign Visual Graphic */}
                      <div className="flex items-center justify-center h-28 w-full bg-slate-50/70 rounded-xl p-3 border border-slate-100 mb-3 overflow-hidden">
                        {sign.image_url.startsWith('data:') ||
                        sign.image_url.startsWith('http') ||
                        sign.image_url.startsWith('/') ? (
                          <img
                            src={sign.image_url}
                            alt={sign.name}
                            className="h-full max-h-24 w-auto object-contain drop-shadow-sm"
                          />
                        ) : (
                          <RoadSignIllustration signCode={sign.image_url} className="h-20 w-20" />
                        )}
                      </div>

                      {/* Sign Title */}
                      <h4 className="text-xs font-extrabold text-slate-900 leading-snug">
                        {displayName}
                      </h4>

                      {/* Sign Meaning */}
                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                        {displayMeaning}
                      </p>
                    </div>

                    {/* Footer: Fine & Quick Replace Button */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px]">
                      {sign.fine_or_points ? (
                        <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          {sign.fine_or_points}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium">Standard Advisory</span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleTriggerReplaceImage(sign.id)}
                        className="font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                      >
                        Replace Image →
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* ============================================================== */}
      {/* VIEW MODE 2: INTERACTIVE FLASHCARD PREVIEW                     */}
      {/* ============================================================== */}
      {viewMode === 'flashcard' && currentFlashcard && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs flex flex-col items-center justify-center">
            <div className="flex items-center justify-between w-full max-w-xl mb-4">
              <span className="text-xs font-bold text-slate-500">
                Flashcard {flashcardIndex + 1} of {filteredSigns.length}
              </span>
              <span className="text-xs font-semibold text-blue-600">
                Click card to flip and reveal DMT meaning
              </span>
            </div>

            {/* Flip Card Container */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="w-full max-w-xl min-h-64 rounded-3xl border-2 border-dashed border-blue-300 bg-linear-to-b from-blue-50/50 to-white p-8 flex flex-col items-center justify-center text-center cursor-pointer shadow-sm hover:border-blue-500 transition-all"
            >
              {!isFlipped ? (
                /* Front of card */
                <div className="space-y-4">
                  <div className="h-24 flex items-center justify-center">
                    {currentFlashcard.image_url.startsWith('data:') ||
                    currentFlashcard.image_url.startsWith('http') ||
                    currentFlashcard.image_url.startsWith('/') ? (
                      <img
                        src={currentFlashcard.image_url}
                        alt={currentFlashcard.name}
                        className="h-24 w-auto object-contain drop-shadow-md"
                      />
                    ) : (
                      <RoadSignIllustration
                        signCode={currentFlashcard.image_url}
                        className="h-24 w-24"
                      />
                    )}
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    {previewLanguage === 'si' && currentFlashcard.name_si
                      ? currentFlashcard.name_si
                      : previewLanguage === 'ta' && currentFlashcard.name_ta
                        ? currentFlashcard.name_ta
                        : currentFlashcard.name}
                  </h3>
                  <p className="text-xs text-blue-600 font-bold">
                    Show Meaning &amp; Highway Code Rule ↓
                  </p>
                </div>
              ) : (
                /* Back of card */
                <div className="space-y-3">
                  <span className="rounded-full bg-blue-100 text-blue-800 px-3 py-1 text-xs font-extrabold uppercase">
                    {currentFlashcard.category} Sign
                  </span>
                  <p className="text-sm font-bold text-slate-900 leading-relaxed max-w-md">
                    {previewLanguage === 'si' && currentFlashcard.meaning_si
                      ? currentFlashcard.meaning_si
                      : previewLanguage === 'ta' && currentFlashcard.meaning_ta
                        ? currentFlashcard.meaning_ta
                        : currentFlashcard.meaning}
                  </p>
                  {currentFlashcard.fine_or_points && (
                    <div className="pt-2">
                      <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                        {currentFlashcard.fine_or_points}
                      </span>
                    </div>
                  )}
                  <p className="text-[11px] text-slate-400 mt-2">Click to flip back ↑</p>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-4 mt-6">
              <button
                type="button"
                onClick={() => {
                  setIsFlipped(false)
                  setFlashcardIndex(
                    (prev) => (prev - 1 + filteredSigns.length) % filteredSigns.length,
                  )
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous Sign</span>
              </button>

              <span className="text-xs font-bold text-slate-600">
                {flashcardIndex + 1} / {filteredSigns.length}
              </span>

              <button
                type="button"
                onClick={() => {
                  setIsFlipped(false)
                  setFlashcardIndex((prev) => (prev + 1) % filteredSigns.length)
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 cursor-pointer shadow-xs"
              >
                <span>Next Sign</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Road Sign Add/Edit Modal */}
      <RoadSignModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSign}
        initialSign={editingSign}
      />
    </div>
  )
}
