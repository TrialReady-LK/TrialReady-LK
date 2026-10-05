import { describe, it, expect } from 'vitest'
import {
  formatChannelBadge,
  formatPriorityBadge,
  formatNotificationTypeIcon,
} from './alertEngine'

describe('alertEngine', () => {
  describe('formatChannelBadge', () => {
    it('formats WhatsApp channel badge with icon', () => {
      const b = formatChannelBadge('whatsapp')
      expect(b.label).toBe('WhatsApp')
      expect(b.icon).toBe('whatsapp')
    })

    it('formats SMS channel badge with icon', () => {
      const b = formatChannelBadge('sms')
      expect(b.label).toBe('SMS Text')
      expect(b.icon).toBe('sms')
    })

    it('formats Email channel badge with icon', () => {
      const b = formatChannelBadge('email')
      expect(b.label).toBe('Email')
      expect(b.icon).toBe('email')
    })
  })

  describe('formatPriorityBadge', () => {
    it('returns pulsing red badge for urgent priority', () => {
      const p = formatPriorityBadge('urgent')
      expect(p.label).toBe('Urgent')
      expect(p.badgeClass).toContain('bg-red-100')
    })

    it('returns amber badge for high priority', () => {
      const p = formatPriorityBadge('high')
      expect(p.label).toBe('High Priority')
      expect(p.badgeClass).toContain('bg-amber-100')
    })
  })

  describe('formatNotificationTypeIcon', () => {
    it('returns appropriate icon for permit, medical, and trial notices', () => {
      expect(formatNotificationTypeIcon('permit_expiring')).toBe('file-text')
      expect(formatNotificationTypeIcon('medical_expiring')).toBe('activity')
      expect(formatNotificationTypeIcon('trial_scheduled')).toBe('target')
      expect(formatNotificationTypeIcon('announcement')).toBe('megaphone')
    })
  })
})
