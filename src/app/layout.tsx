import { AuthProvider } from '@/contexts/AuthProvider'

export const metadata = {
  title: 'Georgia Sistemas',
  description: 'Sistema multi-tenant',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}