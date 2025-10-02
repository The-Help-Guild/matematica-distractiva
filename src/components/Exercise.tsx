import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VisualRepresentation } from "./VisualRepresentation";
import { FeedbackAnimation } from "./FeedbackAnimation";
import { ExplanationDialog } from "./ExplanationDialog";
import { supabase } from "@/integrations/supabase/client";
import starImage from "@/assets/star.png";

interface ExerciseProps {
  operationType: "subtraction" | "addition";
  userName: string;
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

export const Exercise = ({ operationType, userName }: ExerciseProps) => {
  const [exercise, setExercise] = useState<ExerciseData | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [currentEncouragement, setCurrentEncouragement] = useState("");
  const [showExplanation, setShowExplanation] = useState(false);
  const [lastExercise, setLastExercise] = useState<ExerciseData | null>(null);
  const [lastUserAnswer, setLastUserAnswer] = useState(0);

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
      // Addition
      const num1 = Math.floor(Math.random() * 10) + 1;
      const num2 = Math.floor(Math.random() * (10 - num1)) + 1;
      setExercise({
        num1,
        num2,
        answer: num1 + num2,
        operation: "+",
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

  const handleSubmit = async () => {
    if (!exercise || userAnswer === "") return;

    const correct = parseInt(userAnswer) === exercise.answer;
    setIsCorrect(correct);
    setShowFeedback(true);
    setLastExercise(exercise);
    setLastUserAnswer(parseInt(userAnswer));

    // Salvăm în istoric
    await supabase.from('exercise_history').insert({
      user_name: userName,
      operation_type: operationType,
      num1: exercise.num1,
      num2: exercise.num2,
      user_answer: parseInt(userAnswer),
      correct_answer: exercise.answer,
      is_correct: correct,
    });

    if (correct) {
      const newScore = score + 1;
      setScore(newScore);
      
      // Actualizăm sau inserăm scorul zilnic
      const today = new Date().toISOString().split('T')[0];
      
      const { data: existingScore } = await supabase
        .from('daily_scores')
        .select('id, score')
        .eq('user_name', userName)
        .eq('date', today)
        .maybeSingle();

      if (existingScore) {
        await supabase
          .from('daily_scores')
          .update({ score: newScore })
          .eq('id', existingScore.id);
      } else {
        await supabase
          .from('daily_scores')
          .insert({
            user_name: userName,
            score: newScore,
            date: today,
          });
      }
    }
  };

  const handleNext = () => {
    setShowFeedback(false);
    
    // Dacă răspunsul a fost greșit, arătăm explicația
    if (!isCorrect && lastExercise) {
      setShowExplanation(true);
    } else {
      generateExercise();
    }
  };

  const handleExplanationClose = () => {
    setShowExplanation(false);
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

          {operationType === "addition" && (
            <div className="space-y-6">
              <div className="text-center text-2xl font-bold text-secondary mb-4">
                Primul grup are {exercise.num1}:
              </div>
              <VisualRepresentation number={exercise.num1} />
              <div className="text-center text-2xl font-bold text-secondary mt-6 mb-4">
                Al doilea grup are {exercise.num2}:
              </div>
              <VisualRepresentation number={exercise.num2} />
              <p className="text-center text-2xl font-bold text-playful">
                Dacă le pun împreună, câte sunt în total?
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

      {/* Explanation Dialog */}
      {showExplanation && lastExercise && (
        <ExplanationDialog
          open={showExplanation}
          onClose={handleExplanationClose}
          exercise={lastExercise}
          userAnswer={lastUserAnswer}
          operationType={operationType}
        />
      )}
    </div>
  );
};
