"use client";

import React, { useMemo, useState } from "react";
import PlaceInfoEditor, { PlaceInfo } from "../../components/NewPlaceEditor";
import { useSearchParams } from "next/navigation";

export default function ExamplePlaceEditorPage() {
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