import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Layout from "@/components/Layout";

export default function SearchPage() {
  const { user } = useUser();
  const userId = user?.id;

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState([]);

  useEffect(() => {
    const loadFavorites = async () => {
      if (!userId) return;
      const res = await fetch(`/api/favorites?userId=${userId}`);
      const data = await res.json();
      const ids = data.favorites.map((f) => f.id);
      setFavoriteIds(ids);
    };
    loadFavorites();
  }, [userId]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=ro-RO`);
    const data = await res.json();
    setResults(data.results || []);
    setLoading(false);
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">🔍 Caută un film</h1>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Ex: Interstellar, Barbie, Gladiator..."
          className="w-full border p-3 rounded-lg"
        />
        <button
          onClick={handleSearch}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg"
        >
          Caută
        </button>
      </div>

      {loading && <p className="text-center">Se caută...</p>}

      {!loading && results.length > 0 && (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((movie) => (
            <div key={movie.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden">
              {movie.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-72 object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-xl font-bold text-gray-800">{movie.title}</h2>
                <p className="text-sm text-gray-500 mb-2">⭐ {movie.vote_average}/10</p>
                <p className="text-sm text-gray-700">{movie.overview}</p>

                {userId && favoriteIds.includes(movie.id) ? (
                  <button disabled className="mt-3 w-full bg-gray-400 text-white py-2 rounded-lg text-sm">
                    ✔️ Salvat
                  </button>
                ) : (
                  userId && (
                    <button
                      onClick={async () => {
                        const res = await fetch("/api/favorites", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            id: movie.id,
                            title: movie.title,
                            overview: movie.overview,
                            image: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
                            rating: movie.vote_average,
                            userId
                          }),
                        });
                        if (res.ok) {
                          setFavoriteIds((prev) => [...prev, movie.id]);
                        }
                      }}
                      className="mt-3 w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg text-sm"
                    >
                      Salvează ca favorit
                    </button>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
