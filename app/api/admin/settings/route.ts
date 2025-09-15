import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { dbConnect, toObject } from "@/lib/mongoose";
import { SystemSetting } from "@/lib/models/SystemSetting";

const SettingsSchema = z.object({
  siteName: z.string().optional(),
  siteDescription: z.string().optional(),
  adminEmail: z.string().email().optional(),
  maxFileSize: z.number().int().positive().optional(),
  allowedFileTypes: z.array(z.string()).optional(),
  enableRegistration: z.boolean().optional(),
  enableEmailVerification: z.boolean().optional(),
  maintenanceMode: z.boolean().optional(),
  cloudinaryCloudName: z.string().optional(),
  cloudinaryApiKey: z.string().optional(),
  smtpHost: z.string().optional(),
  smtpPort: z.number().int().positive().optional(),
  smtpUser: z.string().optional(),
});

async function getSingleton() {
  await dbConnect();
  let doc = await SystemSetting.findOne({}).lean();
  if (!doc) {
    const created = await SystemSetting.create({});
    doc = created.toObject();
  }
  return doc;
}

export async function GET() {
  try {
    const doc = await getSingleton();
    return NextResponse.json({ settings: toObject(doc as { _id: unknown }) });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load settings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const json = await req.json();
    const parsed = SettingsSchema.safeParse(json.settings || json);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    const doc = await SystemSetting.findOneAndUpdate({}, parsed.data, { upsert: true, new: true }).lean();
    return NextResponse.json({ settings: toObject(doc as unknown as { _id: unknown }) });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
