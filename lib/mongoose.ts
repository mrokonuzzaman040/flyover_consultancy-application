import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL || "";

if (!MONGODB_URI) {
  // Do not throw at import time to avoid breaking build; runtime will check
  console.warn("[db] MONGODB_URI not set. Set it in .env to enable database.");
}

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const globalForMongoose = global as unknown as { mongooseCache?: MongooseCache };

const cache: MongooseCache = globalForMongoose.mongooseCache || { conn: null, promise: null };

export async function dbConnect() {
  if (cache.conn) return cache.conn;

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI env var is required to connect to MongoDB");
  }

  if (!cache.promise) {
    const opts: Parameters<typeof mongoose.connect>[1] = {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      appName: "flyover-admin",
    };
    cache.promise = mongoose.connect(MONGODB_URI, opts).then((m) => m);
  }
  cache.conn = await cache.promise;
  globalForMongoose.mongooseCache = cache;
  return cache.conn;
}

export function toObject<T extends { _id: unknown }>(doc: T): Record<string, unknown> {
  const obj = JSON.parse(JSON.stringify(doc));
  (obj as Record<string, unknown>)["id"] = (obj as Record<string, unknown>)["_id"];
  delete (obj as Record<string, unknown>)["_id"];
  delete (obj as Record<string, unknown>)["__v"];
  return obj as Record<string, unknown>;
}
