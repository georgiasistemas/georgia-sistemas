"use client";

import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useState } from "react";

export const metadata = {
  title: "Georgia Sistemas",
  description: "Sistema de gestão",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 🔥 Evita recriar o client a cada render
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="pt-BR">
      <body>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>{children}</AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}