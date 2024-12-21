import { Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import CustomChartTooltip from "./CustomChartTooltip";

interface RunningChartProps {
  data: {
    date: string;
    speed: number;
    distance: number;
    pace: number;
    duration: number;
  }[];
  showSpeed: boolean;
  showDistance: boolean;
}

const RunningChart = ({ data, showSpeed, showDistance }: RunningChartProps) => {
  return (
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
  );
};

export default RunningChart;