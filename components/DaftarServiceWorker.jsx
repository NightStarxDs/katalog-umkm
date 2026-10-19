"use client";

import { useEffect } from "react";

export default function DaftarServiceWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .catch((err) =>
          console.warn("Pendaftaran service worker gagal:", err)
        );
    }
  }, []);

  return null;
}

