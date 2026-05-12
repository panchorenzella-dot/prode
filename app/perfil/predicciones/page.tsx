"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Prediction = {
  id: string;
  status: string;
  created_at: string;
  submitted_at: string | null;
  prediction_data: {
    champion?: {
      name?: string;
    };
  };
};

export default function PrediccionesPage() {
  const [predicciones, setPredicciones] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  async function cerrarSesion() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  useEffect(() => {
    async function cargarPredicciones() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      const { data, error } = await supabase
        .from("predictions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error cargando predicciones:", error.message);
      } else {
        setPredicciones(data ?? []);
      }

      setLoading(false);
    }

    cargarPredicciones();
  }, []);

  return (
    <main className="min-h-screen bg-[#060c1a] text-white px-5 py-8">
      <div className="max-w-6xl mx-auto grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 h-fit">
          <h2 className="text-2xl font-black text-yellow-300 mb-6">
            TU PERFIL
          </h2>
<a
  href="/"
  className="mb-4 block rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-center font-black text-cyan-200"
>
  ← Volver al Menú Principal
</a>
          <nav className="space-y-3">
            <a
              href="/perfil/datos-personales"
              className="block rounded-2xl bg-white/5 px-4 py-3 font-bold text-white/70"
            >
              Datos personales
            </a>

            <a
              href="/perfil/resumen"
              className="block rounded-2xl bg-white/5 px-4 py-3 font-bold text-white/70"
            >
              Resumen
            </a>

            <a
              href="/perfil/predicciones"
              className="block rounded-2xl bg-yellow-300 px-4 py-3 font-black text-black"
            >
              Predicciones
            </a>

            <a
              href="/perfil/transacciones"
              className="block rounded-2xl bg-white/5 px-4 py-3 font-bold text-white/70"
            >
              Transacciones
            </a>
          </nav>

          <button
            onClick={cerrarSesion}
            className="mt-8 w-full rounded-full border border-red-400/20 bg-red-400/10 px-5 py-3 font-black text-red-200"
          >
            Cerrar sesión
          </button>
        </aside>

        <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
          <div className="flex items-center justify-between gap-4 flex-wrap mb-8">
            <div>
              <p className="text-sm text-cyan-300 mb-2">Predicciones</p>

              <h1 className="text-5xl font-black text-yellow-300">
                Mis predicciones
              </h1>
            </div>

            <a
              href="/prediccion"
              className="rounded-full bg-gradient-to-r from-yellow-300 to-orange-400 px-7 py-3 font-black text-black"
            >
              Nueva predicción
            </a>
          </div>

          {loading ? (
            <div className="rounded-3xl border border-white/10 bg-black/20 p-6 text-white/55">
              Cargando predicciones...
            </div>
          ) : predicciones.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-black/20 p-6 text-white/55">
              Todavía no tenés predicciones guardadas.
            </div>
          ) : (
            <div className="grid gap-4">
              {predicciones.map((prediccion, index) => (
                <div
                  key={prediccion.id}
                  className="rounded-3xl border border-white/10 bg-black/20 p-6"
                >
                  <div className="flex justify-between gap-4 flex-wrap">
                    <div>
                      <h2 className="text-2xl font-black text-yellow-300">
                        Predicción #{predicciones.length - index}
                      </h2>

                      <p className="text-white/50 mt-2">
                        Creada:{" "}
                        {new Date(prediccion.created_at).toLocaleString(
                          "es-AR"
                        )}
                      </p>

                      <p className="text-white/50">
                        Campeón:{" "}
                        <strong className="text-white">
                          {prediccion.prediction_data?.champion?.name ??
                            "Sin definir"}
                        </strong>
                      </p>
                    </div>

                    <span
  className={`h-fit rounded-full px-5 py-2 text-sm font-black tracking-wide ${
    prediccion.status === "validada"
      ? "bg-green-500/20 text-green-300 border border-green-400/30"
      : prediccion.status === "rechazada"
      ? "bg-red-500/20 text-red-300 border border-red-400/30"
      : "bg-yellow-400/20 text-yellow-200 border border-yellow-300/30"
  }`}
>
  {prediccion.status === "validada"
    ? "✅ ACEPTADA"
    : prediccion.status === "rechazada"
    ? "❌ RECHAZADA"
    : "⏳ EN REVISIÓN"}
</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}