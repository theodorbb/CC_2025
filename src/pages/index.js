import { useState } from "react";
import Layout from "@/components/Layout";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-hot-toast";

const moodList = ["trist", "fericit", "plictisit", "romantic", "nervos", "curios", "visător", "leneș", "anxios", "nostalgic", "motivat", "relaxat", "euforic", "obosit", "singur", "îndrăgostit", "disperat", "energetic", "rebel", "ciudat", "gânditor", "focusat", "speriat", "încrezător", "calm", "confuz", "dezamăgit", "melancolic", "hiperactiv", "creativ", "entuziasmat"];

export default function Home() {
  const { user } = useUser();
  const userId = user?.id;

  const [genre, setGenre] = useState("");
  const [mood, setMood] = useState("");
  const [seen, setSeen] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [moodSuggestions, setMoodSuggestions] = useState([]);

  const genreOptions = [
    { label: "Acțiune", value: "action" },
    { label: "Comedie", value: "comedy" },
    { label: "Dramă", value: "drama" },
    { label: "Horror", value: "horror" },
    { label: "Romantic", value: "romance" },
    { label: "Thriller", value: "thriller" },
    { label: "Documentar", value: "documentary" },
    { label: "Animație", value: "animation" },
    { label: "Crimă", value: "crime" },
  ];

  const handleMoodInput = (value) => {
    setMood(value);
    const suggestions = moodList.filter((m) => m.toLowerCase().startsWith(value.toLowerCase()));
    setMoodSuggestions(suggestions);
  };

  const validateMood = () => mood.trim() === "" || moodList.includes(mood.toLowerCase());

  const handleSubmit = async () => {
    if (!genre && !mood && !seen) {
      toast.error("Te rugăm să alegi cel puțin un filtru pentru recomandări.");
      return;
    }

    if (!validateMood()) return alert("Introduceți o stare validă.");
    setLoading(true);
    const params = new URLSearchParams();
    if (genre) params.append("genre", genre);
    if (mood) params.append("mood", mood);
    if (seen) params.append("seen", seen);

    const res = await fetch(`/api/recommendations?${params.toString()}`);
    const data = await res.json();
    setMovies(data.movies || []);
    setLoading(false);
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">Hai să găsim un film potrivit!</h1>

      <div className="bg-white p-6 rounded-2xl shadow-lg space-y-6">
        <div>
          <label className="block font-medium mb-1">Gen preferat</label>
          <select className="w-full border p-3 rounded-lg" value={genre} onChange={(e) => setGenre(e.target.value)}>
            <option value="">Selectează un gen (opțional)</option>
            {genreOptions.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Cum te simți?</label>
          <input type="text" className="w-full border p-3 rounded-lg" placeholder="Ex: trist, plictisit, entuziasmat..." value={mood} onChange={(e) => handleMoodInput(e.target.value)} list="mood-options" />
          <datalist id="mood-options">
            {moodSuggestions.map((m, i) => <option key={i} value={m} />)}
          </datalist>
        </div>

        <div>
          <label className="block font-medium mb-1">Ce filme ai văzut recent?</label>
          <input type="text" className="w-full border p-3 rounded-lg" placeholder="Ex: Titanic, Avatar" value={seen} onChange={(e) => setSeen(e.target.value)} />
        </div>

        <button onClick={handleSubmit} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition">
          Generează recomandări
        </button>
        <button
          onClick={() => {
            setGenre("");
            setMood("");
            setSeen("");
            setMovies([]);
            setMoodSuggestions([]);
          }}
          className="w-full mt-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 rounded-xl transition"
        >
          🔄 Resetează filtrele
        </button>

      </div>

      {loading && <p className="text-center mt-6">Se încarcă recomandările...</p>}
      {!loading && movies.length > 0 && (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-10">
          {movies.map((movie) => (
            <div key={movie.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden">
              {movie.image && <img src={movie.image} alt={movie.title} className="w-full h-72 object-cover" />}
              <div className="p-4">
                <h2 className="text-xl font-bold">{movie.title}</h2>
                <p className="text-sm text-gray-700 mb-2">⭐ {movie.rating}/10</p>
                <p className="text-sm">{movie.overview}</p>

                {movie.trailerUrl && (
                  <a href={movie.trailerUrl} target="_blank" rel="noopener noreferrer" className="mt-2 block text-center bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg text-sm">
                    🎥 Vezi trailer
                  </a>
                )}

                {userId && (
                  <button
                    onClick={async () => {
                      const res = await fetch("/api/favorites", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...movie, userId }),
                      });
                      const data = await res.json();
                      if (res.ok) {
                        toast.success("Adăugat la favorite! ❤️");
                      } else {
                        toast.error(data.message || "Eroare la salvare.");
                      }
                    }}
                    className="mt-3 w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg text-sm"
                  >
                    Salvează ca favorit
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
