import { Input } from "@/components/ui/input";

interface BasicGoalInputsProps {
  name: string;
  targetDistance: string;
  deadline: string;
  onNameChange: (value: string) => void;
  onDistanceChange: (value: string) => void;
  onDeadlineChange: (value: string) => void;
}

const BasicGoalInputs = ({
  name,
  targetDistance,
  deadline,
  onNameChange,
  onDistanceChange,
  onDeadlineChange
}: BasicGoalInputsProps) => {
  return (
    <>
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Nom de l'objectif
        </label>
        <Input
          id="name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="targetDistance" className="block text-sm font-medium mb-1">
          Distance cible (km)
        </label>
        <Input
          id="targetDistance"
          type="number"
          step="0.01"
          value={targetDistance}
          onChange={(e) => onDistanceChange(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="deadline" className="block text-sm font-medium mb-1">
          Date limite
        </label>
        <Input
          id="deadline"
          type="date"
          value={deadline}
          onChange={(e) => onDeadlineChange(e.target.value)}
        />
      </div>
    </>
  );
};

export default BasicGoalInputs;