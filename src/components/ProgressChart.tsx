import { useState } from "react";
import { Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Run } from "@/types/running";
import ChartControls from "./ChartControls";
import CustomChartTooltip from "./CustomChartTooltip";

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
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={data}
              margin={{ 
                top: 5,
                right: 10,
                left: 0,
                bottom: 5 
              }}
            >
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                yAxisId="left"
                tick={{ fontSize: 12 }}
                domain={['auto', 'auto']}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 12 }}
                domain={['auto', 'auto']}
              />
              <Tooltip content={<CustomChartTooltip />} />
              {showSpeed && (
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="speed"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, fill: "#3B82F6" }}
                  name="Vitesse"
                  animationDuration={1000}
                  animationBegin={0}
                  isAnimationActive={true}
                />
              )}
              {showDistance && (
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="distance"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, fill: "#10B981" }}
                  name="Distance"
                  animationDuration={1000}
                  animationBegin={0}
                  isAnimationActive={true}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressChart;