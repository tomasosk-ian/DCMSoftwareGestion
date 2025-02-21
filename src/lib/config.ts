export const PublicConfigClaves = {
  "metodo_pago": "Configuración de método de pago. Opciones: mercadopago, mobbex",
  "mercadopago_public_key": "Clave pública de Mercado Pago",
}

export enum PublicConfigMetodoPago {
  mercadopago = "mercadopago",
  mobbex = "mobbex"
}

export type PublicConfigKeys = keyof typeof PublicConfigClaves;

export const PrivateConfigClaves = {
  "mercadopaco_private_key": "Clave privada de Mercado Pago",
}

export type PrivateConfigKeys = keyof typeof PrivateConfigClaves;
