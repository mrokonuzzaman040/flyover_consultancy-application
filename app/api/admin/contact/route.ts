import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { dbConnect, toObject } from "@/lib/mongoose";
import { ContactInfo } from "@/lib/models/ContactInfo";

const OfficeHour = z.object({ day: z.string().optional(), open: z.string().optional(), close: z.string().optional() });
const Social = z.object({ platform: z.string().optional(), url: z.string().optional() });
const schema = z.object({
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  phones: z.array(z.string()).optional(),
  emails: z.array(z.string()).optional(),
  mapEmbedUrl: z.string().optional().nullable(),
  officeHours: z.array(OfficeHour).optional(),
  socials: z.array(Social).optional(),
});

async function getSingleton() {
  await dbConnect();
  let doc = await ContactInfo.findOne({}).lean();
  if (!doc) { const created = await ContactInfo.create({}); doc = created.toObject(); }
  return doc;
}

export async function GET() {
  try { const doc = await getSingleton(); return NextResponse.json({ contact: toObject(doc as { _id: unknown }) }); }
  catch (e) { console.error(e); return NextResponse.json({ error: "Failed to load contact info" }, { status: 500 }); }
}

export async function POST(req: NextRequest) {
  try { await dbConnect(); const json = await req.json(); const parsed = schema.safeParse(json.contact || json);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    const doc = await ContactInfo.findOneAndUpdate({}, parsed.data, { upsert: true, new: true }).lean();
    return NextResponse.json({ contact: toObject(doc as unknown as { _id: unknown }) });
  } catch (e) { console.error(e); return NextResponse.json({ error: "Failed to save contact info" }, { status: 500 }); }
}
