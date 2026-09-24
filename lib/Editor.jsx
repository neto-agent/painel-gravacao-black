"use client";
import { useEffect, useRef } from "react";
import { CAMPOS_TEXTO, DIAS } from "./campos";
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
  const titRef = useRef(null);
  useEffect(() => { autoGrow(titRef.current); }, [valores.title]);
  useEffect(() => { if (focoCampo === "title" && titRef.current) titRef.current.focus(); }, [focoCampo]);
  const principais = CAMPOS_TEXTO.filter((c) => ["hook", "script"].includes(c.key));
  const resto = CAMPOS_TEXTO.filter((c) => !["hook", "script"].includes(c.key));

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

      <div className="ed-campo">
        <span className="ed-label">Dia de gravação</span>
        <div className="ed-chips">
          {DIAS.map((d) => (
            <button type="button" key={d.id || "nenhum"}
              className={"chip" + ((valores.day || "") === d.id ? " ativo" : "")}
              onClick={() => onChange("day", d.id, true)}>{d.label}</button>
          ))}
        </div>
      </div>

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
