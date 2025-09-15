import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { dbConnect, toObject } from "@/lib/mongoose";
import { HomeSettings } from "@/lib/models/HomeSettings";

const Btn = z.object({ label: z.string().optional(), href: z.string().optional(), isModal: z.boolean().optional() });
const Slide = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  headline: z.string().optional(),
  sub: z.string().optional(),
  imageUrl: z.string().optional(),
  image: z.string().optional(),
  primaryButton: Btn.optional(),
  secondaryButton: Btn.optional(),
});
const Item = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  href: z.string().optional(),
  icon: z.string().optional(),
  name: z.string().optional(),
  logoUrl: z.string().optional(),
  stat: z.string().optional(),
  statLabel: z.string().optional(),
  number: z.string().optional(),
  step: z.string().optional(),
  year: z.string().optional(),
  organization: z.string().optional(),
  color: z.string().optional(),
  city: z.string().optional(),
  category: z.string().optional(),
  country: z.string().optional(),
  universityLogoUrl: z.string().optional(),
});
const Section = z.object({ title: z.string().optional(), contentMD: z.string().optional(), imageUrl: z.string().optional(), items: z.array(Item).optional(), enabled: z.boolean().optional() });

const schema = z.object({
  heroSlider: z.array(Slide).optional(),
  transformSection: Section.optional(),
  servicesSection: Section.optional(),
  destinationsSection: Section.optional(),
  fiveStepsSection: Section.optional(),
  whyChooseSection: Section.optional(),
  awardsSection: Section.optional(),
  partnersSection: Section.optional(),
  successStoriesSection: Section.optional(),
  insightsSection: Section.optional(),
  upcomingEventsSection: Section.optional(),
});

async function getSingleton() {
  await dbConnect();
  let doc = await HomeSettings.findOne({}).lean();
  if (!doc) {
    const created = await HomeSettings.create({});
    doc = created.toObject();
  }
  return doc;
}

export async function GET() {
  try {
    const doc = await getSingleton();
    return NextResponse.json({ settings: toObject(doc as { _id: unknown }) });
  } catch (e) {
    console.error(e); return NextResponse.json({ error: "Failed to load home settings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect(); const json = await req.json();
    const parsed = schema.safeParse(json.settings || json);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    const doc = await HomeSettings.findOneAndUpdate({}, parsed.data, { upsert: true, new: true }).lean();
    return NextResponse.json({ settings: toObject(doc as unknown as { _id: unknown }) });
  } catch (e) { console.error(e); return NextResponse.json({ error: "Failed to save home settings" }, { status: 500 }); }
}
