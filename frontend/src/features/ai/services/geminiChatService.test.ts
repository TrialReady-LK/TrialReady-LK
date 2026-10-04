import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  sendGeminiChatMessage,
} from './geminiChatService'
import { queryGeminiCopilot } from './copilotEngine'

describe('geminiChatService & copilotEngine', () => {
  const originalFetch = globalThis.fetch

  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    globalThis.fetch = originalFetch
  })

  it('successfully sends message history and returns Gemini response', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        text: 'The legal speed limit in urban areas is 50 km/h in Sri Lanka.',
        status: 'success',
        suggestions: ['Expressway speed limit', 'Rural area speed limit'],
      }),
    } as Response)

    const result = await sendGeminiChatMessage([
      { sender: 'user', text: 'What is the speed limit in urban areas?' },
    ])

    expect(result.status).toBe('success')
    expect(result.text).toBe('The legal speed limit in urban areas is 50 km/h in Sri Lanka.')
    expect(result.suggestions).toContain('Expressway speed limit')
  })

  it('handles empty query with default driving suggestions', async () => {
    const result = await sendGeminiChatMessage([])
    expect(result.status).toBe('empty_query')
    expect(result.suggestions).toContain('How to do Hill Start without rollback?')
  })

  it('handles network failure gracefully with friendly fallback in English', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network offline'))

    const result = await sendGeminiChatMessage(
      [{ sender: 'user', text: 'How do I do a hill start?' }],
      { language: 'en' }
    )

    expect(result.status).toBe('network_error')
    expect(result.text).toContain('trouble connecting to Gemini')
    expect(result.suggestions).toContain('What are the speed limits in Sri Lanka?')
  })

  it('handles network failure with friendly fallback in Sinhala', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network offline'))

    const result = await sendGeminiChatMessage(
      [{ sender: 'user', text: 'ආයුබෝවන්' }],
      { language: 'si' }
    )

    expect(result.status).toBe('network_error')
    expect(result.text).toContain('Gemini සේවාව හා සම්බන්ධ වීමේ')
  })

  it('queryGeminiCopilot correctly formats response from backend', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        text: 'To do a hill start: Find the clutch bite point, apply slight accelerator, and release handbrake smoothly.',
        status: 'success',
      }),
    } as Response)

    const response = await queryGeminiCopilot(
      [{ sender: 'user', text: 'How to perform hill start?' }],
      'en',
      { userName: 'Amila' }
    )

    expect(response.status).toBe('success')
    expect(response.text).toContain('clutch bite point')
  })
})
