import { useState } from "react";
import { Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, ArrowUp } from "lucide-react";
import { Run } from "@/types/running";

interface ProgressChartProps {
  runs: Run[];
}

const ProgressChart = ({ runs }: ProgressChartProps) => {
  const [showSpeed, setShowSpeed] = useState(true);
  const [showDistance, setShowDistance] = useState(true);

  const data = runs
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((run) => ({
      date: new Date(run.date).toLocaleDateString(),
      speed: parseFloat(run.speed.toFixed(1)),
      distance: parseFloat(run.distance.toFixed(2)),
      pace: run.pace,
      duration: run.duration,
    }));

  const formatDuration = (duration: number) => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    }
    return `${minutes}m ${seconds}s`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold mb-1">{label}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Distance: {data.distance} km
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Durée: {formatDuration(data.duration)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Vitesse: {data.speed} km/h
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="-mx-4 sm:mx-0">
      <CardHeader className="px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Progression</CardTitle>
          <div className="flex gap-2">
            <Button
              variant={showSpeed ? "default" : "outline"}
              size="sm"
              onClick={() => setShowSpeed(!showSpeed)}
              className="gap-2"
            >
              <ArrowUp className="h-4 w-4" />
              Vitesse
            </Button>
            <Button
              variant={showDistance ? "default" : "outline"}
              size="sm"
              onClick={() => setShowDistance(!showDistance)}
              className="gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Distance
            </Button>
          </div>
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
              <Tooltip content={<CustomTooltip />} />
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