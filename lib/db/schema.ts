import { pgTable, text, timestamp, boolean, uuid, integer, json, jsonb, varchar } from 'drizzle-orm/pg-core'

export const users = pgTable('User', {
  id: uuid('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull(),
  image: text('image'),
  emailVerified: boolean('email_verified'),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
})

export const coaches = pgTable('coaches', {
  id: uuid('id').primaryKey(),
  name: text('name'),
  email: text('email'),
  clients: text('clients').array(),
  sessionLinks: text('session_links'),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
})

export const journeyProgress = pgTable('journey_progress', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  currentSession: integer('current_session').notNull(),
  completedSessions: json('completed_sessions').notNull(),
  totalScore: integer('total_score').notNull(),
  lastActiveDate: varchar('last_active_date', { length: 32 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  enableByCoach: jsonb('enable_by_coach').default({}),
})

export const userSessionFormProgress = pgTable('user_session_form_progress', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  sessionId: integer('session_id').notNull(),
  formId: text('form_id').notNull(),
  status: varchar('status', { length: 32 }).notNull(),
  score: integer('score'),
  completedAt: varchar('completed_at', { length: 32 }),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  insights: jsonb('insights').default({}),
})
