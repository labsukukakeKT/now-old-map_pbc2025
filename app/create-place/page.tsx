"use client";

import React, { Suspense, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";

const PlaceInfoEditor = dynamic(
  () => import("../../components/NewPlaceEditor"),
  { ssr: false }
);

export type PlaceInfo = {
  mainImageUrl: string;
  placeName: string;
  periodStartYear: number | null;
  periodEndYear: number | null;
  descriptionMarkdown: string;
  latitude: number | null;
  longitude: number | null;
};

function PlaceEditorContent() {
  const search = useSearchParams();
  const qLat = search?.get("lat");
  const qLng = search?.get("lng");
  const parsedLat = qLat ? Number(qLat) : null;
  const parsedLng = qLng ? Number(qLng) : null;

  const initial: PlaceInfo = useMemo(
    () => ({
      mainImageUrl: "",
      placeName: "",
      periodStartYear: null,
      periodEndYear: null,
      descriptionMarkdown: "",
      latitude: Number.isFinite(parsedLat as number) ? (parsedLat as number) : null,
      longitude: Number.isFinite(parsedLng as number) ? (parsedLng as number) : null,
    }),
    [parsedLat, parsedLng]
  );

  const [place, setPlace] = useState<PlaceInfo>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof PlaceInfo, string>>>({});

  function isValidImageUrl(u?: string) {
    if (!u) return false;
    try {
      const url = new URL(u);
      const ext = url.pathname.split(".").pop()?.toLowerCase() ?? "";
      return ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext) || u.startsWith("data:image");
    } catch {
      return false;
    }
  }

  function validate(p: PlaceInfo) {
    const e: Partial<Record<keyof PlaceInfo, string>> = {};
    if (!p.placeName || p.placeName.trim() === "") e.placeName = "Place name is required";
    if (!p.descriptionMarkdown || p.descriptionMarkdown.trim() === "") e.descriptionMarkdown = "Description is required";

    // latitude / longitude required and ranges
    if (p.latitude == null || isNaN(p.latitude)) e.latitude = "Latitude is required";
    else if (p.latitude < -90 || p.latitude > 90) e.latitude = "Latitude must be between -90 and 90";
    if (p.longitude == null || isNaN(p.longitude)) e.longitude = "Longitude is required";
    else if (p.longitude < -180 || p.longitude > 180) e.longitude = "Longitude must be between -180 and 180";

    // years optional but must be number and <= 3000 if provided
    if (p.periodStartYear != null) {
      if (!Number.isFinite(p.periodStartYear) || p.periodStartYear > 3000) e.periodStartYear = "Invalid start year";
    }
    if (p.periodEndYear != null) {
      if (!Number.isFinite(p.periodEndYear) || p.periodEndYear > 3000) e.periodEndYear = "Invalid end year";
    }

    // main image url optional but if present must be image url
    if (p.mainImageUrl && p.mainImageUrl.trim() !== "" && !isValidImageUrl(p.mainImageUrl)) {
      e.mainImageUrl = "Main image must be a valid image URL";
    }
    return e;
  }

  async function onSubmitClick() {
    const e = validate(place);
    setErrors(e);
    const keys = Object.keys(e);
    if (keys.length > 0) {
      const msg = keys.map((k) => `${k}: ${e[k as keyof typeof e]}`).join("\n");
      window.alert("Please fix the following errors:\n\n" + msg);
      return;
    }

    // build FormData and POST to server API which uses createPlace()
    try {
      const fd = new FormData();
      fd.append("place_name", place.placeName);
      fd.append("description_markdown", place.descriptionMarkdown);
      fd.append("latitude", String(place.latitude ?? ""));
      fd.append("longitude", String(place.longitude ?? ""));
      fd.append("period_start_year", String(place.periodStartYear ?? ""));
      fd.append("period_end_year", String(place.periodEndYear ?? ""));
      fd.append("main_image_url", place.mainImageUrl ?? "");

      const resp = await fetch("/api/create-place", {
        method: "POST",
        body: fd,
      });

      const data = await resp.json();
      if (!resp.ok || data?.error) {
        window.alert("Create failed: " + (data?.error ?? "unknown"));
        return;
      }
      window.alert("Place created");
      // optional: navigate away
      window.location.href = "/";
    } catch (err) {
      window.alert("Failed to create place. Please try again.");
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Place Information Editor</h1>
      <PlaceInfoEditor value={place} onChange={setPlace} errors={errors} onSubmit={onSubmitClick} />

      <pre style={{ marginTop: 24, background: "#f6f8fa", padding: 12 }}>
        {JSON.stringify(place, null, 2)}
      </pre>
    </div>
  );
}

export default function ExamplePlaceEditorPage() {
  return (
    <Suspense fallback={<div style={{ padding: 24 }}>Loading...</div>}>
      <PlaceEditorContent />
    </Suspense>
  );
}