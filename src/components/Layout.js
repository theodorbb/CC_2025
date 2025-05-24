import { useEffect, useState } from "react";
import { Switch } from "@mui/material";
import Link from "next/link";

export default function Layout({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("dark") === "true";
    document.documentElement.classList.toggle("dark", saved);
    setDarkMode(saved);
  }, []);

  const toggleDark = () => {
    const newState = !darkMode;
    setDarkMode(newState);
    document.documentElement.classList.toggle("dark", newState);
    localStorage.setItem("dark", newState);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 font-poppins">
      <header className="bg-white dark:bg-gray-900 shadow py-5 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 text-center sm:text-left">
            🎬 Companion
          </h1>
          <nav className="flex flex-wrap justify-center gap-6 text-base font-medium">
            <Link href="/" className="hover:text-indigo-500 dark:hover:text-indigo-300">Acasă</Link>
            <Link href="/favorites" className="hover:text-indigo-500 dark:hover:text-indigo-300">Filme Salvate</Link>
          </nav>
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm">Dark</span>
            <Switch checked={darkMode} onChange={toggleDark} />
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto p-6 pt-10">
        {children}
      </main>
    </div>
  );
}
