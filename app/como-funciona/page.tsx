export default function ComoFuncionaPage() {
  return (
    <main className="min-h-screen bg-[#07090f] px-5 py-8 text-white">
      <div className="mx-auto max-w-5xl">
        <a
          href="/"
          className="mb-8 inline-block rounded-full border border-white/10 bg-white/5 px-6 py-3 font-bold text-white/80"
        >
          ← Volver al inicio
        </a>

        <section className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-2xl md:p-10">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.35em] text-yellow-300/80">
            Prode Mundial 2026
          </p>

          <h1 className="text-4xl font-black text-yellow-300 md:text-6xl">
            CÓMO FUNCIONA
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/65">
            Armás tu predicción completa del Mundial 2026 antes de que empiece.
            Después, cuando se jueguen los partidos reales, se comparan tus
            elecciones con los resultados.
          </p>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2">
          <InfoCard
            title="1. Creá tu predicción"
            text="Entrás al simulador, completás la fase de grupos, elegís los mejores terceros y avanzás selección por selección hasta elegir campeón."
          />

          <InfoCard
            title="2. Guardás y participás"
            text="Cuando terminás tu predicción, tocás Participar por el Premio. Para guardar la predicción necesitás iniciar sesión."
          />

          <InfoCard
            title="3. Completás el pago"
            text="Abrís el link de pago de AstroPay, pagás la participación y después tocás Listo, ya pagué para dejarla en revisión."
          />

          <InfoCard
            title="4. Se valida el pago"
            text="Tu predicción queda como Pago pendiente hasta que se revise. Una vez validada, queda confirmada y no se puede editar."
          />

          <InfoCard
            title="5. Cierre de predicciones"
            text="Las predicciones cierran antes del partido inaugural México vs Sudáfrica del 11 de junio de 2026."
          />

          <InfoCard
            title="6. Cómo se gana"
            text="Gana quien sume más puntos según los aciertos de resultados, clasificados, llaves y campeón. El sistema de puntos debe estar publicado antes del inicio."
          />
        </section>

        <section className="mt-8 rounded-[28px] border border-yellow-300/20 bg-yellow-300/10 p-6">
          <h2 className="text-2xl font-black text-yellow-300">
            Estados de una predicción
          </h2>

          <div className="mt-5 grid gap-3 md:grid-cols-4">
            <Status label="📝 Borrador" text="Todavía editable." />
            <Status label="⏳ Pago pendiente" text="En revisión." />
            <Status label="✅ Validada" text="Confirmada." />
            <Status label="❌ Rechazada" text="No validada." />
          </div>
        </section>

        <section className="mt-8 rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-2xl font-black text-white">
            Importante
          </h2>

          <p className="mt-3 text-white/60 leading-7">
            Después de enviar una predicción a revisión, no se puede modificar.
            Esto evita cambios después del pago y mantiene la competencia justa.
          </p>
        </section>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="/prediccion"
            className="rounded-2xl bg-white px-6 py-4 font-black text-black"
          >
            Crear mi predicción
          </a>

          <a
            href="/mis-predicciones"
            className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 font-black text-white/80"
          >
            Ver mis predicciones
          </a>
        </div>
      </div>
    </main>
  );
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-6">
      <h2 className="text-xl font-black text-yellow-300">{title}</h2>
      <p className="mt-3 leading-7 text-white/60">{text}</p>
    </div>
  );
}

function Status({ label, text }: { label: string; text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="font-black text-white">{label}</p>
      <p className="mt-1 text-sm text-white/50">{text}</p>
    </div>
  );
}