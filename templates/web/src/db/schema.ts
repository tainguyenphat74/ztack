import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/**
 * Example table. Replace with your own schema.
 *
 * `authorId` stores the Clerk user id (e.g. `user_xxx`), so rows can be tied
 * to the signed-in user without a separate users table.
 */
export const posts = pgTable("posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  authorId: text("author_id").notNull(),
  title: text("title").notNull(),
  content: text("content"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
