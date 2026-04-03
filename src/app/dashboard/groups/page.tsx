"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import Button from "@/components/ui/Button";

type Group = {
  id: string;
  name: string;
  required: boolean;
  min_select: number;
  max_select: number;
};

export default function GroupsPage() {
  const { user } = useAuth();

  const [groups, setGroups] = useState<Group[]>([]);
  const [name, setName] = useState("");
  const [required, setRequired] = useState(false);
  const [minSelect, setMinSelect] = useState(0);
  const [maxSelect, setMaxSelect] = useState(1);

  useEffect(() => {
    fetchGroups();
  }, [user]);

  async function fetchGroups() {
    if (!user) return;

    const { data: profile } = await supabase
      .from("profiles")
      .select("tenant_id")
      .eq("id", user.id)
      .single();

    if (!profile) return;

    const { data } = await supabase
      .from("product_groups")
      .select("*")
      .eq("tenant_id", profile.tenant_id);

    setGroups(data || []);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();

    if (!user) return;

    const { data: profile } = await supabase
      .from("profiles")
      .select("tenant_id")
      .eq("id", user.id)
      .single();

    if (!profile) return;

    await supabase.from("product_groups").insert({
      name,
      required,
      min_select: minSelect,
      max_select: maxSelect,
      tenant_id: profile.tenant_id,
    });

    setName("");
    setRequired(false);
    setMinSelect(0);
    setMaxSelect(1);

    fetchGroups();
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir grupo?")) return;

    await supabase.from("product_groups").delete().eq("id", id);
    fetchGroups();
  }

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Grupos de Complementos</h1>

      {/* FORM */}
      <form
        onSubmit={handleCreate}
        className="bg-white p-6 rounded-xl shadow flex flex-col gap-4 max-w-md mb-8"
      >
        <input
          type="text"
          placeholder="Nome do grupo (ex: adicionais)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={required}
            onChange={(e) => setRequired(e.target.checked)}
          />
          Obrigatório
        </label>

        <input
          type="number"
          placeholder="Mínimo"
          value={minSelect}
          onChange={(e) => setMinSelect(Number(e.target.value))}
          className="border p-2 rounded"
        />

        <input
          type="number"
          placeholder="Máximo"
          value={maxSelect}
          onChange={(e) => setMaxSelect(Number(e.target.value))}
          className="border p-2 rounded"
        />

        <Button type="submit">Criar Grupo</Button>
      </form>

      {/* LISTA */}
      <div className="bg-white p-6 rounded-xl shadow">
        {groups.map((group) => (
          <div
            key={group.id}
            className="flex justify-between border-b p-2"
          >
            <div>
              <p className="font-semibold">{group.name}</p>
              <p className="text-sm text-gray-500">
                {group.required ? "Obrigatório" : "Opcional"} | Min:
                {group.min_select} | Max: {group.max_select}
              </p>
            </div>

            <Button
              onClick={() => handleDelete(group.id)}
              className="bg-red-500"
            >
              Excluir
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}