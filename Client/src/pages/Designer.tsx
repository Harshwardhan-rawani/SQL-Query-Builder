import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useDesignsStore } from '@/store/designsStore';
import { useSchemaStore } from '@/store/schemaStore';
import { Topbar } from '@/components/Topbar/Topbar';
import { SchemaExplorer } from '@/components/Sidebars/SchemaExplorer';
import { PropertiesPanel } from '@/components/Sidebars/PropertiesPanel';
import { SchemaCanvas } from '@/components/Canvas/SchemaCanvas';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { usePreview } from '@/contexts/PreviewContext';
import { motion, AnimatePresence } from 'framer-motion';
const Designer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { designs, loadDesigns, updateDesign, getDesign } = useDesignsStore();
  const { tables, relationships, loadSchema } = useSchemaStore();
  const [designName, setDesignName] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
 const { isPreview, togglePreview } = usePreview();
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user && !isLoaded) {
      loadDesigns(user.id);
    }
  }, [user, loadDesigns, isLoaded]);

  useEffect(() => {
    if (id && designs.length > 0 && !isLoaded) {
      const design = getDesign(id);
      if (design) {
        setDesignName(design.name);
        loadSchema(design.tables, design.relationships);
        setIsLoaded(true);
      } else {
        navigate('/dashboard');
      }
    }
  }, [id, designs, getDesign, loadSchema, navigate, isLoaded]);

  const handleSave = () => {
    if (!id) return;
    updateDesign(id, designName, tables, relationships);
    toast({
      title: 'Saved!',
      description: 'Your design has been saved successfully.',
    });
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  if (authLoading || !isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-card">
        <Button variant="ghost" size="sm" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <span className="text-muted-foreground">|</span>
        <span className="font-medium text-foreground">{designName}</span>
        <div className="flex-1" />
        <Button size="sm" onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Save Design
        </Button>
      </div>
      <Topbar />
      <div className="flex-1 flex overflow-hidden">
     <AnimatePresence mode="wait">

  {/* Left Sidebar */}
  {!isPreview && (
    <motion.div
      key="schema-explorer"
      initial={{ x: -260, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -260, opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="border-r border-border bg-card"
    >
      <SchemaExplorer />
    </motion.div>
  )}

</AnimatePresence>


  <SchemaCanvas />


<AnimatePresence mode="wait">

  {/* Right Sidebar */}
  {!isPreview && (
    <motion.div
      key="properties-panel"
      initial={{ x: 260, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 260, opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="border-l border-border bg-card"
    >
      <PropertiesPanel />
    </motion.div>
  )}

</AnimatePresence>
      </div>
    </div>
  );
};

export default Designer;
