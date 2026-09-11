"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAppState } from "@/lib/store/stateContext";
import { useI18n } from "@/lib/i18n";
import { SERVICES, SERVICE_CATEGORIES, INDIAN_CITIES } from "@/constants";
import { UrgencyLevel, WorkerProfile } from "@/types";
import { rankMatchingWorkers } from "@/lib/matching/deterministicScorer";
import { LocationPicker } from "@/components/maps/LocationPicker";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { WorkerVerificationBadge, UrgencyBadge } from "@/components/shared/StatusBadge";
import { RatingStars } from "@/components/shared/RatingStars";
import { formatCurrency } from "@/lib/utils";
import { initialsFromName } from "@/lib/auth/guest";
import {
  Flame,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Camera,
  Image as ImageIcon,
  X,
  Eye,
  MapPin,
  Building,
  Wrench,
  Award,
  Briefcase,
  Star,
} from "lucide-react";

export function BookingWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { workers, createBooking, currentUser, ratings } = useAppState();
  const { language } = useI18n();

  const initialServiceParam = searchParams.get("service");
  const targetService = initialServiceParam ? SERVICES.find((s) => s.id === initialServiceParam) : null;
  const initialCategory = targetService
    ? targetService.categoryId
    : searchParams.get("category") || "cat_plumbing";
  const initialUrgency = (searchParams.get("urgency") as UrgencyLevel) || "NORMAL";
  const initialWorkerId = searchParams.get("worker") || "";

  const [step, setStep] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(() => {
    if (targetService) return targetService.id;
    return SERVICES.find((s) => s.categoryId === initialCategory)?.id || SERVICES[0].id;
  });
  const [stepError, setStepError] = useState<string | null>(null);
  const [urgency, setUrgency] = useState<UrgencyLevel>(initialUrgency);
  const [scheduledDate, setScheduledDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [scheduledTime, setScheduledTime] = useState<string>("11:00 AM");

  const [selectedCity, setSelectedCity] = useState<string>("Noida / Greater Noida");
  const [customerAddress, setCustomerAddress] = useState<string>(
    currentUser.address || "Sector 62, Noida, Uttar Pradesh"
  );
  const [customerLat, setCustomerLat] = useState<number>(currentUser.lat || 28.628);
  const [customerLng, setCustomerLng] = useState<number>(currentUser.lng || 77.3649);
  const [description, setDescription] = useState<string>("");
  const [customerNotes, setCustomerNotes] = useState<string>("");
  const [problemPhotoUrl, setProblemPhotoUrl] = useState<string | undefined>(undefined);
  const [preferredWorkerId, setPreferredWorkerId] = useState<string>(initialWorkerId);

  // Worker preview modal state
  const [previewWorker, setPreviewWorker] = useState<WorkerProfile | null>(null);

  useEffect(() => {
    if (initialServiceParam) {
      const svc = SERVICES.find((s) => s.id === initialServiceParam);
      if (svc) {
        setSelectedCategory(svc.categoryId);
        setSelectedServiceId(svc.id);
      }
    } else if (initialWorkerId) {
      const foundWorker = workers.find((w) => w.id === initialWorkerId);
      if (foundWorker) {
        setPreferredWorkerId(foundWorker.id);
        const matchedService = foundWorker.skills?.[0]?.serviceId;
        if (matchedService) {
          const s = SERVICES.find((item) => item.id === matchedService);
          if (s) {
            setSelectedCategory(s.categoryId);
            setSelectedServiceId(s.id);
          }
        }
      }
    }
  }, [initialServiceParam, initialWorkerId, workers]);

  const filteredServices = SERVICES.filter((s) => s.categoryId === selectedCategory);
  const selectedService = SERVICES.find((s) => s.id === selectedServiceId) || SERVICES[0];

  const matchingCandidates = rankMatchingWorkers(workers, {
    serviceId: selectedServiceId,
    customerLat,
    customerLng,
    urgency,
  });

  const handleCityChange = (cityName: string) => {
    setSelectedCity(cityName);
    const city = INDIAN_CITIES.find((c) => c.name === cityName);
    if (city) {
      setCustomerLat(city.lat);
      setCustomerLng(city.lng);
      setCustomerAddress(`${city.popularLocalities[0]}, ${city.name}, ${city.state}`);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setProblemPhotoUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleNextStep = () => {
    setStepError(null);
    if (step === 1 && !selectedServiceId) {
      setStepError("Please select a service before proceeding.");
      return;
    }
    if (step === 2 && description.trim().length < 5) {
      setStepError("Please enter a short description of the problem (at least 5 characters).");
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
      problemPhotoUrl,
      preferredWorkerId: preferredWorkerId || undefined,
    });

    router.push(`/customer/bookings/${booking.id}`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Wizard Steps Indicator */}
      <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
        {[
          { num: 1, label: "Select Service" },
          { num: 2, label: "Details & Photo" },
          { num: 3, label: "City & Worker Match" },
          { num: 4, label: "Review & Confirm" },
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step === s.num
                  ? "bg-[#142D52] text-white shadow-md ring-2 ring-[#34D399]"
                  : step > s.num
                  ? "bg-[#047857] text-white shadow-sm"
                  : "bg-[#F9FAF7] text-[#6B7280] border border-[#E5E7EB]"
              }`}
            >
              {step > s.num ? "✓" : s.num}
            </div>
            <span
              className={`text-xs hidden sm:inline-block font-medium ${
                step === s.num ? "text-[#142D52] font-bold" : "text-[#6B7280]"
              }`}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* STEP 1: Select Service */}
      {step === 1 && (
        <Card className="border-[#E5E7EB] shadow-sm animate-in fade-in duration-200">
          <CardHeader>
            <CardTitle className="text-base text-[#142D52]">Step 1: Choose Service Category &amp; Trade</CardTitle>
            <p className="text-xs text-[#6B7280]">
              Select the required service trade. All workers are registered with Labour Cooperatives.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {stepError ? (
              <div role="alert" className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                {stepError}
              </div>
            ) : null}
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
                      ? "bg-[#142D52] text-white border-[#142D52] shadow-sm"
                      : "bg-white text-[#4B5563] border-[#E5E7EB] hover:bg-[#F9FAF7] hover:text-[#047857]"
                  }`}
                >
                  {language === "hi" ? cat.nameHi : cat.name}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2" role="group" aria-label="Available services">
              {filteredServices.map((service) => {
                const isSelected = selectedServiceId === service.id;
                return (
                  <div
                    key={service.id}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected}
                    aria-label={`${service.name}, ${formatCurrency(service.basePrice)}`}
                    onClick={() => setSelectedServiceId(service.id)}
                    onKeyDown={(e) => {
                      if (e.key === " " || e.key === "Enter") {
                        e.preventDefault();
                        setSelectedServiceId(service.id);
                      }
                    }}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#047857] ${
                      isSelected
                        ? "border-[#047857] bg-[#047857]/5 ring-1 ring-[#047857] shadow-sm"
                        : "border-[#E5E7EB] bg-white hover:border-[#047857]/50 hover:bg-[#F9FAF7]"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-xs text-[#142D52]">{service.name}</h4>
                      <span className="font-bold text-xs text-[#047857]">
                        {formatCurrency(service.basePrice)}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6B7280] mt-1 line-clamp-2">{service.description}</p>
                    <div className="flex items-center gap-2 mt-2 text-[10px] text-[#4B5563]">
                      <span>⏱️ ~{service.estimatedDurationMins} mins</span>
                      {service.isEmergencyEligible && (
                        <span className="text-[#DC2626] font-semibold flex items-center gap-0.5">
                          <Flame className="w-3 h-3 fill-[#DC2626]" /> Emergency Eligible
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end border-t border-[#E5E7EB] pt-4">
            <Button onClick={handleNextStep} className="text-xs gap-1 bg-[#047857] hover:bg-[#065F46] text-white">
              Next: Service Details &amp; Photo <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* STEP 2: Details, Urgency & Problem Picture */}
      {step === 2 && (
        <Card className="border-[#E5E7EB] shadow-sm animate-in fade-in duration-200">
          <CardHeader>
            <CardTitle className="text-base text-[#142D52]">Step 2: Service Details &amp; Problem Photo</CardTitle>
            <p className="text-xs text-[#6B7280]">
              Describe the issue, set urgency, and attach a picture so the cooperative worker can prepare tools.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {stepError ? (
              <div role="alert" className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                {stepError}
              </div>
            ) : null}
            <div>
              <label className="text-xs font-semibold text-[#142D52] block mb-2">Urgency Mode</label>
              <div className="grid grid-cols-2 gap-3" role="group" aria-label="Urgency level">
                <div
                  role="button"
                  tabIndex={0}
                  aria-pressed={urgency === "NORMAL"}
                  aria-label="Standard Visit, scheduled time slot"
                  onClick={() => setUrgency("NORMAL")}
                  onKeyDown={(e) => {
                    if (e.key === " " || e.key === "Enter") {
                      e.preventDefault();
                      setUrgency("NORMAL");
                    }
                  }}
                  className={`p-3 rounded-lg border cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#047857] ${
                    urgency === "NORMAL"
                      ? "border-[#047857] bg-[#047857]/5 ring-1 ring-[#047857]"
                      : "border-[#E5E7EB] bg-white hover:bg-[#F9FAF7]"
                  }`}
                >
                  <p className="text-xs font-bold text-[#142D52]">Standard Visit</p>
                  <p className="text-[11px] text-[#6B7280]">Scheduled time slot</p>
                </div>
                <div
                  role="button"
                  tabIndex={0}
                  aria-pressed={urgency === "EMERGENCY"}
                  aria-label="Emergency Dispatch, fastest response"
                  onClick={() => setUrgency("EMERGENCY")}
                  onKeyDown={(e) => {
                    if (e.key === " " || e.key === "Enter") {
                      e.preventDefault();
                      setUrgency("EMERGENCY");
                    }
                  }}
                  className={`p-3 rounded-lg border cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DC2626] ${
                    urgency === "EMERGENCY"
                      ? "border-[#DC2626] bg-[#DC2626]/5 ring-1 ring-[#DC2626]"
                      : "border-[#E5E7EB] bg-white hover:bg-[#F9FAF7]"
                  }`}
                >
                  <div className="flex items-center gap-1 text-[#DC2626] font-bold text-xs">
                    <Flame className="w-3.5 h-3.5 fill-[#DC2626]" />
                    <span>Emergency Dispatch</span>
                  </div>
                  <p className="text-[11px] text-[#6B7280]">Fastest response (+₹100)</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold block mb-1 text-[#142D52]">Date</label>
                <Input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="text-xs border-[#E5E7EB]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1 text-[#142D52]">Time</label>
                <select
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full h-9 rounded-md border border-[#E5E7EB] bg-white px-3 text-xs text-[#1F2937]"
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
              <label className="text-xs font-semibold block mb-1 text-[#142D52]">Describe Problem *</label>
              <Textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Master bathroom tap is broken and leaking water continuously..."
                className="text-xs border-[#E5E7EB]"
              />
            </div>

            {/* Problem Picture Attachment */}
            <div className="p-3.5 rounded-lg border border-[#E5E7EB] bg-[#F9FAF7] space-y-2">
              <label className="text-xs font-bold text-[#142D52] flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-[#047857]" /> Attach Photo of the Problem (Optional)
              </label>
              <p className="text-[11px] text-[#6B7280]">
                Take or upload a picture (e.g. damaged wire, pipe leak, broken handle) to help the technician arrive prepared with the right tools.
              </p>

              {problemPhotoUrl ? (
                <div className="relative inline-block mt-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={problemPhotoUrl}
                    alt="Problem attachment"
                    className="w-36 h-28 object-cover rounded-md border border-[#E5E7EB] shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setProblemPhotoUrl(undefined)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-[#DC2626] text-white rounded-full flex items-center justify-center shadow hover:bg-red-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3 pt-1">
                  <label className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-md border border-[#047857] text-[#047857] hover:bg-[#047857]/10 text-xs font-medium bg-white transition-colors">
                    <ImageIcon className="w-4 h-4" /> Upload Picture
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[10px] text-[#6B7280]">JPG, PNG or WEBP up to 5 MB</span>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1 text-[#142D52]">Landmark / Entry Instructions (Optional)</label>
              <Input
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                placeholder="e.g. 4th floor, Tower B, gate pass code #401"
                className="text-xs border-[#E5E7EB]"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t border-[#E5E7EB] pt-4">
            <Button variant="outline" onClick={() => setStep(1)} className="text-xs gap-1 border-[#E5E7EB] text-[#142D52]">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </Button>
            <Button onClick={handleNextStep} className="text-xs gap-1 bg-[#047857] hover:bg-[#065F46] text-white">
              Next: City &amp; Worker Matching <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* STEP 3: City Dropdown, Location & Worker Matching */}
      {step === 3 && (
        <Card className="border-[#E5E7EB] shadow-sm animate-in fade-in duration-200">
          <CardHeader>
            <CardTitle className="text-base text-[#142D52]">Step 3: Select City, Location &amp; Worker</CardTitle>
            <p className="text-xs text-[#6B7280]">
              PostGIS geo-matching identifies nearby certified cooperative technicians. You can view worker profiles before selecting.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* City Dropdown Menu */}
            <div className="p-3.5 bg-[#F9FAF7] rounded-lg border border-[#E5E7EB] space-y-1.5">
              <label className="text-xs font-bold text-[#142D52] flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#047857]" /> Select Your City / Region
              </label>
              <select
                value={selectedCity}
                onChange={(e) => handleCityChange(e.target.value)}
                className="w-full h-9 rounded-md border border-[#E5E7EB] bg-white px-3 text-xs text-[#1F2937] font-medium"
              >
                {INDIAN_CITIES.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} ({c.state})
                  </option>
                ))}
              </select>
            </div>

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
                <label className="text-xs font-semibold text-[#142D52]">
                  Suitable Cooperative Workers (Ranked by 40% Skill + 30% Proximity + 20% Availability + 10% Workload)
                </label>
                <Badge variant="outline" className="text-[10px] border-[#047857] text-[#047857]">
                  {matchingCandidates.length} Available
                </Badge>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1" role="group" aria-label="Available cooperative workers">
                {matchingCandidates.map((c, index) => {
                  const w = c.worker;
                  const isSelected = preferredWorkerId === w.id || (!preferredWorkerId && index === 0);
                  return (
                    <div
                      key={w.id}
                      role="button"
                      tabIndex={0}
                      aria-pressed={isSelected}
                      aria-label={`${w.profile.fullName}, ${w.cooperativeName}`}
                      onClick={() => setPreferredWorkerId(w.id)}
                      onKeyDown={(e) => {
                        if (e.key === " " || e.key === "Enter") {
                          e.preventDefault();
                          setPreferredWorkerId(w.id);
                        }
                      }}
                      className={`p-3.5 rounded-lg border cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#047857] ${
                        isSelected
                          ? "border-[#047857] bg-[#047857]/5 ring-2 ring-[#047857] shadow-sm"
                          : "border-[#E5E7EB] bg-white hover:border-[#047857]/40 hover:bg-[#F9FAF7]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10 border border-[#142D52]">
                            <AvatarImage src={w.profile.avatarUrl} alt={w.profile.fullName} />
                            <AvatarFallback className="bg-[#142D52] text-[#34D399] text-xs font-bold">
                              {initialsFromName(w.profile.fullName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-bold text-[#142D52]">{w.profile.fullName}</h4>
                              <WorkerVerificationBadge status={w.verificationStatus} />
                              {index === 0 && (
                                <span className="text-[9px] bg-[#047857] text-white px-1.5 py-0.5 rounded font-bold">
                                  Top Match ({c.score}%)
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-[#6B7280] mt-0.5">{w.cooperativeName}</p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          <RatingStars rating={w.ratingAvg || 5} size="sm" showNumber />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewWorker(w);
                            }}
                            className="text-[10px] text-[#047857] hover:underline font-semibold flex items-center gap-1 mt-1 bg-white border border-[#E5E7EB] px-2 py-0.5 rounded"
                          >
                            <Eye className="w-3 h-3" /> View Profile
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mt-2.5 text-[11px] text-[#4B5563] border-t border-[#E5E7EB]/60 pt-2">
                        <span>📍 {c.breakdown.distanceKm} km away</span>
                        <span>⏱️ {w.experienceYears} yrs experience</span>
                        <span>✅ {w.completedServicesCount} jobs delivered</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t border-[#E5E7EB] pt-4">
            <Button variant="outline" onClick={() => setStep(2)} className="text-xs gap-1 border-[#E5E7EB] text-[#142D52]">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </Button>
            <Button onClick={handleNextStep} className="text-xs gap-1 bg-[#047857] hover:bg-[#065F46] text-white">
              Next: Review &amp; Confirm <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* STEP 4: Review & Confirm */}
      {step === 4 && (
        <Card className="border-[#E5E7EB] shadow-sm animate-in fade-in duration-200">
          <CardHeader>
            <CardTitle className="text-base text-[#142D52]">Step 4: Review &amp; Confirm Booking</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="p-4 bg-[#F9FAF7] rounded-lg border border-[#E5E7EB] space-y-2.5">
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Selected Service</span>
                <span className="font-bold text-[#142D52]">{selectedService.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Urgency Mode</span>
                <UrgencyBadge urgency={urgency} />
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Scheduled For</span>
                <span className="font-semibold text-[#142D52]">{scheduledDate} at {scheduledTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Service Location</span>
                <span className="font-semibold text-[#142D52] truncate max-w-[240px]">{customerAddress}</span>
              </div>
              {preferredWorkerId && (
                <div className="flex justify-between border-t border-[#E5E7EB] pt-2">
                  <span className="text-[#6B7280]">Assigned Cooperative Worker</span>
                  <span className="font-bold text-[#047857]">
                    {workers.find((w) => w.id === preferredWorkerId)?.profile.fullName || "Best Match Assigned"}
                  </span>
                </div>
              )}
            </div>

            {problemPhotoUrl && (
              <div className="p-3 bg-white rounded-lg border border-[#E5E7EB] flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={problemPhotoUrl}
                  alt="Problem photo"
                  className="w-14 h-14 object-cover rounded border border-[#E5E7EB]"
                />
                <div>
                  <p className="font-bold text-[#142D52]">Problem Photo Attached</p>
                  <p className="text-[11px] text-[#6B7280]">Technician will review photo before arriving.</p>
                </div>
              </div>
            )}

            <div className="p-4 bg-white rounded-lg border border-[#E5E7EB] space-y-2">
              <div className="flex justify-between text-[#4B5563]">
                <span>Base Service Charge</span>
                <span>{formatCurrency(selectedService.basePrice)}</span>
              </div>
              {urgency === "EMERGENCY" && (
                <div className="flex justify-between text-[#DC2626]">
                  <span>Emergency Priority Dispatch Fee</span>
                  <span>+₹100</span>
                </div>
              )}
              <div className="flex justify-between text-[11px] text-[#6B7280]">
                <span>Cooperative Welfare &amp; Ops Contribution</span>
                <span>12% (Included in government trade rate)</span>
              </div>
              <div className="border-t border-[#E5E7EB] pt-2 flex justify-between text-sm font-bold text-[#142D52]">
                <span>Estimated Total (No Advance)</span>
                <span>
                  {formatCurrency(
                    urgency === "EMERGENCY" ? selectedService.basePrice + 100 : selectedService.basePrice
                  )}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-[#047857]/10 text-[#047857] rounded-md text-[11px] font-medium border border-[#047857]/20">
              <ShieldCheck className="w-4 h-4 shrink-0 text-[#047857]" />
              <span>100% Cooperative Guarantee: Zero advance payment. Pay securely after inspecting completed work.</span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t border-[#E5E7EB] pt-4">
            <Button variant="outline" onClick={() => setStep(3)} className="text-xs gap-1 border-[#E5E7EB] text-[#142D52]">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </Button>
            <Button onClick={handleCreateBooking} className="text-xs gap-1 bg-[#047857] hover:bg-[#065F46] text-white shadow-md">
              Confirm &amp; Request Service <CheckCircle2 className="w-3.5 h-3.5" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Worker Profile Quick Preview Modal */}
      {previewWorker && (
        <Dialog open={Boolean(previewWorker)} onOpenChange={() => setPreviewWorker(null)}>
          <DialogContent className="max-w-md bg-white border border-[#E5E7EB] p-6 space-y-4">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-[#142D52]">Worker Profile Preview</DialogTitle>
            </DialogHeader>

            <div className="flex items-center gap-4 p-3.5 bg-[#F9FAF7] rounded-lg border border-[#E5E7EB]">
              <Avatar className="w-14 h-14 border border-[#142D52]">
                <AvatarImage src={previewWorker.profile.avatarUrl} alt={previewWorker.profile.fullName} />
                <AvatarFallback className="bg-[#142D52] text-[#34D399] font-bold">
                  {initialsFromName(previewWorker.profile.fullName)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-0.5">
                <h3 className="font-bold text-sm text-[#142D52]">{previewWorker.profile.fullName}</h3>
                <p className="text-[11px] text-[#6B7280]">{previewWorker.cooperativeName}</p>
                <div className="flex items-center gap-1.5 pt-1">
                  <WorkerVerificationBadge status={previewWorker.verificationStatus} />
                  <RatingStars rating={previewWorker.ratingAvg || 5} size="sm" showNumber />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-white border border-[#E5E7EB] rounded">
                <span className="text-[10px] uppercase text-[#6B7280]">Experience</span>
                <p className="font-bold text-[#142D52]">{previewWorker.experienceYears} Years</p>
              </div>
              <div className="p-2.5 bg-white border border-[#E5E7EB] rounded">
                <span className="text-[10px] uppercase text-[#6B7280]">Completed Services</span>
                <p className="font-bold text-[#142D52]">{previewWorker.completedServicesCount} Orders</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs font-bold text-[#142D52]">Certified Trade Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {previewWorker.skills?.map((s) => (
                  <Badge key={s.id || s.skillId} variant="secondary" className="text-[10px]">
                    ✓ {s.skillName}
                  </Badge>
                ))}
              </div>
            </div>

            {previewWorker.bio && (
              <div className="space-y-1 text-xs">
                <p className="font-bold text-[#142D52]">About Technician</p>
                <p className="text-[#4B5563] leading-relaxed text-[11px]">{previewWorker.bio}</p>
              </div>
            )}

            <DialogFooter className="flex gap-2 sm:justify-between pt-2 border-t border-[#E5E7EB]">
              <Link href={`/workers/${previewWorker.id}`} target="_blank" className="text-xs text-[#047857] hover:underline font-semibold flex items-center">
                Open Full Profile Page ↗
              </Link>
              <Button
                onClick={() => {
                  setPreferredWorkerId(previewWorker.id);
                  setPreviewWorker(null);
                }}
                className="bg-[#047857] hover:bg-[#065F46] text-white text-xs"
              >
                Select This Worker
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}