import { useEffect, useState } from "react";
import catImage from "@/assets/cat.png";
import dogImage from "@/assets/dog.png";
import bunnyImage from "@/assets/bunny.png";
import elephantImage from "@/assets/elephant.png";

interface VisualRepresentationProps {
  number: number;
}

const animals = [
  { name: "pisici", image: catImage },
  { name: "câini", image: dogImage },
  { name: "iepurași", image: bunnyImage },
  { name: "elefanți", image: elephantImage },
];

export const VisualRepresentation = ({ number }: VisualRepresentationProps) => {
  const [selectedAnimal, setSelectedAnimal] = useState(animals[0]);

  useEffect(() => {
    // Selectăm aleator un animal pentru fiecare exercițiu
    const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
    setSelectedAnimal(randomAnimal);
  }, [number]);

  return (
    <div className="flex flex-col items-center gap-6 py-6">
      <p className="text-2xl font-bold text-foreground/80">
        Numără {selectedAnimal.name}le:
      </p>
      <div className="grid grid-cols-5 gap-4 max-w-2xl">
        {Array.from({ length: number }).map((_, index) => (
          <div
            key={index}
            className="animate-pop flex items-center justify-center"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <img
              src={selectedAnimal.image}
              alt={selectedAnimal.name}
              className="w-20 h-20 object-contain hover:scale-110 transition-transform"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
