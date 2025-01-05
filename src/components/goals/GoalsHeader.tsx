import { Button } from "@/components/ui/button";
import { Folder, Plus } from "lucide-react";
import BackButton from "@/components/BackButton";

interface GoalsHeaderProps {
  onAddGoal: () => void;
  onAddFolder: () => void;
}

const GoalsHeader = ({ onAddGoal, onAddFolder }: GoalsHeaderProps) => {
  return (
    <div className="space-y-4 md:space-y-0">
      <div className="flex items-center justify-between md:hidden">
        <BackButton />
        <h1 className="text-2xl font-bold">Objectifs</h1>
        <div className="w-10" /> {/* Spacer pour centrer le titre */}
      </div>
      
      <div className="hidden md:flex md:items-center md:justify-between">
        <BackButton />
        <h1 className="text-3xl font-bold">Objectifs</h1>
        <div className="flex gap-2">
          <Button onClick={onAddFolder}>
            <Folder className="h-4 w-4 mr-2" />
            Nouveau dossier
          </Button>
          <Button onClick={onAddGoal}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvel objectif
          </Button>
        </div>
      </div>

      <div className="flex gap-2 md:hidden">
        <Button className="flex-1" onClick={onAddFolder}>
          <Folder className="h-4 w-4 mr-2" />
          Nouveau dossier
        </Button>
        <Button className="flex-1" onClick={onAddGoal}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvel objectif
        </Button>
      </div>
    </div>
  );
};

export default GoalsHeader;