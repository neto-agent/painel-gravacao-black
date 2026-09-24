import "./globals.css";

export const metadata = {
  title: "Painel de Gravação",
  description: "Painel de produção de criativos pra Black Friday",
  manifest: "/manifest.json",
  icons: { icon: "/2-icon-192.png", apple: "/1-apple-touch-icon.png" },
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Gravação" },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#143826",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
