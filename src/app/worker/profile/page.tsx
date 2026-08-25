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
import { Award, FileUp, Pencil, Plus, Trash2, Wrench } from "lucide-react";
import type { Certification } from "@/types";

type CertificationDraft = { id?: string; title: string; issuingBody: string; certificationNumber: string; issueDate: string; expiryDate: string; notes: string };
const emptyCertification = (): CertificationDraft => ({ title: "", issuingBody: "", certificationNumber: "", issueDate: "", expiryDate: "", notes: "" });

export default function WorkerProfilePage() {
  const state = useAppState();
  const worker = useMemo(() => state.workers.find((item) => item.id === state.currentUser.id) ?? normalizeWorkerRecord({ id: state.currentUser.id, profile: { ...state.currentUser, role: "WORKER" } }), [state.currentUser, state.workers]);
  const [bio, setBio] = useState(worker.bio);
  const [bioEditing, setBioEditing] = useState(false);
  const [skillName, setSkillName] = useState("");
  const [certOpen, setCertOpen] = useState(false);
  const [certDraft, setCertDraft] = useState<CertificationDraft>(emptyCertification());
  const [certFile, setCertFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const saveBio = async () => { setSaving(true); const result = await state.updateOwnWorkerBio(bio); setSaving(false); setMessage(result.error ?? "Bio saved."); if (!result.error) setBioEditing(false); };
  const addSkill = async () => {
    const name = skillName.trim(); if (!name) return;
    const key = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const result = await state.addOwnSkill({ skillId: key, skillName: name, serviceId: key, serviceName: "Trade", isVerified: false });
    setMessage(result.error ?? "Skill added and submitted for verification."); if (!result.error) setSkillName("");
  };
  const openCertification = (cert?: Certification) => { setCertFile(null); setCertDraft(cert ? { id: cert.id, title: cert.title, issuingBody: cert.issuingBody, certificationNumber: cert.certificationNumber ?? "", issueDate: cert.issueDate?.slice(0, 10) ?? "", expiryDate: cert.expiryDate?.slice(0, 10) ?? "", notes: cert.notes ?? "" } : emptyCertification()); setCertOpen(true); };
  const saveCertification = async () => {
    if (!certDraft.title.trim() || !certDraft.issuingBody.trim()) { setMessage("Certification name and issuing organization are required."); return; }
    setSaving(true);
    const result = await state.saveOwnCertification({ ...certDraft, issueDate: certDraft.issueDate || new Date().toISOString().slice(0, 10), expiryDate: certDraft.expiryDate || undefined, certificationNumber: certDraft.certificationNumber || undefined, notes: certDraft.notes || undefined });
    if (!result.error && result.certification && certFile) {
      const upload = await state.uploadOwnCertificateFile(result.certification.id, certFile);
      if (upload.error) { setSaving(false); setMessage(upload.error); return; }
    }
    setSaving(false); setMessage(result.error ?? "Certification saved and submitted for review."); if (!result.error) setCertOpen(false);
  };
  const viewCertificate = async (path?: string) => { if (!path) return; const result = await createCertificateSignedUrl(path); if (result.url) window.open(result.url, "_blank", "noopener,noreferrer"); else setMessage(result.error ?? "Certificate is unavailable."); };

  return <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
    <div className="rounded-xl border border-[#E5E5E5] bg-[#F8F8F8] p-5 sm:p-6"><div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4"><Avatar className="h-16 w-16"><AvatarImage src={worker.profile.avatarUrl} alt={worker.profile.fullName} /><AvatarFallback>{worker.profile.fullName.slice(0, 2).toUpperCase()}</AvatarFallback></Avatar><div><div className="flex flex-wrap items-center gap-2"><h1 className="text-xl font-bold">{worker.profile.fullName}</h1><WorkerVerificationBadge status={worker.verificationStatus} /></div><p className="text-xs text-[#737373]">Worker ID: {worker.id}</p><p className="text-xs text-[#737373]">{worker.cooperativeName}</p></div></div>
      <AvatarUploader name={worker.profile.fullName} url={worker.profile.avatarUrl} disabled={state.isDemoMode} onUpload={state.uploadOwnAvatar} onRemove={state.removeOwnAvatar} />
    </div></div>
    {state.isDemoMode ? <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">Demo profile changes are temporary. Real worker profiles persist securely to Supabase.</div> : null}
    {message ? <p className="rounded-md bg-[#F3F3F3] px-3 py-2 text-xs text-[#525252]">{message}</p> : null}
    <Tabs defaultValue="overview"><TabsList className="grid h-auto w-full grid-cols-2 gap-1 sm:grid-cols-6"><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="bio">Bio</TabsTrigger><TabsTrigger value="skills">Trade skills</TabsTrigger><TabsTrigger value="certifications">Certifications</TabsTrigger><TabsTrigger value="badges">Badges</TabsTrigger><TabsTrigger value="account">Account</TabsTrigger></TabsList>
      <TabsContent value="overview"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Metric label="Availability" value={worker.isAvailable ? "Available" : "Offline"} /><Metric label="Rating" value={`${worker.ratingAvg.toFixed(1)} / 5`} /><Metric label="Experience" value={`${worker.experienceYears} years`} /><Metric label="Completed jobs" value={String(worker.completedServicesCount)} /></div><Card className="mt-4"><CardHeader><CardTitle className="text-base">Professional summary</CardTitle></CardHeader><CardContent className="space-y-2 text-sm text-[#525252]"><p>{worker.bio || "Add a short bio so customers can understand your experience and service approach."}</p><div className="flex flex-wrap gap-2">{worker.skills.map((skill) => <Badge key={skill.id} variant="secondary">{skill.skillName}</Badge>)}</div></CardContent></Card></TabsContent>
      <TabsContent value="bio"><Card><CardHeader><CardTitle className="text-base">About your professional work</CardTitle></CardHeader><CardContent className="space-y-3"><Textarea value={bio} disabled={!bioEditing} onChange={(event) => setBio(event.target.value)} className="min-h-36" placeholder="Describe your experience, specialties, and service approach." /><div className="flex justify-end gap-2">{bioEditing ? <><Button variant="outline" onClick={() => { setBio(worker.bio); setBioEditing(false); }}>Cancel</Button><Button disabled={saving} onClick={() => void saveBio()}>{saving ? "Saving…" : "Save bio"}</Button></> : <Button onClick={() => setBioEditing(true)}><Pencil className="mr-1 h-4 w-4" /> Edit bio</Button>}</div></CardContent></Card></TabsContent>
      <TabsContent value="skills"><Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><Wrench className="h-4 w-4" /> Certified trade skills</CardTitle></CardHeader><CardContent className="space-y-4"><div className="flex flex-col gap-2 sm:flex-row"><Input value={skillName} onChange={(event) => setSkillName(event.target.value)} placeholder="Add a trade skill (e.g. Plumbing)" /><Button onClick={() => void addSkill()}><Plus className="mr-1 h-4 w-4" /> Add skill</Button></div>{worker.skills.length ? <div className="grid gap-2 sm:grid-cols-2">{worker.skills.map((skill) => <div key={skill.id} className="flex items-center justify-between rounded-lg border p-3"><div><p className="text-sm font-semibold">{skill.skillName}</p><p className="text-xs text-[#737373]">{skill.isVerified ? "Verified skill" : "Verification pending"}</p></div><Button size="icon" variant="ghost" aria-label={`Remove ${skill.skillName}`} onClick={() => void state.removeOwnSkill(skill.id)}><Trash2 className="h-4 w-4 text-red-700" /></Button></div>)}</div> : <Empty text="No trade skills yet. Add the services you are qualified to perform." />}</CardContent></Card></TabsContent>
      <TabsContent value="certifications"><Card><CardHeader className="flex flex-row items-center justify-between"><CardTitle className="flex items-center gap-2 text-base"><Award className="h-4 w-4" /> Professional certifications</CardTitle><Button size="sm" onClick={() => openCertification()}><Plus className="mr-1 h-4 w-4" /> Add certification</Button></CardHeader><CardContent className="space-y-3">{worker.certifications.length ? worker.certifications.map((cert) => <div key={cert.id} className="rounded-lg border p-4"><div className="flex flex-col justify-between gap-3 sm:flex-row"><div><div className="flex items-center gap-2"><p className="font-semibold">{cert.title}</p><Badge variant={cert.certificationStatus === "APPROVED" ? "success" : cert.certificationStatus === "REJECTED" ? "destructive" : "warning"}>{cert.certificationStatus}</Badge></div><p className="text-xs text-[#737373]">{cert.issuingBody} · Issued {cert.issueDate}</p>{cert.certificationNumber ? <p className="text-xs text-[#737373]">ID: {cert.certificationNumber}</p> : null}</div><div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => openCertification(cert)}><Pencil className="mr-1 h-3.5 w-3.5" /> Edit</Button>{cert.documentUrl ? <Button size="sm" variant="outline" onClick={() => void viewCertificate(cert.documentUrl)}>View</Button> : null}<Button size="icon" variant="ghost" disabled={cert.certificationStatus === "APPROVED"} onClick={() => void state.removeOwnCertification(cert.id)}><Trash2 className="h-4 w-4 text-red-700" /></Button></div></div></div>) : <Empty text="No certifications yet. Add your first professional certification." />}</CardContent></Card></TabsContent>
      <TabsContent value="badges"><Card><CardHeader><CardTitle className="text-base">Badges</CardTitle></CardHeader><CardContent>{worker.badges?.length ? <div className="grid gap-3 sm:grid-cols-2">{worker.badges.map((badge) => <div key={badge.id} className="rounded-lg border bg-[#F8F8F8] p-4"><p className="font-semibold">{badge.label}</p><p className="text-xs text-[#737373]">{badge.description}</p></div>)}</div> : <Empty text="No badges awarded yet. Verification and performance badges are issued by your cooperative or administrators." />}</CardContent></Card></TabsContent>
      <TabsContent value="account"><Card><CardHeader><CardTitle className="text-base">Account and profile</CardTitle></CardHeader><CardContent className="grid gap-4 text-sm sm:grid-cols-2"><Detail label="Email" value={worker.profile.email} /><Detail label="Phone" value={worker.profile.phone || "Not provided"} /><Detail label="Location" value={[worker.profile.city, worker.profile.address].filter(Boolean).join(", ") || "Not provided"} /><Detail label="Cooperative" value={worker.cooperativeName} /></CardContent></Card></TabsContent>
    </Tabs>
    <Dialog open={certOpen} onOpenChange={setCertOpen}><DialogContent className="max-h-[90vh] overflow-y-auto"><DialogHeader><DialogTitle>{certDraft.id ? "Edit certification" : "Add certification"}</DialogTitle></DialogHeader><div className="grid gap-3"><FormField label="Certification name" value={certDraft.title} onChange={(value) => setCertDraft((draft) => ({ ...draft, title: value }))} /><FormField label="Issuing organization" value={certDraft.issuingBody} onChange={(value) => setCertDraft((draft) => ({ ...draft, issuingBody: value }))} /><FormField label="Certification ID" value={certDraft.certificationNumber} onChange={(value) => setCertDraft((draft) => ({ ...draft, certificationNumber: value }))} /><div className="grid gap-3 sm:grid-cols-2"><FormField label="Issue date" type="date" value={certDraft.issueDate} onChange={(value) => setCertDraft((draft) => ({ ...draft, issueDate: value }))} /><FormField label="Expiry date" type="date" value={certDraft.expiryDate} onChange={(value) => setCertDraft((draft) => ({ ...draft, expiryDate: value }))} /></div><div><Label htmlFor="cert-notes">Notes</Label><Textarea id="cert-notes" className="mt-1" value={certDraft.notes} onChange={(event) => setCertDraft((draft) => ({ ...draft, notes: event.target.value }))} /></div><div><Label htmlFor="certificate-file">Certificate document</Label><Input id="certificate-file" className="mt-1" type="file" accept="image/jpeg,image/png,image/webp,application/pdf" onChange={(event) => setCertFile(event.target.files?.[0] ?? null)} /><p className="mt-1 text-[11px] text-[#737373]"><FileUp className="mr-1 inline h-3 w-3" /> JPG, PNG, WEBP, or PDF up to 8 MB.</p></div></div><DialogFooter><Button variant="outline" onClick={() => setCertOpen(false)}>Cancel</Button><Button disabled={saving} onClick={() => void saveCertification()}>{saving ? "Saving…" : "Save certification"}</Button></DialogFooter></DialogContent></Dialog>
  </div>;
}

function Metric({ label, value }: { label: string; value: string }) { return <Card><CardContent className="p-4"><p className="text-[11px] uppercase text-[#737373]">{label}</p><p className="mt-1 font-bold">{value}</p></CardContent></Card>; }
function Detail({ label, value }: { label: string; value: string }) { return <div><p className="text-xs text-[#737373]">{label}</p><p className="font-medium">{value}</p></div>; }
function Empty({ text }: { text: string }) { return <p className="rounded-lg border border-dashed p-5 text-center text-sm text-[#737373]">{text}</p>; }
function FormField({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: "text" | "date" }) { return <div><Label>{label}</Label><Input className="mt-1" type={type} value={value} onChange={(event) => onChange(event.target.value)} /></div>; }
