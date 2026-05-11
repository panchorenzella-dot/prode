"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function MisPrediccionesPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    async function cargarUsuario() {
      const { data } = await supabase.auth.getUser();
      setUserEmail(data.user?.email ?? null);
    }

    cargarUsuario();
  }, []);

  return (
    <main className="min-h-screen bg-[#060c1a] text-white px-5 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center gap-4 flex-wrap mb-10">
          <h1 className="text-yellow-300 font-black text-4xl">
            MIS PREDICCIONES
          </h1>

          <a href="/" className="rounded-full border border-white/10 bg-white/5 px-6 py-3 font-bold text-white/80">
            ← Volver al Menú Principal
          </a>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-6">
          {userEmail ? (
            <>
              <p className="text-white/60 mb-5">
                Sesión iniciada como: <strong className="text-yellow-300">{userEmail}</strong>
              </p>

              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-5 text-white/70">
                Todavía no tenés predicciones guardadas.
              </div>
            </>
          ) : (
            <>
              <p className="text-white/60 mb-5">
                No iniciaste sesión todavía.
              </p>

              <a
                href="/login"
                className="inline-block rounded-full bg-gradient-to-r from-yellow-300 to-orange-400 px-7 py-3 font-black text-black"
              >
                Iniciar sesión
              </a>
            </>
          )}
        </div>
      </div>
    </main>
  );
}