import { Input } from "@/components/ui/input";

interface TimeInputsProps {
  hours: string;
  minutes: string;
  seconds: string;
  onChange: (field: 'hours' | 'minutes' | 'seconds', value: string) => void;
}

const TimeInputs = ({ hours, minutes, seconds, onChange }: TimeInputsProps) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      <div>
        <label htmlFor="hours" className="block text-sm font-medium mb-1">
          Heures
        </label>
        <Input
          id="hours"
          type="number"
          min="0"
          value={hours}
          onChange={(e) => onChange('hours', e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="minutes" className="block text-sm font-medium mb-1">
          Minutes
        </label>
        <Input
          id="minutes"
          type="number"
          min="0"
          max="59"
          value={minutes}
          onChange={(e) => onChange('minutes', e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="seconds" className="block text-sm font-medium mb-1">
          Secondes
        </label>
        <Input
          id="seconds"
          type="number"
          min="0"
          max="59"
          value={seconds}
          onChange={(e) => onChange('seconds', e.target.value)}
        />
      </div>
    </div>
  );
};

export default TimeInputs;