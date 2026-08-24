"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppState } from "@/lib/store/stateContext";
import { useI18n } from "@/lib/i18n";
import { SERVICES, SERVICE_CATEGORIES } from "@/constants";
import { UrgencyLevel } from "@/types";
import { rankMatchingWorkers } from "@/lib/matching/deterministicScorer";
import { LocationPicker } from "@/components/maps/LocationPicker";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { WorkerVerificationBadge, UrgencyBadge } from "@/components/shared/StatusBadge";
import { RatingStars } from "@/components/shared/RatingStars";
import { formatCurrency } from "@/lib/utils";
import { Flame, CheckCircle2, ShieldCheck, ArrowRight, ArrowLeft } from "lucide-react";

export function BookingWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { workers, createBooking, currentUser } = useAppState();
  const { language } = useI18n();

  const initialCategory = searchParams.get("category") || "cat_plumbing";
  const initialUrgency = (searchParams.get("urgency") as UrgencyLevel) || "NORMAL";

  const [step, setStep] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    SERVICES.find((s) => s.categoryId === initialCategory)?.id || SERVICES[0].id
  );
  const [urgency, setUrgency] = useState<UrgencyLevel>(initialUrgency);
  const [scheduledDate, setScheduledDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [scheduledTime, setScheduledTime] = useState<string>("11:00 AM");
  const [customerAddress, setCustomerAddress] = useState<string>(
    currentUser.address || "Sector 62, Noida, Uttar Pradesh"
  );
  const [customerLat, setCustomerLat] = useState<number>(currentUser.lat || 28.628);
  const [customerLng, setCustomerLng] = useState<number>(currentUser.lng || 77.3649);
  const [description, setDescription] = useState<string>("");
  const [customerNotes, setCustomerNotes] = useState<string>("");
  const [preferredWorkerId, setPreferredWorkerId] = useState<string>("");

  const filteredServices = SERVICES.filter((s) => s.categoryId === selectedCategory);
  const selectedService = SERVICES.find((s) => s.id === selectedServiceId) || SERVICES[0];

  const matchingCandidates = rankMatchingWorkers(workers, {
    serviceId: selectedServiceId,
    customerLat,
    customerLng,
    urgency,
  });

  const handleNextStep = () => {
    if (step === 1 && !selectedServiceId) {
      alert("Please select a service.");
      return;
    }
    if (step === 2 && description.trim().length < 5) {
      alert("Please enter a short description of the problem.");
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handleCreateBooking = () => {
    const booking = createBooking({
      serviceId: selectedServiceId,
      urgency,
      scheduledDate,
      scheduledTime,
      customerAddress,
      customerLat,
      customerLng,
      description: description || `Requested ${selectedService.name}`,
      customerNotes,
      preferredWorkerId: preferredWorkerId || undefined,
    });

    router.push(`/customer/bookings/${booking.id}`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-4">
        {[
          { num: 1, label: "Select Service" },
          { num: 2, label: "Details & Time" },
          { num: 3, label: "Location & Match" },
          { num: 4, label: "Review & Confirm" },
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step === s.num
                  ? "bg-[#111111] text-white"
                  : step > s.num
                  ? "bg-[#16A34A] text-white"
                  : "bg-[#F3F3F3] text-[#737373]"
              }`}
            >
              {step > s.num ? "✓" : s.num}
            </div>
            <span
              className={`text-xs hidden sm:inline-block font-medium ${
                step === s.num ? "text-[#111111] font-bold" : "text-[#737373]"
              }`}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {step === 1 && (
        <Card className="border-[#E5E5E5]">
          <CardHeader>
            <CardTitle className="text-base">Step 1: Choose Service Category & Trade</CardTitle>
            <p className="text-xs text-[#737373]">
              Select the required service trade. All workers are registered with Labour Cooperatives.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {SERVICE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    const firstServ = SERVICES.find((s) => s.categoryId === cat.id);
                    if (firstServ) setSelectedServiceId(firstServ.id);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    selectedCategory === cat.id
                      ? "bg-[#111111] text-white border-[#111111]"
                      : "bg-white text-[#525252] border-[#E5E5E5] hover:bg-[#F8F8F8]"
                  }`}
                >
                  {language === "hi" ? cat.nameHi : cat.name}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {filteredServices.map((srv) => {
                const isSelected = selectedServiceId === srv.id;
                return (
                  <div
                    key={srv.id}
                    onClick={() => setSelectedServiceId(srv.id)}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? "border-[#111111] bg-[#F8F8F8] shadow-sm ring-1 ring-[#111111]"
                        : "border-[#E5E5E5] bg-white hover:border-[#D4D4D4]"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="text-xs font-bold text-[#111111]">
                        {language === "hi" ? srv.nameHi : srv.name}
                      </h4>
                      {srv.isEmergencyEligible && (
                        <span className="text-[10px] bg-[#DC2626]/10 text-[#DC2626] font-semibold px-1.5 py-0.5 rounded">
                          Urgent Available
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#737373] mt-1 line-clamp-2">
                      {language === "hi" ? srv.descriptionHi : srv.description}
                    </p>
                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#E5E5E5] text-xs">
                      <span className="text-[#525252]">Est. {srv.estimatedDurationMins} mins</span>
                      <span className="font-bold text-[#111111]">{formatCurrency(srv.basePrice)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end border-t border-[#E5E5E5] pt-4">
            <Button onClick={handleNextStep} className="text-xs gap-1">
              Next: Schedule & Urgency <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === 2 && (
        <Card className="border-[#E5E5E5]">
          <CardHeader>
            <CardTitle className="text-base">Step 2: Urgency & Timing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#111111] block mb-2">Urgency Mode</label>
              <div className="grid grid-cols-2 gap-3">
                <div
                  onClick={() => setUrgency("NORMAL")}
                  className={`p-3 rounded-lg border cursor-pointer ${
                    urgency === "NORMAL"
                      ? "border-[#111111] bg-[#F8F8F8] ring-1 ring-[#111111]"
                      : "border-[#E5E5E5] bg-white hover:bg-[#F8F8F8]"
                  }`}
                >
                  <p className="text-xs font-bold text-[#111111]">Standard Visit</p>
                  <p className="text-[11px] text-[#737373]">Scheduled time slot</p>
                </div>
                <div
                  onClick={() => setUrgency("EMERGENCY")}
                  className={`p-3 rounded-lg border cursor-pointer ${
                    urgency === "EMERGENCY"
                      ? "border-[#DC2626] bg-[#DC2626]/5 ring-1 ring-[#DC2626]"
                      : "border-[#E5E5E5] bg-white hover:bg-[#F8F8F8]"
                  }`}
                >
                  <div className="flex items-center gap-1 text-[#DC2626] font-bold text-xs">
                    <Flame className="w-3.5 h-3.5 fill-[#DC2626]" />
                    <span>Emergency Dispatch</span>
                  </div>
                  <p className="text-[11px] text-[#737373]">Fastest response (+₹100)</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold block mb-1">Date</label>
                <Input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">Time</label>
                <select
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full h-9 rounded-md border border-[#E5E5E5] bg-white px-3 text-xs"
                >
                  <option value="Immediate (ASAP)">Immediate (ASAP)</option>
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="04:30 PM">04:30 PM</option>
                  <option value="06:30 PM">06:30 PM</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1">Describe Problem *</label>
              <Textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Master bathroom tap is broken and leaking water continuously..."
                className="text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1">Landmark / Notes (Optional)</label>
              <Input
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                placeholder="e.g. 4th floor, elevator accessible"
                className="text-xs"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t border-[#E5E5E5] pt-4">
            <Button variant="outline" onClick={() => setStep(1)} className="text-xs gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </Button>
            <Button onClick={handleNextStep} className="text-xs gap-1">
              Next: Location & Worker <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === 3 && (
        <Card className="border-[#E5E5E5]">
          <CardHeader>
            <CardTitle className="text-base">Step 3: Location & Worker Matching</CardTitle>
            <p className="text-xs text-[#737373]">
              PostGIS geo-matching identifies nearby certified cooperative workers.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <LocationPicker
              initialLat={customerLat}
              initialLng={customerLng}
              initialAddress={customerAddress}
              onLocationChange={(lat, lng, addr) => {
                setCustomerLat(lat);
                setCustomerLng(lng);
                setCustomerAddress(addr);
              }}
            />

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-[#111111]">
                  Suitable Cooperative Workers (Ranked by 40% Skill + 30% Proximity + 20% Availability + 10% Workload)
                </label>
                <Badge variant="outline" className="text-[10px]">
                  {matchingCandidates.length} Found
                </Badge>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {matchingCandidates.map((c, index) => {
                  const w = c.worker;
                  const isSelected = preferredWorkerId === w.id || (!preferredWorkerId && index === 0);
                  return (
                    <div
                      key={w.id}
                      onClick={() => setPreferredWorkerId(w.id)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? "border-[#111111] bg-[#F8F8F8] ring-1 ring-[#111111]"
                          : "border-[#E5E5E5] bg-white hover:bg-[#F8F8F8]"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-[#111111]">{w.profile.fullName}</h4>
                            <WorkerVerificationBadge status={w.verificationStatus} />
                            {index === 0 && (
                              <span className="text-[10px] bg-[#111111] text-white px-1.5 py-0.5 rounded">
                                Best Match ({c.score}%)
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#737373] mt-0.5">{w.cooperativeName}</p>
                        </div>
                        <RatingStars rating={w.ratingAvg || 5} size="sm" showNumber />
                      </div>

                      <div className="flex items-center gap-4 mt-2 text-[11px] text-[#525252]">
                        <span>📍 {c.breakdown.distanceKm} km away</span>
                        <span>⏱️ {w.experienceYears} yrs exp</span>
                        <span>✅ {w.completedServicesCount} jobs done</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t border-[#E5E5E5] pt-4">
            <Button variant="outline" onClick={() => setStep(2)} className="text-xs gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </Button>
            <Button onClick={handleNextStep} className="text-xs gap-1">
              Next: Review & Confirm <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === 4 && (
        <Card className="border-[#E5E5E5]">
          <CardHeader>
            <CardTitle className="text-base">Step 4: Review & Confirm Booking</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="p-3.5 bg-[#F8F8F8] rounded-lg border border-[#E5E5E5] space-y-2">
              <div className="flex justify-between">
                <span className="text-[#737373]">Selected Service</span>
                <span className="font-bold text-[#111111]">{selectedService.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#737373]">Urgency Mode</span>
                <UrgencyBadge urgency={urgency} />
              </div>
              <div className="flex justify-between">
                <span className="text-[#737373]">Scheduled For</span>
                <span className="font-semibold text-[#111111]">{scheduledDate} at {scheduledTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#737373]">Service Location</span>
                <span className="font-semibold text-[#111111] truncate max-w-[200px]">{customerAddress}</span>
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-lg border border-[#E5E5E5] space-y-1.5">
              <div className="flex justify-between text-[#525252]">
                <span>Base Service Charge</span>
                <span>{formatCurrency(selectedService.basePrice)}</span>
              </div>
              {urgency === "EMERGENCY" && (
                <div className="flex justify-between text-[#DC2626]">
                  <span>Emergency Priority Dispatch Fee</span>
                  <span>+₹100</span>
                </div>
              )}
              <div className="flex justify-between text-[11px] text-[#737373]">
                <span>Cooperative Welfare & Ops Contribution</span>
                <span>12% (Included)</span>
              </div>
              <div className="border-t border-[#E5E5E5] pt-2 flex justify-between text-sm font-bold text-[#111111]">
                <span>Estimated Total</span>
                <span>
                  {formatCurrency(
                    urgency === "EMERGENCY" ? selectedService.basePrice + 100 : selectedService.basePrice
                  )}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 bg-[#16A34A]/10 text-[#16A34A] rounded-md text-[11px] font-medium border border-[#16A34A]/20">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>100% Cooperative Guarantee: Zero advance payment required. Rate & pay worker upon completion.</span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t border-[#E5E5E5] pt-4">
            <Button variant="outline" onClick={() => setStep(3)} className="text-xs gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </Button>
            <Button onClick={handleCreateBooking} className="text-xs gap-1 bg-[#111111] text-white">
              Confirm & Request Service <CheckCircle2 className="w-3.5 h-3.5" />
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}