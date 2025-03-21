import { eq, inArray } from "drizzle-orm";
import { Payment } from "mercadopago";
import { NextResponse } from "next/server";
import crypto from "node:crypto";
import type { PrivateConfigKeys } from "~/lib/config";
import { getMpClient } from "~/server/api/routers/mp";
import { db, schema } from "~/server/db";

function validateHmac(xSignature: string, xRequestId: string, secretKey: string): boolean {
  // Obtain Query params related to the request URL
  const urlParams = new URLSearchParams(window.location.search);
  const dataID = urlParams.get('data.id');

  // Separating the x-signature into parts
  const parts = xSignature.split(',');

  // Initializing variables to store ts and hash
  let ts;
  let hash;

  // Iterate over the values to obtain ts and v1
  parts.forEach(part => {
      // Split each part into key and value
      const [key, value] = part.split('=');
      if (key && value) {
          const trimmedKey = key.trim();
          const trimmedValue = value.trim();
          if (trimmedKey === 'ts') {
              ts = trimmedValue;
          } else if (trimmedKey === 'v1') {
              hash = trimmedValue;
          }
      }
  });

  // Obtain the secret key for the user/application from Mercadopago developers site
  const secret = secretKey;

  // Generate the manifest string
  const manifest = `id:${dataID};request-id:${xRequestId};ts:${ts};`;

  // Create an HMAC signature
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(manifest);

  // Obtain the hash result as a hexadecimal string
  const sha = hmac.digest('hex');
  return sha === hash;
}

export async function POST(request: Request) {
  const xSignature = request.headers.get("x-signature");
  const xRequestId = request.headers.get("x-request-id");

  const claveConfigMp: PrivateConfigKeys = 'mercadopaco_private_key';
  const claveMp = await db.query.privateConfig.findFirst({
    where: eq(schema.privateConfig.key, claveConfigMp)
  });

  if (!claveMp) {
    console.error('No está configurada la clave privada de mercado pago');
    return NextResponse.json(null, { status: 502 });
  }

  if (!validateHmac(xSignature ?? "", xRequestId ?? "", claveMp.value)) {
    console.error("api mp firma invalida");
    return NextResponse.json(null, { status: 400 });
  }

  const res = await request.json() as object;
  if (typeof res !== 'object') {
    console.error("api mp res no es object");
    return NextResponse.json(null, { status: 400 });
  }

  const body: {
    data?: {
      id?: string
    },
    type?: "payment"
  } = res;

  if (!body.data?.id) {
    console.error("api mp !body.data.id", body);
    return NextResponse.json(null, { status: 400 });
  } else if (body.type !== 'payment') {
    console.error("api mp type is not payment", body);
    return NextResponse.json(null, { status: 400 });
  }

  const mp = getMpClient(claveMp.value);
  const payment = await new Payment(mp).get({id: body.data.id});
  const meta: {
    IdTransactions?: number[],
  } = payment.metadata as object;
  const trans = (meta.IdTransactions ?? []).filter(v => typeof v === 'number');

  if (meta.IdTransactions && Array.isArray(meta.IdTransactions) && payment.status === "approved") {
    console.log("recibido WH pago procesado", payment);
    if (trans.length > 0) {
      await db.update(schema.reservas)
        .set({ mpPagadoOk: 1 })
        .where(inArray(schema.reservas.IdTransaction, trans));
    } else {
      console.error("recibido WH pago sin reservas");
    }
  } else {
    console.log("recibido WH pago no procesado", payment);
  }

  return new Response(null, {status: 200});
}
