import Link from "next/link";
import { UserButton, SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function Layout({ children }) {
  const { user } = useUser();
  const userId = user?.id;
  const [favoritesCount, setFavoritesCount] = useState(0);

  useEffect(() => {
    const loadCount = async () => {
      if (!userId) return;
      const res = await fetch(`/api/favorites?userId=${userId}`);
      const data = await res.json();
      setFavoritesCount(data.favorites.length);
    };
    loadCount();
  }, [userId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-100 text-gray-900 font-poppins">
      <header className="bg-white shadow py-5 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-bold text-indigo-700 flex items-center gap-2">
            🎬 <span>Companion</span>
          </h1>

          <div className="flex items-center gap-6">
            <nav className="flex gap-6 text-base font-medium">
              <Link href="/" className="hover:text-indigo-600">Acasă</Link>
              <Link href="/search" className="hover:text-indigo-600">Caută</Link>
              <SignedIn>
                <Link href="/favorites" className="hover:text-indigo-600">
                  Filme Salvate {favoritesCount > 0 && `(${favoritesCount})`}
                </Link>
              </SignedIn>
            </nav>
            
            <div className="flex items-center gap-3">
              <SignedIn>
                <UserButton redirectUrl="/" />
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-xl shadow transition">
                    🔐 Intră în cont
                  </button>
                </SignInButton>

              </SignedOut>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto p-6 pt-10">
        {children}
      </main>
    </div>
  );
}
