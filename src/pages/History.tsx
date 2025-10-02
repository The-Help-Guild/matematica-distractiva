import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, CheckCircle2, XCircle, Calendar, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { ro } from "date-fns/locale";

interface HistoryEntry {
  id: string;
  operation_type: string;
  num1: number;
  num2: number;
  user_answer: number;
  correct_answer: number;
  is_correct: boolean;
  created_at: string;
}

const History = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const userName = localStorage.getItem("userName") || "";

  useEffect(() => {
    if (!userName) {
      navigate("/");
      return;
    }
    fetchHistory();
  }, [userName]);

  const fetchHistory = async () => {
    const { data, error } = await supabase
      .from('exercise_history')
      .select('*')
      .eq('user_name', userName)
      .order('created_at', { ascending: false })
      .limit(50);

    if (!error && data) {
      setHistory(data);
      const correct = data.filter(e => e.is_correct).length;
      setStats({ correct, total: data.length });
    }
  };

  const getOperationSymbol = (type: string) => {
    return type === 'addition' ? '+' : '-';
  };

  const percentage = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            Înapoi Acasă
          </Button>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-hero bg-clip-text text-transparent text-center">
            Istoricul Meu 📖
          </h1>
          <div className="hidden sm:block sm:w-32 md:w-40" /> {/* Spacer pentru centrare */}
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <Card className="p-4 sm:p-6 shadow-card bg-gradient-to-br from-primary/10 to-accent/10 border-4 border-primary/20">
            <div className="flex items-center gap-3 sm:gap-4">
              <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-primary flex-shrink-0" />
              <div>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground">Total Exerciții</p>
                <p className="text-3xl sm:text-4xl font-bold text-primary">{stats.total}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6 shadow-card bg-gradient-to-br from-success/10 to-accent/10 border-4 border-success/20">
            <div className="flex items-center gap-3 sm:gap-4">
              <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-success flex-shrink-0" />
              <div>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground">Răspunsuri Corecte</p>
                <p className="text-3xl sm:text-4xl font-bold text-success">{stats.correct}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6 shadow-card bg-gradient-to-br from-sunny/10 to-playful/10 border-4 border-sunny/20 sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 sm:gap-4">
              <TrendingUp className="w-10 h-10 sm:w-12 sm:h-12 text-sunny flex-shrink-0" />
              <div>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground">Rată de Succes</p>
                <p className="text-3xl sm:text-4xl font-bold text-sunny">{percentage}%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* History List */}
        <Card className="p-4 sm:p-6 md:p-8 shadow-card">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center gradient-playful bg-clip-text text-transparent">
            Exercițiile Tale Recente
          </h2>
          {history.length === 0 ? (
            <p className="text-lg sm:text-xl md:text-2xl text-center text-muted-foreground py-8 sm:py-12">
              Nu ai rezolvat încă niciun exercițiu! <br />
              Începe să exersezi și vei vedea aici progresul tău! 🚀
            </p>
          ) : (
            <div className="space-y-3 sm:space-y-4 max-h-[500px] sm:max-h-[600px] overflow-y-auto">
              {history.map((entry, index) => (
                <div
                  key={entry.id}
                  className={`p-4 sm:p-6 rounded-xl border-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 animate-fade-in ${
                    entry.is_correct
                      ? "bg-success/10 border-success/30"
                      : "bg-warning/10 border-warning/30"
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto">
                    {entry.is_correct ? (
                      <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-success flex-shrink-0" />
                    ) : (
                      <XCircle className="w-8 h-8 sm:w-10 sm:h-10 text-warning flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-lg sm:text-xl md:text-2xl font-bold">
                        {entry.num1} {getOperationSymbol(entry.operation_type)} {entry.num2} = {entry.user_answer}
                      </p>
                      {!entry.is_correct && (
                        <p className="text-base sm:text-lg text-muted-foreground">
                          Răspuns corect: {entry.correct_answer}
                        </p>
                      )}
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        {format(new Date(entry.created_at), "dd MMMM yyyy, HH:mm", { locale: ro })}
                      </p>
                    </div>
                  </div>
                  {entry.is_correct && (
                    <span className="text-3xl sm:text-4xl">🌟</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default History;
