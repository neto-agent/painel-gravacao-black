"use client";
import { useCallback, useEffect, useRef, useState } from "react";

/** Salva campos com debounce. estado: "ok" | "salvando" | "salvo" | "erro" */
export function useAutosave(id, onSaved) {
  const pend = useRef({});
  const timer = useRef(null);
  const [estado, setEstado] = useState("ok");
  const [erro, setErro] = useState(null);

  const flush = useCallback(async () => {
    if (timer.current) { clearTimeout(timer.current); timer.current = null; }
    const campos = pend.current;
    if (!Object.keys(campos).length) return true;
    pend.current = {};
    setEstado("salvando");
    try {
      const res = await fetch(`/api/cards/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(campos),
        keepalive: true,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Erro ao salvar");
      setEstado(Object.keys(pend.current).length ? "salvando" : "salvo");
      setErro(null);
      if (onSaved && data.card) onSaved(data.card);
      return true;
    } catch (e) {
      pend.current = { ...campos, ...pend.current };
      setEstado("erro");
      setErro(e.message);
      return false;
    }
  }, [id, onSaved]);

  const mudar = useCallback((key, value) => {
    pend.current[key] = value;
    setEstado("salvando");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(flush, 700);
  }, [flush]);

  useEffect(() => {
    const antesDeSair = () => { if (Object.keys(pend.current).length) flush(); };
    window.addEventListener("pagehide", antesDeSair);
    document.addEventListener("visibilitychange", antesDeSair);
    return () => {
      window.removeEventListener("pagehide", antesDeSair);
      document.removeEventListener("visibilitychange", antesDeSair);
    };
  }, [flush]);

  const temPendente = () => Object.keys(pend.current).length > 0;
  return { mudar, flush, estado, erro, temPendente };
}

/** textarea que cresce com o conteúdo */
export function autoGrow(el) {
  if (!el) return;
  el.style.height = "auto";
  el.style.height = el.scrollHeight + 2 + "px";
}
