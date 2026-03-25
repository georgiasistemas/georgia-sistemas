"use client";

import { useAuth } from "@/contexts/AuthContext";

export default function DashboardClient() {
  const { user } = useAuth();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>{user ? user.email : "Usuário não logado"}</p>
    </div>
  );
}