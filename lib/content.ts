import { eq } from "drizzle-orm";
import { getUser, verifyRequestOrigin, AuthError } from "@netlify/identity";
import { db } from "../db/index.js";
import { siteContent } from "../db/schema.js";

const CONTENT_ID = "main";

export type FileInfo = { contentType: string; filename: string; version: number };
export type Content = Record<string, unknown> & { photo?: FileInfo; resume?: FileInfo };

export async function readContent(): Promise<Content | null> {
  const [row] = await db.select().from(siteContent).where(eq(siteContent.id, CONTENT_ID));
  return (row?.data as Content) ?? null;
}

export async function writeContent(data: Content) {
  await db
    .insert(siteContent)
    .values({ id: CONTENT_ID, data, updatedAt: new Date() })
    .onConflictDoUpdate({ target: siteContent.id, set: { data, updatedAt: new Date() } });
}

// Returns an error Response when the request is not from a logged-in admin, otherwise null.
export async function requireAdmin(req: Request): Promise<Response | null> {
  try {
    verifyRequestOrigin(req);
  } catch (error) {
    if (error instanceof AuthError) return new Response("Forbidden", { status: 403 });
    throw error;
  }
  const user = await getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });
  if (!user.roles?.includes("admin")) return new Response("Forbidden: admin role required", { status: 403 });
  return null;
}
