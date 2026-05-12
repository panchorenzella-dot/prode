"use client";

import { useEffect } from "react";

export default function PerfilPrediccionesRedirect() {
  useEffect(() => {
    window.location.href = "/mis-predicciones";
  }, []);

  return (
    <main className="min-h-screen bg-[#060c1a] text-white flex items-center justify-center px-5">
      <div className="text-center">
        <h1 className="text-2xl font-black text-yellow-300 mb-3">
          Redirigiendo...
        </h1>
        <p className="text-white/60">
          Te estamos llevando a tus predicciones.
        </p>
      </div>
    </main>
  );
}