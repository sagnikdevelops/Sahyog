"use client";

import React, { useState } from "react";
import { useAppState } from "@/lib/store/stateContext";
import { Bell, Check, ExternalLink, Info, AlertTriangle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export function NotificationCenter() {
  const { notifications, currentRole, currentUser, markNotificationAsRead } = useAppState();
  const [isOpen, setIsOpen] = useState(false);

  // Filter relevant notifications
  const userNotifications = notifications.filter(
    (n) => n.userId === currentUser.id || n.role === currentRole
  );

  const unreadCount = userNotifications.filter((n) => !n.isRead).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-md text-[#525252] hover:text-[#111111] hover:bg-[#F8F8F8] transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#DC2626] text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-lg border border-[#E5E5E5] bg-white shadow-xl p-3 z-50 animate-in fade-in-0 zoom-in-95">
          <div className="flex items-center justify-between pb-2 border-b border-[#E5E5E5] mb-2">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-[#111111]">Notifications</h4>
              {unreadCount > 0 && (
                <span className="bg-[#111111] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-xs text-[#737373] hover:text-[#111111]"
            >
              Close
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto space-y-2">
            {userNotifications.length === 0 ? (
              <div className="text-center py-6 text-xs text-[#737373]">
                No notifications right now.
              </div>
            ) : (
              userNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-2.5 rounded-md border transition-colors ${
                    notif.isRead
                      ? "bg-white border-[#E5E5E5]"
                      : "bg-[#F8F8F8] border-[#D4D4D4]"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {notif.type === "URGENT" && (
                      <AlertTriangle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
                    )}
                    {notif.type === "SUCCESS" && (
                      <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                    )}
                    {(notif.type === "INFO" || notif.type === "WARNING") && (
                      <Info className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#111111]">{notif.title}</p>
                      <p className="text-xs text-[#525252] mt-0.5 leading-relaxed">
                        {notif.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[10px] text-[#A3A3A3]">
                          {formatDate(notif.createdAt, "hh:mm a")}
                        </span>
                        <div className="flex items-center gap-2">
                          {!notif.isRead && (
                            <button
                              onClick={() => markNotificationAsRead(notif.id)}
                              className="text-[11px] text-[#525252] hover:text-[#111111] flex items-center gap-1"
                            >
                              <Check className="w-3 h-3" /> Mark read
                            </button>
                          )}
                          {notif.link && (
                            <Link
                              href={notif.link}
                              onClick={() => {
                                markNotificationAsRead(notif.id);
                                setIsOpen(false);
                              }}
                              className="text-[11px] font-semibold text-[#111111] hover:underline flex items-center gap-1"
                            >
                              Open <ExternalLink className="w-2.5 h-2.5" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}