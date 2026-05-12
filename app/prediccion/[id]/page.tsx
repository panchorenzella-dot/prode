"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const ADMIN_EMAIL = "panchorenzella@gmail.com";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Bebas+Neue&display=swap');
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
:root{--gold:#ffd700;--gold2:#ffed4e;--cyan:#00d4ff;--blue-dark:#060c1a;--glass:rgba(255,255,255,0.04);--glass-border:rgba(255,255,255,0.10);--glass-hover:rgba(255,255,255,0.08);--green:#2ed573;--text-muted:rgba(255,255,255,0.5)}
body{font-family:'Inter',sans-serif;background:var(--blue-dark);color:#fff;min-height:100vh;overflow-x:hidden}.app{min-height:100vh;background:radial-gradient(ellipse at top,#0d2060 0%,#060c1a 60%);padding-bottom:60px}.container{max-width:1500px;margin:0 auto;padding:0 20px}.header{text-align:center;padding:50px 20px 30px}.header::after{content:'';display:block;width:200px;height:2px;background:linear-gradient(90deg,transparent,var(--gold),transparent);margin:20px auto 0}.header-badge{display:inline-block;background:linear-gradient(135deg,rgba(255,215,0,0.15),rgba(255,215,0,0.05));border:1px solid rgba(255,215,0,0.3);border-radius:30px;padding:6px 18px;font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:var(--gold);margin-bottom:18px}.header h1{font-family:'Bebas Neue',sans-serif;font-size:clamp(2.5rem,6vw,5rem);letter-spacing:4px;background:linear-gradient(135deg,#fff 0%,var(--gold) 50%,var(--gold2) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1;margin-bottom:12px}.header p{color:var(--text-muted);font-size:15px}.btn{padding:12px 28px;border:none;border-radius:100px;font-family:'Inter',sans-serif;font-size:14px;font-weight:700;cursor:pointer;transition:all .25s;letter-spacing:.5px;text-decoration:none;display:inline-flex}.btn-ghost{background:var(--glass);border:1px solid var(--glass-border);color:rgba(255,255,255,.7)}.section-title{font-family:'Bebas Neue',sans-serif;font-size:1.8rem;letter-spacing:3px;color:var(--gold);margin:36px 0 24px;display:flex;align-items:center;gap:12px}.section-title::after{content:'';flex:1;height:1px;background:linear-gradient(90deg,rgba(255,215,0,.3),transparent)}.flag-img{border-radius:3px;object-fit:cover;flex-shrink:0;box-shadow:0 0 0 1px rgba(255,255,255,.12)}
.champion-screen{text-align:center;padding:40px 20px;animation:fadeIn .8s ease;background:linear-gradient(135deg,rgba(255,215,0,.10),rgba(255,255,255,.03));border:1px solid rgba(255,215,0,.18);border-radius:28px;margin-bottom:36px}.champion-flag{display:flex;justify-content:center;align-items:center;margin-bottom:20px}.champion-flag img{width:120px;height:auto;border-radius:10px}.champion-title{font-family:'Bebas Neue',sans-serif;font-size:clamp(2rem,6vw,4.5rem);letter-spacing:4px;background:linear-gradient(135deg,#fff 0%,var(--gold) 50%,var(--gold2) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:12px}.champion-subtitle{font-size:18px;color:var(--text-muted)}
.groups-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:20px;margin-bottom:36px}.group-card{background:var(--glass);border:1px solid var(--glass-border);border-radius:20px;overflow:hidden}.group-card.complete{border-color:rgba(46,213,115,.25)}.group-card-header{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;background:linear-gradient(135deg,rgba(255,255,255,.06),rgba(255,255,255,.02));border-bottom:1px solid var(--glass-border)}.group-label{font-family:'Bebas Neue',sans-serif;font-size:1.4rem;letter-spacing:2px;color:var(--gold)}.group-status{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;padding:4px 12px;border-radius:100px;background:rgba(46,213,115,.15);color:var(--green)}.standings-table{width:100%;padding:12px 16px}.standing-header{display:grid;grid-template-columns:24px 1fr 28px 28px 28px 28px 36px;gap:4px;padding:4px 4px 8px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--text-muted);border-bottom:1px solid var(--glass-border);margin-bottom:4px}.standing-row{display:grid;grid-template-columns:24px 1fr 28px 28px 28px 28px 36px;align-items:center;gap:4px;padding:8px 4px;border-radius:10px;font-size:13px}.standing-row.qualifies{background:rgba(46,213,115,.06)}.standing-row.third{background:rgba(255,215,0,.05)}.standing-row+.standing-row{border-top:1px solid rgba(255,255,255,.04)}.standing-pos{font-size:11px;font-weight:700;color:var(--text-muted);text-align:center}.standing-pos.pos-1,.standing-pos.pos-2{color:var(--green)}.standing-pos.pos-3{color:var(--gold)}.standing-team{display:flex;align-items:center;gap:6px;font-weight:500;overflow:hidden}.standing-name{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:12px}.standing-stat{text-align:center;font-size:12px;color:var(--text-muted)}.standing-pts{text-align:center;font-weight:800;font-size:13px;color:#fff}.group-matches{padding:12px 16px 16px;border-top:1px solid var(--glass-border);display:flex;flex-direction:column;gap:8px}.group-match-row{display:flex;align-items:center;gap:8px;background:rgba(255,255,255,.03);border-radius:12px;padding:10px 12px}.match-team{flex:1;display:flex;align-items:center;gap:6px;font-size:12px;font-weight:500;overflow:hidden}.match-team.right{flex-direction:row-reverse}.match-team-name{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.result-pill{padding:8px 14px;border-radius:999px;background:linear-gradient(135deg,#ffd700,#ff9500);color:#000;font-size:12px;font-weight:900;white-space:nowrap}
.round-tabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:24px}.round-tab{padding:8px 18px;border-radius:100px;border:1px solid var(--glass-border);background:var(--glass);font-size:12px;font-weight:600;color:var(--text-muted);cursor:pointer}.round-tab.active{background:linear-gradient(135deg,rgba(255,215,0,.2),rgba(255,215,0,.05));border-color:var(--gold);color:var(--gold)}.matches-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:16px}.knockout-card{background:var(--glass);border:1px solid rgba(0,212,255,.2);border-radius:18px;overflow:hidden}.knockout-card-header{padding:10px 18px;background:rgba(255,255,255,.03);border-bottom:1px solid var(--glass-border);font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--text-muted);text-align:center}.knockout-match{display:flex;align-items:center;padding:18px;gap:12px;flex-direction:column}.ko-line{display:flex;align-items:center;gap:12px;width:100%}.ko-team{flex:1;display:flex;align-items:center;gap:10px;min-width:0}.ko-team.right{flex-direction:row-reverse}.ko-team-name{font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ko-team.winner .ko-team-name{color:var(--gold)}.ko-team.loser{opacity:.45}.ko-sep{font-size:16px;font-weight:800;color:var(--text-muted)}.ko-card-footer{padding:12px 18px;border-top:1px solid var(--glass-border);display:flex;justify-content:space-between;align-items:center;gap:8px}.ko-tbd{flex:1;display:flex;align-items:center;gap:10px;color:var(--text-muted);font-size:13px;font-style:italic}.method-pill{display:inline-flex;align-items:center;justify-content:center;border-radius:999px;border:1px solid rgba(255,215,0,.25);background:rgba(255,215,0,.10);color:var(--gold);font-size:12px;font-weight:900;padding:8px 12px}.empty-box{border:1px solid rgba(255,255,255,.10);background:rgba(255,255,255,.04);border-radius:20px;padding:20px;color:rgba(255,255,255,.60);text-align:center}@keyframes fadeIn{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}@media(max-width:600px){.groups-grid{grid-template-columns:1fr}.matches-grid{grid-template-columns:1fr}.header h1{font-size:2.2rem}.group-card-header{align-items:flex-start;gap:10px;flex-direction:column}.group-match-row{padding:10px 8px;flex-direction:column}.match-team.right{flex-direction:row}.result-pill{width:100%;text-align:center}.ko-line{flex-direction:column}.ko-team.right{flex-direction:row}}
`;

type Round = "r32" | "r16" | "qf" | "sf" | "final";

type Prediction = {
  id: string;
  user_id: string;
  prediction_data: any;
  status: string;
  created_at: string;
};

const ROUNDS: Round[] = ["r32", "r16", "qf", "sf", "final"];

const ROUND_LABELS: Record<Round, string> = {
  r32: "32avos de Final",
  r16: "Octavos de Final",
  qf: "Cuartos de Final",
  sf: "Semifinales",
  final: "Gran Final",
};

const ROUND_SHORT_LABELS: Record<Round, string> = {
  r32: "32avos",
  r16: "Octavos",
  qf: "Cuartos",
  sf: "Semis",
  final: "Final",
};

function Flag({ code, name, size = "normal" }: { code?: string; name: string; size?: "normal" | "big" }) {
  if (!code) {
    return <div className="flag-img" style={{ width: size === "big" ? 120 : 28, height: size === "big" ? 80 : 20, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,.08)", fontSize: size === "big" ? 36 : 14 }}>🏆</div>;
  }

  return <img src={`https://flagcdn.com/w80/${code.toLowerCase()}.png`} alt={name} width={size === "big" ? 120 : 28} height={size === "big" ? 80 : 20} className="flag-img" />;
}

function formatGroupResult(result: string | null, team1?: any, team2?: any) {
  if (result === "team1") return `Gana ${team1?.name ?? "Equipo 1"}`;
  if (result === "team2") return `Gana ${team2?.name ?? "Equipo 2"}`;
  if (result === "draw") return "Empate";
  return "Sin elegir";
}

function isGroupComplete(group: any) {
  return group?.matches?.every((match: any) => match.result !== null);
}

function getCurrentRound(bracket: any[]): Round {
  const savedFinal = bracket.find((match) => match.round === "final" && match.winner);
  if (savedFinal) return "final";
  const found = [...ROUNDS].reverse().find((round) => bracket.some((match) => match.round === round));
  return found ?? "r32";
}

function getStatusLabel(status: string) {
  if (status === "borrador") return "📝 Borrador";
  if (status === "en_revision") return "⏳ Pago pendiente de validación";
  if (status === "validada") return "✅ Pago validado";
  if (status === "rechazada") return "❌ Pago rechazado";
  return status;
}
export default function VerPrediccionPage() {
  const params = useParams();
  const id = params?.id as string;
  const [loading, setLoading] = useState(true);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [denied, setDenied] = useState(false);
  const [currentRound, setCurrentRound] = useState<Round>("r32");

  useEffect(() => {
    if (document.getElementById("mundial-2026-readonly-styles")) return;
    const tag = document.createElement("style");
    tag.id = "mundial-2026-readonly-styles";
    tag.textContent = CSS;
    document.head.appendChild(tag);
    return () => document.getElementById("mundial-2026-readonly-styles")?.remove();
  }, []);

  useEffect(() => {
    async function cargar() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/login";
        return;
      }

      const { data, error } = await supabase.from("predictions").select("*").eq("id", id).single();
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
      setCurrentRound(getCurrentRound(data.prediction_data?.bracket ?? []));
      setLoading(false);
    }
    if (id) cargar();
  }, [id]);

  const predictionData = prediction?.prediction_data ?? {};
  const groups = predictionData.groups ?? [];
  const bracket = predictionData.bracket ?? [];
  const champion = predictionData.champion ?? null;

  const roundMatches = useMemo(() => bracket.filter((match: any) => match.round === currentRound), [bracket, currentRound]);
  const existingRounds = useMemo(() => ROUNDS.filter((round) => bracket.some((match: any) => match.round === round)), [bracket]);

  if (loading) return <main className="app"><div className="container" style={{ paddingTop: 40 }}><div className="empty-box">Cargando predicción...</div></div></main>;
  if (denied || !prediction) return <main className="app"><div className="container" style={{ paddingTop: 40 }}><div className="empty-box">No tenés permiso para ver esta predicción.</div></div></main>;

  return (
    <main className="app">
      <div style={{ padding: "20px 20px 0", display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
        <a href="/mis-predicciones" className="btn btn-ghost">← Volver a Mis Predicciones</a>
        <a href="/" className="btn btn-ghost">Menú Principal</a>
      </div>

      <div className="header">
        <div className="header-badge">Modo solo lectura</div>
        <h1>⚽ PREDICCIÓN GUARDADA</h1>
        <p>Esta predicción ya está guardada y se muestra sin edición.</p>
      </div>

      <div className="container">
        <div style={{ marginBottom: 24, padding: 16, borderRadius: 16, background: "rgba(255,215,0,0.12)", border: "1px solid rgba(255,215,0,0.3)", color: "#ffd700", fontWeight: 800, textAlign: "center" }}>
          🔒 Vista de predicción completa · {getStatusLabel(prediction.status)}
        </div>

        <div className="champion-screen">
          <div className="champion-flag"><Flag code={champion?.flag} name={champion?.name ?? "Campeón"} size="big" /></div>
          <div className="champion-title">{champion?.name ? `¡${champion.name.toUpperCase()} CAMPEÓN DEL MUNDO!` : "CAMPEÓN SIN DEFINIR"}</div>
          <div className="champion-subtitle">🏆 FIFA World Cup 2026 🏆</div>
        </div>

        <div className="section-title">📊 Fase de Grupos</div>
        {groups.length === 0 ? <div className="empty-box">No hay datos de grupos guardados.</div> : (
          <div className="groups-grid">
            {groups.map((group: any) => (
              <div key={group.id} className={`group-card ${isGroupComplete(group) ? "complete" : ""}`}>
                <div className="group-card-header"><span className="group-label">GRUPO {group.id}</span><span className="group-status">{isGroupComplete(group) ? "Completo" : "Incompleto"}</span></div>
                <div className="standings-table">
                  <div className="standing-header"><div /><div>Equipo</div><div style={{ textAlign: "center" }}>PJ</div><div style={{ textAlign: "center" }}>G</div><div style={{ textAlign: "center" }}>E</div><div style={{ textAlign: "center" }}>P</div><div style={{ textAlign: "center" }}>PTS</div></div>
                  {group.standings?.map((standing: any, index: number) => (
                    <div key={standing.team.id} className={`standing-row ${index < 2 ? "qualifies" : index === 2 ? "third" : ""}`}>
                      <div className={`standing-pos pos-${index + 1}`}>{index + 1}°</div>
                      <div className="standing-team"><Flag code={standing.team.flag} name={standing.team.name} /><span className="standing-name">{standing.team.name}</span></div>
                      <div className="standing-stat">{standing.pj}</div><div className="standing-stat">{standing.g}</div><div className="standing-stat">{standing.e}</div><div className="standing-stat">{standing.p}</div><div className="standing-pts">{standing.pts}</div>
                    </div>
                  ))}
                </div>
                <div className="group-matches">
                  {group.matches?.map((match: any) => (
                    <div key={match.id} className="group-match-row">
                      <div className="match-team"><Flag code={match.team1.flag} name={match.team1.name} /><span className="match-team-name">{match.team1.name}</span></div>
                      <div className="result-pill">{formatGroupResult(match.result, match.team1, match.team2)}</div>
                      <div className="match-team right"><Flag code={match.team2.flag} name={match.team2.name} /><span className="match-team-name">{match.team2.name}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="section-title">🏆 Fase Final</div>
        {bracket.length === 0 ? <div className="empty-box">No hay datos de llaves guardados.</div> : (
          <>
            <div className="round-tabs">
              {existingRounds.map((round) => <button key={round} className={`round-tab ${currentRound === round ? "active" : ""}`} onClick={() => setCurrentRound(round)}>{ROUND_SHORT_LABELS[round]}</button>)}
            </div>
            <div className="section-title">🏆 {ROUND_LABELS[currentRound]}</div>
            <div className="matches-grid">
              {roundMatches.map((match: any) => {
                const team1Winner = match.winner?.id === match.team1?.id;
                const team2Winner = match.winner?.id === match.team2?.id;
                return (
                  <div key={match.id} className="knockout-card">
                    <div className="knockout-card-header">{ROUND_LABELS[match.round as Round]} · Partido {match.matchIndex + 1}</div>
                    <div className="knockout-match">
                      <div className="ko-line">
                        {match.team1 ? <div className={`ko-team ${team1Winner ? "winner" : match.winner ? "loser" : ""}`}><Flag code={match.team1.flag} name={match.team1.name} /><span className="ko-team-name">{match.team1.name}</span></div> : <div className="ko-tbd">Por definir</div>}
                        <span className="ko-sep">VS</span>
                        {match.team2 ? <div className={`ko-team right ${team2Winner ? "winner" : match.winner ? "loser" : ""}`}><Flag code={match.team2.flag} name={match.team2.name} /><span className="ko-team-name">{match.team2.name}</span></div> : <div className="ko-tbd" style={{ justifyContent: "flex-end" }}>Por definir</div>}
                      </div>
                      {match.winner && <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap", marginTop: 14 }}><div className="method-pill">✓ Pasa {match.winner.name}</div>{match.method && <div className="method-pill">{match.method}</div>}</div>}
                    </div>
                    <div className="ko-card-footer">{match.winner ? <span style={{ fontSize: 12, color: "var(--green)" }}>✓ Pasa: {match.winner.name} {match.method ? `(${match.method})` : ""}</span> : <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Sin resultado</span>}</div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </main>
  );
}