import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Run } from "@/types/running";
import ChartControls from "./ChartControls";
import RunningChart from "./RunningChart";

interface ProgressChartProps {
  runs: Run[];
}

const ProgressChart = ({ runs }: ProgressChartProps) => {
  const [showSpeed, setShowSpeed] = useState(true);
  const [showDistance, setShowDistance] = useState(true);

  const data = runs
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((run) => ({
      date: new Date(run.date).toLocaleDateString(),
      speed: parseFloat(run.speed.toFixed(1)),
      distance: parseFloat(run.distance.toFixed(2)),
      pace: run.pace,
      duration: run.duration,
    }));

  return (
    <Card className="-mx-4 sm:mx-0">
      <CardHeader className="px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Progression</CardTitle>
          <ChartControls
            showSpeed={showSpeed}
            showDistance={showDistance}
            onToggleSpeed={() => setShowSpeed(!showSpeed)}
            onToggleDistance={() => setShowDistance(!showDistance)}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0 sm:p-6">
        <RunningChart 
          data={data}
          showSpeed={showSpeed}
          showDistance={showDistance}
        />
      </CardContent>
    </Card>
  );
};

export default ProgressChart;