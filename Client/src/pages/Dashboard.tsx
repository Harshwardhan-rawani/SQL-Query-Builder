import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useDesignsStore, SavedDesign } from '@/store/designsStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Database, Plus, Pencil, Trash2, LogOut, FolderOpen, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const Dashboard = () => {
  const { user, logout, isLoading: authLoading } = useAuth();
  const { designs, loadDesigns, saveDesign, updateDesign, deleteDesign } = useDesignsStore();
  const navigate = useNavigate();
  
  const [newDesignName, setNewDesignName] = useState('');
  const [editingDesign, setEditingDesign] = useState<SavedDesign | null>(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      loadDesigns(user.id);
    }
  }, [user, loadDesigns]);

const handleCreateDesign = async () => {
  if (!user || !newDesignName.trim()) return;

  const design = await saveDesign(user.id, newDesignName, [], []);
  navigate(`/designer/${design.id}`);
};


  const handleEditDesign = () => {
    if (!editingDesign || !editName.trim()) return;
    
    updateDesign(editingDesign.id, editName, editingDesign.tables, editingDesign.relationships);
    setEditingDesign(null);
    setEditName('');
  };

  const handleDeleteDesign = (id: string) => {
    deleteDesign(id);
  };

  const handleOpenDesign = (id: string) => {
    navigate(`/designer/${id}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground">LinkDB</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Hello, <span className="text-foreground font-medium">{user?.name}</span>
            </span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Your Designs</h1>
            <p className="text-muted-foreground mt-1">
              Create and manage your database schema designs
            </p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Design
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Design</DialogTitle>
                <DialogDescription>
                  Give your new schema design a name to get started.
                </DialogDescription>
              </DialogHeader>
              <Input
                placeholder="Design name"
                value={newDesignName}
                onChange={(e) => setNewDesignName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateDesign()}
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button onClick={handleCreateDesign} disabled={!newDesignName.trim()}>
                    Create
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {designs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No designs yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first database schema design to get started.
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Design
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Design</DialogTitle>
                  <DialogDescription>
                    Give your new schema design a name to get started.
                  </DialogDescription>
                </DialogHeader>
                <Input
                  placeholder="Design name"
                  value={newDesignName}
                  onChange={(e) => setNewDesignName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateDesign()}
                />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button onClick={handleCreateDesign} disabled={!newDesignName.trim()}>
                      Create
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {designs.map((design, index) => (
              <motion.div
                key={design.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div 
                        className="flex-1 cursor-pointer" 
                        onClick={() => handleOpenDesign(design.id)}
                      >
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {design.name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(design.updatedAt), 'MMM d, yyyy')}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => {
                                setEditingDesign(design);
                                setEditName(design.name);
                              }}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Rename Design</DialogTitle>
                              <DialogDescription>
                                Enter a new name for your design.
                              </DialogDescription>
                            </DialogHeader>
                            <Input
                              placeholder="Design name"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleEditDesign()}
                            />
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                              </DialogClose>
                              <DialogClose asChild>
                                <Button onClick={handleEditDesign} disabled={!editName.trim()}>
                                  Save
                                </Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Design</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{design.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteDesign(design.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent onClick={() => handleOpenDesign(design.id)}>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{design.tables.length} tables</span>
                      <span>{design.relationships.length} relationships</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
