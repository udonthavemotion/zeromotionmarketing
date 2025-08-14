import type { APIRoute } from "astro";
import { sendLeadEmail } from "../../server/email";
import { writeFile, mkdir } from "node:fs/promises";
import { randomUUID } from "node:crypto";

export const POST: APIRoute = async ({ request }) => {
  try {
    let data: Record<string, unknown> = {};
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      data = await request.json();
    } else if (
      contentType.includes("application/x-www-form-urlencoded") ||
      contentType.includes("multipart/form-data")
    ) {
      const form = await request.formData();
      for (const [key, value] of form.entries()) data[key] = value as string;
    } else {
      data = await request.json().catch(() => ({}));
    }
    const payload = {
      name: String((data as any).name || "").trim(),
      phone: String((data as any).phone || "").trim(),
      businessType: String((data as any).businessType || "N/A").trim() || "N/A",
      niche: String((data as any).niche || "General").trim() || "General",
      notes: String((data as any).notes || (data as any).message || "").trim(),
      source: String((data as any).source || "").trim() || "unknown",
    };
    if (!payload.name || !payload.phone) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
      });
    }
    const res = await sendLeadEmail({
      name: payload.name,
      email: "",
      business: payload.businessType,
      niche: payload.niche,
      message: `${payload.notes}\n\nPhone: ${payload.phone}\nSource: ${payload.source}`,
    });
    if (process.env.NODE_ENV !== "production") {
      const dir = new URL("../../data/leads/", import.meta.url);
      await mkdir(dir, { recursive: true });
      const file = new URL(`${Date.now()}-${randomUUID()}.json`, dir);
      await writeFile(
        file,
        JSON.stringify(
          { ...payload, createdAt: new Date().toISOString(), email: res },
          null,
          2,
        ),
      );
    }
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
    });
  }
};
