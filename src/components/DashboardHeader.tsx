"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardHeader() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await signOut();
    router.push("/login");
  }

  return (
    <header>
      <p>{user?.email}</p>
      <button onClick={handleLogout}>Sair</button>
    </header>
  );
}