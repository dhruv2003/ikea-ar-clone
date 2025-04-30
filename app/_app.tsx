import "styles/globals.css";
import { useEffect } from "react";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js");
    }
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;