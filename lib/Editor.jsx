"use client";
import { useEffect, useRef, useState } from "react";
import { CAMPOS_TEXTO } from "./campos";
import { FASES, faseClasse } from "./fases";
import { autoGrow } from "./useAutosave";

function Area({ campo, valor, onChange, onBlur, foco }) {
  const ref = useRef(null);
  useEffect(() => { autoGrow(ref.current); }, [valor]);
  useEffect(() => {
    if (foco && ref.current) {
      ref.current.focus({ preventScroll: true });
      ref.current.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [foco]);
  return (
    <label className={"ed-campo" + (campo.grande ? " grande" : "")}>
      <span className="ed-label">{campo.label}</span>
      <textarea
        ref={ref}
        rows={campo.rows}
        value={valor || ""}
        onChange={(e) => { onChange(campo.key, e.target.value); autoGrow(e.target); }}
        onBlur={onBlur}
        placeholder={campo.grande ? "Escreve o roteiro aqui. Linha em branco separa os blocos do teleprompter." : ""}
      />
    </label>
  );
}

/** Editor de todos os campos. `valores` é o rascunho; `onChange(key, value)` a cada tecla. */
export default function Editor({ valores, onChange, onBlur, focoCampo, camposExtrasAbertos = true }) {
  const [sugestoes, setSugestoes] = useState({ cenarios: [], figurinos: [] });
  useEffect(() => {
    fetch("/api/cards").then((r) => r.json()).then((j) => {
      const cs = j.cards || [];
      const uniq = (k) => [...new Set(cs.map((c) => (c[k] || "").trim()).filter(Boolean))].sort();
      setSugestoes({ cenarios: uniq("setting"), figurinos: uniq("outfit") });
    }).catch(() => {});
  }, []);
  const titRef = useRef(null);
  useEffect(() => { autoGrow(titRef.current); }, [valores.title]);
  useEffect(() => { if (focoCampo === "title" && titRef.current) titRef.current.focus(); }, [focoCampo]);
  const principais = CAMPOS_TEXTO.filter((c) => ["hook", "script"].includes(c.key));
  const resto = CAMPOS_TEXTO.filter((c) => !["hook", "script", "setting", "outfit"].includes(c.key));

  return (
    <div className="editor">
      <label className="ed-campo">
        <span className="ed-label">Título</span>
        <textarea
          ref={titRef}
          className="ed-titulo"
          rows={1}
          value={valores.title || ""}
          onChange={(e) => { onChange("title", e.target.value); autoGrow(e.target); }}
          onBlur={onBlur}
          placeholder="Ex: Trend do paciente no WhatsApp"
        />
      </label>

      <div className="ed-campo">
        <span className="ed-label">Fase</span>
        <div className="ed-chips">
          {FASES.map((f) => (
            <button type="button" key={f}
              className={"chip " + faseClasse(f) + ((valores.phase || "A definir") === f ? " ativo" : "")}
              onClick={() => onChange("phase", f, true)}>
              <span className="fdot" />{f}
            </button>
          ))}
        </div>
      </div>

      <div className="ed-linha">
        <label className="ed-campo">
          <span className="ed-label">Data de gravação</span>
          <input type="date" className="ed-input" value={valores.day || ""}
            onChange={(e) => onChange("day", e.target.value, true)} />
        </label>
        <label className="ed-campo">
          <span className="ed-label">Cenário</span>
          <input className="ed-input" list="lista-cenarios" value={valores.setting || ""} placeholder="Ex: Cozinha"
            onChange={(e) => onChange("setting", e.target.value)} onBlur={onBlur} />
        </label>
        <label className="ed-campo">
          <span className="ed-label">Figurino</span>
          <input className="ed-input" list="lista-figurinos" value={valores.outfit || ""} placeholder="Ex: Camiseta preta"
            onChange={(e) => onChange("outfit", e.target.value)} onBlur={onBlur} />
        </label>
      </div>
      <datalist id="lista-cenarios">{sugestoes.cenarios.map((v) => <option key={v} value={v} />)}</datalist>
      <datalist id="lista-figurinos">{sugestoes.figurinos.map((v) => <option key={v} value={v} />)}</datalist>

      {principais.map((c) => (
        <Area key={c.key} campo={c} valor={valores[c.key]} onChange={onChange} onBlur={onBlur} foco={focoCampo === c.key} />
      ))}

      {camposExtrasAbertos ? (
        resto.map((c) => (
          <Area key={c.key} campo={c} valor={valores[c.key]} onChange={onChange} onBlur={onBlur} foco={focoCampo === c.key} />
        ))
      ) : null}
    </div>
  );
}
