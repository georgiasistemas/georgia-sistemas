export const metadata = {
      title: "Georgia Sistemas",
        description: "Sistema SaaS de Delivery White Label"
        };

        export default function RootLayout({ children }: { children: React.ReactNode }) {
          return (
              <html lang="pt-BR">
                    <body>{children}</body>
                        </html>
                          );
                          }
}