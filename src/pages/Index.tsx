import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Minus, X } from "lucide-react";
import heroImage from "@/assets/hero-bg.png";

const Index = () => {
  const navigate = useNavigate();

  const startExercise = (type: "subtraction" | "multiplication") => {
    navigate("/exercise", { state: { operationType: type } });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Hero Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Content */}
      <div className="relative z-10 max-w-5xl w-full space-y-12">
        {/* Header */}
        <div className="text-center space-y-6 animate-fade-in">
          <h1 className="text-7xl font-bold gradient-hero bg-clip-text text-transparent">
            Matematică Distractivă! 🎓
          </h1>
          <p className="text-3xl text-muted-foreground font-semibold">
            Hai să învățăm împreună matematica!
          </p>
        </div>

        {/* Exercise Cards */}
        <div className="grid md:grid-cols-2 gap-8 animate-scale-in">
          <Card
            className="p-12 space-y-8 hover:scale-105 transition-all cursor-pointer shadow-playful bg-gradient-to-br from-primary/10 to-accent/10 border-4 border-primary/20"
            onClick={() => startExercise("subtraction")}
          >
            <div className="flex justify-center">
              <div className="w-32 h-32 rounded-full gradient-hero flex items-center justify-center shadow-playful">
                <Minus className="w-20 h-20 text-primary-foreground" strokeWidth={4} />
              </div>
            </div>
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-primary">Scădere</h2>
              <p className="text-xl text-muted-foreground">
                Învață să scazi numere până la 10!
              </p>
            </div>
            <Button
              size="lg"
              variant="default"
              className="w-full"
              onClick={() => startExercise("subtraction")}
            >
              Începe Scăderea! 🎯
            </Button>
          </Card>

          <Card
            className="p-12 space-y-8 hover:scale-105 transition-all cursor-pointer shadow-playful bg-gradient-to-br from-secondary/10 to-playful/10 border-4 border-secondary/20"
            onClick={() => startExercise("multiplication")}
          >
            <div className="flex justify-center">
              <div className="w-32 h-32 rounded-full gradient-playful flex items-center justify-center shadow-playful">
                <X className="w-20 h-20 text-playful-foreground" strokeWidth={4} />
              </div>
            </div>
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-secondary">Înmulțire</h2>
              <p className="text-xl text-muted-foreground">
                Descoperă înmulțirea până la 10!
              </p>
            </div>
            <Button
              size="lg"
              variant="secondary"
              className="w-full"
              onClick={() => startExercise("multiplication")}
            >
              Începe Înmulțirea! 🚀
            </Button>
          </Card>
        </div>

        {/* Footer Info */}
        <div className="text-center space-y-4 animate-fade-in">
          <p className="text-2xl text-muted-foreground">
            ✨ Fiecare exercițiu e diferit și te ajută să înveți! ✨
          </p>
          <p className="text-xl text-muted-foreground/80">
            Apasă pe una dintre carduri pentru a începe aventura!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
