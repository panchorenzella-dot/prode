"use client";

import { useEffect, useState } from "react";
import { Trophy, Clock, ChevronRight, Flag, User } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const mundialStart = new Date("2026-06-11T19:00:00Z").getTime();

const grupos = [
  {
    grupo: "Grupo A",
    equipos: ["🇲🇽 México", "🇿🇦 Sudáfrica", "🇰🇷 Corea del Sur", "🇨🇿 República Checa"],
  },
  {
    grupo: "Grupo B",
    equipos: ["🇨🇦 Canadá", "🇧🇦 Bosnia", "🇶🇦 Qatar", "🇨🇭 Suiza"],
  },
  {
    grupo: "Grupo C",
    equipos: ["🇧🇷 Brasil", "🇲🇦 Marruecos", "🇭🇹 Haití", "🏴 Escocia"],
  },
  {
    grupo: "Grupo D",
    equipos: ["🇺🇸 Estados Unidos", "🇵🇾 Paraguay", "🇦🇺 Australia", "🇽🇰 Kosovo"],
  },
];

const llaves = [
  ["1° Grupo A", "2° Grupo B"],
  ["1° Grupo C", "2° Grupo D"],
  ["1° Grupo E", "2° Grupo F"],
  ["1° Grupo G", "2° Grupo H"],
];

export default function HomePage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [perfilAbierto, setPerfilAbierto] = useState(false);

  const [timeLeft, setTimeLeft] = useState({
    dias: 0,
    horas: 0,
    minutos: 0,
    segundos: 0,
  });

  useEffect(() => {
    async function cargarUsuario() {
      const { data } = await supabase.auth.getUser();
      setUserEmail(data.user?.email ?? null);
    }

    cargarUsuario();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = mundialStart - now;

      if (diff <= 0) {
        setTimeLeft({ dias: 0, horas: 0, minutos: 0, segundos: 0 });
        return;
      }

      setTimeLeft({
        dias: Math.floor(diff / (1000 * 60 * 60 * 24)),
        horas: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutos: Math.floor((diff / (1000 * 60)) % 60),
        segundos: Math.floor((diff / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  async function cerrarSesion() {
    await supabase.auth.signOut();
    setUserEmail(null);
    setPerfilAbierto(false);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#07090f] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1f3b57_0%,transparent_35%),radial-gradient(circle_at_80%_20%,#7c5c1e_0%,transparent_25%)] opacity-60" />

      <div className="relative mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-cyan-400 text-black">
              <Trophy size={22} />
            </div>

            <div>
              <p className="text-sm font-semibold leading-none">Prode Mundial</p>
              <p className="text-xs text-white/50">Predicciones 2026</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/prediccion"
              className="hidden rounded-xl bg-white px-4 py-2 text-sm font-bold text-black sm:inline-block"
            >
              Jugar
            </a>

            {userEmail ? (
              <div className="relative">
<a
  href="/perfil"
  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white/85 transition hover:bg-white/10"
>
  <User size={17} />
  Tu perfil
</a>

                {perfilAbierto && (
                  <div className="absolute right-0 z-20 mt-3 w-64 rounded-2xl border border-white/10 bg-[#0b1020] p-4 shadow-2xl">
                    <p className="mb-1 text-xs text-white/40">Sesión iniciada</p>
                    <p className="mb-4 truncate text-sm font-bold text-amber-300">
                      {userEmail}
                    </p>

                    <a
                      href="/mis-predicciones"
                      className="mb-2 block rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white/80 transition hover:bg-white/10"
                    >
                      Mis predicciones
                    </a>

                    <button
                      onClick={cerrarSesion}
                      className="w-full rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-left text-sm font-bold text-red-200 transition hover:bg-red-400/20"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <a
                  href="/register"
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white/80 transition hover:bg-white/10"
                >
                  Registrarse
                </a>

                <a
                  href="/login"
                  className="rounded-xl bg-gradient-to-r from-amber-300 to-cyan-300 px-4 py-2 text-sm font-black text-black transition hover:scale-[1.02]"
                >
                  Iniciar sesión
                </a>
              </div>
            )}
          </div>
        </nav>

        <section className="grid gap-10 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-sm text-amber-200">
              <Clock size={16} />
              México vs Sudáfrica · 11 de junio 2026
            </div>

            <h1 className="max-w-3xl text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
              Armá tu Mundial antes de que empiece.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-white/65">
              Completá los grupos, avanzá selecciones en las llaves y guardá tu
              predicción. Cuando arranque el Mundial, tus puntos se calcularán
              con resultados reales.
            </p>

            <div className="mt-8 grid grid-cols-4 gap-3">
              <CounterBox label="Días" value={timeLeft.dias} />
              <CounterBox label="Horas" value={timeLeft.horas} />
              <CounterBox label="Min" value={timeLeft.minutos} />
              <CounterBox label="Seg" value={timeLeft.segundos} />
            </div>

            <a
              href="/prediccion"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 font-bold text-black transition hover:scale-[1.02]"
            >
              Crear mi predicción
              <ChevronRight size={20} />
            </a>

            <p className="mt-5 text-sm text-white/40">
              Sin datos falsos: el ranking se activa cuando haya usuarios y
              resultados cargados.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-3 backdrop-blur-xl">
            <div className="rounded-[1.5rem] bg-[#0b1020] p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-cyan-300">Simulador</p>
                  <h2 className="text-3xl font-black">Tu predicción</h2>
                </div>

                <Flag className="text-amber-300" size={28} />
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div>
                  <h3 className="mb-3 text-sm font-bold text-white/50">
                    Fase de grupos
                  </h3>

                  <div className="space-y-3">
                    {grupos.map((grupo) => (
                      <div
                        key={grupo.grupo}
                        className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                      >
                        <p className="mb-3 text-sm font-bold text-amber-300">
                          {grupo.grupo}
                        </p>

                        <div className="space-y-2">
                          {grupo.equipos.map((equipo) => (
                            <div
                              key={equipo}
                              className="rounded-xl bg-black/25 px-3 py-2 text-sm text-white/80"
                            >
                              {equipo}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-bold text-white/50">
                    Llaves eliminatorias
                  </h3>

                  <div className="space-y-4">
                    {llaves.map((partido, index) => (
                      <div
                        key={index}
                        className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                      >
                        <p className="mb-3 text-xs font-bold text-cyan-300">
                          16avos · Partido {index + 1}
                        </p>

                        <div className="space-y-2">
                          <div className="rounded-xl bg-black/25 px-3 py-3 text-sm">
                            {partido[0]}
                          </div>

                          <div className="text-center text-xs text-white/35">
                            vs
                          </div>

                          <div className="rounded-xl bg-black/25 px-3 py-3 text-sm">
                            {partido[1]}
                          </div>
                        </div>

                        <button className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white/60">
                          Elegir ganador
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 rounded-2xl bg-gradient-to-br from-amber-400 to-cyan-300 p-4 text-black">
                    <p className="text-sm font-semibold opacity-70">
                      Objetivo
                    </p>
                    <p className="text-2xl font-black">
                      Completar todo el cuadro
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function CounterBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-center">
      <p className="text-3xl font-black">{value}</p>
      <p className="text-xs text-white/45">{label}</p>
    </div>
  );
}