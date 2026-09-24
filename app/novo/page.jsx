"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Editor from "../../lib/Editor";

const CHAVE = "painel_novo_rascunho";

export default function NovoRoteiro() {
  const router = useRouter();
  const [valores, setValores] = useState({ phase: "A definir", day: "" });
  const [mais, setMais] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);
  const carregou = useRef(false);

  // rascunho local: se fechar sem querer, não perde a ideia
  useEffect(() => {
    try {
      const r = JSON.parse(localStorage.getItem(CHAVE) || "null");
      if (r && typeof r === "object") setValores((v) => ({ ...v, ...r }));
    } catch {}
    carregou.current = true;
  }, []);
  useEffect(() => {
    if (!carregou.current) return;
    try { localStorage.setItem(CHAVE, JSON.stringify(valores)); } catch {}
  }, [valores]);

  function mudar(key, value) {
    setValores((v) => ({ ...v, [key]: value }));
    if (erro) setErro(null);
  }

  async function criar() {
    if (!(valores.title || "").trim()) { setErro("Dá um título pro roteiro"); return; }
    setSalvando(true);
    try {
      const res = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(valores),
      });
      if (res.status === 401) { window.location.href = "/login"; return; }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao criar");
      try { localStorage.removeItem(CHAVE); } catch {}
      router.replace(`/card/${encodeURIComponent(data.card.id)}`);
    } catch (e) {
      setErro(e.message);
      setSalvando(false);
    }
  }

  function descartar() {
    try { localStorage.removeItem(CHAVE); } catch {}
    router.push("/");
  }

  return (
    <div style={{ paddingBottom: 120 }}>
      <div className="tp-top">
        <div className="linha1">
          <button className="btn-voltar" onClick={() => router.push("/")}>←</button>
          <h1><span className="cid">NOVO ROTEIRO</span>Anota a ideia, completa depois</h1>
        </div>
      </div>

      <Editor valores={valores} onChange={mudar} focoCampo="title" camposExtrasAbertos={mais} />

      {!mais && (
        <button className="ed-mais" onClick={() => setMais(true)}>+ Mais campos (legenda, texto na tela, CTA...)</button>
      )}

      {erro && <div className="ed-erro">{erro}</div>}

      <div className="ed-barra">
        <button className="ed-descartar" onClick={descartar}>Descartar</button>
        <button className="ed-criar" onClick={criar} disabled={salvando}>{salvando ? "Criando..." : "Criar roteiro"}</button>
      </div>
    </div>
  );
}
