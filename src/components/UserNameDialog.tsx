import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface UserNameDialogProps {
  open: boolean;
  onSubmit: (name: string) => void;
}

export const UserNameDialog = ({ open, onSubmit }: UserNameDialogProps) => {
  const [name, setName] = useState("");

  useEffect(() => {
    // Verificăm dacă avem deja un nume salvat
    const savedName = localStorage.getItem("userName");
    if (savedName) {
      onSubmit(savedName);
    }
  }, []);

  const handleSubmit = () => {
    if (name.trim()) {
      localStorage.setItem("userName", name.trim());
      onSubmit(name.trim());
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center gradient-hero bg-clip-text text-transparent flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8 text-primary" />
            Bine ai venit!
            <Sparkles className="w-8 h-8 text-secondary" />
          </DialogTitle>
          <DialogDescription className="text-lg text-center">
            Cum te cheamă? Introdu numele tău pentru a salva progresul și a apărea în top!
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-6 py-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Numele tău..."
            className="text-2xl text-center h-16 border-4 border-primary/30 focus:border-primary rounded-2xl"
            autoFocus
          />
          <Button
            onClick={handleSubmit}
            size="lg"
            variant="success"
            disabled={!name.trim()}
            className="text-xl"
          >
            Începe Aventura! 🚀
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
