import React from 'react'
import {
  FileText,
  Activity,
  Car,
  CreditCard,
  Target,
  Megaphone,
  Bell,
} from 'lucide-react'
import type { NotificationType } from '../types/notifications'

interface NotificationTypeIconProps {
  type: NotificationType
  className?: string
}

export const NotificationTypeIcon: React.FC<NotificationTypeIconProps> = ({
  type,
  className = 'h-4 w-4',
}) => {
  switch (type) {
    case 'permit_expiring':
      return <FileText className={`${className} text-blue-600`} />
    case 'medical_expiring':
      return <Activity className={`${className} text-emerald-600`} />
    case 'session_reminder':
      return <Car className={`${className} text-indigo-600`} />
    case 'payment_due':
      return <CreditCard className={`${className} text-amber-600`} />
    case 'trial_scheduled':
      return <Target className={`${className} text-purple-600`} />
    case 'announcement':
      return <Megaphone className={`${className} text-pink-600`} />
    default:
      return <Bell className={`${className} text-slate-600`} />
  }
}

export default NotificationTypeIcon
