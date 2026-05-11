"use client";

import { supabase } from "@/lib/supabaseClient";

export default function TransaccionesPage() {
  async function cerrarSesion() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <main className="min-h-screen bg-[#060c1a] text-white px-5 py-8">
      <div className="max-w-6xl mx-auto grid gap-6 lg:grid-cols-[260px_1fr]">

        <aside className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 h-fit">
          <h2 className="text-2xl font-black text-yellow-300 mb-6">
            TU PERFIL
          </h2>

          <nav className="space-y-3">
            <a href="/perfil/datos-personales" className="block rounded-2xl bg-white/5 px-4 py-3 font-bold text-white/70">
              Datos personales
            </a>

            <a href="/perfil/resumen" className="block rounded-2xl bg-white/5 px-4 py-3 font-bold text-white/70">
              Resumen
            </a>

            <a href="/perfil/predicciones" className="block rounded-2xl bg-white/5 px-4 py-3 font-bold text-white/70">
              Predicciones
            </a>

            <a href="/perfil/transacciones" className="block rounded-2xl bg-yellow-300 px-4 py-3 font-black text-black">
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
          <p className="text-sm text-cyan-300 mb-2">
            Transacciones
          </p>

          <h1 className="text-5xl font-black text-yellow-300 mb-8">
            Historial de pagos
          </h1>

          <div className="rounded-3xl border border-yellow-400/20 bg-yellow-400/10 p-6">
            <p className="text-lg font-black text-yellow-300">
              No hay transacciones registradas
            </p>

            <p className="mt-3 text-white/60">
              Cuando participes por el premio y una predicción sea validada,
              los pagos aparecerán acá.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}