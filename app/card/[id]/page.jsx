"use client";

import { useCallback, useEffect, useRef, useState, use } from "react";
import { useRouter } from "next/navigation";
import { faseClasse } from "../../../lib/fases";
import Editor from "../../../lib/Editor";
import { useAutosave } from "../../../lib/useAutosave";
import { EDITAVEIS } from "../../../lib/campos";

const COLUNAS = [
  { id: "a_gravar", label: "A gravar" },
  { id: "gravando", label: "Gravando" },
  { id: "gravado", label: "Gravado" },
  { id: "regravar", label: "Regravar" },
];

export default function CardPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [card, setCard] = useState(null);
  const [erro, setErro] = useState(null);
  const [rolling, setRolling] = useState(false);
  const [vel, setVel] = useState(40); // px por segundo
  const [fonte, setFonte] = useState(26);
  const [notes, setNotes] = useState("");
  const [salvo, setSalvo] = useState(false);
  const restoRef = useRef(0);
  const rafRef = useRef(null);
  const ultimoRef = useRef(null);
  const [editando, setEditando] = useState(false);
  const [draft, setDraft] = useState({});
  const [foco, setFoco] = useState(null);
  const [confirmarApagar, setConfirmarApagar] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [apagando, setApagando] = useState(false);
  const editandoRef = useRef(false);
  useEffect(() => { editandoRef.current = editando; }, [editando]);
  const onSaved = useCallback((c) => {
    setCard((antigo) => (antigo ? { ...antigo, ...c, take_notes: antigo.take_notes } : c));
  }, []);
  const { mudar, flush, estado, erro: erroSalvar } = useAutosave(id, onSaved);

  function abrirEdicao(campo) {
    if (!card) return;
    const d = {};
    for (const k of EDITAVEIS) d[k] = card[k] ?? "";
    setDraft(d);
    setFoco(campo || null);
    setRolling(false);
    setEditando(true);
  }

  async function copiarRoteiro() {
    const texto = (card.script || "").trim();
    if (!texto) return;
    let ok = false;
    try { await navigator.clipboard.writeText(texto); ok = true; } catch {}
    if (!ok) {
      // fallback pro Safari antigo / sem permissão de clipboard
      const ta = document.createElement("textarea");
      ta.value = texto; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.top = "-1000px"; ta.style.fontSize = "16px";
      document.body.appendChild(ta);
      const range = document.createRange(); range.selectNodeContents(ta);
      const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(range);
      ta.setSelectionRange(0, texto.length);
      try { ok = document.execCommand("copy"); } catch {}
      document.body.removeChild(ta);
    }
    setCopiado(ok ? "ok" : "erro");
    setTimeout(() => setCopiado(false), 2500);
  }

  async function apagar() {
    setApagando(true);
    try {
      const r = await fetch(`/api/cards/${encodeURIComponent(card.id)}`, { method: "DELETE" });
      if (!r.ok) throw new Error("falhou");
      router.push(`/?apagado=${encodeURIComponent(card.id)}`);
    } catch {
      setApagando(false);
      setConfirmarApagar(false);
      alert("Não consegui apagar. Tenta de novo.");
    }
  }

  async function fecharEdicao() {
    await flush();
    setEditando(false);
    setFoco(null);
    window.scrollTo({ top: 0 });
    carregar();
  }

  function mudarCampo(key, value, imediato) {
    setDraft((d) => ({ ...d, [key]: value }));
    if (key === "title" && !value.trim()) return; // não salva título vazio
    mudar(key, value);
    if (imediato) flush();
  }

  async function carregar() {
    try {
      const res = await fetch("/api/cards", { cache: "no-store" });
      if (res.status === 401) { window.location.href = "/login"; return; }
      const data = await res.json();
      const c = (data.cards || []).find((x) => x.id === id);
      if (c) {
        setCard((antigo) => {
          // durante a edição, só atualiza o status (não pisa no que está sendo digitado)
          if (antigo && editandoRef.current) return { ...antigo, status: c.status };
          // não pisa nas notas enquanto a pessoa digita
          if (antigo && document.activeElement && document.activeElement.id === "take-notes") {
            return { ...c, take_notes: antigo.take_notes };
          }
          return c;
        });
      } else setErro("Roteiro não encontrado");
    } catch {
      setErro("Falha de conexão");
    }
  }

  useEffect(() => {
    carregar();
    const t = setInterval(carregar, 6000);
    return () => clearInterval(t);
  }, [id]);

  useEffect(() => { if (card) setNotes(card.take_notes || ""); }, [card && card.id]);

  // teleprompter auto-scroll
  useEffect(() => {
    if (!rolling) { if (rafRef.current) cancelAnimationFrame(rafRef.current); ultimoRef.current = null; return; }
    function passo(ts) {
      if (ultimoRef.current == null) ultimoRef.current = ts;
      const dt = (ts - ultimoRef.current) / 1000;
      ultimoRef.current = ts;
      // acumula frações de pixel: no iPhone, rolar 0,5px por vez arredonda pra zero e o texto não anda
      restoRef.current += vel * dt;
      const px = Math.floor(restoRef.current);
      if (px >= 1) { window.scrollBy(0, px); restoRef.current -= px; }
      const fim = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (fim) { setRolling(false); return; }
      rafRef.current = requestAnimationFrame(passo);
    }
    rafRef.current = requestAnimationFrame(passo);
    // mantém a tela acesa enquanto o teleprompter roda (quando o navegador deixa)
    let trava = null;
    try { navigator.wakeLock?.request("screen").then((t) => { trava = t; }).catch(() => {}); } catch {}
    return () => { cancelAnimationFrame(rafRef.current); try { trava && trava.release(); } catch {} };
  }, [rolling, vel]);

  async function mudarStatus(status) {
    setCard((c) => ({ ...c, status }));
    await fetch(`/api/cards/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  async function salvarNotas() {
    const res = await fetch(`/api/cards/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ take_notes: notes }),
    });
    if (res.ok) {
      setSalvo(true);
      setTimeout(() => setSalvo(false), 2500);
      carregar();
    }
  }

  if (erro) return <div className="empty" style={{ paddingTop: 60 }}>⚠️ {erro}</div>;
  if (!card) return <div className="empty" style={{ paddingTop: 60 }}>Carregando...</div>;

  const paragrafos = (card.script || "").split(/\n\s*\n/).filter(Boolean);

  return (
    <div className="card-page" style={{ paddingBottom: 110 }}>
      <div className="tp-top">
        <div className="linha1">
          <button className="btn-voltar" onClick={async () => { if (editando) await flush(); router.push("/"); }}>←</button>
          <h1><span className="cid">{card.id}</span>{editando ? (draft.title || card.title) : card.title}</h1>
          {editando ? (
            <button className="btn-editar pronto" onClick={fecharEdicao}>Pronto</button>
          ) : (
            <button className="btn-editar" onClick={() => abrirEdicao(null)}>✏️ Editar</button>
          )}
        </div>
        {editando && (
          <div className={"save-pill s-" + estado}>
            {estado === "salvando" ? "Salvando..." : estado === "erro" ? `Não salvou: ${erroSalvar || "erro"}. Tentando de novo ao digitar.` : estado === "salvo" ? "✓ Salvo, a equipe já vê" : "As mudanças salvam sozinhas"}
          </div>
        )}
        <div className="status-row">
          {COLUNAS.map((c) => (
            <button
              key={c.id}
              className={`status-btn s-${c.id}` + (card.status === c.id ? " ativo" : "")}
              onClick={() => mudarStatus(c.id)}
            >{c.label}</button>
          ))}
        </div>
      </div>

      {editando ? (
        <>
          <Editor valores={draft} onChange={mudarCampo} onBlur={() => flush()} focoCampo={foco} />
          <div className="ed-rodape">
            <button className="ed-pronto" onClick={fecharEdicao}>Pronto</button>
          </div>
          <div className="ed-apagar-wrap">
            <button className="ed-apagar" onClick={() => setConfirmarApagar(true)}>🗑 Apagar roteiro</button>
          </div>
          {confirmarApagar && (
            <div className="sheet-fundo" onClick={() => !apagando && setConfirmarApagar(false)}>
              <div className="sheet" onClick={(e) => e.stopPropagation()}>
                <h3>Apagar este roteiro?</h3>
                <p>“{draft.title || card.title}” sai do quadro pra todo mundo. Dá pra desfazer logo em seguida.</p>
                <button className="sheet-apagar" disabled={apagando} onClick={apagar}>{apagando ? "Apagando..." : "Apagar"}</button>
                <button className="sheet-cancelar" disabled={apagando} onClick={() => setConfirmarApagar(false)}>Cancelar</button>
              </div>
            </div>
          )}
        </>
      ) : (
      <>
      {card.script && (
        <div className="copiar-row">
          <button className={"btn-copiar" + (copiado === "ok" ? " ok" : "")} onClick={copiarRoteiro}>
            {copiado === "ok" ? "✓ Roteiro copiado" : copiado === "erro" ? "Não consegui copiar" : "📋 Copiar roteiro"}
          </button>
        </div>
      )}

      <div className="tp-script limpo" style={{ fontSize: fonte }} onDoubleClick={() => abrirEdicao("script")}>
        {paragrafos.map((p, i) => <p className="par" key={i}>{p}</p>)}
        {paragrafos.length === 0 && (
          <button className="add-roteiro" onClick={() => abrirEdicao("script")}>+ Escrever o roteiro</button>
        )}
      </div>

      <details className="tp-detalhes">
        <summary>Hook, legenda, cena e detalhes</summary>

        {card.hook && (
          <div className="tp-section">
            <h2>Hook (0–3s)</h2>
            <div className="box tap" onClick={() => abrirEdicao("hook")}>{card.hook}</div>
          </div>
        )}

        {card.screen_text && (
          <div className="tp-section">
            <h2>Texto na tela</h2>
            <div className="box tap" onClick={() => abrirEdicao("screen_text")}>{card.screen_text}</div>
          </div>
        )}

        {card.caption && (
          <div className="tp-section">
            <h2>Copy / Legenda</h2>
            <div className="box tap" onClick={() => abrirEdicao("caption")}>{card.caption}</div>
          </div>
        )}

        {card.alt_hooks && (
          <div className="tp-section">
            <h2>Hooks alternativos</h2>
            <div className="box tap" onClick={() => abrirEdicao("alt_hooks")}>{card.alt_hooks}</div>
          </div>
        )}

        {card.bullets && (
          <div className="tp-section">
            <h2>Estrutura rápida</h2>
            <div className="box">{card.bullets}</div>
          </div>
        )}

        {card.shot_notes && (
          <div className="tp-section">
            <h2>Direção de cena</h2>
            <div className="box tap" onClick={() => abrirEdicao("shot_notes")}>{card.shot_notes}</div>
          </div>
        )}

        {card.editor_note && (
          <div className="tp-section">
            <h2>Nota do editor</h2>
            <div className="box tap" onClick={() => abrirEdicao("editor_note")}>{card.editor_note}</div>
          </div>
        )}

        <div className="tp-section">
          <h2>Ficha</h2>
          <div className="box tap ficha" onClick={() => abrirEdicao(null)}>
            {[
              ["Fase", card.phase], ["Dia", card.day_label], ["Formato", card.format], ["Cenário", card.setting],
              ["Figurino", card.outfit], ["Bloco", card.block_label], ["CTA", card.cta], ["Quando postar", card.post_when], ["Canal", card.channel],
            ].filter(([, v]) => v).map(([k, v]) => <div key={k}><b>{k}:</b> {v}</div>)}
          </div>
        </div>
      </details>

      <div className="tp-section notes-box">
        <h2>Melhor take / anotações</h2>
        <textarea
          id="take-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ex: take 3 ficou ótimo, usar a partir de 0:12..."
        />
        <button onClick={salvarNotas}>Salvar anotação</button>
        {salvo && <div className="salvo">Salvo — sincronizado com a equipe</div>}
      </div>

      </>
      )}

      {!editando && (
      <div className="tp-controls">
        <button className="play" onClick={() => setRolling(!rolling)}>{rolling ? "⏸" : "▶"}</button>
        <input type="range" min="10" max="160" step="5" value={vel} onChange={(e) => setVel(Number(e.target.value))} />
        <span className="vel">{vel}</span>
        <div className="tp-fonte">
          <button onClick={() => setFonte((f) => Math.max(18, f - 2))}>A-</button>
          <button onClick={() => setFonte((f) => Math.min(44, f + 2))}>A+</button>
        </div>
      </div>
      )}
    </div>
  );
}

