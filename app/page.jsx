"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FASES, faseClasse } from "../lib/fases";
import { DIAS } from "../lib/campos";

const COLUNAS = [
  { id: "a_gravar", label: "A gravar" },
  { id: "gravando", label: "Gravando" },
  { id: "gravado", label: "Gravado" },
  { id: "regravar", label: "Regravar" },
];

const isIA = (c) => /^vídeo ia/i.test(c.setting || "") || /vídeo ia/i.test(c.category || "");

const norm = (v) => String(v || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const cacheBusca = new WeakMap();
function textoBusca(c) {
  let t = cacheBusca.get(c);
  if (t === undefined) {
    t = norm(Object.entries(c).filter(([k, v]) => typeof v === "string" && !/(_at|^sort_order)$/.test(k)).map(([, v]) => v).join(" \n "));
    cacheBusca.set(c, t);
  }
  return t;
}

function irPara(id) {
  const el = document.getElementById("sec-" + id);
  if (!el) return;
  const off = (parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--barra-h")) || 0) + 6;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - off, behavior: "smooth" });
}

const PROXIMO = { a_gravar: ["gravando", "Gravando"], gravando: ["gravado", "Gravado"], regravar: ["gravando", "Gravando"], gravado: null };

export default function BoardPage() {
  const [cards, setCards] = useState(null);
  const [erro, setErro] = useState(null);
  const [dia, setDia] = useState("todos");
  const [cenario, setCenario] = useState("todos");
  const [figurino, setFigurino] = useState("todos");
  const [fase, setFase] = useState("todas");
  const [apagado, setApagado] = useState(null);
  const [modo, setModo] = useState("ney");
  const [busca, setBusca] = useState("");
  useEffect(() => { const m = localStorage.getItem("painel-modo"); if (m === "ia") setModo("ia"); }, []);
  function trocarModo(m) { setModo(m); localStorage.setItem("painel-modo", m); setCenario("todos"); setFigurino("todos"); setFase("todas"); setDia("todos"); setBusca(""); }
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("apagado");
    if (!id) return;
    setApagado(id);
    window.history.replaceState(null, "", "/");
    const t = setTimeout(() => setApagado(null), 10000);
    return () => clearTimeout(t);
  }, []);
  async function desfazer() {
    const id = apagado;
    setApagado(null);
    await fetch(`/api/cards/${encodeURIComponent(id)}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ restore: true }),
    });
    carregar();
  }
  const router = useRouter();
  useEffect(() => {
    const el = document.querySelector(".barra-fixa");
    const top = document.querySelector(".topbar");
    if (!el || !top) return;
    const upd = () => {
      const h = el.offsetParent !== null ? el.getBoundingClientRect().height : top.getBoundingClientRect().height;
      document.documentElement.style.setProperty("--barra-h", h + "px");
    };
    upd();
    const ro = new ResizeObserver(upd);
    ro.observe(el); ro.observe(top);
    window.addEventListener("resize", upd);
    return () => { ro.disconnect(); window.removeEventListener("resize", upd); };
  }, [cards !== null]);

  function abrirCard(e, id) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
    e.preventDefault();
    const href = `/card/${encodeURIComponent(id)}`;
    try { router.push(href); } catch { window.location.assign(href); return; }
    // se a navegação do app falhar (ex: aba aberta antes de um deploy novo), abre direto
    setTimeout(() => { if (window.location.pathname === "/") window.location.assign(href); }, 1500);
  }

  async function avancar(e, card) {
    e.preventDefault();
    e.stopPropagation();
    const prox = PROXIMO[card.status];
    if (!prox) return;
    setCards((cs) => cs.map((c) => (c.id === card.id ? { ...c, status: prox[0] } : c)));
    await fetch(`/api/cards/${encodeURIComponent(card.id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: prox[0] }),
    });
  }

  async function carregar() {
    try {
      const res = await fetch("/api/cards", { cache: "no-store" });
      if (res.status === 401) { window.location.href = "/login"; return; }
      const data = await res.json();
      if (data.cards) setCards(data.cards);
      else setErro(data.error || "Erro ao carregar");
    } catch {
      setErro("Falha de conexão");
    }
  }

  useEffect(() => {
    carregar();
    const t = setInterval(carregar, 5000);
    const onFocus = () => carregar();
    window.addEventListener("focus", onFocus);
    return () => { clearInterval(t); window.removeEventListener("focus", onFocus); };
  }, []);

  const base = useMemo(() => (cards || []).filter((c) => (modo === "ia" ? isIA(c) : !isIA(c))), [cards, modo]);
  const nIA = useMemo(() => (cards || []).filter(isIA).length, [cards]);
  const cenarios = useMemo(() => [...new Set(base.map((c) => c.setting).filter(Boolean))].sort(), [base]);
  const figurinos = useMemo(() => [...new Set(base.map((c) => c.outfit).filter(Boolean))].sort(), [base]);

  const termos = useMemo(() => norm(busca).split(/\s+/).filter(Boolean), [busca]);
  const filtrados = useMemo(() => base.filter((c) =>
    (termos.length === 0 || termos.every((t) => textoBusca(c).includes(t))) &&
    (dia === "todos" || c.day === dia) &&
    (cenario === "todos" || c.setting === cenario) &&
    (figurino === "todos" || c.outfit === figurino) &&
    (fase === "todas" || c.phase === fase)
  ), [base, termos, dia, cenario, figurino, fase]);
  const fasesPresentes = useMemo(() => FASES.filter((f) => base.some((c) => c.phase === f)), [base]);

  const total = base.length;
  const gravados = base.filter((c) => c.status === "gravado").length;
  const pendentes = total - gravados;

  return (
    <div>
      <div className="topbar">
        <div className="brand">
          <div className="logo">G</div>
          <div>
            <h1>Painel de Gravação</h1>
            <div className="sub">{modo === "ia" ? "Vídeos gerados com IA · fora das gravações" : "Black Friday · roteiros e gravações"}</div>
          </div>
        </div>
        <div className="progress"><div style={{ width: total ? `${(gravados / total) * 100}%` : 0 }} /></div>
        <div className="progress-label">{gravados} de {total} {modo === "ia" ? "vídeos IA prontos" : "roteiros gravados"}</div>
        <div className="modos">
          <button className={modo === "ney" ? "ativo" : ""} onClick={() => trocarModo("ney")}>🎬 Gravações</button>
          <button className={modo === "ia" ? "ativo" : ""} onClick={() => trocarModo("ia")}>🤖 Vídeos IA{nIA ? ` · ${nIA}` : ""}</button>
        </div>
        <div className="top-desk">
          <div className="top-stats">
            <span><b>{total}</b> roteiros</span>
            <span className="ok"><b>{gravados}</b> {modo === "ia" ? "prontos" : "gravados"}</span>
            <span><b>{pendentes}</b> restam</span>
          </div>
          <div className="busca busca-top">
            <span className="lupa">🔎</span>
            <input type="search" enterKeyHint="search" placeholder="Buscar roteiro ou copy" value={busca} onChange={(e) => setBusca(e.target.value)} />
            {busca && <button className="limpar" onClick={() => setBusca("")} aria-label="Limpar busca">✕</button>}
          </div>
        </div>
      </div>

      <div className="stats">
        <div className="stat"><div className="l">Roteiros</div><div className="v">{total}</div></div>
        <div className="stat destaque"><div className="l">{modo === "ia" ? "Prontos" : "Gravados"}</div><div className="v">{gravados}</div></div>
        <div className="stat"><div className="l">Restam</div><div className="v">{pendentes}</div></div>
      </div>

      <div className="barra-fixa">
        <div className="busca">
          <span className="lupa">🔎</span>
          <input type="search" inputMode="search" enterKeyHint="search" placeholder="Buscar título, roteiro, copy" value={busca} onChange={(e) => setBusca(e.target.value)} />
          {busca && <button className="limpar" onClick={() => setBusca("")} aria-label="Limpar busca">✕</button>}
        </div>
        {cards && (
          <div className="pulos">
            {COLUNAS.map((col) => (
              <button key={col.id} className="pulo" onClick={() => irPara(col.id)}>
                <span className={`dot d-${col.id}`} />{col.label}<b>{filtrados.filter((c) => c.status === col.id).length}</b>
              </button>
            ))}
          </div>
        )}
      </div>
      {busca && cards && <div className="busca-info">{filtrados.length} {filtrados.length === 1 ? "roteiro encontrado" : "roteiros encontrados"} para "{busca}"</div>}

      <div className="filtros-wrap">
      <div className="filters">
        <button className={"chip" + (dia === "todos" ? " ativo" : "")} onClick={() => setDia("todos")}>Todos os dias</button>
        {DIAS.filter((d) => d.id).map((d) => (
          <button key={d.id} className={"chip" + (dia === d.id ? " ativo" : "")} onClick={() => setDia(d.id)}>{d.label}</button>
        ))}
        {cenarios.length > 0 && (
          <select value={cenario} onChange={(e) => setCenario(e.target.value)}>
            <option value="todos">Cenário: todos</option>
            {cenarios.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        )}
        {figurinos.length > 0 && (
          <select value={figurino} onChange={(e) => setFigurino(e.target.value)}>
            <option value="todos">Figurino: todos</option>
            {figurinos.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        )}
      </div>

      {fasesPresentes.length > 0 && (
        <div className="filters fases">
          <button className={"chip" + (fase === "todas" ? " ativo" : "")} onClick={() => setFase("todas")}>Todas as fases</button>
          {fasesPresentes.map((f) => (
            <button key={f} className={"chip " + faseClasse(f) + (fase === f ? " ativo" : "")} onClick={() => setFase(f)}>
              <span className="fdot" />{f}
            </button>
          ))}
        </div>
      )}

      </div>

      {erro && <div className="empty">⚠️ {erro}</div>}
      {!cards && !erro && <div className="empty">Carregando roteiros...</div>}

      {cards && (
        <div className="board" style={{ "--cols": COLUNAS.map((col) => { const n = filtrados.filter((c) => c.status === col.id).length; return n === 0 ? "minmax(190px, .55fr)" : `minmax(260px, ${Math.min(4, Math.max(1, Math.sqrt(n))).toFixed(2)}fr)`; }).join(" ") }}>
          {COLUNAS.map((col) => {
            const itens = filtrados.filter((c) => c.status === col.id);
            return (
              <section className={"col" + (itens.length === 0 ? " vazia" : "")} key={col.id} id={"sec-" + col.id}>
                <div className="col-head">
                  <span className={`dot d-${col.id}`} />
                  <span className="lbl">{col.label}</span>
                  <span className="n">{itens.length}</span>
                </div>
                <div className="col-body">
                  {itens.length === 0 && <div className="empty">{busca ? "Nada com essa busca" : "Nada aqui"}</div>}
                  {itens.map((c) => (
                    <a className="card" key={c.id} href={`/card/${encodeURIComponent(c.id)}`} onClick={(e) => abrirCard(e, c.id)}>
                      <div className="card-top">
                        <span className="cid">{c.id}</span>
                        {c.phase && <span className={"tag fase " + faseClasse(c.phase)}><span className="fdot" />{c.phase}</span>}
                      </div>
                      <h3>{c.title}</h3>
                      {c.hook && <div className="hook">{c.hook}</div>}
                      <div className="tags">
                        {c.day && <span className="tag dia">{(DIAS.find((d) => d.id === c.day) || {}).label || c.day}</span>}
                        {c.setting && <span className="tag">{c.setting}</span>}
                        {c.outfit && <span className="tag">{c.outfit}</span>}
                      </div>
                      {c.take_notes && <div className="take">Nota: {c.take_notes}</div>}
                      {PROXIMO[c.status] && (
                        <span className="avancar" onClick={(e) => avancar(e, c)}>
                          Marcar como {PROXIMO[c.status][1]} →
                        </span>
                      )}
                    </a>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {apagado && (
        <div className="toast">
          <span>Roteiro {apagado} apagado</span>
          <button onClick={desfazer}>Desfazer</button>
        </div>
      )}

      <button className="fab" onClick={() => router.push("/novo")} aria-label="Novo roteiro">
        <span>+</span> Novo roteiro
      </button>
    </div>
  );
}

