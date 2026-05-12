"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const ADMIN_EMAIL = "panchorenzella@gmail.com";

type Prediction = {
  id: string;
  user_id: string;
  prediction_data: any;
  status: string;
  created_at: string;
};

const ROUND_LABELS: Record<string, string> = {
  r32: "32avos",
  r16: "Octavos",
  qf: "Cuartos",
  sf: "Semifinales",
  final: "Final",
};

const ROUND_ORDER = ["r32", "r16", "qf", "sf", "final"];

function Flag({ code, name, small = false }: { code?: string; name: string; small?: boolean }) {
  if (!code) {
    return (
      <div className={`${small ? "h-6 w-8 text-sm" : "h-14 w-20 text-2xl"} flex items-center justify-center rounded-lg border border-white/10 bg-white/5`}>
        🏆
      </div>
    );
  }

  return (
    <img
      src={`https://flagcdn.com/w160/${code.toLowerCase()}.png`}
      alt={name}
      className={`${small ? "h-6 w-8" : "h-14 w-20"} rounded-lg object-cover ring-1 ring-white/15`}
    />
  );
}

export default function VerPrediccionPage() {
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    async function cargar() {
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
        .eq("id", id)
        .single();

      if (error || !data) {
        setDenied(true);
        setLoading(false);
        return;
      }

      const isOwner = data.user_id === user.id;
      const isAdmin = user.email === ADMIN_EMAIL;

      if (!isOwner && !isAdmin) {
        setDenied(true);
        setLoading(false);
        return;
      }

      setPrediction(data);
      setLoading(false);
    }

    if (!id) {
  setDenied(true);
  setLoading(false);
  return;
}

cargar();
  }, [id]);

  const bracketByRound = useMemo(() => {
    const bracket = prediction?.prediction_data?.bracket ?? [];

    return ROUND_ORDER.map((round) => ({
      round,
      label: ROUND_LABELS[round],
      matches: bracket.filter((match: any) => match.round === round),
    })).filter((item) => item.matches.length > 0);
  }, [prediction]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#060c1a] px-5 py-10 text-white">
        <p className="text-white/60">Cargando predicción...</p>
      </main>
    );
  }

  if (denied || !prediction) {
    return (
      <main className="min-h-screen bg-[#060c1a] px-5 py-10 text-white">
        <div className="rounded-3xl border border-red-400/20 bg-red-400/10 p-6 text-red-200">
          No tenés permiso para ver esta predicción.
        </div>
      </main>
    );
  }

  const champion = prediction.prediction_data?.champion;
  const groups = prediction.prediction_data?.groups ?? [];

  return (
    <main className="min-h-screen bg-[#060c1a] px-5 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.35em] text-yellow-300/80">
              Predicción completa
            </p>
            <h1 className="text-4xl font-black text-yellow-300 md:text-5xl">
              VER PREDICCIÓN
            </h1>
          </div>

          <a
            href="/mis-predicciones"
            className="rounded-full border border-white/10 bg-white/5 px-6 py-3 font-bold text-white/80"
          >
            ← Volver
          </a>
        </div>

        <section className="mb-8 rounded-[30px] border border-yellow-300/20 bg-gradient-to-br from-yellow-300/15 to-white/[0.03] p-6 shadow-2xl">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Flag code={champion?.flag} name={champion?.name ?? "Campeón"} />

              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-white/40">
                  Campeón elegido
                </p>

                <h2 className="mt-1 text-4xl font-black text-white">
                  {champion?.name ?? "Sin definir"}
                </h2>

                <p className="mt-2 text-white/50">Estado: {prediction.status}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-yellow-300/20 bg-yellow-300/10 px-5 py-4 text-yellow-200">
              🏆 Predicción guardada
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-5 text-3xl font-black text-yellow-300">
            Fase de grupos
          </h2>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {groups.map((group: any) => (
              <div
                key={group.id}
                className="overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.04]"
              >
                <div className="border-b border-white/10 bg-white/[0.05] px-5 py-4">
                  <h3 className="text-2xl font-black text-yellow-300">
                    Grupo {group.id}
                  </h3>
                </div>

                <div className="p-4">
                  <div className="grid grid-cols-[40px_1fr_50px] border-b border-white/10 px-3 pb-2 text-xs font-black uppercase tracking-wider text-white/35">
                    <span>Pos</span>
                    <span>Equipo</span>
                    <span className="text-right">Pts</span>
                  </div>

                  <div className="mt-2 space-y-2">
                    {group.standings?.map((standing: any, index: number) => (
                      <div
                        key={standing.team.id}
                        className={`grid grid-cols-[40px_1fr_50px] items-center rounded-xl px-3 py-3 ${
                          index < 2
                            ? "bg-green-400/10"
                            : index === 2
                            ? "bg-yellow-300/10"
                            : "bg-black/20"
                        }`}
                      >
                        <span className="font-black text-yellow-300">
                          {index + 1}°
                        </span>

                        <div className="flex min-w-0 items-center gap-3">
                          <Flag
                            code={standing.team.flag}
                            name={standing.team.name}
                            small
                          />

                          <span className="truncate font-bold text-white">
                            {standing.team.name}
                          </span>
                        </div>

                        <span className="text-right font-black text-cyan-300">
                          {standing.pts}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-5 text-3xl font-black text-yellow-300">
            Llaves eliminatorias
          </h2>

          <div className="overflow-x-auto rounded-[30px] border border-white/10 bg-white/[0.04] p-5">
            <div
              className="grid min-w-[1100px] gap-5"
              style={{
                gridTemplateColumns: `repeat(${bracketByRound.length}, minmax(210px, 1fr))`,
              }}
            >
              {bracketByRound.map((round) => (
                <div key={round.round}>
                  <div className="mb-4 rounded-2xl border border-yellow-300/20 bg-yellow-300/10 px-4 py-3 text-center font-black text-yellow-200">
                    {round.label}
                  </div>

                  <div className="flex flex-col gap-4">
                    {round.matches.map((match: any, index: number) => (
                      <div
                        key={match.id}
                        className="relative rounded-2xl border border-white/10 bg-black/25 p-3"
                        style={{
                          marginTop:
                            round.round === "r16"
                              ? index % 2 === 0
                                ? 28
                                : 0
                              : round.round === "qf"
                              ? index % 2 === 0
                                ? 70
                                : 0
                              : round.round === "sf"
                              ? index % 2 === 0
                                ? 150
                                : 0
                              : round.round === "final"
                              ? 300
                              : 0,
                        }}
                      >
                        <p className="mb-2 text-center text-xs font-black uppercase tracking-wider text-white/35">
                          Partido {match.matchIndex + 1}
                        </p>

                        <TeamRow team={match.team1} winner={match.winner} />

                        <div className="my-2 text-center text-xs font-black text-white/30">
                          VS
                        </div>

                        <TeamRow team={match.team2} winner={match.winner} />

                        {match.winner && (
                          <div className="mt-3 rounded-xl border border-green-400/20 bg-green-400/10 px-3 py-2 text-center text-sm font-black text-green-300">
                            🏆 {match.winner.name}
                            {match.method ? ` · ${match.method}` : ""}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-4 text-sm text-white/45">
            En celular podés deslizar horizontalmente para ver toda la llave.
          </p>
        </section>
      </div>
    </main>
  );
}

function TeamRow({ team, winner }: { team: any; winner: any }) {
  if (!team) {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-3 text-white/35">
        <div className="h-6 w-8 rounded bg-white/10" />
        Por definir
      </div>
    );
  }

  const isWinner = winner?.id === team.id;

  return (
    <div
      className={`flex items-center gap-3 rounded-xl px-3 py-3 ${
        isWinner
          ? "border border-yellow-300/30 bg-yellow-300/15 text-yellow-100"
          : "bg-white/5 text-white/75"
      }`}
    >
      <Flag code={team.flag} name={team.name} small />
      <span className="truncate font-bold">{team.name}</span>
    </div>
  );
}