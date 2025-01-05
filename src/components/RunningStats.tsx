import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Run } from "@/types/running";
import { formatPace } from "@/utils/calculations";

interface RunningStatsProps {
  runs: Run[];
}

const RunningStats = ({ runs }: RunningStatsProps) => {
  const totalDistance = runs.reduce((acc, run) => acc + run.distance, 0);
  const averageSpeed = runs.reduce((acc, run) => acc + run.speed, 0) / runs.length;
  const averagePace = runs.reduce((acc, run) => acc + run.pace, 0) / runs.length;
  const totalRuns = runs.length;

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Nombre de courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalRuns}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Distance Totale</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalDistance.toFixed(1)} km</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Vitesse Moyenne</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageSpeed.toFixed(1)} km/h</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Allure Moyenne</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatPace(averagePace)}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RunningStats;