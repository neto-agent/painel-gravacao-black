// Campos editáveis de um roteiro (mesma ordem no editor e no "novo roteiro").
export const CAMPOS_TEXTO = [
  { key: "hook", label: "Hook (0–3s)", rows: 2 },
  { key: "script", label: "Roteiro / teleprompter", rows: 8, grande: true },
  { key: "screen_text", label: "Texto na tela", rows: 2 },
  { key: "alt_hooks", label: "Hooks alternativos", rows: 3 },
  { key: "shot_notes", label: "Direção de cena", rows: 4 },
  { key: "caption", label: "Copy / Legenda", rows: 4 },
  { key: "cta", label: "CTA", rows: 1 },
  { key: "editor_note", label: "Nota do editor", rows: 3 },
  { key: "format", label: "Formato", rows: 1 },
  { key: "setting", label: "Cenário", rows: 1 },
  { key: "outfit", label: "Figurino", rows: 1 },
  { key: "block_label", label: "Bloco", rows: 1 },
  { key: "category", label: "Categoria", rows: 1 },
  { key: "post_when", label: "Quando postar", rows: 1 },
  { key: "channel", label: "Canal", rows: 1 },
  { key: "source_ref", label: "Referência (link)", rows: 1 },
];

// Dias de gravação. Troque os nomes se quiser (ex: "Sexta 28/11").
export const DIAS = [
  { id: "", label: "Sem dia" },
  { id: "dia1", label: "Dia 1" },
  { id: "dia2", label: "Dia 2" },
];
export const DIA_IDS = DIAS.map((d) => d.id).filter(Boolean);

export const EDITAVEIS = ["title", "phase", "day", ...CAMPOS_TEXTO.map((c) => c.key)];

export function dayLabel(day) {
  const d = DIAS.find((x) => x.id && x.id === day);
  return d ? d.label : null;
}
