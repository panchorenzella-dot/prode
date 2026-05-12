"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function DatosPersonalesPage() {
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [dni, setDni] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");

  useEffect(() => {
    async function cargarDatos() {
      const { data } = await supabase.auth.getUser();

      const user = data.user;
      const meta = user?.user_metadata;

      setEmail(user?.email ?? "");
      setNombre(meta?.nombre ?? "");
      setApellido(meta?.apellido ?? "");
      setDni(meta?.dni ?? "");
      setFechaNacimiento(meta?.fechaNacimiento ?? "");
    }

    cargarDatos();
  }, []);

  async function cerrarSesion() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <main className="min-h-screen bg-[#060c1a] text-white px-5 py-8">
      <div className="max-w-6xl mx-auto grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 h-fit">
          <h2 className="text-2xl font-black text-yellow-300 mb-6">TU PERFIL</h2>
<a
  href="/"
  className="mb-4 block rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-center font-black text-cyan-200"
>
  ← Volver al Menú Principal
</a>
          <nav className="space-y-3">
            <a href="/perfil/datos-personales" className="block rounded-2xl bg-yellow-300 px-4 py-3 font-black text-black">
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

          <button
            onClick={cerrarSesion}
            className="mt-8 w-full rounded-full border border-red-400/20 bg-red-400/10 px-5 py-3 font-black text-red-200"
          >
            Cerrar sesión
          </button>
        </aside>

        <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
          <p className="text-sm text-cyan-300 mb-2">Datos personales</p>
          <h1 className="text-5xl font-black text-yellow-300 mb-8">
            Mi información
          </h1>

          <div className="grid gap-4 md:grid-cols-2">
            <Dato label="Nombre" value={nombre || "No cargado"} />
            <Dato label="Apellido" value={apellido || "No cargado"} />
            <Dato label="Email" value={email || "No cargado"} />
            <Dato label="DNI" value={dni || "No cargado"} />
            <Dato label="Contraseña" value="••••••••" />
          </div>

          <p className="mt-6 text-sm text-white/40">
            La contraseña no se puede ver por seguridad. Más adelante podemos agregar “Cambiar contraseña”.
          </p>
        </section>
      </div>
    </main>
  );
}

function Dato({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
      <p className="mb-1 text-xs font-bold uppercase tracking-[1px] text-white/40">
        {label}
      </p>
      <p className="break-all text-lg font-black text-white">
        {value}
      </p>
    </div>
  );
}