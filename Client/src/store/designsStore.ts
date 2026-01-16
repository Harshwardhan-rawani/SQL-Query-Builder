import { create } from 'zustand';
import { Table, Relationship } from '@/types/schema';

const API_URL = import.meta.env.VITE_API_URL;

const authHeader = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
});

export interface SavedDesign {
  id: string;
  name: string;
  userId: string;
  tables: Table[];
  relationships: Relationship[];
  createdAt: string;
  updatedAt: string;
}

interface DesignsState {
  designs: SavedDesign[];
  loadDesigns: (userId: string) => Promise<void>;
  saveDesign: (
    userId: string,
    name: string,
    tables: Table[],
    relationships: Relationship[]
  ) => Promise<SavedDesign>;
  updateDesign: (
    id: string,
    name: string,
    tables: Table[],
    relationships: Relationship[]
  ) => Promise<void>;
  deleteDesign: (id: string) => Promise<void>;
  getDesign: (id: string) => SavedDesign | undefined;
}

export const useDesignsStore = create<DesignsState>((set, get) => ({
  designs: [],

  // ✅ LOAD (backend)
  loadDesigns: async (_userId: string) => {
    const res = await fetch(`${API_URL}/api/designs`, {
      headers: authHeader(),
    });

    const designs = await res.json();
    set({ designs });
  },

  // ✅ SAVE (backend)
  saveDesign: async (userId, name, tables, relationships) => {
    const payload = {
      id: crypto.randomUUID(),
      userId, // kept for compatibility (backend trusts JWT)
      name,
      tables,
      relationships,
    };

    const res = await fetch(`${API_URL}/api/designs`, {
      method: "POST",
      headers: authHeader(),
      body: JSON.stringify(payload),
    });

    const newDesign = await res.json();

    set((state) => ({
      designs: [...state.designs, newDesign],
    }));

    return newDesign;
  },

  // ✅ UPDATE (backend)
  updateDesign: async (id, name, tables, relationships) => {
    const res = await fetch(`${API_URL}/api/designs/${id}`, {
      method: "PUT",
      headers: authHeader(),
      body: JSON.stringify({ name, tables, relationships }),
    });

    const updated = await res.json();

    set((state) => ({
      designs: state.designs.map((d) =>
        d.id === id ? updated : d
      ),
    }));
  },

  // ✅ DELETE (backend)
  deleteDesign: async (id) => {
    await fetch(`${API_URL}/api/designs/${id}`, {
      method: "DELETE",
      headers: authHeader(),
    });

    set((state) => ({
      designs: state.designs.filter((d) => d.id !== id),
    }));
  },

  // ✅ LOCAL GET
  getDesign: (id) => {
    return get().designs.find((d) => d.id === id);
  },
}));
