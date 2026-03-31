"use client";

import { useAuth } from "@/contexts/AuthContext";
import Button from "@/components/ui/Button";

export default function DashboardHeader() {
  const { user, signOut } = useAuth();

  return (
    <header className="flex justify-between items-center p-4 bg-white shadow">
      <h1 className="font-bold text-lg">
        {user?.email}
      </h1>

      <Button onClick={signOut}>
        Sair
      </Button>
    </header>
  );
}