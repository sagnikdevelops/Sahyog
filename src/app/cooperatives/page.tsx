import React from "react";
import { COOPERATIVE_SOCIETIES, FEDERATION } from "@/constants";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Landmark, MapPin, Phone, Mail, CheckCircle2 } from "lucide-react";

export default function CooperativesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="border-b border-[#E5E5E5] pb-6 space-y-2">
        <Badge variant="default" className="text-xs">Cooperative Governance</Badge>
        <h1 className="text-3xl font-bold text-[#111111]">Labour Cooperative Federations & Societies</h1>
        <p className="text-xs sm:text-sm text-[#525252] max-w-2xl">
          Directory of federations and affiliated primary labour cooperative societies mobilizing skilled technicians under Sahyog.
        </p>
      </div>

      {/* Apex Federation */}
      <Card className="border border-[#111111] bg-[#F8F8F8] p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-[#111111] text-white flex items-center justify-center shrink-0">
            <Landmark className="w-6 h-6" />
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-[#111111] text-white px-2 py-0.5 rounded font-bold uppercase">
                Apex Federation
              </span>
              <span className="text-xs text-[#737373]">Reg No: {FEDERATION.registrationNo}</span>
            </div>
            <h2 className="text-lg font-bold text-[#111111]">{FEDERATION.name}</h2>
            <p className="text-xs text-[#525252]">Jurisdiction: {FEDERATION.state}</p>
            <div className="flex flex-wrap gap-4 text-xs text-[#737373] pt-2">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-[#111111]" /> {FEDERATION.contactEmail}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-[#111111]" /> {FEDERATION.phone}
              </span>
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-[#16A34A]" /> {FEDERATION.societiesCount} Member Societies
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Member Societies */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-[#111111]">Affiliated Primary Labour Cooperative Societies</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {COOPERATIVE_SOCIETIES.map((coop) => (
            <Card key={coop.id} className="border-[#E5E5E5] bg-white p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#111111]" />
                  <span className="text-xs font-semibold text-[#16A34A] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Active Society
                  </span>
                </div>
                <span className="text-[10px] text-[#737373] bg-[#F8F8F8] px-2 py-0.5 rounded border border-[#E5E5E5]">
                  {coop.district}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-sm text-[#111111]">{coop.name}</h4>
                <p className="text-[11px] text-[#737373] mt-0.5">Reg: {coop.registrationNo}</p>
              </div>

              <div className="text-xs text-[#525252] space-y-1 pt-2 border-t border-[#E5E5E5]">
                <p className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#111111]" /> {coop.address}
                </p>
                <p className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#111111]" /> Contact: {coop.contactPerson} ({coop.phone})
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}