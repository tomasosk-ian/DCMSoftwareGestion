import { relations, sql } from "drizzle-orm";
import { timestamp } from "drizzle-orm/mysql-core";
import {
  text,
  index,
  integer,
  primaryKey,
  real,
  sqliteTableCreator,
  blob,
} from "drizzle-orm/sqlite-core";
// export const sqliteTable = sqliteTableCreator((name) => `test_${name}`);
export const sqliteTable = sqliteTableCreator((name) => `${name}`);

export const cities = sqliteTable(
  "test_cities",
  {
    identifier: text("identifier", { length: 255 }).notNull(),
    name: text("name", { length: 255 }).notNull(),
    description: text("description", { length: 255 }).notNull(),
    image: text("image", { length: 255 }),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier),
  }),
);

export const clients = sqliteTable(
  "test_clients",
  {
    identifier: integer("identifier").primaryKey({ autoIncrement: true }),
    name: text("name", { length: 255 }),
    surname: text("surname", { length: 255 }),
    email: text("email", { length: 255 }),
    prefijo: integer("prefijo"),
    telefono: integer("telefono"),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier),
  }),
);

export const stores = sqliteTable(
  "test_stores",
  {
    identifier: text("identifier", { length: 255 }).notNull(),
    name: text("name", { length: 255 }).notNull(),
    image: text("image", { length: 255 }),
    cityId: text("cityId", { length: 255 }).notNull(),
    serieLocker: text("serieLocker", { length: 255 }),
    address: text("address", { length: 255 }),
    organizationName: text("organizationName", { length: 255 }),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier),
  }),
);

export const storesRelations = relations(stores, ({ one }) => ({
  city: one(cities, {
    fields: [stores.cityId],
    references: [cities.identifier],
  }),
}));

export const transactions = sqliteTable(
  "test_transactions",
  {
    id: integer("number").primaryKey().primaryKey({ autoIncrement: true }),
    confirm: integer("confirm", { mode: "boolean" }).default(false),
    confirmedAt: text("confirmedAt").default(sql`(CURRENT_DATE)`),
    client: text("client", { length: 255 }),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.id),
  }),
);

export const transactionsRelations = relations(transactions, ({ one }) => ({
  clients: one(clients, {
    fields: [transactions.client],
    references: [clients.identifier],
  }),
}));

export const sizes = sqliteTable(
  "test_sizes",
  {
    id: integer("id").notNull(),
    alto: integer("alto"),
    ancho: integer("ancho"),
    profundidad: integer("profundidad"),
    nombre: text("nombre", { length: 255 }),
    cantidad: integer("cantidad"),
    cantidadSeleccionada: integer("cantidadSeleccionada"),
    tarifa: text("tarifa", { length: 255 }),
    image: text("image", { length: 255 }),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.id),
  }),
);

export const reservas = sqliteTable(
  "test_reservas",
  {
    identifier: text("identifier", { length: 255 }),
    NroSerie: text("NroSerie", { length: 255 }),
    IdSize: integer("IdSize"),
    IdBox: integer("IdBox"),
    Token1: integer("Token1"),
    FechaCreacion: text("FechaCreacion", { length: 255 }),
    FechaInicio: text("FechaInicio", { length: 255 }),
    FechaFin: text("FechaFin", { length: 255 }),
    Contador: integer("Contador"),
    Confirmado: integer("Confirmado", { mode: "boolean" }).default(false),
    Modo: text("Modo", { length: 255 }),
    Cantidad: integer("Cantidad"),
    IdTransaction: integer("IdTransaction"),
    client: integer("client"),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier),
  }),
);

export const reservasRelations = relations(reservas, ({ one }) => ({
  clients: one(clients, {
    fields: [reservas.client],
    references: [clients.identifier],
  }),
}));

export const config = sqliteTable(
  "test_config",
  {
    identifier: text("identifier", { length: 255 }).notNull(),
    name: text("name", { length: 255 }).notNull(),
    description: text("description", { length: 255 }),
    token: text("token", { length: 20 }),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier),
  }),
);

export const lockers = sqliteTable(
  "test_lockers",
  {
    id: text("identifier", { length: 255 }).notNull(),
    nroSerieLocker: text("name", { length: 255 }).notNull(),
    status: text("description", { length: 255 }),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.id),
  }),
);

export const globalconfig = sqliteTable(
  "test_globalconfig",
  {
    identifier: text("identifier", { length: 255 }).notNull(),
    name: text("name", { length: 255 }).notNull(),
    image: text("image", { length: 255 }),
    token: text("token", { length: 255 }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier),
  }),
);

export const userData = sqliteTable(
  "test_userdata",
  {
    identifier: text("identifier", { length: 255 }).notNull(),
    name: text("name", { length: 255 }).notNull(),
    last_name: text("last_name", { length: 255 }).notNull(),
    email: text("email", { length: 255 }).notNull(),
    tel: integer("tel").notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier),
  }),
);

export const feeData = sqliteTable(
  "test_feedata",
  {
    identifier: text("identifier", { length: 255 }).notNull(),
    description: text("description", { length: 255 }),
    coin: text("coin", { length: 255 }),
    size: integer("size"),
    value: real("value"),
    discount: real("discount"),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier),
  }),
);

export const coinData = sqliteTable(
  "test_coindate",
  {
    identifier: text("identifier", { length: 255 }).notNull(),
    description: text("description", { length: 255 }),
    value: real("value"),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier),
  }),
);
export const feeRelations = relations(feeData, ({ one }) => ({
  coin: one(coinData, {
    fields: [feeData.coin],
    references: [coinData.identifier],
  }),
}));
export const sessions = sqliteTable(
  "session",
  {
    sessionToken: text("sessionToken", { length: 255 }).notNull().primaryKey(),
    userId: text("userId", { length: 255 }).notNull(),
    expires: integer("expires", { mode: "timestamp" }),
  },
  (session) => ({
    userIdIdx: index("userId_idx").on(session.userId),
  }),
);
export const users = sqliteTable(
  "user",
  {
    id: text("id", { length: 255 }).notNull().primaryKey(),
    name: text("name", { length: 255 }),
    email: text("email", { length: 255 }).notNull(),
    createdAt: integer("createdAt").default(sql`(CURRENT_DATE)`),
    updatedAt: integer("updatedAt").default(sql`(CURRENT_DATE)`),
    emailVerified: text("emailVerified").default(sql`(CURRENT_DATE)`),
    image: text("image", { length: 255 }),
    role: text("role", { length: 255 }),
    state: text("state", { length: 255 }).default("Activo"),
  },
  (user) => ({
    roleIdx: index("role_idx").on(user.id),
  }),
);

export const accounts = sqliteTable(
  "account",
  {
    userId: text("userId", { length: 255 }).notNull(),
    type: text("type", { length: 255 }).notNull(),
    provider: text("provider", { length: 255 }).notNull(),
    providerAccountId: text("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type", { length: 255 }),
    scope: text("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: text("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
    userIdIdx: index("userId_idxx").on(account.userId),
  }),
);
export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  roles: many(roles),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = sqliteTable(
  "verificationToken",
  {
    identifier: text("identifier", { length: 255 }).notNull(),
    token: text("token", { length: 255 }).notNull(),
    expires: integer("expires", { mode: "timestamp" }),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  }),
);

// export const permissionsRelations = relations(roles, ({ many }) => ({
//   roles: many(roles),
// }));

// many to mant, necesito hacer permissionsToRoles y jugar con eso.
// https://orm.drizzle.team/docs/rqb#many-to-many

export const roles = sqliteTable(
  "roles",
  {
    id: text("identifier", { length: 255 }).notNull(),
    description: text("desription", { length: 255 }),
    createdAt: integer("createdAt").default(sql`(CURRENT_DATE)`),
    updatedAt: integer("updatedAt").default(sql`(CURRENT_DATE)`),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.id),
  }),
);

export const rolesRelations = relations(roles, ({ one, many }) => ({
  user: one(users, { fields: [roles.id], references: [users.role] }),
  rolesToPermissions: many(rolesToPermissions),
}));

export const permissions = sqliteTable(
  "permissions",
  {
    id: text("identifier", { length: 255 }).notNull(),
    description: text("desription", { length: 255 }).notNull(),
    type: text("type", { length: 255 }).notNull(),
    access: text("access", { length: 255 }),
    createdAt: integer("createdAt").default(sql`(CURRENT_DATE)`),
    updatedAt: integer("updatedAt").default(sql`(CURRENT_DATE)`),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.id),
  }),
);

export const permissionsRelations = relations(permissions, ({ many }) => ({
  rolesToPermissions: many(rolesToPermissions),
}));

export const rolesToPermissions = sqliteTable(
  "roles_to_permissions",
  {
    roleId: text("roleId").references(() => roles.id),
    permissionId: text("permissionId").references(() => permissions.id),
  },
  (t) => ({
    compoundKey: primaryKey(t.roleId, t.permissionId),
  }),
);

export const rolesToPermissionsRelations = relations(
  rolesToPermissions,
  ({ one }) => ({
    permissions: one(permissions, {
      fields: [rolesToPermissions.permissionId],
      references: [permissions.id],
    }),
    roles: one(roles, {
      fields: [rolesToPermissions.roleId],
      references: [roles.id],
    }),
  }),
);
