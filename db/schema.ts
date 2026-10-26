import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const answerSubmissions = sqliteTable("answer_submissions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  responderName: text("responder_name").notNull().default("ยู"),
  answersJson: text("answers_json").notNull(),
  consentVersion: text("consent_version").notNull().default("v1"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
