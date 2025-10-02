import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Medal, Award } from "lucide-react";

interface LeaderboardEntry {
  user_name: string;
  score: number;
}

export const Leaderboard = () => {
  const [topScores, setTopScores] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    fetchTopScores();

    // Realtime updates
    const channel = supabase
      .channel('daily_scores_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'daily_scores'
        },
        () => {
          fetchTopScores();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchTopScores = async () => {
    const today = new Date().toISOString().split('T')[0];
    
    // Folosește funcția PostgreSQL securizată care returnează doar Top 3
    const { data, error } = await supabase
      .rpc('get_daily_top_scores', { score_date: today });

    if (!error && data) {
      setTopScores(data);
    }
  };

  const getIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-10 h-10 text-sunny animate-bounce-slow" />;
      case 1:
        return <Medal className="w-9 h-9 text-muted-foreground" />;
      case 2:
        return <Award className="w-8 h-8 text-warning" />;
      default:
        return null;
    }
  };

  const getColors = (index: number) => {
    switch (index) {
      case 0:
        return "gradient-sunny border-sunny";
      case 1:
        return "bg-gradient-to-br from-muted to-muted-foreground/20 border-muted-foreground";
      case 2:
        return "bg-gradient-to-br from-warning/20 to-warning/10 border-warning";
      default:
        return "bg-card border-border";
    }
  };

  if (topScores.length === 0) {
    return (
      <Card className="p-6 sm:p-8 shadow-card">
        <h3 className="text-2xl sm:text-3xl font-bold text-center mb-3 sm:mb-4 text-primary">
          🏆 Top Zilnic 🏆
        </h3>
        <p className="text-lg sm:text-xl text-center text-muted-foreground">
          Fii primul în top astăzi! 🌟
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 sm:p-8 shadow-card">
      <h3 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6 gradient-hero bg-clip-text text-transparent">
        🏆 Top Zilnic 🏆
      </h3>
      <div className="space-y-3 sm:space-y-4">
        {topScores.map((entry, index) => (
          <div
            key={index}
            className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl border-4 ${getColors(index)} flex items-center justify-between animate-pop shadow-playful`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center gap-3 sm:gap-4">
              {getIcon(index)}
              <div>
                <p className="text-lg sm:text-xl md:text-2xl font-bold">{entry.user_name}</p>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
                  Locul {index + 1}
                </p>
              </div>
            </div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">
              {entry.score} ⭐
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
