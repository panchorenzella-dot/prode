"use client";

export default function PerfilPage() {
  return (
    <main className="min-h-screen bg-[#060c1a] text-white px-5 py-8">
      <div className="max-w-6xl mx-auto grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 h-fit">
          <h2 className="text-2xl font-black text-yellow-300 mb-6">TU PERFIL</h2>

          <nav className="space-y-3">
            <a href="/perfil/datos-personales" className="block rounded-2xl bg-white/10 px-4 py-3 font-bold text-white">
              Datos personales
            </a>
            <a href="/perfil/resumen" className="block rounded-2xl bg-white/5 px-4 py-3 font-bold text-white/70">
              Resumen
            </a>
            <a href="/perfil/predicciones" className="block rounded-2xl bg-white/5 px-4 py-3 font-bold text-white/70">
              Predicciones
            </a>
            <a href="/perfil/transacciones" className="block rounded-2xl bg-white/5 px-4 py-3 font-bold text-white/70">
              Transacciones
            </a>
          </nav>

          <a href="/" className="mt-8 block rounded-full border border-white/10 bg-white/5 px-5 py-3 text-center font-bold text-white/70">
            ← Volver
          </a>
        </aside>

        <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
          <p className="text-sm text-cyan-300 mb-2">Panel de usuario</p>
          <h1 className="text-5xl font-black text-yellow-300 mb-4">Tu perfil</h1>
          <p className="text-white/60">
            Elegí una sección del menú de la izquierda.
          </p>
        </section>
      </div>
    </main>
  );
}