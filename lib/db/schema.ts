import { pgTable, text, timestamp, boolean, uuid, integer, json, jsonb, varchar, unique, numeric, uniqueIndex, index } from 'drizzle-orm/pg-core'

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
  paymentDone: boolean("payment_done").default(false).notNull(),
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

export const demographicsDetailsForm = pgTable(
  "demographics_details_form",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    user_id: uuid("user_id").notNull(),
    full_name: varchar("full_name", { length: 100 }),
    email: varchar("email", { length: 100 }),
    phone_number: varchar("phone_number", { length: 20 }),
    age: integer("age"),
    gender: varchar("gender", { length: 30 }),
    profession: varchar("profession", { length: 50 }),
    previous_coaching: varchar("previous_coaching", { length: 20 }),
    education: varchar("education", { length: 100 }),
    stress_level: integer("stress_level"),
    motivation: varchar("motivation", { length: 500 }),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    unique().on(table.user_id), // <-- enforces unique user_id constraint
  ]
);
export const careerMaturityAssessment = pgTable(
  "career_maturity_assessment",

  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),

    user_id: uuid("user_id").notNull(),

    session_id: integer("session_id").notNull().default(1),

    answers: varchar("answers", { length: 4000 }).notNull(),

    created_at: timestamp("created_at").defaultNow().notNull(),

    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },

  (table) => [
    unique().on(table.user_id, table.session_id),
  ]
);

export const preAssessment = pgTable(
  "pre_assessment",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    user_id: uuid("user_id").notNull(),
    session_id: integer("session_id").notNull().default(1),
    answers: varchar("answers", { length: 4000 }).notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    unique().on(table.user_id, table.session_id),
  ]
);

export const riasecTest = pgTable(
  "riasec_test",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),

    user_id: uuid("user_id").notNull(),

    session_id: integer("session_id").notNull().default(2),

    // Store the raw array of selected answers as JSON text
    selected_answers: varchar("selected_answers", { length: 4000 }).notNull(),

    // Store counts per category as JSONB
    category_counts: json("category_counts")
      .$type<Record<string, number>>()
      .notNull(),

    // Store the interest code (top 3 letters concatenated, e.g. "RIS")
    interest_code: varchar("interest_code", { length: 3 }).notNull(),

    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    unique().on(table.user_id, table.session_id),
  ]
);

export const personalityTest = pgTable(
  "personality_test",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),

    user_id: uuid("user_id").notNull(),

    session_id: integer("session_id").notNull().default(2),

    answers: varchar("answers", { length: 4000 }).notNull(), // JSON stringified answers

    score: numeric("score", { precision: 5, scale: 2 }).notNull().default("0"), // overall score

    subscale_scores: json("subscale_scores")
      .$type<Record<string, number>>()
      .notNull()
      .default({}), // subscale averages JSON

    created_at: timestamp("created_at").defaultNow().notNull(),

    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    unique().on(table.user_id, table.session_id), // unique by user_id and session_id
  ]
);

export const psychologicalWellbeingTest = pgTable(
  "psychological_wellbeing_test",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),

    user_id: uuid("user_id").notNull(),

    session_id: integer("session_id").notNull().default(1),

    answers: varchar("answers", { length: 4000 }).notNull(), // JSON string of answers

    score: numeric("score", { precision: 5, scale: 2 }).notNull().default("0"), // float score

    subscale_scores: json("subscale_scores")
      .$type<Record<string, number>>()
      .notNull()
      .default({}), // empty JSON object default

    created_at: timestamp("created_at").defaultNow().notNull(),

    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    unique().on(table.user_id, table.session_id), // unique constraint on user_id + session_id
  ]
);

export const careerStoryBoards = pgTable(
  "career_story_boards",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    user_id: varchar("user_id", { length: 255 }).notNull(),
    session_id: integer("session_id").notNull(),
    sticky_notes: json("sticky_notes").notNull(),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("career_story_boards_user_session_idx").on(
      table.user_id,
      table.session_id
    ),
  ]
);

export const dailyJournalingTable = pgTable(
  "daily_journaling",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    userId: varchar("user_id", { length: 255 }).notNull(),
    sessionId: integer("session_id").notNull(),
    date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD format
    tookAction: varchar("took_action", { length: 3 }).default(""), // "yes", "no", or ""
    whatHeldBack: text("what_held_back").default(""),
    challenges: text("challenges").default("[]"), // JSON string
    progress: text("progress").default("[]"), // JSON string
    gratitude: text("gratitude").default("[]"), // JSON string
    gratitudeHelp: text("gratitude_help").default("[]"), // JSON string
    tomorrowStep: text("tomorrow_step").default(""),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    unique(
      "daily_journaling_user_session_date_unique"
    ).on(table.userId, table.sessionId, table.date),
  ]
);

export const careerStoryTwo = pgTable(
  "career_story_two",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    userId: varchar("user_id", { length: 255 }).notNull(),
    sessionId: integer("session_id").notNull(),
    firstAdjectives: text("first_adjectives").notNull(),
    repeatedWords: text("repeated_words").notNull(),
    commonTraits: text("common_traits").notNull(),
    significantWords: text("significant_words").notNull(),
    selfStatement: text("self_statement").notNull(),
    mediaActivities: text("media_activities").notNull(),
    selectedRiasec: jsonb("selected_riasec").notNull().default([]),
    settingStatement: text("setting_statement").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => {
    return [
      uniqueIndex("career_story_two_user_session_unique").on(
        table.userId,
        table.sessionId
      ),
    ];
  }
);

export const careerStoryThree = pgTable(
  "career_story_three",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    userId: text("user_id").notNull(),
    sessionId: integer("session_id").notNull(),
    selfStatement: text("self_statement").notNull(),
    settingStatement: text("setting_statement").notNull(),
    plotDescription: text("plot_description").notNull(),
    plotActivities: text("plot_activities").notNull(),
    ableToBeStatement: text("able_to_be_statement").notNull(),
    placesWhereStatement: text("places_where_statement").notNull(),
    soThatStatement: text("so_that_statement").notNull(),
    mottoStatement: text("motto_statement").notNull(),
    selectedOccupations: jsonb("selected_occupations").notNull().default([]),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    unique().on(table.userId, table.sessionId),
  ]
);

export const letterFromFutureSelfTable = pgTable(
  "letter_from_future_self",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    userId: varchar("user_id").notNull(),
    sessionId: integer("session_id").notNull(),
    letter: text("letter").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    unique().on(table.userId, table.sessionId),
  ]
);

export const careerOptionsMatrix = pgTable("career_options_matrix", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  sessionId: integer("session_id").notNull(),
  rows: jsonb("rows").notNull(), // Array of MatrixRow objects
  columns: jsonb("columns").notNull(), // Array of MatrixColumn objects
  cells: jsonb("cells").notNull(), // Array of MatrixCell objects
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const careerStoryFours = pgTable(
  "career_story_four",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull(),
    sessionId: integer("session_id").notNull(),
    rewrittenStory: text("rewritten_story").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    unique().on(table.userId, table.sessionId),
  ]
);

export const careerStoryOneTable = pgTable(
  "career_story_one",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull(),
    sessionId: integer("session_id").notNull(),
    transitionEssay: text("transition_essay").notNull(),
    occupations: text("occupations").notNull(),
    heroes: jsonb("heroes")
      .$type<
        Array<{
          id: string;
          title: string;
          description: string;
        }>
      >()
      .notNull(),
    mediaPreferences: text("media_preferences").notNull().default(""),
    favoriteStory: text("favorite_story").notNull().default(""),
    favoriteSaying: text("favorite_saying").notNull().default(""),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("career_story_one_user_session_idx").on(
      table.userId,
      table.sessionId
    ),
  ]
);

export const careerStoryFive = pgTable(
  "career_story_five",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    user_id: varchar("user_id", { length: 255 }).notNull(),
    session_id: integer("session_id").notNull(),
    storyboards: jsonb("storyboards").notNull().default([]), // Array of storyboards
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("career_story_five_user_session_idx").on(
      table.user_id,
      table.session_id
    ),
  ]
);

export const careerStorySix = pgTable(
  "career_story_six",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    user_id: varchar("user_id", { length: 255 }).notNull(),
    session_id: integer("session_id").notNull(),
    selected_storyboard_id: varchar("selected_storyboard_id", { length: 255 }),
    storyboard_data: jsonb("storyboard_data"), // Single storyboard data
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("career_story_six_user_session_idx").on(
      table.user_id,
      table.session_id
    ),
  ]
);

export const myLifeCollageTable = pgTable(
  "my_life_collage",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: varchar("user_id", { length: 255 }).notNull(),
    sessionId: integer("session_id").notNull(),
    presentLifeCollage: jsonb("present_life_collage").notNull().default([]),
    futureLifeCollage: jsonb("future_life_collage").notNull().default([]),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    unique("my_life_collage_user_session_unique").on(
      table.userId,
      table.sessionId
    ),
  ]
);

export const postCareerMaturityTable = pgTable(
  "post_career_maturity",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    user_id: uuid("user_id")
      .notNull()
      .references(() => users.id),
    session_id: integer("session_id").notNull().default(1),
    answers: jsonb("answers").notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    unique().on(table.user_id, table.session_id),
  ]
);

export const post_psychological_wellbeing_test = pgTable(
  "post_psychological_wellbeing_test",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    user_id: uuid("user_id").notNull(),
    session_id: integer("session_id").notNull(),
    answers: varchar("answers", { length: 4000 }).notNull(), // JSON string of answers
    score: numeric("score", { precision: 5, scale: 2 }).notNull().default("0"), // float score
    subscale_scores: json("subscale_scores")
      .$type<Record<string, number>>()
      .notNull()
      .default({}), // empty JSON object default
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    unique().on(table.user_id, table.session_id), // unique constraint on user_id + session_id
  ]
);

export const postCoachingAssessments = pgTable(
  "post_coaching_assessments",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    userId: uuid("user_id").notNull(),
    sessionId: integer("session_id").notNull().default(8),
    answers: jsonb("answers").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    unique("unique_user_session_post_coaching").on(
      table.userId,
      table.sessionId
    ),
  ]
);

// Uploaded Images tracking table for cleanup and management
export const uploadedImages = pgTable(
  "uploaded_images",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    sessionId: integer("session_id"), // Optional: link to specific session
    imageUrl: text("image_url").notNull().unique(),
    imagePath: text("image_path").notNull(), // Vercel Blob pathname
    fileName: varchar("file_name", { length: 255 }).notNull(),
    fileSize: integer("file_size").notNull(),
    mimeType: varchar("mime_type", { length: 100 }).notNull(),
    imageType: varchar("image_type", { length: 50 }), // 'present' or 'future' for collage
    isOptimized: boolean("is_optimized").default(false).notNull(),
    lastAccessedAt: timestamp("last_accessed_at").defaultNow().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_user_image_type").on(
      table.userId,
      table.imageType
    ),
    index("idx_last_accessed").on(table.lastAccessedAt),
  ]
);

// Report table for storing session reports
export const report = pgTable(
  "report",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    user_id: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    session_id: integer("session_id").notNull(),
    summary: text("summary").notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
    coach_feedback: text("coach_feedback"),
  },
  (table) => [
    unique().on(table.user_id, table.session_id),
  ]
);

// Pre-coaching SDQ (Strengths and Difficulties Questionnaire) table
export const preCoachingSdq = pgTable(
  "pre_coaching_sdq",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    sessionId: integer("session_id").default(1).notNull(),
    answers: jsonb("answers").notNull(),
    score: numeric("score", { precision: 5, scale: 2 }).default("0").notNull(),
    subscaleScores: json("subscale_scores").default({}).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    unique("pre_coaching_sdq_user_id_session_id_unique").on(
      table.userId,
      table.sessionId
    ),
  ]
);

export const postCoachingSdq = pgTable(
  "post_coaching_sdq",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    sessionId: integer("session_id").default(8).notNull(),
    answers: jsonb("answers").notNull(),
    score: numeric("score", { precision: 5, scale: 2 }).default("0").notNull(),
    subscaleScores: json("subscale_scores").default({}).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    unique("post_coaching_sdq_user_id_session_id_unique").on(
      table.userId,
      table.sessionId
    ),
  ]
);