import { MongoClient } from "mongodb";

const uri = process.env.NEXT_ATLAS_URI;
const dbName = process.env.NEXT_ATLAS_DATABASE;

let client;
let db;

export async function getCollection(collectionName) {
  if (!client || !client.isConnected?.()) {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
  }

  return db.collection(collectionName);
}
