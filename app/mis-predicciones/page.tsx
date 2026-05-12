"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const MAX_PREDICTIONS = 15;

type Champion = {
  name?: string;
  flag?: string;
};

type Prediction = {
  id: string;
  status: string;
  created_at: string;
  submitted_at: string | null;
  prediction_data: {
    champion?: Champion | null;
  } | null;
};

function getStatusInfo(status: string) {
  if (status === "borrador") {
    return {
      label: "Borrador",
      emoji: "📝",
      className: "border-white/10 bg-white/10 text-white/80",
      description: "Todavía podés editar esta predicción.",
    };
  }

  if (status === "en_revision") {
    return {
      label: "Pago pendiente",
      emoji: "⏳",
      className: "border-yellow-300/30 bg-yellow-300/15 text-yellow-200",
      description: "Tu pago está pendiente de validación.",
    };
  }

  if (status === "validada") {
    return {
      label: "Pago validado",
      emoji: "✅",
      className: "border-green-400/30 bg-green-400/15 text-green-300",
      description: "Esta predicción ya está confirmada.",
    };
  }

  if (status === "rechazada") {
    return {
      label: "Rechazada",
      emoji: "❌",
      className: "border-red-400/30 bg-red-400/15 text-red-300",
      description: "Esta predicción no fue validada.",
    };
  }

  return {
    label: status,
    emoji: "ℹ️",
    className: "border-white/10 bg-white/10 text-white/70",
    description: "Estado de la predicción.",
  };
}

function formatFecha(value: string | null) {
  if (!value) return "Sin fecha";

  return new Date(value).toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Flag({ code, name }: { code?: string; name: string }) {
  if (!code) {
    return (
      <div className="flex h-20 w-28 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-4xl">
        🏆
      </div>
    );
  }

  return (
    <img
      src={`https://flagcdn.com/w160/${code.toLowerCase()}.png`}
      alt={name}
      width={112}
      height={80}
      className="h-20 w-28 rounded-2xl object-cover shadow-lg ring-1 ring-white/15"
    />
  );
}

export default function MisPrediccionesPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [predicciones, setPredicciones] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  const usadas = predicciones.length;
  const restantes = Math.max(MAX_PREDICTIONS - usadas, 0);
  const porcentajeUso = useMemo(() => {
    return Math.min((usadas / MAX_PREDICTIONS) * 100, 100);
  }, [usadas]);

  const limiteAlcanzado = usadas >= MAX_PREDICTIONS;

  useEffect(() => {
    async function cargarDatos() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      setUserEmail(user.email ?? null);

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
    <main className="min-h-screen bg-[#060c1a] px-5 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.35em] text-yellow-300/80">
              Perfil
            </p>
            <h1 className="text-4xl font-black text-yellow-300 md:text-5xl">
              MIS PREDICCIONES
            </h1>
          </div>

          <a
            href="/"
            className="rounded-full border border-white/10 bg-white/5 px-6 py-3 font-bold text-white/80 transition hover:bg-white/10"
          >
            ← Volver al Menú Principal
          </a>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-2xl md:p-7">
          {!userEmail ? (
            <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6">
              <p className="mb-5 text-white/70">No iniciaste sesión todavía.</p>

              <a
                href="/login"
                className="inline-block rounded-full bg-gradient-to-r from-yellow-300 to-orange-400 px-7 py-3 font-black text-black transition hover:scale-[1.02]"
              >
                Iniciar sesión
              </a>
            </div>
          ) : (
            <>
              <div className="mb-6 rounded-3xl border border-white/10 bg-black/20 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-white/60">
                      Sesión iniciada como:{" "}
                      <strong className="text-yellow-300">{userEmail}</strong>
                    </p>

                    <p className="mt-2 text-sm text-white/45">
                      Podés tener hasta {MAX_PREDICTIONS} predicciones por cuenta.
                    </p>
                  </div>

                  <div
                    className={`rounded-full border px-5 py-3 text-sm font-black ${
                      limiteAlcanzado
                        ? "border-red-400/30 bg-red-400/15 text-red-300"
                        : "border-yellow-300/20 bg-yellow-300/10 text-yellow-200"
                    }`}
                  >
                    {usadas} / {MAX_PREDICTIONS} predicciones usadas
                  </div>
                </div>

                <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
                  <div
                    className={`h-full rounded-full transition-all ${
                      limiteAlcanzado
                        ? "bg-red-400"
                        : "bg-gradient-to-r from-yellow-300 to-orange-400"
                    }`}
                    style={{ width: `${porcentajeUso}%` }}
                  />
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm">
                  {limiteAlcanzado ? (
                    <p className="font-bold text-red-300">
                      Límite alcanzado. Ya usaste las {MAX_PREDICTIONS} predicciones disponibles.
                    </p>
                  ) : (
                    <p className="text-white/50">
                      Te quedan <strong className="text-yellow-300">{restantes}</strong> predicciones disponibles.
                    </p>
                  )}

                  {!limiteAlcanzado && (
                    <a
                      href="/prediccion"
                      className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 font-black text-cyan-200 transition hover:bg-cyan-400/20"
                    >
                      Crear otra predicción
                    </a>
                  )}
                </div>
              </div>

              {loading ? (
                <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-white/60">
                  Cargando predicciones...
                </div>
              ) : predicciones.length === 0 ? (
                <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-5 text-white/70">
                  Todavía no tenés predicciones guardadas.
                </div>
              ) : (
                <div className="grid gap-5">
                  {predicciones.map((prediccion, index) => {
                    const champion = prediccion.prediction_data?.champion;
                    const championName = champion?.name ?? "Sin definir";
                    const championFlag = champion?.flag;
                    const statusInfo = getStatusInfo(prediccion.status);
                    const editable = prediccion.status === "borrador";

                    return (
                      <div
                        key={prediccion.id}
                        className="overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.07] to-black/30 shadow-xl"
                      >
                        <div className="flex flex-col gap-5 p-5 md:flex-row md:items-center md:justify-between md:p-6">
                          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                            <Flag code={championFlag} name={championName} />

                            <div>
                              <p className="mb-1 text-sm font-bold uppercase tracking-[0.25em] text-white/40">
                                Predicción #{predicciones.length - index}
                              </p>

                              <h2 className="text-3xl font-black leading-tight text-white md:text-4xl">
                                {championName}
                              </h2>

                              <p className="mt-2 text-sm text-white/50">
                                Campeón elegido
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col gap-3 md:items-end">
                            <span
                              className={`inline-flex w-fit items-center gap-2 rounded-full border px-5 py-3 text-sm font-black ${statusInfo.className}`}
                            >
                              <span>{statusInfo.emoji}</span>
                              {statusInfo.label}
                            </span>

                            <p className="max-w-xs text-sm text-white/50 md:text-right">
                              {statusInfo.description}
                            </p>
                          </div>
                        </div>

                        <div className="grid gap-3 border-t border-white/10 bg-black/20 p-5 text-sm text-white/55 md:grid-cols-3 md:p-6">
                          <div>
                            <span className="block text-white/35">Creada</span>
                            <strong className="text-white/80">
                              {formatFecha(prediccion.created_at)}
                            </strong>
                          </div>

                          <div>
                            <span className="block text-white/35">Enviada</span>
                            <strong className="text-white/80">
                              {formatFecha(prediccion.submitted_at)}
                            </strong>
                          </div>

                          <div className="flex items-end gap-3 md:justify-end">
                            {editable ? (
                              <a
                                href="/prediccion"
                                className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-3 font-black text-cyan-200 transition hover:bg-cyan-400/20"
                              >
                                Editar predicción
                              </a>
                            ) : (
                              <span className="rounded-full border border-white/10 bg-white/5 px-5 py-3 font-black text-white/45">
                                🔒 No editable
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
