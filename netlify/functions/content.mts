import type { Config } from "@netlify/functions";
import { readContent, requireAdmin, writeContent } from "../../lib/content.js";

export default async (req: Request) => {
  if (req.method === "GET") {
    const content = await readContent();
    return Response.json(content ?? {}, { headers: { "Cache-Control": "no-store" } });
  }

  if (req.method === "PUT") {
    const denied = await requireAdmin(req);
    if (denied) return denied;

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return new Response("Invalid content", { status: 400 });
    }
    // Uploaded file info is managed by the upload endpoint only.
    const existing = (await readContent()) ?? {};
    const { photo: _photo, resume: _resume, ...fields } = body;
    const next = { ...fields, photo: existing.photo, resume: existing.resume };
    await writeContent(next);
    return Response.json(next);
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = {
  path: "/api/content",
};
