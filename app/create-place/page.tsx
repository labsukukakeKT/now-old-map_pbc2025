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

  return (
    <div style={{ padding: 24 }}>
      <h1>Place Information Editor</h1>
      <PlaceInfoEditor value={place} onChange={setPlace} />
      <pre style={{ marginTop: 24, background: "#f6f8fa", padding: 12 }}>{JSON.stringify(place, null, 2)}</pre>
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