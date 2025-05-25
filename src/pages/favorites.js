import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-hot-toast";
import Layout from "@/components/Layout";

export default function Favorites() {
  const { user } = useUser();
  const userId = user?.id;

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    if (!userId) return;

    const res = await fetch(`/api/favorites?userId=${userId}`);
    const data = await res.json();
    setFavorites(data.favorites || []);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    const res = await fetch("/api/favorites", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, userId }),
    });

    if (res.ok) loadFavorites();
    else toast.error("Eroare la ștergere.");
  };

  useEffect(() => {
    loadFavorites();
  }, [userId]);

  if (!userId) return null;

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">🎬 Filme favorite</h1>
      {loading ? (
        <p className="text-center text-gray-600">Se încarcă...</p>
      ) : favorites.length === 0 ? (
        <p className="text-center text-gray-600">Nu ai salvat încă niciun film.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((movie) => (
            <div key={movie.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden">
              {movie.image && <img src={movie.image} alt={movie.title} className="w-full h-72 object-cover" />}
              <div className="p-4">
                <h2 className="text-xl font-bold text-gray-800">{movie.title}</h2>
                <p className="text-sm text-gray-500 mb-2">⭐ {movie.rating}/10</p>
                <p className="text-sm text-gray-700">{movie.overview}</p>
                <button onClick={() => handleDelete(movie.id)} className="mt-3 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm">
                  Șterge din favorite
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
