import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Minus, Plus, History as HistoryIcon } from "lucide-react";
import { UserNameDialog } from "@/components/UserNameDialog";
import { Leaderboard } from "@/components/Leaderboard";
import heroImage from "@/assets/hero-bg.png";

const Index = () => {
  const navigate = useNavigate();
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const savedName = localStorage.getItem("userName");
    if (!savedName) {
      setShowNameDialog(true);
    } else {
      setUserName(savedName);
    }
  }, []);

  const handleNameSubmit = (name: string) => {
    setUserName(name);
    setShowNameDialog(false);
  };

  const startExercise = (type: "subtraction" | "addition") => {
    if (!userName) {
      setShowNameDialog(true);
      return;
    }
    navigate("/exercise", { state: { operationType: type } });
  };

  return (
    <>
      <UserNameDialog open={showNameDialog} onSubmit={handleNameSubmit} />
      
      <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
        {/* Hero Background */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        
        {/* Content */}
        <div className="relative z-10 max-w-6xl w-full space-y-12">
          {/* Welcome Message */}
          {userName && (
            <div className="text-center animate-fade-in">
              <p className="text-3xl font-bold text-playful">
                Bine ai revenit, {userName}! 🎉
              </p>
            </div>
          )}

          {/* Buttons Row */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={() => navigate("/history")}
              variant="outline"
              size="lg"
            >
              <HistoryIcon className="mr-2" />
              Istoricul Meu
            </Button>
          </div>
          {/* Header */}
          <div className="text-center space-y-6 animate-fade-in">
            <h1 className="text-7xl font-bold gradient-hero bg-clip-text text-transparent">
              Matematică Distractivă! 🎓
            </h1>
            <p className="text-3xl text-muted-foreground font-semibold">
              Hai să învățăm împreună matematica!
            </p>
          </div>

          {/* Exercise Cards and Leaderboard Grid */}
          <div className="grid lg:grid-cols-3 gap-8 animate-scale-in">
            {/* Exercise Cards Column */}
            <div className="lg:col-span-2 grid md:grid-cols-2 gap-8">
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
            onClick={() => startExercise("addition")}
          >
            <div className="flex justify-center">
              <div className="w-32 h-32 rounded-full gradient-playful flex items-center justify-center shadow-playful">
                <Plus className="w-20 h-20 text-playful-foreground" strokeWidth={4} />
              </div>
            </div>
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-secondary">Adunare</h2>
              <p className="text-xl text-muted-foreground">
                Descoperă adunarea până la 10!
              </p>
            </div>
            <Button
              size="lg"
              variant="secondary"
              className="w-full"
              onClick={() => startExercise("addition")}
            >
              Începe Adunarea! 🚀
            </Button>
            </Card>
            </div>

            {/* Leaderboard Column */}
            <div className="lg:col-span-1">
              <Leaderboard />
            </div>
          </div>

          {/* Footer Info */}
          <div className="text-center space-y-4 animate-fade-in">
            <p className="text-2xl text-muted-foreground">
              ✨ Fiecare exercițiu e diferit și te ajută să înveți! ✨
            </p>
            <p className="text-xl text-muted-foreground/80">
              Rezolvă exerciții și intră în Top 3 zilnic! 🏆
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
