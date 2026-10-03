import React from 'react'
import { Link } from 'react-router-dom'
import { Check, X, Smartphone, MessageSquare, Mail, Bell } from 'lucide-react'
import type { AppNotification } from '../types/notifications'
import {
  formatChannelBadge,
  formatPriorityBadge,
} from '../utils/alertEngine'
import { NotificationTypeIcon } from './NotificationTypeIcon'

interface NotificationItemCardProps {
  notification: AppNotification
  onMarkRead: (id: string) => void
  onDelete: (id: string) => void
}

export const NotificationItemCard: React.FC<NotificationItemCardProps> = ({
  notification,
  onMarkRead,
  onDelete,
}) => {
  const channelInfo = formatChannelBadge(notification.channel)
  const priorityInfo = formatPriorityBadge(notification.priority)
  const isUnread = notification.status === 'unread'

  return (
    <div
      className={`rounded-2xl border p-4 sm:p-5 transition-all shadow-xs ${
        isUnread
          ? 'border-blue-200 bg-blue-50/40 hover:bg-blue-50/70'
          : 'border-slate-200 bg-white hover:bg-slate-50/80'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Icon & Details */}
        <div className="flex items-start gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 shadow-2xs border border-slate-200">
            <NotificationTypeIcon type={notification.type} className="h-5 w-5" />
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-sm font-bold text-slate-900">
                {notification.title}
              </h4>

              {isUnread && (
                <span className="h-2 w-2 rounded-full bg-blue-600 animate-ping" />
              )}

              <span
                className={`rounded-md px-2 py-0.2 text-[10px] border ${priorityInfo.badgeClass}`}
              >
                {priorityInfo.label}
              </span>

              <span
                className={`inline-flex items-center gap-1 rounded-md px-2 py-0.2 text-[10px] border ${channelInfo.badgeClass}`}
              >
                {notification.channel === 'whatsapp' ? (
                  <Smartphone className="h-3 w-3" />
                ) : notification.channel === 'sms' ? (
                  <MessageSquare className="h-3 w-3" />
                ) : notification.channel === 'email' ? (
                  <Mail className="h-3 w-3" />
                ) : (
                  <Bell className="h-3 w-3" />
                )}
                <span>{channelInfo.label}</span>
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
              {notification.message}
            </p>

            <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400">
              <span>{notification.created_at.slice(0, 10)}</span>
              {notification.action_url && (
                <>
                  <span>•</span>
                  <Link
                    to={notification.action_url}
                    className="font-bold text-blue-600 hover:underline"
                  >
                    View Details →
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {isUnread && (
            <button
              type="button"
              onClick={() => onMarkRead(notification.id)}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
              title="Mark as Read"
            >
              <Check className="h-3 w-3" />
              <span>Mark Read</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onDelete(notification.id)}
            className="rounded-lg p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer"
            title="Dismiss Alert"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotificationItemCard
