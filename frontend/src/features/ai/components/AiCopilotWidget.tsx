import React, { useState, useRef, useEffect } from 'react'
import {
  Bot,
  Send,
  X,
  RotateCw,
  TrendingUp,
  GraduationCap,
  BookOpen,
  Zap,
} from 'lucide-react'
import { useAuth } from '../../auth/context/AuthContext'
import { processCopilotQuery } from '../services/copilotEngine'
import type { TheoryLanguage } from '../../theory/types/theory'

interface ChatMessage {
  id: string
  sender: 'user' | 'ai'
  text: string
  timestamp: string
  suggestions?: string[]
}

const FormattedMessageText: React.FC<{ text: string; isUser: boolean }> = ({
  text,
  isUser,
}) => {
  const cleanText = text
    .replace(/\$\\ge\$/g, '≥')
    .replace(/\$\\le\$/g, '≤')
    .replace(/\$\\rightarrow\$/g, '→')
    .replace(/\\`/g, '`')

  const lines = cleanText.split('\n')

  return (
    <div className="space-y-1.5 text-xs leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim()
        if (!trimmed) {
          return <div key={idx} className="h-1" />
        }

        const renderInline = (content: string) => {
          const parts = content.split(/(\*\*.*?\*\*|`.*?`)/g)
          return parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong
                  key={pIdx}
                  className={`font-bold ${
                    isUser ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {part.slice(2, -2)}
                </strong>
              )
            }
            if (part.startsWith('`') && part.endsWith('`')) {
              return (
                <code
                  key={pIdx}
                  className={`rounded px-1 py-0.5 font-mono text-[10px] ${
                    isUser
                      ? 'bg-blue-700 text-blue-100'
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}
                >
                  {part.slice(1, -1)}
                </code>
              )
            }
            return part
          })
        }

        if (trimmed.startsWith('• ') || trimmed.startsWith('- ')) {
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-0.5">
              <span
                className={`shrink-0 font-bold ${
                  isUser ? 'text-blue-200' : 'text-blue-600'
                }`}
              >
                •
              </span>
              <div className="flex-1">{renderInline(trimmed.slice(2))}</div>
            </div>
          )
        }

        if (/^\d+\.\s/.test(trimmed)) {
          const match = trimmed.match(/^(\d+\.)\s(.*)$/)
          if (match) {
            return (
              <div key={idx} className="flex items-start gap-1.5 pl-0.5">
                <span
                  className={`shrink-0 text-[11px] font-bold ${
                    isUser ? 'text-blue-200' : 'text-blue-600'
                  }`}
                >
                  {match[1]}
                </span>
                <div className="flex-1">{renderInline(match[2])}</div>
              </div>
            )
          }
        }

        return <p key={idx}>{renderInline(line)}</p>
      })}
    </div>
  )
}

export const AiCopilotWidget: React.FC = () => {
  const { profile, role } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [language, setLanguage] = useState<TheoryLanguage>('en')
  const [inputQuery, setInputQuery] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-0',
      sender: 'ai',
      text:
        '👋 Ayubowan / Vanakkam! I am your **TrialReady AI Copilot**.\n\nAsk me anything about:\n• 🎓 **Student Portal:** Schedules, Payments, and Trial Readiness\n• 🚦 **Sri Lanka Highway Code:** Speed limits, Traffic lights, Road signs\n• 🚗 **DMT Practical Trials:** Hill Start, Reverse S-Bend, Parallel Parking\n\nI can assist you in English, Sinhala (සිංහල), or Tamil (தமிழ்)!',
      timestamp: 'Just now',
      suggestions: [
        'How to use Student Portal?',
        'Give me highway codes in Sri Lanka',
        'Hill Start Tips',
        'Speed Limits in Sri Lanka',
      ],
    },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isTyping, isOpen])

  const quickPrompts = [
    {
      label: 'Student Portal',
      icon: GraduationCap,
      query: 'What can I do in the student portal?',
    },
    {
      label: 'Highway Code',
      icon: BookOpen,
      query: 'Give me highway codes in Sri Lanka',
    },
    {
      label: 'Hill Start Tips',
      icon: TrendingUp,
      query: 'How do I do a perfect Hill Start without rollback?',
    },
    {
      label: 'Roundabout Priority',
      icon: RotateCw,
      query: 'Who has right of way at a roundabout?',
    },
    {
      label: 'Speed Limits',
      icon: Zap,
      query: 'What are the legal speed limits in Sri Lanka?',
    },
  ]

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim()
    if (!query) return

    const now = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
    const userMsg: ChatMessage = {
      id: `user-${crypto.randomUUID()}`,
      sender: 'user',
      text: query,
      timestamp: now,
    }

    setMessages((prev) => [...prev, userMsg])
    setInputQuery('')
    setIsTyping(true)

    // Process with intelligent NLP Copilot engine
    setTimeout(() => {
      const response = processCopilotQuery(query, language, {
        role,
        userName: profile?.full_name,
        drivingSchoolName: profile?.driving_school?.name,
      })

      const aiMsg: ChatMessage = {
        id: `ai-${crypto.randomUUID()}`,
        sender: 'ai',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        suggestions: response.suggestions,
      }

      setMessages((prev) => [...prev, aiMsg])
      setIsTyping(false)
    }, 450)
  }

  return (
    <div className="fixed bottom-5 right-5 z-40 print:hidden font-sans">
      {/* Floating Pill Toggle Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-5 py-3 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer border border-white/20"
        >
          <Bot className="h-5 w-5 text-white animate-pulse" />
          <div className="text-left">
            <p className="text-xs font-black tracking-wide leading-none">
              AI Copilot
            </p>
            <p className="text-[10px] text-blue-100 font-medium leading-tight">
              Highway Code & Student Guide
            </p>
          </div>
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse ml-1" />
        </button>
      )}

      {/* Expanded Chat Dialog */}
      {isOpen && (
        <div className="flex flex-col w-[380px] sm:w-[420px] h-[540px] rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 px-5 py-4 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 shadow-inner">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-black tracking-tight flex items-center gap-1.5">
                  TrialReady AI Copilot
                  <span className="rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] px-1.5 py-0.5 border border-emerald-500/30">
                    Online
                  </span>
                </h3>
                <p className="text-[10px] text-slate-400">
                  Sri Lanka DMT & Academy Assistant
                </p>
              </div>
            </div>

            {/* Language Switcher & Close */}
            <div className="flex items-center gap-2">
              <div className="flex rounded-lg bg-slate-800/80 p-0.5 border border-slate-700 text-[10px] font-bold">
                {(['en', 'si', 'ta'] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setLanguage(lang)}
                    className={`px-1.5 py-0.5 rounded-md transition-all cursor-pointer ${
                      language === lang
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close Copilot"
                className="h-7 w-7 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer text-xs"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div className="flex gap-1.5 overflow-x-auto p-2 bg-slate-50 border-b border-slate-200 no-scrollbar">
            {quickPrompts.map((p, i) => {
              const PromptIcon = p.icon
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSend(p.query)}
                  className="shrink-0 flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-700 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer shadow-2xs"
                >
                  <PromptIcon className="h-3 w-3 text-blue-600" />
                  <span>{p.label}</span>
                </button>
              )
            })}
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                  }`}
                >
                  <FormattedMessageText
                    text={msg.text}
                    isUser={msg.sender === 'user'}
                  />
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1">
                  {msg.timestamp}
                </span>

                {/* Interactive Suggestion Chips */}
                {msg.sender === 'ai' &&
                  msg.suggestions &&
                  msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5 max-w-[90%]">
                      {msg.suggestions.map((sug, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSend(sug)}
                          className="rounded-lg bg-blue-50/80 border border-blue-200/80 px-2 py-0.5 text-[10px] font-semibold text-blue-700 hover:bg-blue-100 hover:border-blue-300 transition-colors cursor-pointer text-left"
                        >
                          💡 {sug}
                        </button>
                      ))}
                    </div>
                  )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-white border border-slate-200 rounded-2xl px-3 py-2 w-24 shadow-2xs">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce" />
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={
                language === 'si'
                  ? 'ශිෂ්‍ය පෝර්ටලය හෝ DMT මාර්ග නීති පිළිබඳ අසන්න...'
                  : language === 'ta'
                  ? 'மாணவர் போர்ட்டல் அல்லது போக்குவரத்து விதிகள் பற்றி கேட்கவும்...'
                  : 'Ask about Student Portal, Highway Code, Hill Start, Fees...'
              }
              className="flex-1 rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:outline-hidden transition-all"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isTyping}
              aria-label="Send Message"
              className="rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50 transition-all cursor-pointer shadow-xs flex items-center justify-center"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default AiCopilotWidget
