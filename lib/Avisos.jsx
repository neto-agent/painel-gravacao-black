"use client";

import { useEffect, useState } from "react";

/** Tela de ajuda quando o banco (REDIS_URL) ainda não foi conectado na Vercel. */
export function Configurar() {
  return (
    <div className="config">
      <h2>Falta conectar o banco de dados</h2>
      <p>O painel está no ar, mas ainda não tem onde guardar os roteiros. Leva 2 minutos:</p>
      <ol>
        <li>Na Vercel, abra este projeto e clique em <b>Storage</b>.</li>
        <li>Clique em <b>Create Database</b>, escolha <b>Upstash for Redis</b> e depois o plano <b>Free</b> (ele não vem marcado).</li>
        <li>Na tela seguinte, conecte o banco a este projeto (deixe os ambientes marcados).</li>
        <li>Vá em <b>Deployments</b>, clique nos <b>⋯</b> do último deploy e em <b>Redeploy</b>.</li>
        <li>Volte aqui e recarregue a página.</li>
      </ol>
      <p className="obs">Dica: a conta gratuita do Upstash permite só 1 banco. Se já usou em outro projeto, conecte aquele mesmo banco aqui ou apague o antigo.</p>
      <button className="btn-verde" onClick={() => window.location.reload()}>Já fiz, recarregar</button>
    </div>
  );
}

/** Aviso de primeira vez. Some quando a pessoa fecha ou quando não sobra nenhum exemplo. */
export function BoasVindas({ cards, irBiblioteca }) {
  const [fechado, setFechado] = useState(true);
  useEffect(() => { setFechado(localStorage.getItem("painel-boas-vindas") === "ok"); }, []);
  const temExemplo = cards.some((c) => /^exemplo/i.test(c.title || ""));
  if (fechado || !temExemplo) return null;
  const fechar = () => { localStorage.setItem("painel-boas-vindas", "ok"); setFechado(true); };
  return (
    <div className="boas-vindas">
      <button className="fechar" onClick={fechar} aria-label="Fechar">✕</button>
      <b>Primeira vez aqui? Começa assim:</b>
      <ol>
        <li>Abre um card de <b>Exemplo</b> pra ver como um roteiro fica.</li>
        <li>Toca em <b>Editar</b> e troca o texto pelo teu.</li>
        <li>Na <button className="link" onClick={irBiblioteca}>📚 Biblioteca</button>, pega formatos prontos por fase.</li>
        <li>No dia da gravação, abre o card e usa o <b>teleprompter</b>.</li>
      </ol>
      <button className="link" onClick={fechar}>Entendi, não mostrar de novo</button>
    </div>
  );
}
