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
import { INDIAN_CITIES } from "@/constants";
import { MapPin, User, Phone, Mail, Building, CheckCircle2 } from "lucide-react";

export default function CustomerProfilePage() {
  const { currentUser, isDemoMode, updateOwnProfile, uploadOwnAvatar, removeOwnAvatar } = useAppState();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: currentUser.fullName,
    phone: currentUser.phone,
    city: currentUser.city || "Noida / Greater Noida",
    address: currentUser.address,
    bio: currentUser.bio ?? "",
  });

  useEffect(() => {
    setForm({
      fullName: currentUser.fullName,
      phone: currentUser.phone,
      city: currentUser.city || "Noida / Greater Noida",
      address: currentUser.address,
      bio: currentUser.bio ?? "",
    });
  }, [currentUser]);

  const update = (field: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [field]: value }));

  const handleCitySelect = (cityName: string) => {
    const matchedCity = INDIAN_CITIES.find((c) => c.name === cityName);
    setForm((prev) => ({
      ...prev,
      city: cityName,
      address: matchedCity ? `${matchedCity.popularLocalities[0]}, ${cityName}, ${matchedCity.state}` : prev.address,
    }));
  };

  const save = async () => {
    setSaving(true);
    setMessage(null);
    const result = await updateOwnProfile(form);
    setSaving(false);
    setMessage(result.error ?? (isDemoMode ? "Demo profile updated for this simulation." : "Profile changes saved successfully."));
    if (!result.error) setEditing(false);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 border-b border-[#E5E7EB] pb-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#6B7280]">Customer portal</p>
          <h1 className="text-2xl font-bold text-[#142D52]">Account &amp; Household Profile</h1>
        </div>
        <Button
          onClick={() => (editing ? void save() : setEditing(true))}
          disabled={saving}
          className="bg-[#047857] hover:bg-[#065F46] text-white"
        >
          {editing ? (saving ? "Saving…" : "Save changes") : "Edit profile"}
        </Button>
      </div>

      {isDemoMode && (
        <div className="rounded-lg border border-[#34D399]/40 bg-[#34D399]/10 p-3 text-xs text-[#142D52]">
          ✨ <strong>Interactive Demo Mode:</strong> You can edit profile information, change your city, and upload an avatar picture. All updates persist in your active browser session.
        </div>
      )}

      {message && (
        <p className="rounded-md bg-[#F9FAF7] border border-[#E5E7EB] px-3 py-2 text-xs text-[#047857] font-medium flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-[#047857]" /> {message}
        </p>
      )}

      <Card className="border-[#E5E7EB] bg-white">
        <CardContent className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center">
          <AvatarUploader
            name={currentUser.fullName}
            url={currentUser.avatarUrl}
            onUpload={uploadOwnAvatar}
            onRemove={removeOwnAvatar}
          />
          <div>
            <h2 className="text-lg font-bold text-[#142D52]">{currentUser.fullName}</h2>
            <p className="text-sm text-[#6B7280]">{currentUser.email}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="secondary">Verified Customer</Badge>
              <Badge variant="outline" className="border-[#E5E7EB] text-[#142D52]">
                Member since {new Date(currentUser.createdAt || Date.now()).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-[#E5E7EB] bg-white">
        <CardHeader>
          <CardTitle className="text-base text-[#142D52]">Personal &amp; Service Location Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 p-5 pt-0 sm:grid-cols-2">
          <Field
            label="Full name"
            value={form.fullName}
            disabled={!editing}
            onChange={(value) => update("fullName", value)}
          />
          <ReadOnly label="Email address" value={currentUser.email} />
          <Field
            label="Phone number"
            value={form.phone}
            disabled={!editing}
            onChange={(value) => update("phone", value)}
          />

          <div>
            <Label className="text-[#142D52]">City / Region</Label>
            {editing ? (
              <select
                value={form.city}
                onChange={(e) => handleCitySelect(e.target.value)}
                className="mt-1 w-full h-9 rounded-md border border-[#E5E7EB] bg-white px-3 text-xs text-[#1F2937]"
              >
                {INDIAN_CITIES.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} ({c.state})
                  </option>
                ))}
              </select>
            ) : (
              <Input className="mt-1 border-[#E5E7EB]" value={form.city} disabled />
            )}
          </div>

          <div className="sm:col-span-2">
            <Field
              label="Service address / Landmark"
              value={form.address}
              disabled={!editing}
              onChange={(value) => update("address", value)}
            />
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="customer-bio" className="text-[#142D52]">Household Notes / Preferences</Label>
            <Textarea
              id="customer-bio"
              className="mt-1 min-h-24 border-[#E5E7EB]"
              value={form.bio}
              disabled={!editing}
              onChange={(event) => update("bio", event.target.value)}
              placeholder="Tell cooperative technicians about specific access instructions, building landmarks, or service preferences."
            />
          </div>
        </CardContent>
      </Card>

      {editing && (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            className="border-[#E5E7EB] text-[#142D52]"
            onClick={() => {
              setEditing(false);
              setForm({
                fullName: currentUser.fullName,
                phone: currentUser.phone,
                city: currentUser.city || "Noida / Greater Noida",
                address: currentUser.address,
                bio: currentUser.bio ?? "",
              });
            }}
          >
            Cancel
          </Button>
          <Button
            disabled={saving}
            className="bg-[#047857] hover:bg-[#065F46] text-white"
            onClick={() => void save()}
          >
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  disabled,
  onChange,
}: {
  label: string;
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <Label className="text-[#142D52]">{label}</Label>
      <Input
        className="mt-1 border-[#E5E7EB]"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

function ReadOnly({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <Label className="text-[#142D52]">{label}</Label>
      <Input className="mt-1 border-[#E5E7EB] bg-[#F9FAF7]" value={value} disabled />
    </div>
  );
}
