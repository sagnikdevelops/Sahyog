"use client";

import React from "react";
import { useAppState } from "@/lib/store/stateContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { ShieldCheck, Lock, Activity } from "lucide-react";

export default function AdminAuditPage() {
  const { auditLogs } = useAppState();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-[#E5E5E5] pb-4">
        <h1 className="text-2xl font-bold text-[#111111]">Compliance & Security Audit Trail</h1>
        <p className="text-xs text-[#737373]">
          Tamper-evident record of all sensitive actions: worker verification, suspensions, manual dispatches, dispute resolutions, and payment settlements.
        </p>
      </div>

      <Card className="border-[#E5E5E5]">
        <CardContent className="p-0">
          <div className="divide-y divide-[#E5E5E5] text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-[#F8F8F8]">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#111111]">{log.action}</span>
                    <Badge variant="outline" className="text-[10px]">{log.entityType}</Badge>
                  </div>
                  <p className="text-[#525252]">{log.details}</p>
                  <p className="text-[11px] text-[#737373]">
                    Actor: <span className="font-semibold text-[#111111]">{log.actorName}</span> ({log.actorRole})
                  </p>
                </div>
                <div className="text-[11px] text-[#737373] shrink-0">
                  {formatDate(log.createdAt, "dd MMM yyyy, hh:mm a")}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}