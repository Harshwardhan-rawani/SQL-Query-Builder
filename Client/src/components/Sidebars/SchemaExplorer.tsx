import { Plus, Table2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSchemaStore } from '@/store/schemaStore';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export const SchemaExplorer = () => {
  const { tables, selectedTableId, addTable, selectTable, deleteTable } = useSchemaStore();

  return (
    <aside className="sidebar-panel w-64 flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Tables
          </h2>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => addTable()}
            className="h-7 w-7 p-0"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          <AnimatePresence mode="popLayout">
            {tables.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 text-muted-foreground text-sm"
              >
                <Table2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No tables yet</p>
                <p className="text-xs mt-1">Click + to add one</p>
              </motion.div>
            ) : (
              tables.map((table) => (
                <motion.div
                  key={table.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={cn(
                    'schema-table-item group',
                    selectedTableId === table.id && 'active'
                  )}
                  onClick={() => selectTable(table.id)}
                >
                  <Table2 className="w-4 h-4 shrink-0" />
                  <span className="flex-1 truncate">{table.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {table.columns.length}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTable(table.id);
                    }}
                  >
                    <Trash2 className="w-3 h-3 text-destructive" />
                  </Button>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </aside>
  );
};
