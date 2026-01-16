import { Key, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useSchemaStore } from '@/store/schemaStore';
import { COLUMN_TYPES, ColumnType, RelationType } from '@/types/schema';
import { motion, AnimatePresence } from 'framer-motion';

const RELATION_TYPES: { value: RelationType; label: string }[] = [
  { value: 'one-to-one', label: 'One to One (1:1)' },
  { value: 'one-to-many', label: 'One to Many (1:N)' },
  { value: 'many-to-many', label: 'Many to Many (N:N)' },
];

export const PropertiesPanel = () => {
  const {
    tables,
    relationships,
    selectedTableId,
    selectedRelationshipId,
    updateTable,
    addColumn,
    updateColumn,
    deleteColumn,
    updateRelationship,
    deleteRelationship,
  } = useSchemaStore();

  const selectedTable = tables.find((t) => t.id === selectedTableId);
  const selectedRelationship = relationships.find((r) => r.id === selectedRelationshipId);

  if (!selectedTable && !selectedRelationship) {
    return (
      <aside className="properties-panel w-72 flex items-center justify-center">
        <div className="text-center text-muted-foreground p-6">
          <Key className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Select a table or relationship</p>
          <p className="text-xs mt-1">to view and edit properties</p>
        </div>
      </aside>
    );
  }

  if (selectedRelationship) {
    const fromTable = tables.find((t) => t.id === selectedRelationship.fromTableId);
    const toTable = tables.find((t) => t.id === selectedRelationship.toTableId);
    const fromColumn = fromTable?.columns.find((c) => c.id === selectedRelationship.fromColumnId);
    const toColumn = toTable?.columns.find((c) => c.id === selectedRelationship.toColumnId);

    return (
      <aside className="properties-panel w-72">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold">Relationship</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {fromTable?.name}.{fromColumn?.name} → {toTable?.name}.{toColumn?.name}
          </p>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <Label>Relationship Type</Label>
              <Select
                value={selectedRelationship.relationType}
                onValueChange={(value: RelationType) =>
                  updateRelationship(selectedRelationship.id, { relationType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RELATION_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="destructive"
              size="sm"
              className="w-full"
              onClick={() => deleteRelationship(selectedRelationship.id)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Relationship
            </Button>
          </div>
        </ScrollArea>
      </aside>
    );
  }

  return (
    <aside className="properties-panel w-72 flex flex-col">
      <div className="p-4 border-b border-border">
        <Label htmlFor="table-name" className="text-xs text-muted-foreground">
          Table Name
        </Label>
        <Input
          id="table-name"
          value={selectedTable!.name}
          onChange={(e) => updateTable(selectedTable!.id, { name: e.target.value })}
          className="mt-1 font-medium"
        />
      </div>

      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold text-sm">Columns</h3>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => addColumn(selectedTable!.id)}
          className="h-7"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          <AnimatePresence mode="popLayout">
            {selectedTable!.columns.map((column) => (
              <motion.div
                key={column.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-3 bg-secondary/50 rounded-lg space-y-3"
              >
                <div className="flex items-center gap-2">
                  <Input
                    value={column.name}
                    onChange={(e) =>
                      updateColumn(selectedTable!.id, column.id, { name: e.target.value })
                    }
                    className="h-8 text-sm font-mono"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 shrink-0"
                    onClick={() => deleteColumn(selectedTable!.id, column.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5 text-destructive" />
                  </Button>
                </div>

                <Select
                  value={column.type}
                  onValueChange={(value: ColumnType) =>
                    updateColumn(selectedTable!.id, column.id, { type: value })
                  }
                >
                  <SelectTrigger className="h-8 text-sm font-mono">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COLUMN_TYPES.map((type) => (
                      <SelectItem key={type} value={type} className="font-mono">
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex flex-wrap gap-3">
                  <label className="flex items-center gap-2 text-xs">
                    <Switch
                      checked={column.isPrimary}
                      onCheckedChange={(checked) =>
                        updateColumn(selectedTable!.id, column.id, { isPrimary: checked })
                      }
                      className="scale-75"
                    />
                    Primary
                  </label>
                  <label className="flex items-center gap-2 text-xs">
                    <Switch
                      checked={column.isNullable}
                      onCheckedChange={(checked) =>
                        updateColumn(selectedTable!.id, column.id, { isNullable: checked })
                      }
                      className="scale-75"
                    />
                    Nullable
                  </label>
                  <label className="flex items-center gap-2 text-xs">
                    <Switch
                      checked={column.isUnique}
                      onCheckedChange={(checked) =>
                        updateColumn(selectedTable!.id, column.id, { isUnique: checked })
                      }
                      className="scale-75"
                    />
                    Unique
                  </label>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </aside>
  );
};
