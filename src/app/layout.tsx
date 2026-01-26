export const metadata = {
  title: "Georgia Sistemas",
  description: "Sistema SaaS de Delivery White Label"
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
