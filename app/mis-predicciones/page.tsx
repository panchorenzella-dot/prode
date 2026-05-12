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

export default function MisPrediccionesPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [predicciones, setPredicciones] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarDatos() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUserEmail(user?.email ?? null);

      if (!user) {
        setLoading(false);
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

    cargarDatos();
  }, []);

  return (
    <main className="min-h-screen bg-[#060c1a] text-white px-5 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center gap-4 flex-wrap mb-10">
          <h1 className="text-yellow-300 font-black text-4xl">
            MIS PREDICCIONES
          </h1>

          <a
            href="/"
            className="rounded-full border border-white/10 bg-white/5 px-6 py-3 font-bold text-white/80"
          >
            ← Volver al Menú Principal
          </a>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-6">
          {!userEmail ? (
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
          ) : (
            <>
              <p className="text-white/60 mb-5">
                Sesión iniciada como:{" "}
                <strong className="text-yellow-300">{userEmail}</strong>
              </p>

              {loading ? (
                <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-white/60">
                  Cargando predicciones...
                </div>
              ) : predicciones.length === 0 ? (
                <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-5 text-white/70">
                  Todavía no tenés predicciones guardadas.
                </div>
              ) : (
                <div className="grid gap-4">
                  {predicciones.map((prediccion, index) => (
                    <div
                      key={prediccion.id}
                      className="rounded-2xl border border-white/10 bg-black/20 p-5"
                    >
                      <div className="flex justify-between gap-4 flex-wrap">
                        <div>
                          <h2 className="text-xl font-black text-yellow-300">
                            Predicción #{predicciones.length - index}
                          </h2>

                          <p className="text-white/50 text-sm mt-1">
                            Creada:{" "}
                            {new Date(prediccion.created_at).toLocaleString(
                              "es-AR"
                            )}
                          </p>

                          <p className="text-white/50 text-sm">
                            Campeón:{" "}
                            <strong className="text-white">
                              {prediccion.prediction_data?.champion?.name ??
                                "Sin definir"}
                            </strong>
                          </p>
                        </div>

                        <span className="h-fit rounded-full bg-yellow-300 px-4 py-2 text-sm font-black text-black">
                          {prediccion.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}