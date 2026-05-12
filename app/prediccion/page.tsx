"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Bebas+Neue&display=swap');

*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
:root{--gold:#ffd700;--gold2:#ffed4e;--cyan:#00d4ff;--blue-dark:#060c1a;--blue-mid:#0d1b35;--blue-light:#162444;--glass:rgba(255,255,255,0.04);--glass-border:rgba(255,255,255,0.10);--glass-hover:rgba(255,255,255,0.08);--red:#ff4757;--green:#2ed573;--text-muted:rgba(255,255,255,0.5)}
body{font-family:'Inter',sans-serif;background:var(--blue-dark);color:#fff;min-height:100vh;overflow-x:hidden}
.app{min-height:100vh;background:radial-gradient(ellipse at top,#0d2060 0%,#060c1a 60%);padding-bottom:60px}
.header{text-align:center;padding:50px 20px 30px;position:relative}
.header::after{content:'';display:block;width:200px;height:2px;background:linear-gradient(90deg,transparent,var(--gold),transparent);margin:20px auto 0}
.header-badge{display:inline-block;background:linear-gradient(135deg,rgba(255,215,0,0.15),rgba(255,215,0,0.05));border:1px solid rgba(255,215,0,0.3);border-radius:30px;padding:6px 18px;font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:var(--gold);margin-bottom:18px}
.header h1{font-family:'Bebas Neue',sans-serif;font-size:clamp(2.5rem,6vw,5rem);letter-spacing:4px;background:linear-gradient(135deg,#fff 0%,var(--gold) 50%,var(--gold2) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1;margin-bottom:12px}
.header p{color:var(--text-muted);font-size:15px}
.stage-nav{display:flex;justify-content:center;gap:8px;padding:0 20px 30px;flex-wrap:wrap}
.stage-step{display:flex;align-items:center;gap:8px;padding:10px 20px;border-radius:100px;border:1px solid var(--glass-border);background:var(--glass);font-size:13px;font-weight:600;color:var(--text-muted);cursor:default;transition:all 0.3s}
.stage-step.active{background:linear-gradient(135deg,rgba(255,215,0,0.2),rgba(255,215,0,0.05));border-color:var(--gold);color:var(--gold)}
.stage-step.done{border-color:rgba(46,213,115,0.4);color:var(--green);background:rgba(46,213,115,0.05)}
.stage-num{width:22px;height:22px;border-radius:50%;background:rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700}
.stage-step.active .stage-num{background:var(--gold);color:#000}
.stage-step.done .stage-num{background:var(--green);color:#000}
.container{max-width:1500px;margin:0 auto;padding:0 20px}
.section-title{font-family:'Bebas Neue',sans-serif;font-size:1.8rem;letter-spacing:3px;color:var(--gold);margin-bottom:24px;display:flex;align-items:center;gap:12px}
.section-title::after{content:'';flex:1;height:1px;background:linear-gradient(90deg,rgba(255,215,0,0.3),transparent)}
.controls{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:36px}
.btn{padding:12px 28px;border:none;border-radius:100px;font-family:'Inter',sans-serif;font-size:14px;font-weight:700;cursor:pointer;transition:all 0.25s cubic-bezier(0.34,1.56,0.64,1);letter-spacing:0.5px;position:relative;overflow:hidden}
.btn-primary{background:linear-gradient(135deg,#ffd700,#ff9500);color:#000;box-shadow:0 4px 20px rgba(255,215,0,0.25)}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(255,215,0,0.4)}
.btn-secondary{background:linear-gradient(135deg,#00d4ff22,#00d4ff11);border:1px solid rgba(0,212,255,0.4);color:var(--cyan)}
.btn-secondary:hover{transform:translateY(-2px);background:linear-gradient(135deg,#00d4ff33,#00d4ff15);box-shadow:0 6px 20px rgba(0,212,255,0.2)}
.btn-ghost{background:var(--glass);border:1px solid var(--glass-border);color:rgba(255,255,255,0.7)}
.btn-ghost:hover{background:var(--glass-hover);transform:translateY(-2px)}
.btn-danger{background:linear-gradient(135deg,rgba(255,71,87,0.2),rgba(255,71,87,0.1));border:1px solid rgba(255,71,87,0.4);color:var(--red)}
.btn-danger:hover{transform:translateY(-2px)}
.btn:disabled{opacity:0.4;cursor:not-allowed;transform:none!important}
.btn-sm{padding:8px 16px;font-size:12px}
.groups-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:20px;margin-bottom:36px}
.group-card{background:var(--glass);border:1px solid var(--glass-border);border-radius:20px;overflow:hidden;transition:border-color 0.3s}
.group-card.complete{border-color:rgba(46,213,115,0.25)}
.group-card-header{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;background:linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02));border-bottom:1px solid var(--glass-border)}
.group-label{font-family:'Bebas Neue',sans-serif;font-size:1.4rem;letter-spacing:2px;color:var(--gold)}
.group-status{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;padding:4px 12px;border-radius:100px}
.group-status.complete{background:rgba(46,213,115,0.15);color:var(--green)}
.group-status.partial{background:rgba(0,212,255,0.1);color:var(--cyan)}
.group-status.pending{background:rgba(255,255,255,0.05);color:var(--text-muted)}
.standings-table{width:100%;padding:12px 16px}
.standing-header{display:grid;grid-template-columns:24px 1fr 28px 28px 28px 28px 36px;gap:4px;padding:4px 4px 8px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--text-muted);border-bottom:1px solid var(--glass-border);margin-bottom:4px}
.standing-row{display:grid;grid-template-columns:24px 1fr 28px 28px 28px 28px 36px;align-items:center;gap:4px;padding:8px 4px;border-radius:10px;font-size:13px;transition:background 0.2s}
.standing-row:hover{background:rgba(255,255,255,0.04)}
.standing-row.qualifies{background:rgba(46,213,115,0.06)}
.standing-row.third{background:rgba(255,215,0,0.05)}
.standing-row+.standing-row{border-top:1px solid rgba(255,255,255,0.04)}
.standing-pos{font-size:11px;font-weight:700;color:var(--text-muted);text-align:center}
.standing-pos.pos-1,.standing-pos.pos-2{color:var(--green)}
.standing-pos.pos-3{color:var(--gold)}
.standing-team{display:flex;align-items:center;gap:6px;font-weight:500;overflow:hidden}
.standing-name{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:12px}
.standing-stat{text-align:center;font-size:12px;color:var(--text-muted)}
.standing-pts{text-align:center;font-weight:800;font-size:13px;color:#fff}
.flag-img{border-radius:3px;object-fit:cover;flex-shrink:0;box-shadow:0 0 0 1px rgba(255,255,255,0.12)}
.group-matches{padding:12px 16px 16px;border-top:1px solid var(--glass-border);display:flex;flex-direction:column;gap:8px}
.group-match-row{display:flex;align-items:center;gap:8px;background:rgba(255,255,255,0.03);border-radius:12px;padding:10px 12px}
.match-team{flex:1;display:flex;align-items:center;gap:6px;font-size:12px;font-weight:500;overflow:hidden}
.match-team.right{flex-direction:row-reverse}
.match-team-name{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.match-score-box{display:flex;align-items:center;gap:4px;flex-shrink:0}
.score-sep{color:var(--text-muted);font-size:14px;font-weight:700}
.thirds-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px;margin-bottom:30px}
.third-card{background:var(--glass);border:1px solid var(--glass-border);border-radius:16px;padding:18px;cursor:pointer;transition:all 0.25s;display:flex;align-items:center;gap:12px}
.third-card:hover{border-color:rgba(255,215,0,0.3);background:var(--glass-hover);transform:translateY(-2px)}
.third-card.selected{background:linear-gradient(135deg,rgba(46,213,115,0.12),rgba(46,213,115,0.04));border-color:var(--green);box-shadow:0 0 20px rgba(46,213,115,0.1)}
.third-card-info{flex:1}.third-card-name{font-size:13px;font-weight:600;margin-bottom:2px}.third-card-stats{font-size:11px;color:var(--text-muted)}
.third-card-check{width:22px;height:22px;border-radius:50%;border:2px solid var(--glass-border);display:flex;align-items:center;justify-content:center;font-size:11px;transition:all 0.2s}
.third-card.selected .third-card-check{background:var(--green);border-color:var(--green);color:#000;font-weight:900}
.thirds-info{text-align:center;color:var(--text-muted);font-size:14px;margin-bottom:20px}.thirds-info strong{color:var(--gold)}
.knockout-controls{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:28px}
.round-tabs{display:flex;gap:8px;flex-wrap:wrap}.round-tab{padding:8px 18px;border-radius:100px;border:1px solid var(--glass-border);background:var(--glass);font-size:12px;font-weight:600;color:var(--text-muted);cursor:pointer;transition:all 0.2s}
.round-tab.active{background:linear-gradient(135deg,rgba(255,215,0,0.2),rgba(255,215,0,0.05));border-color:var(--gold);color:var(--gold)}.round-tab.done{border-color:rgba(46,213,115,0.3);color:var(--green)}
.matches-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:16px}
.knockout-card{background:var(--glass);border:1px solid var(--glass-border);border-radius:18px;overflow:hidden;transition:all 0.3s}.knockout-card:hover{border-color:rgba(255,255,255,0.15)}.knockout-card.has-result{border-color:rgba(0,212,255,0.2)}
.knockout-card-header{padding:10px 18px;background:rgba(255,255,255,0.03);border-bottom:1px solid var(--glass-border);font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--text-muted);text-align:center}
.knockout-match{display:flex;align-items:center;padding:18px;gap:12px}.ko-team{flex:1;display:flex;align-items:center;gap:10px;min-width:0}.ko-team.right{flex-direction:row-reverse}.ko-team-name{font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ko-team.winner .ko-team-name{color:var(--gold)}.ko-team.loser .ko-team-name{color:rgba(255,255,255,0.3)}
.ko-sep{font-size:16px;font-weight:800;color:var(--text-muted)}
.ko-card-footer{padding:12px 18px;border-top:1px solid var(--glass-border);display:flex;justify-content:space-between;align-items:center;gap:8px}.ko-tbd{flex:1;display:flex;align-items:center;gap:10px;color:var(--text-muted);font-size:13px;font-style:italic}
.champion-screen{text-align:center;padding:60px 20px;animation:fadeIn 0.8s ease}.champion-flag{display:flex;justify-content:center;align-items:center;margin-bottom:20px}.champion-flag img{width:120px;height:auto;border-radius:10px}.champion-title{font-family:'Bebas Neue',sans-serif;font-size:clamp(2rem,6vw,4.5rem);letter-spacing:4px;background:linear-gradient(135deg,#fff 0%,var(--gold) 50%,var(--gold2) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:12px}.champion-subtitle{font-size:20px;color:var(--text-muted);margin-bottom:40px}
@keyframes fadeIn{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
.confetti-wrap{position:fixed;inset:0;pointer-events:none;z-index:999;overflow:hidden}.confetti-piece{position:absolute;width:10px;height:10px;border-radius:2px;animation:fall linear forwards}@keyframes fall{from{transform:translateY(-20px) rotate(0deg);opacity:1}to{transform:translateY(105vh) rotate(720deg);opacity:0}}
.next-round-bar{text-align:center;padding:36px 0 0}
@media(max-width:600px){.groups-grid{grid-template-columns:1fr}.matches-grid{grid-template-columns:1fr}.thirds-grid{grid-template-columns:1fr 1fr}.header h1{font-size:2.2rem}.ko-team-name{font-size:11px}.group-card-header{align-items:flex-start;gap:10px;flex-direction:column}.group-match-row{padding:10px 8px;flex-direction:column}.match-team.right{flex-direction:row}.match-team-name{font-size:11px}.match-score-box{width:100%;justify-content:center}}
`;

type GroupId = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L";
type Stage = "groups" | "thirds" | "knockout";
type Round = "r32" | "r16" | "qf" | "sf" | "final";
type GroupResult = "team1" | "draw" | "team2" | null;
type KoMethod = "normal" | "suplementario" | "penales" | null;

type Team = {
  id: string;
  name: string;
  flag: string;
  group: GroupId;
};

type Standing = {
  team: Team;
  pj: number;
  g: number;
  e: number;
  p: number;
  gf: number;
  gc: number;
  pts: number;
};

type GroupMatch = {
  id: string;
  team1: Team;
  team2: Team;
  result: GroupResult;
};

type GroupState = {
  id: GroupId;
  matches: GroupMatch[];
  standings: Standing[];
};

type KnockoutMatch = {
  id: string;
  round: Round;
  matchIndex: number;
  team1: Team | null;
  team2: Team | null;
  winner: Team | null;
  method: KoMethod;
};

const TEAMS: Team[] = [
  { id: "mexico", name: "México", flag: "mx", group: "A" },
  { id: "sudafrica", name: "Sudáfrica", flag: "za", group: "A" },
  { id: "corea", name: "Corea del Sur", flag: "kr", group: "A" },
  { id: "czechia", name: "República Checa", flag: "cz", group: "A" },
  { id: "canada", name: "Canadá", flag: "ca", group: "B" },
  { id: "bosnia", name: "Bosnia y Herzegovina", flag: "ba", group: "B" },
  { id: "qatar", name: "Qatar", flag: "qa", group: "B" },
  { id: "suiza", name: "Suiza", flag: "ch", group: "B" },
  { id: "brasil", name: "Brasil", flag: "br", group: "C" },
  { id: "marruecos", name: "Marruecos", flag: "ma", group: "C" },
  { id: "haiti", name: "Haití", flag: "ht", group: "C" },
  { id: "escocia", name: "Escocia", flag: "gb-sct", group: "C" },
  { id: "usa", name: "Estados Unidos", flag: "us", group: "D" },
  { id: "paraguay", name: "Paraguay", flag: "py", group: "D" },
  { id: "australia", name: "Australia", flag: "au", group: "D" },
  { id: "turquia", name: "Turquía", flag: "tr", group: "D" },
  { id: "alemania", name: "Alemania", flag: "de", group: "E" },
  { id: "curazao", name: "Curazao", flag: "cw", group: "E" },
  { id: "ivory", name: "Costa de Marfil", flag: "ci", group: "E" },
  { id: "ecuador", name: "Ecuador", flag: "ec", group: "E" },
  { id: "paises_bajos", name: "Países Bajos", flag: "nl", group: "F" },
  { id: "japon", name: "Japón", flag: "jp", group: "F" },
  { id: "suecia", name: "Suecia", flag: "se", group: "F" },
  { id: "tunez", name: "Túnez", flag: "tn", group: "F" },
  { id: "belgica", name: "Bélgica", flag: "be", group: "G" },
  { id: "egipto", name: "Egipto", flag: "eg", group: "G" },
  { id: "iran", name: "Irán", flag: "ir", group: "G" },
  { id: "nuevazelandia", name: "Nueva Zelanda", flag: "nz", group: "G" },
  { id: "espana", name: "España", flag: "es", group: "H" },
  { id: "caboverde", name: "Cabo Verde", flag: "cv", group: "H" },
  { id: "saudi", name: "Arabia Saudita", flag: "sa", group: "H" },
  { id: "uruguay", name: "Uruguay", flag: "uy", group: "H" },
  { id: "francia", name: "Francia", flag: "fr", group: "I" },
  { id: "senegal", name: "Senegal", flag: "sn", group: "I" },
  { id: "irak", name: "Irak", flag: "iq", group: "I" },
  { id: "noruega", name: "Noruega", flag: "no", group: "I" },
  { id: "argentina", name: "Argentina", flag: "ar", group: "J" },
  { id: "austria", name: "Austria", flag: "at", group: "J" },
  { id: "argelia", name: "Argelia", flag: "dz", group: "J" },
  { id: "jordania", name: "Jordania", flag: "jo", group: "J" },
  { id: "portugal", name: "Portugal", flag: "pt", group: "K" },
  { id: "colombia", name: "Colombia", flag: "co", group: "K" },
  { id: "uzbekistan", name: "Uzbekistán", flag: "uz", group: "K" },
  { id: "panama", name: "Panamá", flag: "pa", group: "K" },
  { id: "inglaterra", name: "Inglaterra", flag: "gb-eng", group: "L" },
  { id: "italia", name: "Italia", flag: "it", group: "L" },
  { id: "camerun", name: "Camerún", flag: "cm", group: "L" },
  { id: "venezuela", name: "Venezuela", flag: "ve", group: "L" },
];

const GROUPS: GroupId[] = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
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

const NEXT_ROUND: Partial<Record<Round, Round>> = {
  r32: "r16",
  r16: "qf",
  qf: "sf",
  sf: "final",
};

const CONFETTI_COLORS = ["#ffd700", "#ff4757", "#00d4ff", "#2ed573", "#ff9500", "#fff"];

function uid() {
  return crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 11);
}

function Flag({ code, name, size = "normal" }: { code: string; name: string; size?: "normal" | "big" }) {
  const width = size === "big" ? 120 : 28;
  const height = size === "big" ? 80 : 20;

  return (
    <img
      src={`https://flagcdn.com/w80/${code.toLowerCase()}.png`}
      alt={name}
      width={width}
      height={height}
      className="flag-img"
    />
  );
}

function buildStandings(teams: Team[], matches: GroupMatch[]): Standing[] {
  const map: Record<string, Standing> = {};

  teams.forEach((team) => {
    map[team.id] = { team, pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, pts: 0 };
  });

  matches.forEach((match) => {
    if (!match.result) return;

    const t1 = map[match.team1.id];
    const t2 = map[match.team2.id];
    if (!t1 || !t2) return;

    t1.pj += 1;
    t2.pj += 1;

    if (match.result === "team1") {
      t1.g += 1;
      t1.pts += 3;
      t2.p += 1;
    }

    if (match.result === "team2") {
      t2.g += 1;
      t2.pts += 3;
      t1.p += 1;
    }

    if (match.result === "draw") {
      t1.e += 1;
      t2.e += 1;
      t1.pts += 1;
      t2.pts += 1;
    }
  });

  return Object.values(map).sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    if (b.g !== a.g) return b.g - a.g;
    return a.team.name.localeCompare(b.team.name);
  });
}

function buildGroupState(groupId: GroupId): GroupState {
  const teams = TEAMS.filter((team) => team.group === groupId);
  const matches: GroupMatch[] = [];

  for (let i = 0; i < teams.length; i += 1) {
    for (let j = i + 1; j < teams.length; j += 1) {
      matches.push({
        id: uid(),
        team1: teams[i],
        team2: teams[j],
        result: null,
      });
    }
  }

  return { id: groupId, matches, standings: buildStandings(teams, matches) };
}

function getTeamsFromMatches(matches: GroupMatch[]): Team[] {
  const teamMap = new Map<string, Team>();

  matches.forEach((match) => {
    teamMap.set(match.team1.id, match.team1);
    teamMap.set(match.team2.id, match.team2);
  });

  return Array.from(teamMap.values());
}

function simulateGroupFull(group: GroupState): GroupState {
  const results: Exclude<GroupResult, null>[] = ["team1", "draw", "team2"];

  const matches = group.matches.map((match) => {
    if (match.result) return match;
    return {
      ...match,
      result: results[Math.floor(Math.random() * results.length)],
    };
  });

  return { ...group, matches, standings: buildStandings(getTeamsFromMatches(matches), matches) };
}

function simulateKnockoutMatch(match: KnockoutMatch): KnockoutMatch {
  if (!match.team1 || !match.team2) return match;

  const winner = Math.random() > 0.5 ? match.team1 : match.team2;
  const methods: Exclude<KoMethod, null>[] = ["normal", "suplementario", "penales"];

  return {
    ...match,
    winner,
    method: methods[Math.floor(Math.random() * methods.length)],
  };
}

function buildBracket(groups: GroupState[], selectedThirds: Team[]): KnockoutMatch[] {
  const winners = groups.map((group) => group.standings[0]?.team).filter(Boolean) as Team[];
  const runnerUps = groups.map((group) => group.standings[1]?.team).filter(Boolean) as Team[];

  const pairs: Array<[Team | null, Team | null]> = [
    [winners[0] ?? null, selectedThirds[0] ?? null],
    [winners[1] ?? null, selectedThirds[1] ?? null],
    [winners[2] ?? null, selectedThirds[2] ?? null],
    [winners[3] ?? null, selectedThirds[3] ?? null],
    [winners[4] ?? null, selectedThirds[4] ?? null],
    [winners[5] ?? null, selectedThirds[5] ?? null],
    [winners[6] ?? null, selectedThirds[6] ?? null],
    [winners[7] ?? null, selectedThirds[7] ?? null],
    [winners[8] ?? null, runnerUps[11] ?? null],
    [winners[9] ?? null, runnerUps[10] ?? null],
    [winners[10] ?? null, runnerUps[9] ?? null],
    [winners[11] ?? null, runnerUps[8] ?? null],
    [runnerUps[0] ?? null, runnerUps[3] ?? null],
    [runnerUps[1] ?? null, runnerUps[2] ?? null],
    [runnerUps[4] ?? null, runnerUps[7] ?? null],
    [runnerUps[5] ?? null, runnerUps[6] ?? null],
  ];

  return pairs.map(([team1, team2], index) => ({
    id: uid(),
    round: "r32",
    matchIndex: index,
    team1,
    team2,
    winner: null,
    method: null,
  }));
}

function buildNextRound(prevMatches: KnockoutMatch[], round: Round): KnockoutMatch[] {
  const next: KnockoutMatch[] = [];

  for (let i = 0; i < prevMatches.length; i += 2) {
    const match1 = prevMatches[i];
    const match2 = prevMatches[i + 1];

    next.push({
      id: uid(),
      round,
      matchIndex: i / 2,
      team1: match1?.winner ?? null,
      team2: match2?.winner ?? null,
      winner: null,
      method: null,
    });
  }

  return next;
}

function initGroups(): GroupState[] {
  return GROUPS.map(buildGroupState);
}

function groupComplete(group: GroupState): boolean {
  return group.matches.every((match) => match.result !== null);
}

function groupPartial(group: GroupState): boolean {
  return group.matches.some((match) => match.result !== null) && !groupComplete(group);
}

function allGroupsComplete(groups: GroupState[]): boolean {
  return groups.every(groupComplete);
}

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 120 }, (_, index) => ({
        id: index,
        color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
        left: `${Math.random() * 100}%`,
        top: `-${Math.random() * 30}px`,
        delay: `${Math.random() * 2}s`,
        duration: `${2.5 + Math.random() * 2.5}s`,
        size: `${6 + Math.random() * 8}px`,
      })),
    []
  );

  return (
    <div className="confetti-wrap">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="confetti-piece"
          style={{
            background: piece.color,
            left: piece.left,
            top: piece.top,
            width: piece.size,
            height: piece.size,
            animationDelay: piece.delay,
            animationDuration: piece.duration,
          }}
        />
      ))}
    </div>
  );
}

export default function SimuladorMundial2026() {
  const [stage, setStage] = useState<Stage>("groups");
  const [groups, setGroups] = useState<GroupState[]>(() => initGroups());
  const [selectedThirds, setSelectedThirds] = useState<Team[]>([]);
  const [bracket, setBracket] = useState<KnockoutMatch[]>([]);
  const [currentRound, setCurrentRound] = useState<Round>("r32");
  const [showConfetti, setShowConfetti] = useState(false);
  const [champion, setChampion] = useState<Team | null>(null);
  const [savedPredictionId, setSavedPredictionId] = useState<string | null>(null);
  const [savingPrediction, setSavingPrediction] = useState(false);

  useEffect(() => {
    if (document.getElementById("mundial-2026-styles")) return;

    const tag = document.createElement("style");
    tag.id = "mundial-2026-styles";
    tag.textContent = CSS;
    document.head.appendChild(tag);

    return () => {
      document.getElementById("mundial-2026-styles")?.remove();
    };
  }, []);

  const buildPredictionData = useCallback(() => {
    return {
      groups,
      selectedThirds,
      bracket,
      champion,
      currentRound,
      saved_at: new Date().toISOString(),
    };
  }, [groups, selectedThirds, bracket, champion, currentRound]);

  const guardarPrediccion = useCallback(async () => {
    setSavingPrediction(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setSavingPrediction(false);
      alert("Tenés que iniciar sesión para guardar la predicción.");
      window.location.href = "/login";
      return null;
    }

    const predictionData = buildPredictionData();

    if (savedPredictionId) {
      const { error } = await supabase
        .from("predictions")
        .update({
          prediction_data: predictionData,
          status: "borrador",
        })
        .eq("id", savedPredictionId)
        .eq("user_id", user.id);

      setSavingPrediction(false);

      if (error) {
        alert("Error al actualizar la predicción: " + error.message);
        return null;
      }

      return savedPredictionId;
    }

    const { data, error } = await supabase
      .from("predictions")
      .insert({
        user_id: user.id,
        prediction_data: predictionData,
        status: "borrador",
      })
      .select("id")
      .single();

    setSavingPrediction(false);

    if (error) {
      alert("Error al guardar la predicción: " + error.message);
      return null;
    }

    setSavedPredictionId(data.id);
    localStorage.setItem("current_prediction_id", data.id);

    return data.id;
  }, [buildPredictionData, savedPredictionId]);

  const irAParticipar = useCallback(async () => {
    const id = await guardarPrediccion();

    if (!id) return;

    window.location.href = `/participar?prediction_id=${id}`;
  }, [guardarPrediccion]);

  const thirdPlaceTeams = useMemo(
    () =>
      groups
        .map((group) => group.standings[2])
        .filter(Boolean)
        .sort((a, b) => {
          if (b.pts !== a.pts) return b.pts - a.pts;
          if (b.g !== a.g) return b.g - a.g;
          return a.team.name.localeCompare(b.team.name);
        }),
    [groups]
  );

  const roundMatches = useMemo(
    () => bracket.filter((match) => match.round === currentRound),
    [bracket, currentRound]
  );

  const currentRoundDone = roundMatches.length > 0 && roundMatches.every((match) => match.winner !== null && match.method !== null);

  const stageSteps: Array<{ id: Stage; label: string }> = [
    { id: "groups", label: "Fase de Grupos" },
    { id: "thirds", label: "Mejores Terceros" },
    { id: "knockout", label: "Fase Final" },
  ];

  const stageIndex = stageSteps.findIndex((step) => step.id === stage);

  const updateMatch = useCallback((groupId: GroupId, matchId: string, result: GroupResult) => {
    setGroups((prevGroups) =>
      prevGroups.map((group) => {
        if (group.id !== groupId) return group;

        const matches = group.matches.map((match) => (match.id === matchId ? { ...match, result } : match));

        return {
          ...group,
          matches,
          standings: buildStandings(getTeamsFromMatches(matches), matches),
        };
      })
    );
  }, []);

  const simulateGroup = useCallback((groupId: GroupId) => {
    setGroups((prevGroups) => prevGroups.map((group) => (group.id === groupId ? simulateGroupFull(group) : group)));
  }, []);

  const simulateAllGroups = useCallback(() => {
    setGroups((prevGroups) => prevGroups.map(simulateGroupFull));
  }, []);

  const resetAll = useCallback(() => {
    setGroups(initGroups());
    setSelectedThirds([]);
    setBracket([]);
    setCurrentRound("r32");
    setStage("groups");
    setChampion(null);
    setShowConfetti(false);
  }, []);

  const toggleThird = useCallback((team: Team) => {
    setSelectedThirds((prevSelected) => {
      const alreadySelected = prevSelected.some((selectedTeam) => selectedTeam.id === team.id);
      if (alreadySelected) return prevSelected.filter((selectedTeam) => selectedTeam.id !== team.id);
      if (prevSelected.length >= 8) return prevSelected;
      return [...prevSelected, team];
    });
  }, []);

  const advanceToKnockout = useCallback(() => {
    setBracket(buildBracket(groups, selectedThirds));
    setCurrentRound("r32");
    setChampion(null);
    setStage("knockout");
  }, [groups, selectedThirds]);

  const updateKnockoutWinner = useCallback((matchId: string, winner: Team) => {
    setBracket((prevBracket) => prevBracket.map((match) => (match.id === matchId ? { ...match, winner } : match)));
  }, []);

  const updateKnockoutMethod = useCallback((matchId: string, method: KoMethod) => {
    setBracket((prevBracket) => prevBracket.map((match) => (match.id === matchId ? { ...match, method } : match)));
  }, []);

  const simulateKnockout = useCallback((matchId: string) => {
    setBracket((prevBracket) => prevBracket.map((match) => (match.id === matchId ? simulateKnockoutMatch(match) : match)));
  }, []);

  const simulateAllKnockout = useCallback(() => {
    setBracket((prevBracket) =>
      prevBracket.map((match) => {
        if (match.round !== currentRound) return match;
        if (match.winner !== null && match.method !== null) return match;
        if (!match.team1 || !match.team2) return match;
        return simulateKnockoutMatch(match);
      })
    );
  }, [currentRound]);

  const advanceRound = useCallback(() => {
    const nextRound = NEXT_ROUND[currentRound];
    if (!nextRound) return;

    const currentMatches = bracket.filter((match) => match.round === currentRound);
    const newMatches = buildNextRound(currentMatches, nextRound);

    setBracket((prevBracket) => [...prevBracket.filter((match) => match.round !== nextRound), ...newMatches]);
    setCurrentRound(nextRound);
  }, [bracket, currentRound]);

  useEffect(() => {
    if (currentRound !== "final") return;

    const finalMatch = bracket.find((match) => match.round === "final");
    if (!finalMatch?.winner || champion) return;

    setChampion(finalMatch.winner);
    setShowConfetti(true);

    const timeout = window.setTimeout(() => setShowConfetti(false), 6000);
    return () => window.clearTimeout(timeout);
  }, [bracket, champion, currentRound]);

  return (
    <div className="app">
      {showConfetti && <Confetti />}

      <div style={{ padding: "20px 20px 0", display: "flex", justifyContent: "center" }}>
        <a href="/" className="btn btn-ghost" style={{ textDecoration: "none" }}>
          ← Volver al Menú Principal
        </a>
      </div>

      <div className="header">
        <div className="header-badge">FIFA World Cup 2026</div>
        <h1>⚽ SIMULADOR MUNDIAL 2026</h1>
        <p>48 equipos · 12 grupos · Avanza hasta la Gran Final</p>
      </div>

      <div className="stage-nav">
        {stageSteps.map((step, index) => (
          <div key={step.id} className={`stage-step ${index < stageIndex ? "done" : index === stageIndex ? "active" : ""}`}>
            <div className="stage-num">{index < stageIndex ? "✓" : index + 1}</div>
            {step.label}
          </div>
        ))}
      </div>

      <div className="container">
        {stage === "groups" && (
          <>
            <div className="controls">
              <button className="btn btn-primary" onClick={simulateAllGroups}>
                ⚡ Simular Todos los Grupos
              </button>
              <button className="btn btn-secondary" onClick={() => setStage("thirds")} disabled={!allGroupsComplete(groups)}>
                Continuar → Mejores Terceros
              </button>
              <button className="btn btn-danger btn-sm" onClick={resetAll}>
                🔄 Reiniciar
              </button>
            </div>

            <div className="section-title">📊 Fase de Grupos</div>

            <div className="groups-grid">
              {groups.map((group) => {
                const complete = groupComplete(group);
                const partial = groupPartial(group);

                return (
                  <div key={group.id} className={`group-card ${complete ? "complete" : ""}`}>
                    <div className="group-card-header">
                      <span className="group-label">GRUPO {group.id}</span>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => simulateGroup(group.id)} disabled={complete}>
                          ⚡ Simular
                        </button>
                        <span className={`group-status ${complete ? "complete" : partial ? "partial" : "pending"}`}>
                          {complete ? "Completo" : partial ? "En curso" : "Pendiente"}
                        </span>
                      </div>
                    </div>

                    <div className="standings-table">
                      <div className="standing-header">
                        <div />
                        <div>Equipo</div>
                        <div style={{ textAlign: "center" }}>PJ</div>
                        <div style={{ textAlign: "center" }}>G</div>
                        <div style={{ textAlign: "center" }}>E</div>
                        <div style={{ textAlign: "center" }}>P</div>
                        <div style={{ textAlign: "center" }}>PTS</div>
                      </div>

                      {group.standings.map((standing, index) => (
                        <div key={standing.team.id} className={`standing-row ${index < 2 ? "qualifies" : index === 2 ? "third" : ""}`}>
                          <div className={`standing-pos pos-${index + 1}`}>{index + 1}°</div>
                          <div className="standing-team">
                            <Flag code={standing.team.flag} name={standing.team.name} />
                            <span className="standing-name">{standing.team.name}</span>
                          </div>
                          <div className="standing-stat">{standing.pj}</div>
                          <div className="standing-stat">{standing.g}</div>
                          <div className="standing-stat">{standing.e}</div>
                          <div className="standing-stat">{standing.p}</div>
                          <div className="standing-pts">{standing.pts}</div>
                        </div>
                      ))}
                    </div>

                    <div className="group-matches">
                      {group.matches.map((match) => (
                        <div key={match.id} className="group-match-row">
                          <div className="match-team">
                            <Flag code={match.team1.flag} name={match.team1.name} />
                            <span className="match-team-name">{match.team1.name}</span>
                          </div>

                          <div className="match-score-box" style={{ gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
                            <button
                              className={`btn btn-sm ${match.result === "team1" ? "btn-primary" : "btn-ghost"}`}
                              onClick={() => updateMatch(group.id, match.id, "team1")}
                            >
                              Gana
                            </button>
                            <button
                              className={`btn btn-sm ${match.result === "draw" ? "btn-primary" : "btn-ghost"}`}
                              onClick={() => updateMatch(group.id, match.id, "draw")}
                            >
                              Empate
                            </button>
                            <button
                              className={`btn btn-sm ${match.result === "team2" ? "btn-primary" : "btn-ghost"}`}
                              onClick={() => updateMatch(group.id, match.id, "team2")}
                            >
                              Gana
                            </button>
                          </div>

                          <div className="match-team right">
                            <Flag code={match.team2.flag} name={match.team2.name} />
                            <span className="match-team-name">{match.team2.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {allGroupsComplete(groups) && (
              <div className="next-round-bar">
                <button className="btn btn-primary" onClick={() => setStage("thirds")}>
                  ✅ Seleccionar Mejores Terceros →
                </button>
              </div>
            )}
          </>
        )}

        {stage === "thirds" && (
          <>
            <div className="controls">
              <button className="btn btn-ghost" onClick={() => setStage("groups")}>
                ← Volver a Grupos
              </button>
              <button className="btn btn-primary" onClick={advanceToKnockout} disabled={selectedThirds.length !== 8}>
                ⚽ Avanzar a la Fase Final →
              </button>
            </div>

            <div className="section-title">🥉 Selección de Mejores Terceros</div>
            <div className="thirds-info">
              Seleccioná <strong>8 de 12</strong> equipos terceros. Seleccionados: <strong style={{ color: selectedThirds.length === 8 ? "var(--green)" : "var(--gold)" }}>{selectedThirds.length}/8</strong>
            </div>

            <div className="thirds-grid">
              {thirdPlaceTeams.map((standing) => {
                const isSelected = selectedThirds.some((team) => team.id === standing.team.id);
                const disabled = !isSelected && selectedThirds.length >= 8;

                return (
                  <div
                    key={standing.team.id}
                    className={`third-card ${isSelected ? "selected" : ""}`}
                    style={{ opacity: disabled ? 0.5 : 1, cursor: disabled ? "not-allowed" : "pointer" }}
                    onClick={() => !disabled && toggleThird(standing.team)}
                  >
                    <Flag code={standing.team.flag} name={standing.team.name} />
                    <div className="third-card-info">
                      <div className="third-card-name">{standing.team.name}</div>
                      <div className="third-card-stats">
                        Grupo {standing.team.group} · {standing.pts} pts · {standing.g} ganados
                      </div>
                    </div>
                    <div className="third-card-check">{isSelected ? "✓" : ""}</div>
                  </div>
                );
              })}
            </div>

            {selectedThirds.length === 8 && (
              <div className="next-round-bar">
                <button className="btn btn-primary" onClick={advanceToKnockout}>
                  🏆 Comenzar Fase Final →
                </button>
              </div>
            )}
          </>
        )}

        {stage === "knockout" && (
          <>
            {champion && currentRound === "final" ? (
              <div className="champion-screen">
                <div className="champion-flag">
                  <Flag code={champion.flag} name={champion.name} size="big" />
                </div>
                <div className="champion-title">¡{champion.name.toUpperCase()} CAMPEÓN DEL MUNDO!</div>
                <div className="champion-subtitle">🏆 FIFA World Cup 2026 🏆</div>
                <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
                  <button
                    className="btn btn-primary"
                    onClick={irAParticipar}
                    disabled={savingPrediction}
                  >
                    {savingPrediction ? "Guardando..." : "🏆 Participar por el Premio"}
                  </button>

                  <button className="btn btn-danger" onClick={resetAll}>
                    🔄 Nueva Simulación
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="controls">
                  <button className="btn btn-ghost" onClick={() => setStage("thirds")}>
                    ← Terceros
                  </button>
                  <button className="btn btn-primary" onClick={simulateAllKnockout} disabled={currentRoundDone}>
                    ⚡ Simular Todos
                  </button>
                  {currentRoundDone && currentRound !== "final" && NEXT_ROUND[currentRound] && (
                    <button className="btn btn-secondary" onClick={advanceRound}>
                      Avanzar → {ROUND_LABELS[NEXT_ROUND[currentRound]]}
                    </button>
                  )}
                </div>

                <div className="knockout-controls">
                  <div className="round-tabs">
                    {ROUNDS.map((round) => {
                      const exists = bracket.some((match) => match.round === round);
                      const done = exists && bracket.filter((match) => match.round === round).every((match) => match.winner !== null && match.method !== null);

                      return (
                        <button
                          key={round}
                          className={`round-tab ${currentRound === round ? "active" : done ? "done" : ""}`}
                          disabled={!exists}
                          onClick={() => exists && setCurrentRound(round)}
                        >
                          {ROUND_SHORT_LABELS[round]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="section-title">🏆 {ROUND_LABELS[currentRound]}</div>

                <div className="matches-grid">
                  {roundMatches.map((match) => {
                    const hasResult = match.winner !== null && match.method !== null;

                    return (
                      <div key={match.id} className={`knockout-card ${hasResult ? "has-result" : ""}`}>
                        <div className="knockout-card-header">
                          {ROUND_LABELS[match.round]} · Partido {match.matchIndex + 1}
                        </div>

                        <div className="knockout-match" style={{ flexDirection: "column", alignItems: "stretch" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            {match.team1 ? (
                              <div className={`ko-team ${match.winner?.id === match.team1.id ? "winner" : ""}`}>
                                <Flag code={match.team1.flag} name={match.team1.name} />
                                <span className="ko-team-name">{match.team1.name}</span>
                              </div>
                            ) : (
                              <div className="ko-tbd">Por definir</div>
                            )}

                            <span className="ko-sep">VS</span>

                            {match.team2 ? (
                              <div className={`ko-team right ${match.winner?.id === match.team2.id ? "winner" : ""}`}>
                                <Flag code={match.team2.flag} name={match.team2.name} />
                                <span className="ko-team-name">{match.team2.name}</span>
                              </div>
                            ) : (
                              <div className="ko-tbd" style={{ justifyContent: "flex-end" }}>
                                Por definir
                              </div>
                            )}
                          </div>

                          <div style={{ display: "grid", gap: 8, marginTop: 14 }}>
                            <button
                              className={`btn ${match.winner?.id === match.team1?.id ? "btn-primary" : "btn-ghost"}`}
                              disabled={!match.team1 || !match.team2}
                              onClick={() => match.team1 && updateKnockoutWinner(match.id, match.team1)}
                            >
                              Gana {match.team1?.name ?? "Equipo 1"}
                            </button>

                            <button
                              className={`btn ${match.winner?.id === match.team2?.id ? "btn-primary" : "btn-ghost"}`}
                              disabled={!match.team1 || !match.team2}
                              onClick={() => match.team2 && updateKnockoutWinner(match.id, match.team2)}
                            >
                              Gana {match.team2?.name ?? "Equipo 2"}
                            </button>
                          </div>

                          {match.winner && (
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginTop: 14 }}>
                              <button
                                className={`btn btn-sm ${match.method === "normal" ? "btn-primary" : "btn-ghost"}`}
                                onClick={() => updateKnockoutMethod(match.id, "normal")}
                              >
                                Normal
                              </button>
                              <button
                                className={`btn btn-sm ${match.method === "suplementario" ? "btn-primary" : "btn-ghost"}`}
                                onClick={() => updateKnockoutMethod(match.id, "suplementario")}
                              >
                                Suplementario
                              </button>
                              <button
                                className={`btn btn-sm ${match.method === "penales" ? "btn-primary" : "btn-ghost"}`}
                                onClick={() => updateKnockoutMethod(match.id, "penales")}
                              >
                                Penales
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="ko-card-footer">
                          {match.winner ? (
                            <span style={{ fontSize: 12, color: "var(--green)" }}>
                              ✓ Pasa: {match.winner.name} {match.method ? `(${match.method})` : ""}
                            </span>
                          ) : (
                            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Sin resultado</span>
                          )}

                          <button className="btn btn-secondary btn-sm" disabled={!match.team1 || !match.team2} onClick={() => simulateKnockout(match.id)}>
                            🎲 Simular
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
