// O cookie guarda um hash da senha, nunca a senha em si.
export async function hashSenha(senha) {
  const dados = new TextEncoder().encode("painel-gravacao:" + senha);
  const buf = await crypto.subtle.digest("SHA-256", dados);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
export const COOKIE = "painel_sessao";
