import { NextResponse } from "next/server";
import { createPlace } from "@/app/create-place/validate_and_create";

export async function POST(req: Request) {
  try {
    // accept either FormData (from FormData POST) or JSON (client may send JSON)
    const contentType = req.headers.get("content-type") || "";
    let formData: FormData | null = null;
    if (contentType.startsWith("multipart/form-data")) {
      formData = await req.formData();
    } else {
      const body = await req.json().catch(() => null);
      formData = new FormData();
      if (body && typeof body === "object") {
        for (const k of Object.keys(body)) {
          formData.append(k, body[k] == null ? "" : String(body[k]));
        }
      }
    }

    if (!formData) return NextResponse.json({ error: "No form data" }, { status: 400 });

    const created = await createPlace(formData as FormData);
    return NextResponse.json({ ok: true, created });
  } catch (err: any) {
    const msg = err?.message ?? "Server error";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
