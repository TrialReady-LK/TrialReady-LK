import React, { useState, useRef, useEffect } from 'react'
import {
  Bot,
  Send,
  X,
  RotateCw,
  Sparkles,
  GraduationCap,
  BookOpen,
  Code2,
  Calculator,
  Trash2,
} from 'lucide-react'
import { useAuth } from '../../auth/context/AuthContext'
import { queryGeminiCopilot } from '../services/copilotEngine'
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
  // Normalize math and symbols
  const cleanText = text
    .replace(/\$\s*ightarrow\$/gi, '→')
    .replace(/\$\\rightarrow\$/gi, '→')
    .replace(/\$\\ge\$/gi, '≥')
    .replace(/\$\\le\$/gi, '≤')
    .replace(/\$ge\$/gi, '≥')
    .replace(/\$le\$/gi, '≤')
    .replace(/\\`/g, '`')

  // Split into code blocks vs text blocks
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g
  const parts: Array<{ type: 'text' | 'code'; content: string; lang?: string }> = []

  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = codeBlockRegex.exec(cleanText)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: cleanText.slice(lastIndex, match.index),
      })
    }
    parts.push({
      type: 'code',
      lang: match[1] || 'code',
      content: match[2].trimEnd(),
    })
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < cleanText.length) {
    parts.push({
      type: 'text',
      content: cleanText.slice(lastIndex),
    })
  }

  const renderInline = (content: string) => {
    const inlineParts = content.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`|\$.*?\$)/g)
    return inlineParts.map((part, pIdx) => {
      if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
        return (
          <strong
            key={pIdx}
            className={`font-bold ${isUser ? 'text-white' : 'text-slate-950'}`}
          >
            {part.slice(2, -2)}
          </strong>
        )
      }
      if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
        return (
          <em key={pIdx} className="italic">
            {part.slice(1, -1)}
          </em>
        )
      }
      if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
        return (
          <code
            key={pIdx}
            className={`rounded px-1.5 py-0.5 font-mono text-[11px] ${
              isUser
                ? 'bg-blue-700 text-blue-100'
                : 'bg-slate-100 text-blue-700 border border-slate-200'
            }`}
          >
            {part.slice(1, -1)}
          </code>
        )
      }
      if (part.startsWith('$') && part.endsWith('$') && part.length >= 2) {
        return (
          <span
            key={pIdx}
            className={`font-mono font-medium px-1 py-0.2 rounded ${
              isUser ? 'bg-blue-700 text-amber-200' : 'bg-amber-50 text-amber-900 border border-amber-200/60'
            }`}
          >
            {part.slice(1, -1)}
          </span>
        )
      }
      return part
    })
  }

  return (
    <div className="space-y-2 text-xs leading-relaxed">
      {parts.map((block, bIdx) => {
        if (block.type === 'code') {
          return (
            <div
              key={bIdx}
              className="my-2 rounded-xl bg-slate-900 text-slate-100 p-3 font-mono text-[11px] overflow-x-auto shadow-inner border border-slate-800"
            >
              {block.lang && (
                <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1 pb-1 border-b border-slate-800">
                  {block.lang}
                </div>
              )}
              <pre className="whitespace-pre overflow-x-auto">
                <code>{block.content}</code>
              </pre>
            </div>
          )
        }

        const lines = block.content.split('\n')
        return (
          <div key={bIdx} className="space-y-1">
            {lines.map((line, idx) => {
              const trimmed = line.trim()
              if (!trimmed) {
                return <div key={idx} className="h-0.5" />
              }

              // Divider
              if (trimmed === '---' || trimmed === '***') {
                return (
                  <hr
                    key={idx}
                    className={`my-2 border-t ${
                      isUser ? 'border-blue-400/40' : 'border-slate-200'
                    }`}
                  />
                )
              }

              // Markdown Headers
              if (trimmed.startsWith('### ')) {
                return (
                  <h4
                    key={idx}
                    className={`font-black text-[12px] pt-1 ${
                      isUser ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {renderInline(trimmed.slice(4))}
                  </h4>
                )
              }
              if (trimmed.startsWith('## ')) {
                return (
                  <h3
                    key={idx}
                    className={`font-black text-[13px] pt-1.5 ${
                      isUser ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {renderInline(trimmed.slice(3))}
                  </h3>
                )
              }
              if (trimmed.startsWith('# ')) {
                return (
                  <h2
                    key={idx}
                    className={`font-black text-[14px] pt-2 ${
                      isUser ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {renderInline(trimmed.slice(2))}
                  </h2>
                )
              }

              // Bullet points
              if (
                trimmed.startsWith('• ') ||
                trimmed.startsWith('- ') ||
                trimmed.startsWith('* ')
              ) {
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

              // Numbered list
              if (/^\d+\.\s/.test(trimmed)) {
                const numMatch = trimmed.match(/^(\d+\.)\s(.*)$/)
                if (numMatch) {
                  return (
                    <div key={idx} className="flex items-start gap-1.5 pl-0.5">
                      <span
                        className={`shrink-0 text-[11px] font-bold ${
                          isUser ? 'text-blue-200' : 'text-blue-600'
                        }`}
                      >
                        {numMatch[1]}
                      </span>
                      <div className="flex-1">{renderInline(numMatch[2])}</div>
                    </div>
                  )
                }
              }

              return <p key={idx}>{renderInline(line)}</p>
            })}
          </div>
        )
      })}
    </div>
  )
}

export const AiCopilotWidget: React.FC = () => {
  const { profile, role } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [language, setLanguage] = useState<TheoryLanguage>('en')
  const [inputQuery, setInputQuery] = useState('')

  const getInitialGreeting = (lang: TheoryLanguage): ChatMessage => {
    let text =
      '👋 Ayubowan / Vanakkam / Hello! I am your **TrialReady AI Assistant** (powered by Google Gemini).\n\nAsk me anything! I can assist you with:\n• 📐 **Mathematics & Science:** Calculations, formulas, and step-by-step solutions\n• 💻 **Programming & Tech:** Python, JavaScript, SQL, algorithms, and code debugs\n• 📚 **Academic & Coursework:** Explanations, summaries, English writing, and study tips\n• 🚦 **Sri Lanka Highway Code & Trials:** Road rules, speed limits, Hill Start, and parking maneuvers\n\nFeel free to ask questions in English, Sinhala (සිංහල), or Tamil (தமிழ்)!'

    if (lang === 'si') {
      text =
        '👋 ආයුබෝවන්! මම ඔබේ **TrialReady AI සහායකයා** (Google Gemini මගින් බලගැන්වේ).\n\nගණිතය, පරිගණක ක්‍රමලේඛනය (Coding), අධ්‍යයන කටයුතු, සාමාන්‍ය දැනුම, හෝ ශ්‍රී ලංකා මාර්ග නීති සහ DMT රියදුරු විභාග පිළිබඳ ඕනෑම ප්‍රශ්නයක් විමසන්න!'
    } else if (lang === 'ta') {
      text =
        '👋 வணக்கம்! நான் உங்கள் **TrialReady AI உதவியாளர்** (Google Gemini மூலம் இயக்கப்படுகிறது).\n\nகணிதம், நிரலாக்கம் (Coding), கல்விசார் வினாக்கள், பொது அறிவு, அல்லது இலங்கை போக்குவரத்து விதிகள் மற்றும் ஓட்டுநர் பரீட்சை பற்றி எதுவாக இருந்தாலும் கேட்கலாம்!'
    }

    return {
      id: 'msg-0',
      sender: 'ai',
      text,
      timestamp: 'Just now',
      suggestions: [
        'Solve 2x + 5 = 15 step-by-step',
        'Write a Python function to reverse a string',
        'What are the speed limits in Sri Lanka?',
        'How to do Hill Start without rollback?',
      ],
    }
  }

  const [messages, setMessages] = useState<ChatMessage[]>([getInitialGreeting('en')])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isTyping, isOpen])

  const quickPrompts = [
    {
      label: 'Math Solution',
      icon: Calculator,
      query: 'Solve 3x + 12 = 45 step-by-step',
    },
    {
      label: 'Python Code',
      icon: Code2,
      query: 'Write a Python function to check if a string is a palindrome',
    },
    {
      label: 'English Grammar',
      icon: BookOpen,
      query: 'Explain the difference between "affect" and "effect" with examples',
    },
    {
      label: 'Highway Code',
      icon: Sparkles,
      query: 'What are the legal speed limits in Sri Lanka?',
    },
    {
      label: 'Hill Start Tips',
      icon: RotateCw,
      query: 'How do I perform a perfect Hill Start without engine stalling or rollback?',
    },
    {
      label: 'Student Portal',
      icon: GraduationCap,
      query: 'How does the TrialReady Learner Journey and Readiness Score work?',
    },
  ]

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim()
    if (!query || isTyping) return

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

    // Build the updated messages list with the new query
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setInputQuery('')
    setIsTyping(true)

    try {
      // Prepare payload for Gemini API with multi-turn conversation
      const conversationHistory = updatedMessages.map((m) => ({
        sender: m.sender,
        text: m.text,
      }))

      const response = await queryGeminiCopilot(conversationHistory, language, {
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
    } catch {
      const errorMsg: ChatMessage = {
        id: `ai-err-${crypto.randomUUID()}`,
        sender: 'ai',
        text:
          language === 'si'
            ? 'සමාවෙන්න, ඉල්ලීම සැකසීමේදී දෝෂයක් ඇති විය. කරුණාකර නැවත උත්සාහ කරන්න.'
            : language === 'ta'
            ? 'மன்னிக்கவும், கோரிக்கையைச் செயலாக்குவதில் பிழை ஏற்பட்டது. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.'
            : 'Sorry, an error occurred while processing your request. Please try again.',
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setIsTyping(false)
    }
  }

  const handleClearHistory = () => {
    setMessages([getInitialGreeting(language)])
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
          <div className="relative">
            <Bot className="h-5 w-5 text-white animate-pulse" />
            <Sparkles className="h-2.5 w-2.5 text-amber-300 absolute -top-1 -right-1 animate-spin" />
          </div>
          <div className="text-left">
            <p className="text-xs font-black tracking-wide leading-none flex items-center gap-1">
              AI Copilot <span className="text-[9px] font-normal text-amber-200">Gemini</span>
            </p>
            <p className="text-[10px] text-blue-100 font-medium leading-tight">
              General AI & Academy Assistant
            </p>
          </div>
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse ml-1" />
        </button>
      )}

      {/* Expanded Chat Dialog */}
      {isOpen && (
        <div className="flex flex-col w-[calc(100vw-32px)] sm:w-[440px] max-w-[460px] h-[580px] max-h-[85vh] rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 px-4 sm:px-5 py-3.5 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 shadow-inner relative">
                <Bot className="h-5 w-5" />
                <Sparkles className="h-2.5 w-2.5 text-amber-300 absolute -top-0.5 -right-0.5" />
              </div>
              <div>
                <h3 className="text-xs font-black tracking-tight flex items-center gap-1.5">
                  TrialReady Gemini AI
                  <span className="rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] px-1.5 py-0.5 border border-emerald-500/30 font-medium">
                    Online
                  </span>
                </h3>
                <p className="text-[10px] text-slate-400">
                  Ask anything • Multi-turn Copilot
                </p>
              </div>
            </div>

            {/* Language Switcher, Clear, & Close */}
            <div className="flex items-center gap-1.5">
              <div className="flex rounded-lg bg-slate-800/80 p-0.5 border border-slate-700 text-[10px] font-bold">
                {(['en', 'si', 'ta'] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => {
                      setLanguage(lang)
                      if (messages.length <= 1) {
                        setMessages([getInitialGreeting(lang)])
                      }
                    }}
                    className={`px-1.5 py-0.5 rounded-md transition-all cursor-pointer ${
                      language === lang
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleClearHistory}
                title="Clear Chat History"
                aria-label="Clear Chat History"
                className="h-7 w-7 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-300 hover:bg-slate-700 flex items-center justify-center transition-colors cursor-pointer text-xs"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close Copilot"
                className="h-7 w-7 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors cursor-pointer text-xs"
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
                  disabled={isTyping}
                  className="shrink-0 flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-700 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
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
                  className={`max-w-[90%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs ${
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
                    <div className="flex flex-wrap gap-1 mt-1.5 max-w-[92%]">
                      {msg.suggestions.map((sug, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSend(sug)}
                          disabled={isTyping}
                          className="rounded-lg bg-blue-50/90 border border-blue-200 px-2 py-0.5 text-[10px] font-semibold text-blue-700 hover:bg-blue-100 hover:border-blue-300 transition-colors cursor-pointer text-left shadow-2xs disabled:opacity-50"
                        >
                          💡 {sug}
                        </button>
                      ))}
                    </div>
                  )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 rounded-2xl px-3.5 py-2 w-32 shadow-2xs">
                <span className="h-2 w-2 rounded-full bg-blue-600 animate-bounce" />
                <span className="h-2 w-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]" />
                <span className="h-2 w-2 rounded-full bg-purple-600 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[10px] font-semibold text-slate-400">Gemini...</span>
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
                  ? 'ගණිතය, කෝඩින්, හෝ ඕනෑම ප්‍රශ්නයක් අසන්න...'
                  : language === 'ta'
                  ? 'கணிதம், கோடிங், அல்லது எந்த கேள்வியையும் கேளுங்கள்...'
                  : 'Ask about math, coding, university, highway code...'
              }
              className="flex-1 rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:outline-hidden transition-all"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isTyping}
              aria-label="Send Message"
              className="rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50 transition-all cursor-pointer shadow-xs flex items-center justify-center shrink-0"
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
