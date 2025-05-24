import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-100 text-gray-900 font-poppins">
      <header className="bg-white shadow py-5 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold text-indigo-700 text-center sm:text-left">
            🎬 Companion
          </h1>
          <div className="flex items-center gap-4">
              <nav className="flex gap-6 text-base font-medium">
                <Link href="/" className="hover:text-indigo-600">Acasă</Link>
                <SignedIn>
                  <Link href="/favorites" className="hover:text-indigo-600">Filme Salvate</Link>
                </SignedIn>
              </nav>
              <div className="flex items-center gap-3">
                <SignedIn>
                  <UserButton redirectUrl="/" />
                </SignedIn>
                <SignedOut>
                  <SignInButton />
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

