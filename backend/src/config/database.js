import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URL || "mongodb://mongo:27017/pagerduty";
const client = new MongoClient(uri);
const dbName = process.env.MONGODB_DATABASE;

let db;

export async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db(dbName);
    console.log(`✅ Connected to MongoDB: ${dbName}`);
  }
  return db;
}

export async function closeDB() {
  await client.close();
  db = null;
}
