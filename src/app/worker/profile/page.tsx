"use client";

import React, { useMemo, useState } from "react";
import { useAppState } from "@/lib/store/stateContext";
import { normalizeWorkerRecord } from "@/lib/auth/authHelpers";
import { createCertificateSignedUrl } from "@/lib/supabase/profileApi";
import { AvatarUploader } from "@/components/profile/AvatarUploader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { WorkerVerificationBadge } from "@/components/shared/StatusBadge";
import { RatingStars } from "@/components/shared/RatingStars";
import { Award, FileUp, Pencil, Plus, Trash2, Wrench, CheckCircle2 } from "lucide-react";
import { STANDARD_TRADE_SKILLS } from "@/constants";
import type { Certification } from "@/types";

type CertificationDraft = {
  id?: string;
  title: string;
  issuingBody: string;
  certificationNumber: string;
  issueDate: string;
  expiryDate: string;
  notes: string;
};

const emptyCertification = (): CertificationDraft => ({
  title: "",
  issuingBody: "",
  certificationNumber: "",
  issueDate: "",
  expiryDate: "",
  notes: "",
});

export default function WorkerProfilePage() {
  const state = useAppState();
  const worker = useMemo(
    () =>
      state.workers.find((item) => item.id === state.currentUser.id) ??
      normalizeWorkerRecord({ id: state.currentUser.id, profile: { ...state.currentUser, role: "WORKER" } }),
    [state.currentUser, state.workers]
  );
  const [bio, setBio] = useState(worker.bio);
  const [bioEditing, setBioEditing] = useState(false);
  const [skillName, setSkillName] = useState("");
  const [selectedDropdownSkill, setSelectedDropdownSkill] = useState(STANDARD_TRADE_SKILLS[0].name);
  const [certOpen, setCertOpen] = useState(false);
  const [certDraft, setCertDraft] = useState<CertificationDraft>(emptyCertification());
  const [certFile, setCertFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const saveBio = async () => {
    setSaving(true);
    const result = await state.updateOwnWorkerBio(bio);
    setSaving(false);
    setMessage(result.error ?? "Bio saved successfully.");
    if (!result.error) setBioEditing(false);
  };

  const addSkillDirect = async (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const key = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const result = await state.addOwnSkill({
      skillId: key,
      skillName: trimmed,
      serviceId: key,
      serviceName: "Trade",
      isVerified: true,
    });
    setMessage(result.error ?? `Added "${trimmed}" to certified trade skills.`);
    if (!result.error) setSkillName("");
  };

  const addSkill = async () => {
    await addSkillDirect(skillName || selectedDropdownSkill);
  };

  const openCertification = (cert?: Certification) => {
    setCertFile(null);
    setCertDraft(
      cert
        ? {
            id: cert.id,
            title: cert.title,
            issuingBody: cert.issuingBody,
            certificationNumber: cert.certificationNumber ?? "",
            issueDate: cert.issueDate?.slice(0, 10) ?? "",
            expiryDate: cert.expiryDate?.slice(0, 10) ?? "",
            notes: cert.notes ?? "",
          }
        : emptyCertification()
    );
    setCertOpen(true);
  };

  const saveCertification = async () => {
    if (!certDraft.title.trim() || !certDraft.issuingBody.trim()) {
      setMessage("Certification name and issuing organization are required.");
      return;
    }
    setSaving(true);
    const result = await state.saveOwnCertification({
      ...certDraft,
      issueDate: certDraft.issueDate || new Date().toISOString().slice(0, 10),
      expiryDate: certDraft.expiryDate || undefined,
      certificationNumber: certDraft.certificationNumber || undefined,
      notes: certDraft.notes || undefined,
    });
    if (!result.error && result.certification && certFile) {
      const upload = await state.uploadOwnCertificateFile(result.certification.id, certFile);
      if (upload.error) {
        setSaving(false);
        setMessage(upload.error);
        return;
      }
    }
    setSaving(false);
    setMessage(result.error ?? "Certification saved and submitted for review.");
    if (!result.error) setCertOpen(false);
  };

  const viewCertificate = async (path?: string) => {
    if (!path) return;
    const result = await createCertificateSignedUrl(path);
    if (result.url) window.open(result.url, "_blank", "noopener,noreferrer");
    else setMessage(result.error ?? "Certificate is unavailable.");
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAF7] p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-[#142D52]">
              <AvatarImage src={worker.profile.avatarUrl} alt={worker.profile.fullName} />
              <AvatarFallback className="bg-[#142D52] text-[#34D399] font-bold">
                {worker.profile.fullName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold text-[#142D52]">{worker.profile.fullName}</h1>
                <WorkerVerificationBadge status={worker.verificationStatus} />
              </div>
              <p className="text-xs text-[#6B7280]">Worker ID: {worker.id}</p>
              <p className="text-xs text-[#6B7280]">{worker.cooperativeName}</p>
            </div>
          </div>
          <AvatarUploader
            name={worker.profile.fullName}
            url={worker.profile.avatarUrl}
            onUpload={state.uploadOwnAvatar}
            onRemove={state.removeOwnAvatar}
          />
        </div>
      </div>

      {state.isDemoMode ? (
        <div className="rounded-lg border border-[#34D399]/40 bg-[#34D399]/10 p-3 text-xs text-[#142D52]">
          ✨ <strong>Interactive Demo Worker Profile:</strong> You can edit bio, select trade skills from the dropdown, upload your avatar, and manage trade certifications.
        </div>
      ) : null}

      {message ? (
        <p className="rounded-md bg-[#F9FAF7] border border-[#E5E7EB] px-3 py-2 text-xs text-[#047857] font-medium flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-[#047857]" /> {message}
        </p>
      ) : null}

      <Tabs defaultValue="overview">
        <TabsList className="grid h-auto w-full grid-cols-2 gap-1 sm:grid-cols-6 bg-[#F9FAF7] border border-[#E5E7EB]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bio">Bio</TabsTrigger>
          <TabsTrigger value="skills">Trade skills</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label="Availability" value={worker.isAvailable ? "Available" : "Offline"} />
            <Metric label="Rating" value={`${worker.ratingAvg.toFixed(1)} / 5`} />
            <Metric label="Experience" value={`${worker.experienceYears} years`} />
            <Metric label="Completed jobs" value={String(worker.completedServicesCount)} />
          </div>
          <Card className="mt-4 border-[#E5E7EB]">
            <CardHeader>
              <CardTitle className="text-base text-[#142D52]">Professional summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-[#4B5563]">
              <p>{worker.bio || "Add a short bio so customers can understand your experience and service approach."}</p>
              <div className="flex flex-wrap gap-2">
                {worker.skills.map((skill) => (
                  <Badge key={skill.id} variant="secondary">
                    {skill.skillName}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bio">
          <Card className="border-[#E5E7EB]">
            <CardHeader>
              <CardTitle className="text-base text-[#142D52]">About your professional work</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                value={bio}
                disabled={!bioEditing}
                onChange={(event) => setBio(event.target.value)}
                className="min-h-36 border-[#E5E7EB]"
                placeholder="Describe your experience, specialties, and service approach."
              />
              <div className="flex justify-end gap-2">
                {bioEditing ? (
                  <>
                    <Button
                      variant="outline"
                      className="border-[#E5E7EB] text-[#142D52]"
                      onClick={() => {
                        setBio(worker.bio);
                        setBioEditing(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      disabled={saving}
                      className="bg-[#047857] hover:bg-[#065F46] text-white"
                      onClick={() => void saveBio()}
                    >
                      {saving ? "Saving…" : "Save bio"}
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => setBioEditing(true)}
                    className="border-[#E5E7EB] bg-white text-[#142D52] hover:bg-[#F9FAF7] border"
                  >
                    <Pencil className="mr-1 h-4 w-4" /> Edit bio
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills">
          <Card className="border-[#E5E7EB]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base text-[#142D52]">
                <Wrench className="h-4 w-4 text-[#047857]" /> Certified Trade Skills &amp; Services
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-[#F9FAF7] rounded-lg border border-[#E5E7EB] space-y-3">
                <p className="text-xs font-bold text-[#142D52]">Select a Standard Cooperative Trade Skill:</p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    value={selectedDropdownSkill}
                    onChange={(e) => setSelectedDropdownSkill(e.target.value)}
                    className="flex-1 h-9 rounded-md border border-[#E5E7EB] bg-white px-3 text-xs text-[#1F2937]"
                  >
                    {STANDARD_TRADE_SKILLS.map((trade) => (
                      <option key={trade.id} value={trade.name}>
                        {trade.name} ({trade.category})
                      </option>
                    ))}
                  </select>
                  <Button
                    onClick={() => void addSkillDirect(selectedDropdownSkill)}
                    className="bg-[#047857] hover:bg-[#065F46] text-white text-xs gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add from Dropdown
                  </Button>
                </div>

                <div className="pt-2 border-t border-[#E5E7EB]">
                  <p className="text-xs text-[#6B7280] mb-1.5">Or enter a custom specialized trade skill:</p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      value={skillName}
                      onChange={(event) => setSkillName(event.target.value)}
                      placeholder="e.g. Inverter Repair, Solar Panel Fitting, Polish..."
                      className="border-[#E5E7EB] text-xs"
                    />
                    <Button
                      onClick={() => void addSkillDirect(skillName)}
                      disabled={!skillName.trim()}
                      variant="outline"
                      className="border-[#047857] text-[#047857] hover:bg-[#047857]/10 text-xs gap-1"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add Custom Skill
                    </Button>
                  </div>
                </div>
              </div>

              {worker.skills.length ? (
                <div className="grid gap-2 sm:grid-cols-2">
                  {worker.skills.map((skill) => (
                    <div key={skill.id} className="flex items-center justify-between rounded-lg border border-[#E5E7EB] p-3 bg-[#F9FAF7]">
                      <div>
                        <p className="text-sm font-semibold text-[#142D52]">{skill.skillName}</p>
                        <p className="text-xs text-[#047857] font-medium">
                          ✓ Verified Cooperative Trade
                        </p>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label={`Remove ${skill.skillName}`}
                        onClick={() => void state.removeOwnSkill(skill.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-700" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <Empty text="No trade skills yet. Select from the dropdown to add your certified services." />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certifications">
          <Card className="border-[#E5E7EB]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base text-[#142D52]">
                <Award className="h-4 w-4 text-[#047857]" /> Professional certifications
              </CardTitle>
              <Button
                size="sm"
                className="bg-[#047857] hover:bg-[#065F46] text-white"
                onClick={() => openCertification()}
              >
                <Plus className="mr-1 h-4 w-4" /> Add certification
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {worker.certifications.length ? (
                worker.certifications.map((cert) => (
                  <div key={cert.id} className="rounded-lg border border-[#E5E7EB] p-4 bg-[#F9FAF7]">
                    <div className="flex flex-col justify-between gap-3 sm:flex-row">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-[#142D52]">{cert.title}</p>
                          <Badge
                            variant={
                              cert.certificationStatus === "APPROVED"
                                ? "success"
                                : cert.certificationStatus === "REJECTED"
                                ? "destructive"
                                : "warning"
                            }
                          >
                            {cert.certificationStatus}
                          </Badge>
                        </div>
                        <p className="text-xs text-[#6B7280]">
                          {cert.issuingBody} · Issued {cert.issueDate}
                        </p>
                        {cert.certificationNumber ? (
                          <p className="text-xs text-[#6B7280]">ID: {cert.certificationNumber}</p>
                        ) : null}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-[#E5E7EB] text-[#142D52]"
                          onClick={() => openCertification(cert)}
                        >
                          <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
                        </Button>
                        {cert.documentUrl ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-[#E5E7EB] text-[#142D52]"
                            onClick={() => void viewCertificate(cert.documentUrl)}
                          >
                            View
                          </Button>
                        ) : null}
                        <Button
                          size="icon"
                          variant="ghost"
                          disabled={cert.certificationStatus === "APPROVED"}
                          onClick={() => void state.removeOwnCertification(cert.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-700" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <Empty text="No certifications yet. Add your first professional certification." />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="badges">
          <Card className="border-[#E5E7EB]">
            <CardHeader>
              <CardTitle className="text-base text-[#142D52]">Badges</CardTitle>
            </CardHeader>
            <CardContent>
              {worker.badges?.length ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {worker.badges.map((badge) => (
                    <div key={badge.id} className="rounded-lg border border-[#E5E7EB] bg-[#F9FAF7] p-4">
                      <p className="font-semibold text-[#142D52]">{badge.label}</p>
                      <p className="text-xs text-[#6B7280]">{badge.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <Empty text="No badges awarded yet. Verification and performance badges are issued by your cooperative or administrators." />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card className="border-[#E5E7EB]">
            <CardHeader>
              <CardTitle className="text-base text-[#142D52]">Account and profile</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm sm:grid-cols-2">
              <Detail label="Email" value={worker.profile.email} />
              <Detail label="Phone" value={worker.profile.phone || "Not provided"} />
              <Detail
                label="Location"
                value={[worker.profile.city, worker.profile.address].filter(Boolean).join(", ") || "Not provided"}
              />
              <Detail label="Cooperative" value={worker.cooperativeName} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={certOpen} onOpenChange={setCertOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto bg-white border border-[#E5E7EB]">
          <DialogHeader>
            <DialogTitle className="text-[#142D52]">{certDraft.id ? "Edit certification" : "Add certification"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <FormField
              label="Certification name"
              value={certDraft.title}
              onChange={(value) => setCertDraft((draft) => ({ ...draft, title: value }))}
            />
            <FormField
              label="Issuing organization"
              value={certDraft.issuingBody}
              onChange={(value) => setCertDraft((draft) => ({ ...draft, issuingBody: value }))}
            />
            <FormField
              label="Certification ID"
              value={certDraft.certificationNumber}
              onChange={(value) => setCertDraft((draft) => ({ ...draft, certificationNumber: value }))}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <FormField
                label="Issue date"
                type="date"
                value={certDraft.issueDate}
                onChange={(value) => setCertDraft((draft) => ({ ...draft, issueDate: value }))}
              />
              <FormField
                label="Expiry date"
                type="date"
                value={certDraft.expiryDate}
                onChange={(value) => setCertDraft((draft) => ({ ...draft, expiryDate: value }))}
              />
            </div>
            <div>
              <Label htmlFor="cert-notes" className="text-[#142D52]">Notes</Label>
              <Textarea
                id="cert-notes"
                className="mt-1 border-[#E5E7EB]"
                value={certDraft.notes}
                onChange={(event) => setCertDraft((draft) => ({ ...draft, notes: event.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="certificate-file" className="text-[#142D52]">Certificate document</Label>
              <Input
                id="certificate-file"
                className="mt-1 border-[#E5E7EB]"
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                onChange={(event) => setCertFile(event.target.files?.[0] ?? null)}
              />
              <p className="mt-1 text-[11px] text-[#6B7280]">
                <FileUp className="mr-1 inline h-3 w-3 text-[#047857]" /> JPG, PNG, WEBP, or PDF up to 8 MB.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="border-[#E5E7EB] text-[#142D52]" onClick={() => setCertOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={saving}
              className="bg-[#047857] hover:bg-[#065F46] text-white"
              onClick={() => void saveCertification()}
            >
              {saving ? "Saving…" : "Save certification"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <Card className="border-[#E5E7EB] bg-white">
      <CardContent className="p-4">
        <p className="text-[11px] uppercase text-[#6B7280]">{label}</p>
        <p className="mt-1 font-bold text-[#142D52]">{value}</p>
      </CardContent>
    </Card>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-[#6B7280]">{label}</p>
      <p className="font-medium text-[#1F2937]">{value}</p>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="rounded-lg border border-dashed border-[#E5E7EB] p-5 text-center text-sm text-[#6B7280]">{text}</p>;
}

function FormField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "date";
}) {
  return (
    <div>
      <Label className="text-[#142D52]">{label}</Label>
      <Input
        className="mt-1 border-[#E5E7EB]"
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
