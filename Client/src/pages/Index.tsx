import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Database, ArrowRight, Layers, Share2, Download } from 'lucide-react';
import { motion } from 'framer-motion';

const Index = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      navigate('/dashboard');
    }
  }, [user, isLoading, navigate]);

  const features = [
    {
      icon: Layers,
      title: 'Visual Design',
      description: 'Drag and drop tables, create columns, and visualize your database structure.',
    },
    {
      icon: Share2,
      title: 'Relationships',
      description: 'Draw connections between tables to define foreign keys and relationships.',
    },
    {
      icon: Download,
      title: 'SQL Export',
      description: 'Export your schema to SQL with a single click for easy migration.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">

      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto
        sticky top-0 z-50
        backdrop-blur-md bg-background/70
        border-b border-border/50">
        
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center
            shadow-sm hover:shadow-md transition-shadow">
            <Database className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold text-foreground tracking-tight">
            LinkDB
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => navigate('/auth')}>
            Sign In
          </Button>
          <Button onClick={() => navigate('/auth')}>
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto relative
            after:absolute after:inset-0
            after:bg-gradient-to-b after:from-primary/5 after:to-transparent
            after:blur-3xl after:-z-10"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight tracking-tight">
            Design Your Database
            <span className="text-primary block">Visually</span>
          </h1>

          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Create beautiful database schemas with our intuitive drag-and-drop designer.
            Build tables, define relationships, and export to SQL in minutes.
          </p>

          <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
            <Button size="lg" onClick={() => navigate('/auth')}>
              Start Designing
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/auth')}>
              View Demo
            </Button>
          </div>
        </motion.div>
<section className="mt-36 max-w-7xl mx-auto ">
        {/* Features */}
          <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="text-center mb-10"
  >
    <h2 className="text-3xl md:text-4xl font-bold text-foreground">
       Powerful Features
    </h2>
    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
      Everything you need to design, visualize, and export database schemas —
  all in one intuitive and easy-to-use workspace.
    </p>
  </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-8"
        >
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-card border border-border rounded-xl p-6
                hover:shadow-xl hover:-translate-y-1
                transition-all duration-300 ease-out"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg
                flex items-center justify-center mb-4 shadow-inner">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>

              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </motion.div>
    </section>
         
{/* How It Works */}
<section className="mt-32 max-w-7xl mx-auto ">

  {/* Heading + Description */}
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="text-center mb-16"
  >
    <h2 className="text-3xl md:text-4xl font-bold text-foreground">
      How It Works
    </h2>
    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
      Design, connect, and export your database schema in just a few simple steps.
      No complex setup, no steep learning curve.
    </p>
  </motion.div>

  {/* Steps */}
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.2 }}
    className="grid md:grid-cols-3 gap-8"
  >
    {[
      {
        step: "01",
        title: "Create Tables",
        desc: "Add tables and columns visually with drag & drop."
      },
      {
        step: "02",
        title: "Define Relations",
        desc: "Connect tables to define foreign keys and constraints."
      },
      {
        step: "03",
        title: "Export SQL",
        desc: "Generate clean SQL for MySQL, PostgreSQL & SQLite."
      }
    ].map((item) => (
      <div
        key={item.step}
        className="bg-card border border-border rounded-xl p-6
                hover:shadow-xl hover:-translate-y-1
                transition-all duration-300 ease-out"
      >
        {/* Step badge */}
        <div className="w-12 h-12 bg-primary/10 rounded-lg
          flex items-center justify-center mb-4 shadow-inner">
          <span className="text-primary text-xl font-bold">
            {item.step}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-foreground mb-2">
          {item.title}
        </h3>

        <p className="text-muted-foreground">
          {item.desc}
        </p>
      </div>
    ))}
  </motion.div>

</section>


      </main>

 

    </div>
  );
};

export default Index;
