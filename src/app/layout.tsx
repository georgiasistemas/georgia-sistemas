import "./globals.css";
import Providers from "@/providers/Providers";

export const metadata = {
  title: "Georgia Sistemas",
  description: "Sistema de gestão",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}