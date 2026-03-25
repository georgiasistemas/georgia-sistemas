"use client";

import { useAuth } from "@/contexts/AuthContext";

export default function HomeClient() {
  const { user } = useAuth();

  return (
    <div>
      <h1>Home</h1>
      <p>{user ? user.email : "Usuário não logado"}</p>
    </div>
  );
}