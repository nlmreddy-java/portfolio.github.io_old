import type { Config, Context } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import { readContent, requireAdmin, writeContent } from "../../lib/content.js";

// Function request bodies are capped at 6 MB, so keep uploads comfortably below that.
const MAX_BYTES = 4 * 1024 * 1024;

const RULES: Record<string, { types: string[]; label: string }> = {
  photo: {
    types: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    label: "a JPG, PNG, WebP or GIF image",
  },
  resume: {
    types: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    label: "a PDF, DOC or DOCX file",
  },
};

export default async (req: Request, context: Context) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const kind = context.params.kind;
  const rule = RULES[kind];
  if (!rule) return new Response("Unknown upload type", { status: 404 });

  const denied = await requireAdmin(req);
  if (denied) return denied;

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return new Response("No file provided", { status: 400 });
  if (!rule.types.includes(file.type)) {
    return new Response(`Please upload ${rule.label}.`, { status: 400 });
  }
  if (file.size > MAX_BYTES) return new Response("File is larger than 4 MB.", { status: 413 });

  await getStore("portfolio-files").set(kind, await file.arrayBuffer());

  const content = (await readContent()) ?? {};
  const info = { contentType: file.type, filename: file.name, version: Date.now() };
  await writeContent({ ...content, [kind]: info });

  return Response.json(info);
};

export const config: Config = {
  path: "/api/upload/:kind",
};
