import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Minus, Plus, History as HistoryIcon, LogOut } from "lucide-react";
import { Leaderboard } from "@/components/Leaderboard";
import heroImage from "@/assets/hero-bg.png";

const Index = () => {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("display_name")
          .eq("id", user.id)
          .single();
        
        if (profile) {
          setDisplayName(profile.display_name);
        }
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const startExercise = (type: "subtraction" | "addition") => {
    navigate("/exercise", { state: { operationType: type } });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden">
      {/* Hero Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Content */}
      <div className="relative z-10 max-w-6xl w-full space-y-8 sm:space-y-10 md:space-y-12">
        {/* Welcome Message */}
        {displayName && (
          <div className="text-center animate-fade-in">
            <p className="text-2xl sm:text-3xl font-bold text-playful">
              Bine ai revenit, {displayName}! 🎉
            </p>
          </div>
        )}

        {/* Buttons Row */}
        <div className="flex justify-center gap-3 sm:gap-4">
          <Button
            onClick={() => navigate("/history")}
            variant="outline"
            size="lg"
            className="text-base sm:text-lg"
          >
            <HistoryIcon className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            Istoricul Meu
          </Button>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="lg"
            className="text-base sm:text-lg"
          >
            <LogOut className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            Deconectare
          </Button>
        </div>

        {/* Header */}
        <div className="text-center space-y-4 sm:space-y-6 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold gradient-hero bg-clip-text text-transparent">
            Matematică Distractivă! 🎓
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl text-muted-foreground font-semibold">
            Hai să învățăm împreună matematica!
          </p>
        </div>

        {/* Exercise Cards and Leaderboard Grid */}
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 animate-scale-in">
          {/* Exercise Cards Column */}
          <div className="lg:col-span-2 grid md:grid-cols-2 gap-6 sm:gap-8">
            <Card
              className="p-6 sm:p-8 md:p-12 space-y-6 sm:space-y-8 hover:scale-105 transition-all cursor-pointer shadow-playful bg-gradient-to-br from-primary/10 to-accent/10 border-4 border-primary/20"
              onClick={() => startExercise("subtraction")}
            >
              <div className="flex justify-center">
                <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full gradient-hero flex items-center justify-center shadow-playful">
                  <Minus className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 text-primary-foreground" strokeWidth={4} />
                </div>
              </div>
              <div className="text-center space-y-3 sm:space-y-4">
                <h2 className="text-3xl sm:text-4xl font-bold text-primary">Scădere</h2>
                <p className="text-lg sm:text-xl text-muted-foreground">
                  Învață să scazi numere până la 10!
                </p>
              </div>
              <Button
                size="lg"
                variant="default"
                className="w-full text-base sm:text-lg"
                onClick={() => startExercise("subtraction")}
              >
                Începe Scăderea! 🎯
              </Button>
            </Card>

            <Card
              className="p-6 sm:p-8 md:p-12 space-y-6 sm:space-y-8 hover:scale-105 transition-all cursor-pointer shadow-playful bg-gradient-to-br from-secondary/10 to-playful/10 border-4 border-secondary/20"
              onClick={() => startExercise("addition")}
            >
              <div className="flex justify-center">
                <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full gradient-playful flex items-center justify-center shadow-playful">
                  <Plus className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 text-playful-foreground" strokeWidth={4} />
                </div>
              </div>
              <div className="text-center space-y-3 sm:space-y-4">
                <h2 className="text-3xl sm:text-4xl font-bold text-secondary">Adunare</h2>
                <p className="text-lg sm:text-xl text-muted-foreground">
                  Descoperă adunarea până la 10!
                </p>
              </div>
              <Button
                size="lg"
                variant="secondary"
                className="w-full text-base sm:text-lg"
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
        <div className="text-center space-y-3 sm:space-y-4 animate-fade-in">
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground">
            ✨ Fiecare exercițiu este diferit și te ajută să înveți! ✨
          </p>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground/80">
            Rezolvă exerciții și intră în Top 3 zilnic! 🏆
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
