import { formatDuration } from "@/utils/formatters";

interface CustomChartTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomChartTooltip = ({ active, payload, label }: CustomChartTooltipProps) => {
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

export default CustomChartTooltip;