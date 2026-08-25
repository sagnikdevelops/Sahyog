"use client";

import React, { useEffect, useState } from "react";
import { useAppState } from "@/lib/store/stateContext";
import { AvatarUploader } from "@/components/profile/AvatarUploader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export default function CustomerProfilePage() {
  const { currentUser, isDemoMode, updateOwnProfile, uploadOwnAvatar, removeOwnAvatar } = useAppState();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState({ fullName: currentUser.fullName, phone: currentUser.phone, city: currentUser.city, address: currentUser.address, bio: currentUser.bio ?? "" });

  useEffect(() => setForm({ fullName: currentUser.fullName, phone: currentUser.phone, city: currentUser.city, address: currentUser.address, bio: currentUser.bio ?? "" }), [currentUser]);
  const update = (field: keyof typeof form, value: string) => setForm((current) => ({ ...current, [field]: value }));
  const save = async () => {
    setSaving(true); setMessage(null);
    const result = await updateOwnProfile(form);
    setSaving(false);
    setMessage(result.error ?? (isDemoMode ? "Demo profile updated for this simulation." : "Profile changes saved."));
    if (!result.error) setEditing(false);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 border-b border-[#E5E5E5] pb-5 sm:flex-row sm:items-center">
        <div><p className="text-xs font-bold uppercase tracking-wide text-[#737373]">Customer profile</p><h1 className="text-2xl font-bold">Your account</h1></div>
        <Button onClick={() => editing ? void save() : setEditing(true)} disabled={saving}>{editing ? (saving ? "Saving…" : "Save changes") : "Edit profile"}</Button>
      </div>
      {isDemoMode ? <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">You are editing a temporary demo persona. Sign in to save a real profile to Supabase.</div> : null}
      {message ? <p className="rounded-md bg-[#F3F3F3] px-3 py-2 text-xs text-[#525252]">{message}</p> : null}
      <Card><CardContent className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center">
        <AvatarUploader name={currentUser.fullName} url={currentUser.avatarUrl} disabled={isDemoMode} onUpload={uploadOwnAvatar} onRemove={removeOwnAvatar} />
        <div><h2 className="text-lg font-bold">{currentUser.fullName}</h2><p className="text-sm text-[#737373]">{currentUser.email}</p><div className="mt-2 flex flex-wrap gap-2"><Badge variant="secondary">Customer</Badge><Badge variant="outline">Member since {new Date(currentUser.createdAt).toLocaleDateString()}</Badge></div></div>
      </CardContent></Card>
      <Card><CardHeader><CardTitle className="text-base">Personal details</CardTitle></CardHeader><CardContent className="grid gap-4 p-5 pt-0 sm:grid-cols-2">
        <Field label="Full name" value={form.fullName} disabled={!editing} onChange={(value) => update("fullName", value)} />
        <ReadOnly label="Email" value={currentUser.email} />
        <Field label="Phone" value={form.phone} disabled={!editing} onChange={(value) => update("phone", value)} />
        <Field label="City" value={form.city} disabled={!editing} onChange={(value) => update("city", value)} />
        <div className="sm:col-span-2"><Field label="Address" value={form.address} disabled={!editing} onChange={(value) => update("address", value)} /></div>
        <div className="sm:col-span-2"><Label htmlFor="customer-bio">About you</Label><Textarea id="customer-bio" className="mt-1 min-h-24" value={form.bio} disabled={!editing} onChange={(event) => update("bio", event.target.value)} placeholder="Tell service providers anything useful about your household or preferences." /></div>
      </CardContent></Card>
      {editing ? <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => { setEditing(false); setForm({ fullName: currentUser.fullName, phone: currentUser.phone, city: currentUser.city, address: currentUser.address, bio: currentUser.bio ?? "" }); }}>Cancel</Button><Button disabled={saving} onClick={() => void save()}>{saving ? "Saving…" : "Save changes"}</Button></div> : null}
    </div>
  );
}

function Field({ label, value, disabled, onChange }: { label: string; value: string; disabled: boolean; onChange: (value: string) => void }) { return <div><Label>{label}</Label><Input className="mt-1" value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)} /></div>; }
function ReadOnly({ label, value }: { label: string; value: string }) { return <div><Label>{label}</Label><Input className="mt-1" value={value} disabled /></div>; }
