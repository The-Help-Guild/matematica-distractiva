import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Exercise } from "@/components/Exercise";
import { ArrowLeft } from "lucide-react";

const ExercisePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const operationType = location.state?.operationType as "subtraction" | "addition";
  const userName = localStorage.getItem("userName") || "";

  if (!operationType || !userName) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute top-8 left-8 z-10">
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          size="lg"
        >
          <ArrowLeft className="mr-2" />
          Înapoi Acasă
        </Button>
      </div>
      <Exercise operationType={operationType} userName={userName} />
    </div>
  );
};

export default ExercisePage;
