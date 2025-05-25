import { getCollection } from "../../../utils/functions";

const COLLECTION_NAME = "favorites";

export default async function handler(req, res) {
  const collection = await getCollection(COLLECTION_NAME);

  if (req.method === "GET") {
    const { userId } = req.query;
    if (!userId) return res.status(401).json({ message: "Missing userId" });

    const favorites = await collection.find({ userId }).toArray();
    return res.status(200).json({ favorites });
  }

  if (req.method === "POST") {
    const { userId, ...movie } = req.body;
    if (!userId) return res.status(401).json({ message: "Missing userId" });

    const existing = await collection.findOne({ userId, id: movie.id });
    if (existing) {
      return res.status(400).json({ message: "Filmul este deja salvat" });
    }

    await collection.insertOne({ ...movie, userId });
    return res.status(201).json({ message: "Salvat cu succes" });
  }

  if (req.method === "DELETE") {
    const { id, userId } = req.body;
    if (!userId) return res.status(401).json({ message: "Missing userId" });

    await collection.deleteOne({ userId, id });
    return res.status(200).json({ message: "Șters cu succes" });
  }

  return res.status(405).json({ message: "Metodă neacceptată" });
}
