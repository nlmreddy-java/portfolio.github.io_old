import { jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

// Single-row table holding the editable portfolio content (keyed by "main").
export const siteContent = pgTable("site_content", {
  id: text().primaryKey(),
  data: jsonb().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
