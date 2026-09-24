"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { REFERENCIAS } from "./referencias";
import { FASES, faseClasse } from "./fases";

// Link público de busca na Biblioteca de Anúncios da Meta (anúncios ativos no Brasil).
export const linkMeta = (q) =>
  "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=BR&search_type=keyword_unordered&q=" + encodeURIComponent(q);

export default function Biblioteca({ demo }) {
  const router = useRouter();
  const [fase, setFase] = useState("todas");
  const [aberto, setAberto] = useState(null);
  const [criando, setCriando] = useState(null);
  const [msg, setMsg] = useState(null);
  const fases = FASES.filter((f) => REFERENCIAS.some((r) => r.fase === f));
  const lista = REFERENCIAS.filter((r) => fase === "todas" || r.fase === fase);

  async function usar(r) {
    if (demo) { setMsg("Na demonstração nada é salvo. Crie o teu painel pra usar esse botão."); return; }
    setCriando(r.id);
    try {
      const res = await fetch("/api/cards", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: r.titulo, phase: r.fase, hook: r.hook, script: r.script, screen_text: r.screen_text,
          format: r.formato, shot_notes: r.descricao, editor_note: "Por que funciona: " + r.porque,
          source_ref: linkMeta(r.busca),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Não deu pra criar");
      router.push(`/card/${encodeURIComponent(data.card.id)}?novo=1`);
    } catch (e) {
      setMsg(String(e.message || e));
      setCriando(null);
    }
  }

  return (
    <div className="biblio">
      <p className="biblio-intro">Formatos que costumam funcionar em cada fase da Black. Abra um, veja por que funciona e toque em <b>Usar como roteiro</b>: ele vira um card na coluna A gravar, pronto pra você trocar os [colchetes].</p>
      <div className="filters fases">
        <button className={"chip" + (fase === "todas" ? " ativo" : "")} onClick={() => setFase("todas")}>Todas as fases</button>
        {fases.map((f) => (
          <button key={f} className={"chip " + faseClasse(f) + (fase === f ? " ativo" : "")} onClick={() => setFase(f)}>
            <span className="fdot" />{f}
          </button>
        ))}
      </div>
      <div className="biblio-grid">
        {lista.map((r) => {
          const ab = aberto === r.id;
          return (
            <div className={"ref" + (ab ? " aberta" : "")} key={r.id}>
              <button className="ref-top" onClick={() => setAberto(ab ? null : r.id)}>
                <span className={"tag fase " + faseClasse(r.fase)}><span className="fdot" />{r.fase}</span>
                <h3>{r.titulo}</h3>
                <div className="ref-formato">{r.formato}</div>
                <p>{r.descricao}</p>
                <span className="ref-mais">{ab ? "Fechar ▲" : "Ver roteiro ▼"}</span>
              </button>
              {ab && (
                <div className="ref-corpo">
                  <div className="ref-bloco"><div className="l">Por que funciona</div><p>{r.porque}</p></div>
                  <div className="ref-bloco"><div className="l">Esqueleto do roteiro</div><pre>{r.script}</pre></div>
                  <div className="ref-bloco"><div className="l">Texto na tela</div><p>{r.screen_text}</p></div>
                  <a className="ref-link" href={linkMeta(r.busca)} target="_blank" rel="noreferrer">Ver exemplos reais na Biblioteca de Anúncios da Meta ↗</a>
                </div>
              )}
              <button className="ref-usar" disabled={criando === r.id} onClick={() => usar(r)}>
                {criando === r.id ? "Criando..." : "＋ Usar como roteiro"}
              </button>
            </div>
          );
        })}
      </div>
      {msg && <div className="toast"><span>{msg}</span><button onClick={() => setMsg(null)}>OK</button></div>}
    </div>
  );
}
