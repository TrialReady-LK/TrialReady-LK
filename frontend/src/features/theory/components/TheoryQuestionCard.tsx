import React from 'react'
import {
  Octagon,
  AlertTriangle,
  Info,
  Car,
  Shield,
  Settings2,
  Check,
  X,
  Lightbulb,
} from 'lucide-react'
import { RoadSignIllustration } from './RoadSignIllustration'
import { useTheoryLanguage } from '../context/TheoryLanguageContext'
import type { TheoryQuestion } from '../types/theory'

interface TheoryQuestionCardProps {
  question: TheoryQuestion
  questionNumber: number
  totalQuestions: number
  selectedOptionIndex?: number
  isReviewMode?: boolean
  onSelectOption: (optionIndex: number) => void
}

export const TheoryQuestionCard: React.FC<TheoryQuestionCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  selectedOptionIndex,
  isReviewMode = false,
  onSelectOption,
}) => {
  const { getLocalizedQuestion, language } = useTheoryLanguage()
  const localized = getLocalizedQuestion(question)

  const renderCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'road_signs_regulatory':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-700">
            <Octagon className="h-3.5 w-3.5" />
            <span>
              {language === 'si'
                ? 'නියාමන මාර්ග සංඥා'
                : language === 'ta'
                  ? 'ஒழுங்குமுறை சைகைகள்'
                  : 'Regulatory Road Signs'}
            </span>
          </span>
        )
      case 'road_signs_warning':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>
              {language === 'si'
                ? 'අනතුරු ඇඟවීමේ සංඥා'
                : language === 'ta'
                  ? 'எச்சரிக்கை சைகைகள்'
                  : 'Warning Road Signs'}
            </span>
          </span>
        )
      case 'road_signs_informative':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700">
            <Info className="h-3.5 w-3.5" />
            <span>
              {language === 'si'
                ? 'තොරතුරු සංඥා'
                : language === 'ta'
                  ? 'தகவல் சைகைகள்'
                  : 'Informative Signs'}
            </span>
          </span>
        )
      case 'priority_and_junctions':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700">
            <Car className="h-3.5 w-3.5" />
            <span>
              {language === 'si'
                ? 'ප්‍රමුඛතා නීති හා මංසන්ධි'
                : language === 'ta'
                  ? 'முன்னுரிமை & சந்திப்புகள்'
                  : 'Priority & Right of Way'}
            </span>
          </span>
        )
      case 'general_road_safety':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
            <Shield className="h-3.5 w-3.5" />
            <span>
              {language === 'si'
                ? 'මාර්ග ආරක්ෂාව හා නීති'
                : language === 'ta'
                  ? 'வீதி பாதுகாப்பு & சட்டங்கள்'
                  : 'General Road Safety & DMT Laws'}
            </span>
          </span>
        )
      case 'vehicle_mechanics_controls':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            <Settings2 className="h-3.5 w-3.5" />
            <span>
              {language === 'si'
                ? 'වාහන පාලනය හා යාන්ත්‍රික කරුණු'
                : language === 'ta'
                  ? 'வாகனக் கட்டுப்பாடுகள்'
                  : 'Vehicle Controls & Mechanics'}
            </span>
          </span>
        )
      default:
        return <span className="text-xs font-semibold text-slate-500">{cat}</span>
    }
  }

  const optionLetters = ['A', 'B', 'C', 'D']

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8 space-y-6">
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-black text-blue-700 border border-blue-200">
          Question {questionNumber} of {totalQuestions}
        </span>

        {renderCategoryBadge(question.category)}
      </div>

      {/* Question Text & Sign */}
      <div className="space-y-4">
        {question.image_url && (
          <div className="flex justify-center">
            <RoadSignIllustration
              signCode={question.image_url}
              className="h-24 w-24"
            />
          </div>
        )}

        <h3 className="text-base font-bold text-slate-900 leading-relaxed sm:text-lg">
          {localized.question_text}
        </h3>
      </div>

      {/* Options List */}
      <div className="space-y-2.5">
        {localized.options.map((optionText, idx) => {
          const isSelected = selectedOptionIndex === idx
          const isCorrect = idx === question.correct_option_index

          let buttonStyle =
            'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80 text-slate-800'

          if (!isReviewMode && isSelected) {
            buttonStyle =
              'border-blue-600 bg-blue-50/80 text-blue-900 font-bold shadow-xs'
          } else if (isReviewMode) {
            if (isCorrect) {
              buttonStyle =
                'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold'
            } else if (isSelected && !isCorrect) {
              buttonStyle =
                'border-red-400 bg-red-50 text-red-900 font-semibold'
            }
          }

          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectOption(idx)}
              disabled={isReviewMode}
              className={`flex w-full items-center gap-3.5 rounded-2xl border p-4 text-left text-xs sm:text-sm transition-all cursor-pointer ${buttonStyle}`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl font-black text-xs ${
                  isReviewMode
                    ? isCorrect
                      ? 'bg-emerald-600 text-white'
                      : isSelected
                        ? 'bg-red-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    : isSelected
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                }`}
              >
                {optionLetters[idx]}
              </span>

              <span className="flex-1 leading-snug">{optionText}</span>

              {isReviewMode && (
                <div>
                  {isCorrect && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                      <Check className="h-3 w-3" />
                      <span>Correct</span>
                    </span>
                  )}
                  {isSelected && !isCorrect && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-800">
                      <X className="h-3 w-3" />
                      <span>Your Choice</span>
                    </span>
                  )}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Post-exam Explanation Box */}
      {isReviewMode && (
        <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-xs text-slate-700">
          <strong className="flex items-center gap-1.5 text-blue-900 font-bold mb-1">
            <Lightbulb className="h-4 w-4 text-amber-500 shrink-0" />
            <span>DMT Highway Code Explanation:</span>
          </strong>
          {localized.explanation}
        </div>
      )}
    </div>
  )
}

export default TheoryQuestionCard
