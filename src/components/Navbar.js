import Link from "next/link";
import { Switch } from "@mui/material";

export default function Navbar({ darkMode, toggleDark }) {
  return (
    <header className="bg-white dark:bg-gray-900 shadow py-4 px-6">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 font-poppins">
          🎬 Companion
        </h1>
        <nav className="flex gap-6 text-sm font-medium">
          <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600">
            Acasă
          </Link>
          <Link href="/favorites" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600">
            Filme Salvate
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">Dark</span>
          <Switch checked={darkMode} onChange={toggleDark} />
        </div>
      </div>
    </header>
  );
}