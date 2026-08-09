import { getDb } from "@/db";
import { newsletterSubscribers, newsletterSyncEvents } from "@/db/schema";

export type NewsletterSubscription = {
  email: string;
  marketId: string;
  source: string;
  consentVersion: string;
};

export interface NewsletterStore {
  subscribe(input: NewsletterSubscription): Promise<{ subscriberId: string }>;
}

class D1NewsletterStore implements NewsletterStore {
  async subscribe(input: NewsletterSubscription) {
    const database = getDb();
    const candidateSubscriberId = crypto.randomUUID();
    const now = new Date();
    const [subscriber] = await database.insert(newsletterSubscribers).values({
      subscriberId: candidateSubscriberId,
      ...input,
      email: input.email.toLowerCase(),
      status: "ACTIVE",
      createdAt: now,
    }).onConflictDoUpdate({
      target: newsletterSubscribers.email,
      set: { status: "ACTIVE", marketId: input.marketId, source: input.source },
    }).returning({ subscriberId: newsletterSubscribers.subscriberId });
    const subscriberId = subscriber?.subscriberId ?? candidateSubscriberId;
    await database.insert(newsletterSyncEvents).values({
      syncEventId: crypto.randomUUID(),
      subscriberId,
      provider: "D1_CAPTURE",
      status: "CAPTURED",
      createdAt: now,
    });
    return { subscriberId };
  }
}

export const newsletterStore: NewsletterStore = new D1NewsletterStore();
