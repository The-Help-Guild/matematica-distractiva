import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VisualRepresentation } from "./VisualRepresentation";
import { FeedbackAnimation } from "./FeedbackAnimation";
import starImage from "@/assets/star.png";

interface ExerciseProps {
  operationType: "subtraction" | "multiplication";
}

interface ExerciseData {
  num1: number;
  num2: number;
  answer: number;
  operation: string;
}

const encouragements = [
  "Gândește-te bine! 🤔",
  "Poți să numeri pe degete! ✋",
  "Ia-o ușor, nu te grăbi! 🐌",
  "Folosește imaginile ca ajutor! 🎨",
  "Ești pe drumul cel bun! 🌟",
];

export const Exercise = ({ operationType }: ExerciseProps) => {
  const [exercise, setExercise] = useState<ExerciseData | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [currentEncouragement, setCurrentEncouragement] = useState("");

  const generateExercise = () => {
    if (operationType === "subtraction") {
      const num1 = Math.floor(Math.random() * 10) + 1;
      const num2 = Math.floor(Math.random() * num1) + 1;
      setExercise({
        num1,
        num2,
        answer: num1 - num2,
        operation: "-",
      });
    } else {
      const num1 = Math.floor(Math.random() * 10) + 1;
      const num2 = Math.floor(Math.random() * 10) + 1;
      setExercise({
        num1,
        num2,
        answer: num1 * num2,
        operation: "×",
      });
    }
    setUserAnswer("");
    setCurrentEncouragement(
      encouragements[Math.floor(Math.random() * encouragements.length)]
    );
  };

  useEffect(() => {
    generateExercise();
  }, [operationType]);

  const handleSubmit = () => {
    if (!exercise || userAnswer === "") return;

    const correct = parseInt(userAnswer) === exercise.answer;
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    setShowFeedback(false);
    generateExercise();
  };

  if (!exercise) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative">
      {/* Score Display */}
      <div className="absolute top-8 right-8 flex items-center gap-3 bg-card p-4 rounded-2xl shadow-card">
        <img src={starImage} alt="star" className="w-10 h-10 animate-bounce-slow" />
        <span className="text-3xl font-bold text-sunny">{score}</span>
      </div>

      <div className="max-w-4xl w-full space-y-8">
        {/* Exercise Display */}
        <div className="bg-card p-12 rounded-3xl shadow-card space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-5xl font-bold text-foreground">
              {exercise.num1} {exercise.operation} {exercise.num2} = ?
            </h2>
            <p className="text-2xl text-muted-foreground italic">{currentEncouragement}</p>
          </div>

          {/* Visual Representation */}
          {operationType === "subtraction" && (
            <div className="space-y-6">
              <VisualRepresentation number={exercise.num1} />
              <p className="text-center text-2xl font-bold text-playful">
                Dacă scot {exercise.num2}, câte rămân?
              </p>
            </div>
          )}

          {operationType === "multiplication" && (
            <div className="space-y-6">
              <div className="text-center text-2xl font-bold text-secondary mb-4">
                {exercise.num1} grupuri de câte {exercise.num2}:
              </div>
              {Array.from({ length: exercise.num1 }).map((_, groupIndex) => (
                <div key={groupIndex} className="mb-6">
                  <p className="text-xl font-bold text-accent mb-2">
                    Grupul {groupIndex + 1}:
                  </p>
                  <VisualRepresentation number={exercise.num2} />
                </div>
              ))}
              <p className="text-center text-2xl font-bold text-playful">
                În total, câte sunt?
              </p>
            </div>
          )}

          {/* Answer Input */}
          <div className="flex flex-col items-center gap-6">
            <Input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Scrie răspunsul aici..."
              className="text-4xl text-center h-20 max-w-xs border-4 border-primary/30 focus:border-primary rounded-2xl font-bold"
            />
            <Button
              onClick={handleSubmit}
              size="lg"
              variant="success"
              disabled={userAnswer === ""}
            >
              Verifică Răspunsul ✓
            </Button>
          </div>
        </div>
      </div>

      {/* Feedback Animation */}
      {showFeedback && (
        <FeedbackAnimation isCorrect={isCorrect} onComplete={handleNext} />
      )}
    </div>
  );
};
