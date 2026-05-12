"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Bebas+Neue&display=swap');
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
:root{--gold:#ffd700;--gold2:#ffed4e;--cyan:#00d4ff;--blue-dark:#060c1a;--glass:rgba(255,255,255,0.04);--glass-border:rgba(255,255,255,0.10);--glass-hover:rgba(255,255,255,0.08);--red:#ff4757;--green:#2ed573;--text-muted:rgba(255,255,255,0.55)}
body{font-family:'Inter',sans-serif;background:var(--blue-dark);color:#fff;min-height:100vh;overflow-x:hidden}
.participar-app{min-height:100vh;background:radial-gradient(ellipse at top,#0d2060 0%,#060c1a 60%);padding:20px 20px 70px}
.top-bar{max-width:1100px;margin:0 auto 30px;display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}
.logo-text{font-family:'Bebas Neue',sans-serif;font-size:1.7rem;letter-spacing:2px;color:var(--gold)}
.btn{padding:12px 28px;border:none;border-radius:100px;font-family:'Inter',sans-serif;font-size:14px;font-weight:700;cursor:pointer;transition:all 0.25s cubic-bezier(0.34,1.56,0.64,1);letter-spacing:0.5px;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;gap:8px}
.btn-primary{background:linear-gradient(135deg,#ffd700,#ff9500);color:#000;box-shadow:0 4px 20px rgba(255,215,0,0.25)}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(255,215,0,0.4)}
.btn-ghost{background:var(--glass);border:1px solid var(--glass-border);color:rgba(255,255,255,0.8)}
.btn-ghost:hover{background:var(--glass-hover);transform:translateY(-2px)}
.btn:disabled{opacity:.45;cursor:not-allowed;transform:none!important}
.hero{text-align:center;max-width:900px;margin:0 auto 34px;padding-top:25px}
.badge{display:inline-block;background:linear-gradient(135deg,rgba(255,215,0,0.15),rgba(255,215,0,0.05));border:1px solid rgba(255,215,0,0.3);border-radius:30px;padding:6px 18px;font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:var(--gold);margin-bottom:18px}
h1{font-family:'Bebas Neue',sans-serif;font-size:clamp(2.6rem,6vw,5rem);letter-spacing:4px;background:linear-gradient(135deg,#fff 0%,var(--gold) 50%,var(--gold2) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1;margin-bottom:14px}
.hero p{color:var(--text-muted);font-size:16px;line-height:1.6}
.main-grid{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:22px;align-items:start}
.card{background:var(--glass);border:1px solid var(--glass-border);border-radius:24px;padding:24px;box-shadow:0 18px 60px rgba(0,0,0,0.25)}
.card-title{font-family:'Bebas Neue',sans-serif;font-size:1.8rem;letter-spacing:2px;color:var(--gold);margin-bottom:8px}
.card-subtitle{font-size:13px;color:var(--text-muted);line-height:1.5;margin-bottom:22px}
.form{display:flex;flex-direction:column;gap:14px}
.label{font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:rgba(255,255,255,0.75)}
.input{width:100%;height:48px;border:1px solid var(--glass-border);border-radius:14px;background:rgba(255,255,255,0.07);color:#fff;font-size:15px;font-weight:600;padding:0 14px;outline:none;transition:all 0.2s}
.input::placeholder{color:rgba(255,255,255,0.28)}
.input:focus{border-color:var(--gold);background:rgba(255,215,0,0.08);box-shadow:0 0 0 3px rgba(255,215,0,0.08)}
.input-group{display:flex;flex-direction:column;gap:7px}
.notice{margin-top:14px;border:1px solid rgba(0,212,255,0.25);background:rgba(0,212,255,0.07);border-radius:16px;padding:14px;color:rgba(255,255,255,0.75);font-size:13px;line-height:1.5}
.qr-box{display:flex;flex-direction:column;align-items:center;text-align:center;gap:16px}
.amount-box{width:100%;display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:8px}
.amount-item{background:rgba(255,255,255,0.045);border:1px solid var(--glass-border);border-radius:16px;padding:14px;text-align:left}
.amount-label{font-size:11px;text-transform:uppercase;letter-spacing:1px;color:var(--text-muted);font-weight:800;margin-bottom:4px}
.amount-value{font-size:20px;font-weight:900;color:#fff}
.qr-placeholder{width:260px;height:260px;border-radius:24px;background:#fff;display:flex;align-items:center;justify-content:center;padding:14px;box-shadow:0 20px 60px rgba(0,0,0,0.35)}
.qr-img{width:100%;height:100%;object-fit:contain;border-radius:16px}
.steps{display:flex;flex-direction:column;gap:10px;margin-top:18px;width:100%}
.step{display:flex;align-items:center;gap:10px;background:rgba(255,255,255,0.035);border:1px solid var(--glass-border);border-radius:14px;padding:12px;text-align:left;font-size:13px;color:rgba(255,255,255,0.75)}
.step-num{width:26px;height:26px;border-radius:50%;background:var(--gold);color:#000;font-size:12px;font-weight:900;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.success-box{margin-top:16px;border:1px solid rgba(46,213,115,0.35);background:rgba(46,213,115,0.08);border-radius:16px;padding:14px;color:rgba(255,255,255,0.78);font-size:13px;line-height:1.5}
.error-box{margin-top:16px;border:1px solid rgba(255,71,87,0.35);background:rgba(255,71,87,0.08);border-radius:16px;padding:14px;color:rgba(255,255,255,0.78);font-size:13px;line-height:1.5}
@media(max-width:850px){.main-grid{grid-template-columns:1fr}.amount-box{grid-template-columns:1fr}.qr-placeholder{width:220px;height:220px}.top-bar{justify-content:center}.logo-text{width:100%;text-align:center}}
`;

export default function ParticiparPage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [usuario, setUsuario] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (document.getElementById("participar-styles")) return;

    const tag = document.createElement("style");
    tag.id = "participar-styles";
    tag.textContent = CSS;
    document.head.appendChild(tag);

    return () => {
      document.getElementById("participar-styles")?.remove();
    };
  }, []);

  useEffect(() => {
    async function cargarUsuario() {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        window.location.href = "/login";
        return;
      }

      setEmail(data.user.email ?? "");

      const meta = data.user.user_metadata;
      const nombreCompleto = `${meta?.nombre ?? ""} ${meta?.apellido ?? ""}`.trim();

      setNombre(nombreCompleto);
      setUsuario(meta?.nombre ?? "");
    }

    cargarUsuario();
  }, []);

  const puedeGuardar = nombre.trim() && email.trim() && whatsapp.trim();

  async function listoYaPague() {
    setErrorMsg("");
    setMensaje("");

    if (!puedeGuardar) {
      setErrorMsg("Completá nombre, email y WhatsApp antes de confirmar.");
      return;
    }

    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const predictionId =
      new URLSearchParams(window.location.search).get("prediction_id") ||
      localStorage.getItem("current_prediction_id");

    if (!predictionId) {
      setErrorMsg(
        "No encontré la predicción guardada. Volvé a hacer la predicción y tocá Participar por el Premio."
      );
      setLoading(false);
      return;
    }

    const { data: prediccionActual, error: readError } = await supabase
      .from("predictions")
      .select("prediction_data")
      .eq("id", predictionId)
      .eq("user_id", user.id)
      .single();

    if (readError || !prediccionActual) {
      setErrorMsg("No pude encontrar tu predicción guardada.");
      setLoading(false);
      return;
    }

const { error: updateError } = await supabase
  .from("predictions")
  .update({
    email,
    nombre,
    status: "en_revision",
    submitted_at: new Date().toISOString(),
    prediction_data: {
      ...prediccionActual.prediction_data,
      participante: {
        nombre,
        email,
        whatsapp,
        usuario,
      },
      pago: {
        metodo: "AstroPay",
        monto: 500,
        confirmado_por_usuario: true,
        confirmado_at: new Date().toISOString(),
      },
    },
  })
  .eq("id", predictionId)
  .eq("user_id", user.id);
    if (updateError) {
      setErrorMsg(updateError.message);
      setLoading(false);
      return;
    }

    localStorage.removeItem("current_prediction_id");

    setMensaje("Listo. Tu predicción quedó en revisión.");
    setLoading(false);

    setTimeout(() => {
      window.location.href = "/perfil/predicciones";
    }, 1200);
  }

  return (
    <main className="participar-app">
      <div className="top-bar">
        <div className="logo-text">MUNDIAL 2026</div>
        <a href="/" className="btn btn-ghost">
          ← Volver al Menú Principal
        </a>
      </div>

      <section className="hero">
        <div className="badge">Participá por el Premio</div>
        <h1>CONFIRMÁ TU PREDICCIÓN</h1>
        <p>Completá tus datos, pagá con el QR y tocá “Listo, ya pagué”.</p>
      </section>

      <section className="main-grid">
        <div className="card">
          <div className="card-title">1. Tus datos</div>
          <div className="card-subtitle">
            Estos datos sirven para identificar tu participación.
          </div>

          <div className="form">
            <div className="input-group">
              <label className="label">Nombre completo</label>
              <input
                className="input"
                value={nombre}
                onChange={(event) => setNombre(event.target.value)}
                placeholder="Ej: Francisco Renzella"
              />
            </div>

            <div className="input-group">
              <label className="label">Email</label>
              <input
                className="input"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="tuemail@gmail.com"
              />
            </div>

            <div className="input-group">
              <label className="label">WhatsApp</label>
              <input
                className="input"
                value={whatsapp}
                onChange={(event) => setWhatsapp(event.target.value)}
                placeholder="Ej: 223 555 5555"
              />
            </div>

            <div className="input-group">
              <label className="label">Usuario o apodo</label>
              <input
                className="input"
                value={usuario}
                onChange={(event) => setUsuario(event.target.value)}
                placeholder="Ej: Pancho10"
              />
            </div>
          </div>

          {mensaje && <div className="success-box">{mensaje}</div>}
          {errorMsg && <div className="error-box">{errorMsg}</div>}
        </div>

        <div className="card">
          <div className="card-title">2. Pago con QR</div>
          <div className="card-subtitle">
            Escaneá el QR con AstroPay y pagá la participación.
          </div>

          <div className="amount-box">
            <div className="amount-item">
              <div className="amount-label">Participación</div>
              <div className="amount-value">$500</div>
            </div>

            <div className="amount-item">
              <div className="amount-label">Método</div>
              <div className="amount-value">AstroPay</div>
            </div>
          </div>

          <div className="qr-box">
            <div className="qr-placeholder">
              <img
                src="/astropay-qr.png"
                alt="QR de pago AstroPay"
                className="qr-img"
              />
            </div>

            <div className="steps">
              <div className="step">
                <div className="step-num">1</div>
                Escaneá el QR con AstroPay.
              </div>

              <div className="step">
                <div className="step-num">2</div>
                Pagá la participación indicada.
              </div>

              <div className="step">
                <div className="step-num">3</div>
                Después de pagar, tocá el botón “Listo, ya pagué”.
              </div>
            </div>

            <button
              className="btn btn-primary"
              onClick={listoYaPague}
              disabled={loading || !puedeGuardar}
            >
              {loading ? "Guardando..." : "✅ Listo, ya pagué"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}