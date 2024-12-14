import { Run } from "@/types/running";
import ProgressChart from "./ProgressChart";

interface ProgressSectionProps {
  title: string;
  runs: Run[];
}

const ProgressSection = ({ title, runs }: ProgressSectionProps) => {
  if (runs.length === 0) return null;

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-semibold mb-4">{title}</h2>
      <ProgressChart runs={runs} />
    </div>
  );
};

export default ProgressSection;