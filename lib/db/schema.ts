import { pgTable, text, timestamp, boolean, serial, numeric, jsonb, integer } from 'drizzle-orm/pg-core'

// --- Better Auth required tables -------------------------------------------
// Column names are camelCase to match Better Auth's defaults. Do not rename.

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

// --- App tables ------------------------------------------------------------
// Add your app tables below. Always include a plain `userId` column so queries
// can be scoped per user — the security model depends on this column existing,
// not on a foreign key. Do NOT add a foreign key constraint
// (`.references(() => user.id, ...)`) unless the user explicitly asks for
// foreign keys or referential integrity; FK constraints make iterating on the
// schema harder.
//
// Example:
//
// import { serial } from "drizzle-orm/pg-core"
//
// export const todos = pgTable("todos", {
//   id: serial("id").primaryKey(),
//   userId: text("userId").notNull(),
//   title: text("title").notNull(),
//   completed: boolean("completed").notNull().default(false),
//   createdAt: timestamp("createdAt").notNull().defaultNow(),
// })
//
// If the user asks for foreign keys, add the reference back in:
//   userId: text("userId")
//     .notNull()
//     .references(() => user.id, { onDelete: "cascade" }),

// --- Threats Table -------------------------------------------------------
export const threats = pgTable('threats', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  severity: text('severity').notNull(), // critical, high, medium, low
  type: text('type').notNull(), // cve, vulnerability, malware, etc.
  status: text('status').notNull().default('active'), // active, contained, resolved
  source: text('source'),
  threatActors: text('threatActors'),
  mitreTactics: text('mitreTactics'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// --- Audit Logs Table ---------------------------------------------------
export const auditLogs = pgTable('auditLogs', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  action: text('action').notNull(),
  resource: text('resource').notNull(),
  resourceId: text('resourceId'),
  status: text('status').notNull().default('success'), // success, failure
  details: jsonb('details'),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

// --- Compliance Status Table -------------------------------------------
export const complianceStatus = pgTable('complianceStatus', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  framework: text('framework').notNull(), // iso27001, soc2, gdpr
  controlId: text('controlId').notNull(),
  controlName: text('controlName').notNull(),
  status: text('status').notNull(), // implemented, partial, planned
  percentage: numeric('percentage', { precision: 5, scale: 2 }).default('0'),
  evidenceCount: integer('evidenceCount').notNull().default(0),
  lastAssessedAt: timestamp('lastAssessedAt'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// --- GDPR Data Processing Table -----------------------------------------
export const gdprDataProcessing = pgTable('gdprDataProcessing', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  processingName: text('processingName').notNull(),
  dataCategory: text('dataCategory').notNull(),
  purposes: text('purposes'),
  legalBasis: text('legalBasis'),
  recipients: text('recipients'),
  retentionPeriod: text('retentionPeriod'),
  riskLevel: text('riskLevel'), // low, medium, high
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// --- User Organization Table -------------------------------------------
export const organizations = pgTable('organizations', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  name: text('name').notNull(),
  industry: text('industry'),
  country: text('country'),
  employees: numeric('employees'),
  apiKey: text('apiKey').unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})
