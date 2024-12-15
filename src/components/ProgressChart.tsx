import { Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Run } from "@/types/running";

interface ProgressChartProps {
  runs: Run[];
}

const ProgressChart = ({ runs }: ProgressChartProps) => {
  const data = runs
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((run) => ({
      date: new Date(run.date).toLocaleDateString(),
      speed: parseFloat(run.speed.toFixed(1)),
      pace: run.pace,
      distance: run.distance,
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
            Distance: {data.distance.toFixed(2)} km
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
        <CardTitle>Progression de la vitesse</CardTitle>
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
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="speed"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: "#3B82F6" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressChart;