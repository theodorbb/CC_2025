import { getCollection } from "../../../utils/functions";

const COLLECTION_NAME = "favorites";

export default async function handler(req, res) {
  try {
    const collection = await getCollection(COLLECTION_NAME);

    if (req.method === "GET") {
      const all = await collection.find().toArray();
      return res.status(200).json({ favorites: all });
    }

    if (req.method === "POST") {
      const movie = req.body;
      if (!movie.id) return res.status(400).json({ message: "ID lipsă" });

      const existing = await collection.findOne({ id: movie.id });
      if (existing) return res.status(409).json({ message: "Deja există" });

      await collection.insertOne(movie);
      return res.status(201).json({ message: "Salvat cu succes" });
    }

    if (req.method === "DELETE") {
      const { id } = req.body;
      await collection.deleteOne({ id });
      return res.status(200).json({ message: "Șters" });
    }

    return res.status(405).end();
  } catch (err) {
    console.error("EROARE:", err);
    return res.status(500).json({ message: "Eroare internă", error: err.message });
  }
}
