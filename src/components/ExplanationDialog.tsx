import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import catImage from "@/assets/cat.png";
import dogImage from "@/assets/dog.png";

interface ExplanationDialogProps {
  open: boolean;
  onClose: () => void;
  exercise: {
    num1: number;
    num2: number;
    operation: string;
    answer: number;
  };
  userAnswer: number;
  operationType: "subtraction" | "addition";
}

const animals = [
  { name: "pisici", image: catImage },
  { name: "câini", image: dogImage },
];

export const ExplanationDialog = ({ 
  open, 
  onClose, 
  exercise, 
  userAnswer,
  operationType 
}: ExplanationDialogProps) => {
  const animal = animals[Math.floor(Math.random() * animals.length)];

  const getExplanation = () => {
    if (operationType === "subtraction") {
      return (
        <div className="space-y-4 sm:space-y-6">
          <p className="text-xl sm:text-2xl font-bold text-center text-secondary">
            Hai să explicăm împreună! 📚
          </p>
          
          <div className="bg-accent/20 p-4 sm:p-6 rounded-xl sm:rounded-2xl space-y-3 sm:space-y-4">
            <p className="text-lg sm:text-xl">
              Aveai <span className="font-bold text-primary">{exercise.num1}</span> {animal.name}:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {Array.from({ length: exercise.num1 }).map((_, i) => (
                <img 
                  key={i} 
                  src={animal.image} 
                  alt={animal.name}
                  className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                />
              ))}
            </div>
            
            <p className="text-lg sm:text-xl mt-3 sm:mt-4">
              Dacă scot <span className="font-bold text-playful">{exercise.num2}</span> {animal.name}...
            </p>
            <div className="flex flex-wrap gap-2 justify-center opacity-50">
              {Array.from({ length: exercise.num2 }).map((_, i) => (
                <img 
                  key={i} 
                  src={animal.image} 
                  alt={animal.name}
                  className="w-12 h-12 sm:w-16 sm:h-16 object-contain grayscale"
                />
              ))}
            </div>
            
            <p className="text-lg sm:text-xl mt-3 sm:mt-4">
              ...rămân <span className="font-bold text-success">{exercise.answer}</span> {animal.name}!
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {Array.from({ length: exercise.answer }).map((_, i) => (
                <img 
                  key={i} 
                  src={animal.image} 
                  alt={animal.name}
                  className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                />
              ))}
            </div>
          </div>

          <div className="bg-warning/20 p-4 sm:p-6 rounded-xl sm:rounded-2xl">
            <p className="text-lg sm:text-xl text-center">
              Tu ai răspuns: <span className="font-bold text-destructive">{userAnswer}</span>
            </p>
            <p className="text-lg sm:text-xl text-center mt-2">
              Răspunsul corect este: <span className="font-bold text-success">{exercise.answer}</span>
            </p>
          </div>

          <p className="text-xl sm:text-2xl text-center text-muted-foreground font-semibold">
            Încearcă din nou și vei reuși! 💪✨
          </p>
        </div>
      );
    } else {
      return (
        <div className="space-y-4 sm:space-y-6">
          <p className="text-xl sm:text-2xl font-bold text-center text-secondary">
            Hai să vedem împreună cum se face! 📚
          </p>
          
          <div className="bg-accent/20 p-4 sm:p-6 rounded-xl sm:rounded-2xl space-y-3 sm:space-y-4">
            <p className="text-lg sm:text-xl">
              Primul grup are <span className="font-bold text-primary">{exercise.num1}</span> {animal.name}:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {Array.from({ length: exercise.num1 }).map((_, i) => (
                <img 
                  key={i} 
                  src={animal.image} 
                  alt={animal.name}
                  className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                />
              ))}
            </div>
            
            <p className="text-lg sm:text-xl mt-3 sm:mt-4">
              Al doilea grup are <span className="font-bold text-playful">{exercise.num2}</span> {animal.name}:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {Array.from({ length: exercise.num2 }).map((_, i) => (
                <img 
                  key={i} 
                  src={animal.image} 
                  alt={animal.name}
                  className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                />
              ))}
            </div>
            
            <p className="text-lg sm:text-xl mt-3 sm:mt-4">
              Dacă le pun împreună, în total sunt <span className="font-bold text-success">{exercise.answer}</span> {animal.name}!
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {Array.from({ length: exercise.answer }).map((_, i) => (
                <img 
                  key={i} 
                  src={animal.image} 
                  alt={animal.name}
                  className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                />
              ))}
            </div>
          </div>

          <div className="bg-warning/20 p-4 sm:p-6 rounded-xl sm:rounded-2xl">
            <p className="text-lg sm:text-xl text-center">
              Tu ai răspuns: <span className="font-bold text-destructive">{userAnswer}</span>
            </p>
            <p className="text-lg sm:text-xl text-center mt-2">
              Răspunsul corect este: <span className="font-bold text-success">{exercise.answer}</span>
            </p>
          </div>

          <p className="text-xl sm:text-2xl text-center text-muted-foreground font-semibold">
            Acum înțelegi? Hai să mai încerci! 🌟💪
          </p>
        </div>
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl sm:text-3xl md:text-4xl font-bold text-center gradient-playful bg-clip-text text-transparent">
            Să învățăm împreună! 🎓
          </DialogTitle>
          <DialogDescription className="text-base sm:text-lg text-center">
            Nu-i nimic! Toată lumea greșește când învață. Important este să înțelegem! 💡
          </DialogDescription>
        </DialogHeader>
        {getExplanation()}
        <Button
          onClick={onClose}
          size="lg"
          variant="success"
          className="w-full text-lg sm:text-xl"
        >
          Am înțeles! Vreau să mai încerc! 🚀
        </Button>
      </DialogContent>
    </Dialog>
  );
};
