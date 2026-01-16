import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Column, ColumnType, Relationship, RelationType, Schema, SchemaState, Table } from '@/types/schema';

interface SchemaActions {
  // Table actions
  addTable: (name?: string, position?: { x: number; y: number }) => void;
  updateTable: (tableId: string, updates: Partial<Omit<Table, 'id' | 'columns'>>) => void;
  deleteTable: (tableId: string) => void;
  updateTablePosition: (tableId: string, position: { x: number; y: number }) => void;
  
  // Column actions
  addColumn: (tableId: string) => void;
  updateColumn: (tableId: string, columnId: string, updates: Partial<Omit<Column, 'id'>>) => void;
  deleteColumn: (tableId: string, columnId: string) => void;
  
  // Relationship actions
  addRelationship: (
    fromTableId: string,
    fromColumnId: string,
    toTableId: string,
    toColumnId: string,
    relationType?: RelationType
  ) => void;
  updateRelationship: (relationshipId: string, updates: Partial<Omit<Relationship, 'id'>>) => void;
  deleteRelationship: (relationshipId: string) => void;
  
  // Selection
  selectTable: (tableId: string | null) => void;
  selectRelationship: (relationshipId: string | null) => void;
  
  // History
  undo: () => void;
  redo: () => void;
  saveToHistory: () => void;
  
  // Schema
  clearSchema: () => void;
  loadSchema: (tables: Table[], relationships: Relationship[]) => void;
}

const createDefaultColumn = (): Column => ({
  id: uuidv4(),
  name: 'new_column',
  type: 'text',
  isPrimary: false,
  isNullable: true,
  isUnique: false,
});

const createDefaultTable = (name: string, position: { x: number; y: number }): Table => ({
  id: uuidv4(),
  name,
  columns: [
    {
      id: uuidv4(),
      name: 'id',
      type: 'uuid',
      isPrimary: true,
      isNullable: false,
      isUnique: true,
    },
  ],
  position,
});

const initialState: SchemaState = {
  tables: [],
  relationships: [],
  selectedTableId: null,
  selectedRelationshipId: null,
  history: [],
  historyIndex: -1,
};

export const useSchemaStore = create<SchemaState & SchemaActions>((set, get) => ({
  ...initialState,

  saveToHistory: () => {
    const { tables, relationships, history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ tables: JSON.parse(JSON.stringify(tables)), relationships: JSON.parse(JSON.stringify(relationships)) });
    
    // Keep only last 50 states
    if (newHistory.length > 50) {
      newHistory.shift();
    }
    
    set({ history: newHistory, historyIndex: newHistory.length - 1 });
  },

  addTable: (name, position) => {
    get().saveToHistory();
    const tableCount = get().tables.length;
    const newTable = createDefaultTable(
      name || `table_${tableCount + 1}`,
      position || { x: 100 + (tableCount * 50) % 300, y: 100 + (tableCount * 50) % 300 }
    );
    set((state) => ({
      tables: [...state.tables, newTable],
      selectedTableId: newTable.id,
    }));
  },

  updateTable: (tableId, updates) => {
    get().saveToHistory();
    set((state) => ({
      tables: state.tables.map((t) =>
        t.id === tableId ? { ...t, ...updates } : t
      ),
    }));
  },

  deleteTable: (tableId) => {
    get().saveToHistory();
    set((state) => ({
      tables: state.tables.filter((t) => t.id !== tableId),
      relationships: state.relationships.filter(
        (r) => r.fromTableId !== tableId && r.toTableId !== tableId
      ),
      selectedTableId: state.selectedTableId === tableId ? null : state.selectedTableId,
    }));
  },

  updateTablePosition: (tableId, position) => {
    set((state) => ({
      tables: state.tables.map((t) =>
        t.id === tableId ? { ...t, position } : t
      ),
    }));
  },

  addColumn: (tableId) => {
    get().saveToHistory();
    set((state) => ({
      tables: state.tables.map((t) =>
        t.id === tableId
          ? { ...t, columns: [...t.columns, createDefaultColumn()] }
          : t
      ),
    }));
  },

  updateColumn: (tableId, columnId, updates) => {
    get().saveToHistory();
    set((state) => ({
      tables: state.tables.map((t) =>
        t.id === tableId
          ? {
              ...t,
              columns: t.columns.map((c) =>
                c.id === columnId ? { ...c, ...updates } : c
              ),
            }
          : t
      ),
    }));
  },

  deleteColumn: (tableId, columnId) => {
    get().saveToHistory();
    set((state) => ({
      tables: state.tables.map((t) =>
        t.id === tableId
          ? { ...t, columns: t.columns.filter((c) => c.id !== columnId) }
          : t
      ),
      relationships: state.relationships.filter(
        (r) =>
          !(r.fromTableId === tableId && r.fromColumnId === columnId) &&
          !(r.toTableId === tableId && r.toColumnId === columnId)
      ),
    }));
  },

  addRelationship: (fromTableId, fromColumnId, toTableId, toColumnId, relationType = 'one-to-many') => {
    // Prevent self-references and duplicates
    const existing = get().relationships.find(
      (r) =>
        (r.fromTableId === fromTableId && r.fromColumnId === fromColumnId &&
         r.toTableId === toTableId && r.toColumnId === toColumnId) ||
        (r.fromTableId === toTableId && r.fromColumnId === toColumnId &&
         r.toTableId === fromTableId && r.toColumnId === fromColumnId)
    );
    if (existing || (fromTableId === toTableId && fromColumnId === toColumnId)) return;

    get().saveToHistory();
    const newRelationship: Relationship = {
      id: uuidv4(),
      fromTableId,
      fromColumnId,
      toTableId,
      toColumnId,
      relationType,
    };
    set((state) => ({
      relationships: [...state.relationships, newRelationship],
    }));
  },

  updateRelationship: (relationshipId, updates) => {
    get().saveToHistory();
    set((state) => ({
      relationships: state.relationships.map((r) =>
        r.id === relationshipId ? { ...r, ...updates } : r
      ),
    }));
  },

  deleteRelationship: (relationshipId) => {
    get().saveToHistory();
    set((state) => ({
      relationships: state.relationships.filter((r) => r.id !== relationshipId),
      selectedRelationshipId: state.selectedRelationshipId === relationshipId ? null : state.selectedRelationshipId,
    }));
  },

  selectTable: (tableId) => {
    set({ selectedTableId: tableId, selectedRelationshipId: null });
  },

  selectRelationship: (relationshipId) => {
    set({ selectedRelationshipId: relationshipId, selectedTableId: null });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      set({
        tables: JSON.parse(JSON.stringify(prevState.tables)),
        relationships: JSON.parse(JSON.stringify(prevState.relationships)),
        historyIndex: historyIndex - 1,
      });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      set({
        tables: JSON.parse(JSON.stringify(nextState.tables)),
        relationships: JSON.parse(JSON.stringify(nextState.relationships)),
        historyIndex: historyIndex + 1,
      });
    }
  },

  clearSchema: () => {
    get().saveToHistory();
    set({
      tables: [],
      relationships: [],
      selectedTableId: null,
      selectedRelationshipId: null,
    });
  },

  loadSchema: (tables, relationships) => {
    set({
      tables: JSON.parse(JSON.stringify(tables)),
      relationships: JSON.parse(JSON.stringify(relationships)),
      selectedTableId: null,
      selectedRelationshipId: null,
      history: [],
      historyIndex: -1,
    });
  },
}));
