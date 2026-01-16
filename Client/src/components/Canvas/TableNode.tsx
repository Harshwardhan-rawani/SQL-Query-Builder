import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Key, Hash, Circle } from 'lucide-react';
import { Table } from '@/types/schema';
import { cn } from '@/lib/utils';
import { useSchemaStore } from '@/store/schemaStore';

interface TableNodeProps {
  data: {
    table: Table;
  };
  selected?: boolean;
}

export const TableNode = memo(({ data, selected }: TableNodeProps) => {
  const { table } = data;
  const selectTable = useSchemaStore((state) => state.selectTable);

  const handleClick = () => {
    selectTable(table.id);
  };

  return (
    <div
      className={cn('table-node', selected && 'selected')}
      onClick={handleClick}
    >
      <div className="table-node-header">
        <span className="truncate">{table.name}</span>
        <span className="text-xs opacity-70">{table.columns.length} cols</span>
      </div>

      <div className="relative px-4 ">
        {table.columns.map((column) => (
          <div key={column.id} className="table-node-column relative">
            {/* Left handle for incoming connections */}
            <Handle
              type="target"
              position={Position.Left}
              id={`${column.id}-target`}
              style={{ top: '50%' }}
              className="!w-2.5 !h-2.5 "
            />

            <div className="flex items-center gap-2 flex-1 min-w-0 ">
              {column.isPrimary ? (
                <Key className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              ) : column.isUnique ? (
                <Hash className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              ) : (
                <Circle className="w-3 h-3 text-muted-foreground shrink-0" />
              )}
              <span className="truncate font-medium">{column.name}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="column-type-badge">{column.type}</span>
              {!column.isNullable && (
                <span className="text-xs text-destructive font-medium">*</span>
              )}
            </div>

            {/* Right handle for outgoing connections */}
            <Handle
              type="source"
              position={Position.Right}
              id={`${column.id}-source`}
              style={{ top: '50%' }}
              className="!w-2.5 !h-2.5"
            />
          </div>
        ))}
      </div>
    </div>
  );
});

TableNode.displayName = 'TableNode';
