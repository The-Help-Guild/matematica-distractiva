import { useEffect, useState } from "react";
import starImage from "@/assets/star.png";
import { CheckCircle2, XCircle } from "lucide-react";

interface FeedbackAnimationProps {
  isCorrect: boolean;
  onComplete: () => void;
}

const praises = [
  { title: "Bravo! Excelent!", subtitle: "Ești un geniu la matematică!", emoji: "🎉" },
  { title: "Fantastic! Perfect!", subtitle: "Minunat! Continuă tot așa!", emoji: "⭐" },
  { title: "Super! Magnific!", subtitle: "Ești incredibil de deștept!", emoji: "🌟" },
  { title: "Uimitor! Wow!", subtitle: "Ai un creier fantastic!", emoji: "🎯" },
  { title: "Extraordinar!", subtitle: "Matematica e pasiunea ta!", emoji: "🏆" },
  { title: "Spectaculos!", subtitle: "Ești un campion adevărat!", emoji: "👏" },
  { title: "Fenomenal!", subtitle: "Nimeni nu te poate opri!", emoji: "🚀" },
  { title: "Incredibil!", subtitle: "Ești o stea strălucitoare!", emoji: "✨" },
];

const encouragements = [
  { title: "Aproape! Nu renunța!", subtitle: "Încearcă din nou, vei reuși!", emoji: "💪" },
  { title: "Hmmm, mai gândește!", subtitle: "Poți s-o faci mai bine!", emoji: "🤔" },
  { title: "Încearcă din nou!", subtitle: "Greșelile ne ajută să învățăm!", emoji: "📚" },
  { title: "Nu-i nimic! Hai să mai încerci!", subtitle: "Toată lumea greșește uneori!", emoji: "🌈" },
  { title: "Aproape corect!", subtitle: "Ești pe drumul cel bun!", emoji: "🎯" },
];

export const FeedbackAnimation = ({ isCorrect, onComplete }: FeedbackAnimationProps) => {
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [message, setMessage] = useState({ title: "", subtitle: "", emoji: "" });

  useEffect(() => {
    if (isCorrect) {
      // Generăm stele care cad
      const newStars = Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -20,
      }));
      setStars(newStars);
      
      // Selectăm un mesaj aleatoriu de laudă
      const randomPraise = praises[Math.floor(Math.random() * praises.length)];
      setMessage(randomPraise);
    } else {
      // Selectăm un mesaj aleatoriu de încurajare
      const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
      setMessage(randomEncouragement);
    }

    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [isCorrect, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      {isCorrect ? (
        <div className="relative">
          <div className="animate-pop flex flex-col items-center gap-6 bg-card p-12 rounded-3xl shadow-success border-4 border-success/30">
            <CheckCircle2 className="w-40 h-40 text-success animate-bounce-slow" />
            <p className="text-5xl font-bold text-success">{message.title} {message.emoji}</p>
            <p className="text-3xl text-muted-foreground font-semibold">{message.subtitle}</p>
            <div className="flex gap-4 text-6xl animate-bounce-slow">
              🎊 🎉 ⭐ 🌟 ✨
            </div>
          </div>
          {stars.map((star) => (
            <img
              key={star.id}
              src={starImage}
              alt="star"
              className="absolute w-12 h-12"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                animation: `fall 2.5s ease-in forwards`,
                animationDelay: `${star.id * 0.04}s`,
              }}
            />
          ))}
        </div>
      ) : (
        <div className="animate-pop flex flex-col items-center gap-6 bg-card p-12 rounded-3xl shadow-card border-4 border-warning/30">
          <XCircle className="w-40 h-40 text-warning animate-wiggle" />
          <p className="text-5xl font-bold text-warning">{message.title} {message.emoji}</p>
          <p className="text-3xl text-muted-foreground font-semibold">{message.subtitle}</p>
        </div>
      )}
    </div>
  );
};
