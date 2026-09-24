"use client";

import { useState } from "react";

export default function LoginPage() {
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setErro(null);
    const password = new FormData(event.currentTarget).get("password");
    try {
      const res = await fetch("/api/panel-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        window.location.href = "/";
      } else {
        setErro("Senha incorreta. Tenta de novo.");
        setLoading(false);
      }
    } catch {
      setErro("Falha de conexão. Tenta de novo.");
      setLoading(false);
    }
  }

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={submit}>
        <div className="logo">G</div>
        <h1>Painel de Gravação</h1>
        <p>Roteiros e gravações da Black Friday</p>
        {erro && <div className="erro">{erro}</div>}
        <input name="password" type="password" placeholder="Senha do painel" autoFocus autoComplete="current-password" />
        <button type="submit" disabled={loading}>{loading ? "Entrando..." : "Entrar"}</button>
      </form>
    </div>
  );
}
