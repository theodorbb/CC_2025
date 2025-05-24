const moodToGenre = {
  "trist": "drama",
  "fericit": "comedy",
  "plictisit": "action",
  "romantic": "romance",
  "nervos": "thriller",
  "curios": "documentary",
  "visător": "fantasy",
  "leneș": "animation",
  "anxios": "mystery",
  "nostalgic": "drama",
  "motivat": "adventure",
  "relaxat": "family",
  "euforic": "musical",
  "obosit": "romance",
  "singur": "romance",
  "îndrăgostit": "romance",
  "disperat": "thriller",
  "energetic": "action",
  "rebel": "crime",
  "ciudat": "fantasy",
  "gânditor": "documentary",
  "focusat": "mystery",
  "speriat": "horror",
  "încrezător": "adventure",
  "calm": "animation",
  "confuz": "mystery",
  "dezamăgit": "drama",
  "melancolic": "drama",
  "hiperactiv": "comedy",
  "creativ": "fantasy",
  "entuziasmat": "adventure"
};

const genreMap = {
  action: 28,
  comedy: 35,
  drama: 18,
  horror: 27,
  romance: 10749,
  thriller: 53,
  documentary: 99,
  animation: 16,
  crime: 80,
  mystery: 9648,
  fantasy: 14,
  adventure: 12,
  musical: 10402,
  family: 10751
};

export default async function handler(req, res) {
  const { genre: rawGenre, mood, seen } = req.query;
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Cheia TMDB lipsește" });
  }

  try {
    let genre = rawGenre;

    if (!genre && mood) {
      const moodKey = mood.trim().toLowerCase();
      genre = moodToGenre[moodKey] || "drama";
    }

    const genreId = genreMap[genre?.toLowerCase()];
    let movies = [];

    if (seen) {
      const seenList = seen.split(",").map((s) => s.trim());
      for (const title of seenList) {
        const searchRes = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(title)}&language=ro-RO`);
        const searchData = await searchRes.json();
        const movie = searchData.results?.[0];

        if (movie) {
          const similarRes = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/similar?api_key=${apiKey}&language=ro-RO`);
          const similarData = await similarRes.json();
          if (similarData.results) {
            movies.push(...similarData.results);
          }
        }
      }
    }

    if (movies.length < 5 && genreId) {
      const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}&language=en-EN&sort_by=popularity.desc&page=1`;
      const response = await fetch(url);
      const data = await response.json();
      movies.push(...data.results);
    }

    const recommendations = await Promise.all(
      movies
        .filter((movie) => movie.overview && movie.overview.trim() !== "")
        .slice(0, 10)
        .map(async (movie) => {
          const videoRes = await fetch(
            `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${apiKey}&language=en-EN`
          );
          const videoData = await videoRes.json();
          const trailer = videoData.results?.find(
            (v) => v.type === "Trailer" && v.site === "YouTube"
          );
    
          return {
            id: movie.id,
            title: movie.title,
            overview: movie.overview,
            image: movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : null,
            rating: movie.vote_average,
            trailerUrl: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null,
          };
        })
    );
    

    res.status(200).json({ movies: recommendations });
  } catch (error) {
    console.error("Eroare la generarea recomandărilor:", error);
    res.status(500).json({ error: "Eroare internă", details: error.message });
  }
}
