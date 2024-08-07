import { relations, sql } from "drizzle-orm";
import {
  text,
  integer,
  primaryKey,
  real,
  sqliteTableCreator,
} from "drizzle-orm/sqlite-core";
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
    id: integer("id").primaryKey().primaryKey({ autoIncrement: true }),
    confirm: integer("confirm", { mode: "boolean" }).default(false),
    confirmedAt: text("confirmedAt").default(sql`(CURRENT_DATE)`),
    client: text("client", { length: 255 }),
    amount: integer("amount"),
    nReserve: integer("nReserve"),
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
export const reservasToClients = sqliteTable(
  "test_reservasToClients",
  {
    identifier: integer("id").primaryKey({ autoIncrement: true }),
    clientId: integer("clientId"),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier),
  }),
);
export const reservasToClientsRelations = relations(
  reservasToClients,
  ({ one }) => ({
    clients: one(clients, {
      fields: [reservasToClients.clientId],
      references: [clients.identifier],
    }),
  }),
);
export const reservas = sqliteTable(
  "test_reservas",
  {
    identifier: text("identifier", { length: 255 }),
    NroSerie: text("NroSerie", { length: 255 }),
    IdSize: integer("IdSize"),
    IdBox: integer("IdBox"),
    IdFisico: integer("IdFisico"),
    Token1: integer("Token1"),
    FechaCreacion: text("FechaCreacion", { length: 255 }),
    FechaInicio: text("FechaInicio", { length: 255 }),
    FechaFin: text("FechaFin", { length: 255 }),
    Contador: integer("Contador"),
    Confirmado: integer("Confirmado", { mode: "boolean" }).default(false),
    Modo: text("Modo", { length: 255 }),
    Cantidad: integer("Cantidad"),
    IdTransaction: integer("IdTransaction"),
    client: text("client", { length: 255 }),
    nReserve: integer("nReserve"),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier),
  }),
);

export const reservasRelations = relations(reservas, ({ one }) => ({
  clients: one(clients, {
    fields: [reservas.client],
    references: [clients.email],
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

export const cuponesData = sqliteTable(
  "test_cupones",
  {
    identifier: text("identifier", { length: 255 }).notNull(),
    codigo: text("codigo", { length: 255 }),
    tipo_descuento: text("tipo_descuento", { length: 255 }),
    valor_descuento: real("valor_descuento"),
    cantidad_usos: real("cantidad_usos"),
    fecha_desde: text("fecha_desde"),
    fecha_hasta: text("fecha_hasta"),
    usos: real("usos"),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier),
  }),
);
