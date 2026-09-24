// Fases da Black. Pode renomear aqui se quiser outras.
export const FASES = ["Antecipação", "Captação", "Aquecimento", "Carrinho aberto", "Última chamada", "A definir"];
export const faseClasse = (f) => "fase-" + (FASES.indexOf(f) + 1);
