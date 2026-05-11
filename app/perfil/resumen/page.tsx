"use client";

import { supabase } from "@/lib/supabaseClient";

export default function ResumenPage() {
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

            <a href="/perfil/resumen" className="block rounded-2xl bg-yellow-300 px-4 py-3 font-black text-black">
              Resumen
            </a>

            <a href="/perfil/predicciones" className="block rounded-2xl bg-white/5 px-4 py-3 font-bold text-white/70">
              Predicciones
            </a>

            <a href="/perfil/transacciones" className="block rounded-2xl bg-white/5 px-4 py-3 font-bold text-white/70">
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
            Resumen
          </p>

          <h1 className="text-5xl font-black text-yellow-300 mb-8">
            Mi actividad
          </h1>

          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-3xl bg-gradient-to-br from-amber-400 to-orange-400 p-6 text-black">
              <p className="text-sm font-semibold opacity-70">
                Predicciones
              </p>

              <p className="mt-3 text-5xl font-black">
                0
              </p>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-cyan-300 to-blue-400 p-6 text-black">
              <p className="text-sm font-semibold opacity-70">
                Validadas
              </p>

              <p className="mt-3 text-5xl font-black">
                0
              </p>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-green-300 to-emerald-500 p-6 text-black">
              <p className="text-sm font-semibold opacity-70">
                Disponibles
              </p>

              <p className="mt-3 text-5xl font-black">
                15
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}