"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FASES, faseClasse } from "../lib/fases";
import { dataCurta } from "../lib/campos";
import Biblioteca from "../lib/Biblioteca";
import { Configurar, BoasVindas } from "../lib/Avisos";

const COLUNAS = [
  { id: "a_gravar", label: "A gravar" },
  { id: "gravando", label: "Gravando" },
  { id: "gravado", label: "Gravado" },
  { id: "regravar", label: "Regravar" },
];


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
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);
  const [apagado, setApagado] = useState(null);
  const [modo, setModo] = useState("roteiros");
  const [info, setInfo] = useState({});
  const [aviso, setAviso] = useState(null);
  useEffect(() => { if (!aviso) return; const t = setTimeout(() => setAviso(null), 5000); return () => clearTimeout(t); }, [aviso]);
  const [busca, setBusca] = useState("");
  useEffect(() => { const m = new URLSearchParams(window.location.search).get("aba") || localStorage.getItem("painel-modo"); if (m === "ref") setModo(m); }, []);
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
    mover(card, prox[0]);
  }

  // apagar direto do quadro (dá pra desfazer no aviso de baixo)
  async function apagarCard(e, card) {
    e.preventDefault();
    e.stopPropagation();
    if (info.demo) { setAviso("Modo demonstração: nada é salvo aqui."); return; }
    setCards((cs) => cs.filter((c) => c.id !== card.id));
    const r = await fetch(`/api/cards/${encodeURIComponent(card.id)}`, { method: "DELETE" });
    if (r.ok) setApagado(card.id);
    else { setAviso("Não consegui apagar. Tenta de novo."); carregar(); }
  }

  async function mover(card, status) {
    if (card.status === status) return;
    setCards((cs) => cs.map((c) => (c.id === card.id ? { ...c, status } : c)));
    const r = await fetch(`/api/cards/${encodeURIComponent(card.id)}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }),
    });
    if (!r.ok) { const d = await r.json().catch(() => ({})); setAviso(d.error || "Não consegui mover. Tenta de novo."); carregar(); }
  }

  // arrastar e soltar: segura a alça ⠿ do card e solta em outra coluna (funciona no dedo e no mouse)
  const arrasto = useRef(null);
  const [arrastando, setArrastando] = useState(null);
  function colunaEm(x, y) {
    const el = document.elementFromPoint(x, y);
    const sec = el && el.closest("section.col");
    return sec ? sec.id.replace("sec-", "") : null;
  }
  function iniciarArrasto(e, card) {
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.closest(".card").getBoundingClientRect();
    arrasto.current = { card, dx: e.clientX - rect.left, dy: e.clientY - rect.top, alvo: card.status, x: e.clientX, y: e.clientY, raf: null };
    setArrastando({ card, x: e.clientX, y: e.clientY, w: rect.width, dx: arrasto.current.dx, dy: arrasto.current.dy, alvo: card.status });
    const rolar = () => {
      const a = arrasto.current; if (!a) return;
      const h = window.innerHeight;
      if (a.y < 120) window.scrollBy(0, -12); else if (a.y > h - 90) window.scrollBy(0, 12);
      const alvo = colunaEm(a.x, a.y);
      if (alvo && alvo !== a.alvo) { a.alvo = alvo; setArrastando((s) => s && { ...s, alvo }); }
      a.raf = requestAnimationFrame(rolar);
    };
    arrasto.current.raf = requestAnimationFrame(rolar);
    const mov = (ev) => {
      const a = arrasto.current; if (!a) return;
      a.y = ev.clientY; a.x = ev.clientX;
      a.alvo = colunaEm(ev.clientX, ev.clientY) || a.alvo;
      setArrastando((s) => s && { ...s, x: ev.clientX, y: ev.clientY, alvo: a.alvo });
    };
    const fim = () => {
      const a = arrasto.current;
      window.removeEventListener("pointermove", mov);
      window.removeEventListener("pointerup", fim);
      window.removeEventListener("pointercancel", fim);
      if (a) { cancelAnimationFrame(a.raf); if (a.alvo) mover(a.card, a.alvo); }
      arrasto.current = null;
      setArrastando(null);
    };
    window.addEventListener("pointermove", mov);
    window.addEventListener("pointerup", fim);
    window.addEventListener("pointercancel", fim);
  }

  async function carregar() {
    try {
      const res = await fetch("/api/cards", { cache: "no-store" });
      if (res.status === 401) { window.location.href = "/login"; return; }
      const data = await res.json();
      if (data.cards) { setCards(data.cards); setErro(null); setInfo({ demo: data.demo, aberto: data.aberto }); }
      else setErro({ msg: data.error || "Erro ao carregar", codigo: data.codigo });
    } catch {
      setErro({ msg: "Sem conexão. Confere a internet e recarrega a página." });
    }
  }

  useEffect(() => {
    carregar();
    const t = setInterval(carregar, 5000);
    const onFocus = () => carregar();
    window.addEventListener("focus", onFocus);
    return () => { clearInterval(t); window.removeEventListener("focus", onFocus); };
  }, []);

  const base = useMemo(() => cards || [], [cards]);
  const cenarios = useMemo(() => [...new Set(base.map((c) => c.setting).filter(Boolean))].sort(), [base]);
  const figurinos = useMemo(() => [...new Set(base.map((c) => c.outfit).filter(Boolean))].sort(), [base]);
  const datas = useMemo(() => [...new Set(base.map((c) => c.day).filter((d) => dataCurta(d)))].sort(), [base]);
  const nFiltros = [dia !== "todos", cenario !== "todos", figurino !== "todos", fase !== "todas"].filter(Boolean).length;
  function limparFiltros() { setDia("todos"); setCenario("todos"); setFigurino("todos"); setFase("todas"); }

  const termos = useMemo(() => norm(busca).split(/\s+/).filter(Boolean), [busca]);
  const filtrados = useMemo(() => base.filter((c) =>
    (termos.length === 0 || termos.every((t) => textoBusca(c).includes(t))) &&
    (dia === "todos" || c.day === dia) &&
    (cenario === "todos" || c.setting === cenario) &&
    (figurino === "todos" || c.outfit === figurino) &&
    (fase === "todas" || c.phase === fase)
  ), [base, termos, dia, cenario, figurino, fase]);
  const fasesPresentes = useMemo(() => FASES.filter((f) => base.some((c) => c.phase === f)), [base]);

  const semBanco = erro && erro.codigo === "sem_banco";
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
            <div className="sub">{modo === "ref" ? "Formatos que funcionam · vire qualquer um em roteiro" : "Black Friday · roteiros e gravações"}</div>
          </div>
        </div>
        <div className="progress"><div style={{ width: total ? `${(gravados / total) * 100}%` : 0 }} /></div>
        <div className="progress-label">{gravados} de {total} roteiros gravados</div>
        <div className="modos">
          <button className={modo === "roteiros" ? "ativo" : ""} onClick={() => trocarModo("roteiros")}>🎬 Roteiros</button>
          <button className={modo === "ref" ? "ativo" : ""} onClick={() => trocarModo("ref")}>📚 Biblioteca</button>
        </div>
        <div className="top-desk">
          <div className="top-stats">
            <span><b>{total}</b> roteiros</span>
            <span className="ok"><b>{gravados}</b> gravados</span>
            <span><b>{pendentes}</b> restam</span>
          </div>
          <div className="busca busca-top">
            <span className="lupa">🔎</span>
            <input type="search" enterKeyHint="search" placeholder="Buscar roteiro ou copy" value={busca} onChange={(e) => setBusca(e.target.value)} />
            {busca && <button className="limpar" onClick={() => setBusca("")} aria-label="Limpar busca">✕</button>}
          </div>
        </div>
      </div>

      {info.demo && <div className="aviso demo">👀 Modo demonstração: pode mexer à vontade, mas nada é salvo. <a href="https://github.com/neto-agent/painel-gravacao-black" target="_blank" rel="noreferrer">Criar o meu painel →</a></div>}
      {info.aberto && !info.demo && <div className="aviso alerta">🔓 Painel sem senha: qualquer pessoa com o link consegue ver e editar. Na Vercel, crie a variável <b>PANEL_PASSWORD</b> e faça Redeploy.</div>}
      {semBanco ? <Configurar /> : modo === "ref" ? <Biblioteca demo={info.demo} /> : (<>
      {cards && <BoasVindas cards={cards} irBiblioteca={() => trocarModo("ref")} />}
      <div className="stats">
        <div className="stat"><div className="l">Roteiros</div><div className="v">{total}</div></div>
        <div className="stat destaque"><div className="l">Gravados</div><div className="v">{gravados}</div></div>
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
        <div className="filtro-linha">
          <button className={"btn-filtros" + (nFiltros ? " ativo" : "")} onClick={() => setFiltrosAbertos(true)}>
            <span className="ico">☰</span> Filtros{nFiltros ? <b>{nFiltros}</b> : null}
          </button>
          {nFiltros > 0 && (
            <div className="filtros-ativos">
              {fase !== "todas" && <button className="chip ativo" onClick={() => setFase("todas")}>{fase} ✕</button>}
              {dia !== "todos" && <button className="chip ativo" onClick={() => setDia("todos")}>{dataCurta(dia)} ✕</button>}
              {cenario !== "todos" && <button className="chip ativo" onClick={() => setCenario("todos")}>{cenario} ✕</button>}
              {figurino !== "todos" && <button className="chip ativo" onClick={() => setFigurino("todos")}>{figurino} ✕</button>}
            </div>
          )}
        </div>
      </div>

      {filtrosAbertos && (
        <div className="sheet-fundo filtros-fundo" onClick={() => setFiltrosAbertos(false)}>
          <div className="sheet filtros-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="fs-topo"><h3>Filtros</h3><button className="fs-fechar" onClick={() => setFiltrosAbertos(false)} aria-label="Fechar">✕</button></div>
            {[
              ["Fase", fasesPresentes, fase, setFase, "todas"],
              ["Data de gravação", datas, dia, setDia, "todos"],
              ["Cenário", cenarios, cenario, setCenario, "todos"],
              ["Figurino", figurinos, figurino, setFigurino, "todos"],
            ].map(([rot, lista, val, set, vazio]) => (
              <div className="fs-grupo" key={rot}>
                <div className="fs-rot">{rot}</div>
                {lista.length === 0 ? <div className="fs-vazio">Nenhum card com {rot.toLowerCase()} ainda. Preenche dentro do card.</div> : (
                  <div className="fs-chips">
                    <button className={"chip" + (val === vazio ? " ativo" : "")} onClick={() => set(vazio)}>Todos</button>
                    {lista.map((v) => (
                      <button key={v} className={"chip" + (rot === "Fase" ? " " + faseClasse(v) : "") + (val === v ? " ativo" : "")} onClick={() => set(v)}>
                        {rot === "Fase" && <span className="fdot" />}{rot === "Data de gravação" ? dataCurta(v) : v}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="fs-acoes">
              <button className="fs-limpar" onClick={limparFiltros}>Limpar</button>
              <button className="fs-ver" onClick={() => setFiltrosAbertos(false)}>Ver {filtrados.length} {filtrados.length === 1 ? "roteiro" : "roteiros"}</button>
            </div>
          </div>
        </div>
      )}

      {erro && <div className="empty">⚠️ {erro.msg}</div>}
      {!cards && !erro && <div className="empty">Carregando roteiros...</div>}

      {cards && (
        <div className="board" style={{ "--cols": COLUNAS.map((col) => { const n = filtrados.filter((c) => c.status === col.id).length; return n === 0 ? "minmax(190px, .55fr)" : `minmax(260px, ${Math.min(4, Math.max(1, Math.sqrt(n))).toFixed(2)}fr)`; }).join(" ") }}>
          {COLUNAS.map((col) => {
            const itens = filtrados.filter((c) => c.status === col.id);
            return (
              <section className={"col" + (itens.length === 0 ? " vazia" : "") + (arrastando && arrastando.alvo === col.id ? " alvo" : "")} key={col.id} id={"sec-" + col.id}>
                <div className="col-head">
                  <span className={`dot d-${col.id}`} />
                  <span className="lbl">{col.label}</span>
                  <span className="n">{itens.length}</span>
                </div>
                <div className="col-body">
                  {itens.length === 0 && <div className="empty">{busca ? "Nada com essa busca" : col.id === "a_gravar" && total === 0 ? <>Nenhum roteiro ainda.<br /><button className="link" onClick={() => trocarModo("ref")}>Pegar um formato na Biblioteca</button> ou toque em <b>+ Novo roteiro</b>.</> : "Nada aqui"}</div>}
                  {itens.map((c) => (
                    <a className={"card" + (arrastando && arrastando.card.id === c.id ? " fantasma" : "")} key={c.id} href={`/card/${encodeURIComponent(c.id)}`} onClick={(e) => abrirCard(e, c.id)}>
                      <div className="card-top">
                        <span className="alca" onPointerDown={(e) => iniciarArrasto(e, c)} onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} title="Arraste pra outra coluna" aria-label="Arrastar">⠿</span>
                        <span className="cid">{c.id}</span>
                        {c.phase && <span className={"tag fase " + faseClasse(c.phase)}><span className="fdot" />{c.phase}</span>}
                        <button className="lixo" onClick={(e) => apagarCard(e, c)} aria-label="Apagar roteiro" title="Apagar">🗑</button>
                      </div>
                      <h3>{c.title}</h3>
                      {c.hook && <div className="hook">{c.hook}</div>}
                      <div className="tags">
                        {dataCurta(c.day) && <span className="tag dia">📅 {dataCurta(c.day)}</span>}
                        {c.setting && <span className="tag">{c.setting}</span>}
                        {c.outfit && <span className="tag">{c.outfit}</span>}
                      </div>
                      {c.take_notes && <div className="take">Nota: {c.take_notes}</div>}
                    </a>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      </>)}

      {arrastando && (
        <div className="card arrasto-ghost" style={{ width: arrastando.w, left: arrastando.x - arrastando.dx, top: arrastando.y - arrastando.dy }}>
          <span className="cid">{arrastando.card.id}</span>
          <h3>{arrastando.card.title}</h3>
        </div>
      )}
      {arrastando && (
        <div className="solta-pill">Soltar em: <b>{(COLUNAS.find((c) => c.id === arrastando.alvo) || {}).label}</b></div>
      )}
      {aviso && <div className="toast"><span>{aviso}</span><button onClick={() => setAviso(null)}>OK</button></div>}

      {apagado && (
        <div className="toast">
          <span>Roteiro {apagado} apagado</span>
          <button onClick={desfazer}>Desfazer</button>
        </div>
      )}

      {modo !== "ref" && !arrastando && !semBanco && <button className="fab" onClick={() => router.push("/novo")} aria-label="Novo roteiro">
        <span>+</span> Novo roteiro
      </button>}
    </div>
  );
}

