"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  async function login() {
    if (!email.trim() || !password.trim()) {
      setMensaje("Completá email y contraseña.");
      return;
    }

    setLoading(true);
    setMensaje("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMensaje(error.message);
      setLoading(false);
      return;
    }

    window.location.href = "/mis-predicciones";
  }

  return (
    <main className="min-h-screen bg-[#060c1a] text-white px-5 py-8">
      <div className="max-w-xl mx-auto text-center pt-10">
        <a
          href="/"
          className="inline-block mb-8 rounded-full border border-white/10 bg-white/5 px-6 py-3 font-bold text-white/80"
        >
          ← Volver al Menú Principal
        </a>

        <div className="inline-block rounded-full border border-yellow-400/30 bg-yellow-400/10 px-5 py-2 text-xs font-bold tracking-[2px] text-yellow-300 uppercase mb-5">
          Mundial 2026
        </div>

        <h1 className="font-black text-5xl mb-4 text-yellow-300">
          INICIAR SESIÓN
        </h1>

        <p className="text-white/55 mb-8 leading-relaxed">
          Entrá a tu cuenta para guardar tus predicciones y participar por el premio.
        </p>

        <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-6 shadow-2xl text-left">
          <label className="block text-xs font-black tracking-[1px] uppercase text-white/70 mb-3">
            Email
          </label>

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tuemail@gmail.com"
            className="w-full h-12 rounded-2xl border border-white/10 bg-white/[0.07] px-4 font-semibold text-white outline-none mb-5"
          />

          <label className="block text-xs font-black tracking-[1px] uppercase text-white/70 mb-3">
            Contraseña
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full h-12 rounded-2xl border border-white/10 bg-white/[0.07] px-4 font-semibold text-white outline-none"
          />

          <button
            onClick={login}
            disabled={loading}
            className="mt-5 w-full rounded-full bg-gradient-to-r from-yellow-300 to-orange-400 px-7 py-3 font-black text-black transition hover:scale-[1.01] disabled:opacity-50"
          >
            {loading ? "Cargando..." : "Entrar"}
          </button>

          {mensaje && (
            <div className="mt-5 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-white/70">
              {mensaje}
            </div>
          )}

          <div className="mt-6 border-t border-white/10 pt-6 text-center">
            <p className="text-white/45 text-sm mb-4">
              ¿No tenés cuenta?
            </p>

            <a
              href="/register"
              className="inline-block rounded-full border border-white/10 bg-white/5 px-6 py-3 font-bold text-white/80"
            >
              Crear cuenta
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}