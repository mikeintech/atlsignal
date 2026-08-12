import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const newsletterSubscribers = sqliteTable("newsletter_subscribers", {
  subscriberId: text("subscriber_id").primaryKey(),
  email: text("email").notNull().unique(),
  marketId: text("market_id").notNull(),
  source: text("source").notNull(),
  consentVersion: text("consent_version").notNull(),
  status: text("status").notNull().default("ACTIVE"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
});

export const newsletterSyncEvents = sqliteTable("newsletter_sync_events", {
  syncEventId: text("sync_event_id").primaryKey(),
  subscriberId: text("subscriber_id").notNull(),
  provider: text("provider").notNull(),
  status: text("status").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
});

export const newsroomContacts = sqliteTable("newsroom_contacts", {
  contactId: text("contact_id").primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  contactType: text("contact_type").notNull(),
  message: text("message").notNull(),
  pageUrl: text("page_url"),
  status: text("status").notNull().default("NEW"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
});

export const editorialReviewDecisions = sqliteTable("editorial_review_decisions", {
  decisionId: text("decision_id").primaryKey(),
  candidateId: text("candidate_id").notNull(),
  reviewerEmail: text("reviewer_email").notNull(),
  decision: text("decision").notNull(),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
});

export const contentAnalytics = sqliteTable("content_analytics", {
  analyticsId: text("analytics_id").primaryKey(),
  eventType: text("event_type").notNull(),
  path: text("path").notNull(),
  target: text("target"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
});
