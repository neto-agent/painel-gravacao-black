import { NextResponse } from "next/server";
import { hashSenha, COOKIE } from "./lib/senha";

const PUBLIC_PREFIXES = ["/login", "/api/panel-auth"];

/** Senha única do painel (variável PANEL_PASSWORD na Vercel).
 * Sem PANEL_PASSWORD o painel fica aberto pra quem tiver o link. */
export async function middleware(request) {
  // Modo demonstração (DEMO=1): qualquer um vê, ninguém salva.
  if (process.env.DEMO === "1" && request.nextUrl.pathname.startsWith("/api/cards") && request.method !== "GET") {
    return NextResponse.json({ error: "Modo demonstração: nada é salvo aqui. Crie o teu painel pra editar." }, { status: 403 });
  }
  const password = process.env.PANEL_PASSWORD;
  if (!password) return NextResponse.next();
  const { pathname } = request.nextUrl;
  if (PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return NextResponse.next();
  if (request.cookies.get(COOKIE)?.value === (await hashSenha(password))) return NextResponse.next();
  if (pathname.startsWith("/api")) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|manifest.json|.*\\.png).*)"] };
