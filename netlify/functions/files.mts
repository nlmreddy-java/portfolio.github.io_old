import type { Config, Context } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import { readContent, type FileInfo } from "../../lib/content.js";

export default async (req: Request, context: Context) => {
  const kind = context.params.kind;
  if (kind !== "photo" && kind !== "resume") return new Response("Not found", { status: 404 });

  const content = await readContent();
  const info = content?.[kind] as FileInfo | undefined;
  const data = info ? await getStore("portfolio-files").get(kind, { type: "arrayBuffer" }) : null;
  if (!info || !data) return new Response("Not found", { status: 404 });

  const headers: Record<string, string> = {
    "Content-Type": info.contentType,
    // URLs carry ?v=<version>, so a new upload always gets a fresh URL.
    "Cache-Control": new URL(req.url).searchParams.has("v") ? "public, max-age=31536000, immutable" : "no-cache",
  };
  if (kind === "resume") {
    const fallback = info.filename.replace(/[^\x20-\x7e]|["\\]/g, "_");
    headers["Content-Disposition"] = `attachment; filename="${fallback}"; filename*=UTF-8''${encodeURIComponent(info.filename)}`;
  }
  return new Response(data, { headers });
};

export const config: Config = {
  path: "/api/files/:kind",
};
