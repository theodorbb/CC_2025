import { ClerkProvider } from "@clerk/nextjs";
import "@/styles/globals.css";
import { Toaster } from "react-hot-toast";


export default function App({ Component, pageProps }) {
  return (
    <ClerkProvider>
      <Component {...pageProps} />
      <Toaster position="top-right" />
    </ClerkProvider>
  );
}
