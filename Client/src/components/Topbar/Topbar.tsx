import { Database, Download, Plus, Redo2, Save, Undo2,Fullscreen,Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSchemaStore } from '@/store/schemaStore';
import { downloadSQL } from '@/utils/sqlExport';
import { toast } from 'sonner';
import { usePreview } from '@/contexts/PreviewContext';

export const Topbar = () => {
  const { tables, relationships, addTable, undo, redo, history, historyIndex } = useSchemaStore();
 const { isPreview, togglePreview } = usePreview();
  const handleNewTable = () => {
    addTable();
    toast.success('New table created');
  };

  const handleExportSQL = () => {
    if (tables.length === 0) {
      toast.error('No tables to export');
      return;
    }
    downloadSQL({ tables, relationships });
    toast.success('SQL exported successfully');
  };

  // const handleSave = () => {
  //   const schema = { tables, relationships };
  //   localStorage.setItem('schema-designer', JSON.stringify(schema));
  //   toast.success('Schema saved to local storage');
  // };

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return (
    <header className="topbar justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Database className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg">LinkDB</span>
        </div>
        
        <div className="h-6 w-px bg-border" />
        
        <span className="text-sm text-muted-foreground">
          {tables.length} table{tables.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={undo}
          disabled={!canUndo}
          className="action-button-ghost"
        >
          <Undo2 className="w-4 h-4" />
          <span className="hidden sm:inline">Undo</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={redo}
          disabled={!canRedo}
          className="action-button-ghost"
        >
          <Redo2 className="w-4 h-4" />
          <span className="hidden sm:inline">Redo</span>
        </Button>

        <div className="h-6 w-px bg-border mx-1" />

        <Button
          variant="outline"
          size="sm"
          onClick={handleNewTable}
          className="action-button-secondary"
        >
          <Plus className="w-4 h-4" />
          New Table
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleExportSQL}
          className="action-button-secondary"
        >
          <Download className="w-4 h-4" />
          Export SQL
        </Button>

       <Button
      size="sm"
      className="action-button-primary flex items-center gap-2"
      onClick={togglePreview}
    >
      {isPreview ? (
        <>
          <Edit className="w-4 h-4" />
          Edit Preview
        </>
      ) : (
        <>
          <Fullscreen className="w-4 h-4" />
          Full Preview
        </>
      )}
    </Button>
      </div>
    </header>
  );
};
