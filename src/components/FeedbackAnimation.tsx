import { useEffect, useState } from "react";
import starImage from "@/assets/star.png";
import { CheckCircle2, XCircle } from "lucide-react";

interface FeedbackAnimationProps {
  isCorrect: boolean;
  onComplete: () => void;
}

export const FeedbackAnimation = ({ isCorrect, onComplete }: FeedbackAnimationProps) => {
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    if (isCorrect) {
      // Generăm stele care cad
      const newStars = Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -20,
      }));
      setStars(newStars);
    }

    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [isCorrect, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      {isCorrect ? (
        <div className="relative">
          <div className="animate-pop flex flex-col items-center gap-6 bg-card p-12 rounded-3xl shadow-success">
            <CheckCircle2 className="w-32 h-32 text-success animate-bounce-slow" />
            <p className="text-4xl font-bold text-success">Bravo! Excelent! 🎉</p>
            <p className="text-2xl text-muted-foreground">Ești un geniu la matematică!</p>
          </div>
          {stars.map((star) => (
            <img
              key={star.id}
              src={starImage}
              alt="star"
              className="absolute w-12 h-12 animate-bounce-slow"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                animation: `fall 2s ease-in forwards`,
                animationDelay: `${star.id * 0.05}s`,
              }}
            />
          ))}
        </div>
      ) : (
        <div className="animate-pop flex flex-col items-center gap-6 bg-card p-12 rounded-3xl shadow-card">
          <XCircle className="w-32 h-32 text-warning animate-wiggle" />
          <p className="text-4xl font-bold text-warning">Hmmm... Nu e corect!</p>
          <p className="text-2xl text-muted-foreground">Încearcă din nou, ești aproape! 💪</p>
        </div>
      )}
    </div>
  );
};
