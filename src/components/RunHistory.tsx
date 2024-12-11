import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Run } from "@/types/running";
import { formatPace, formatDuration } from "@/utils/calculations";

interface RunHistoryProps {
  runs: Run[];
}

const RunHistory = ({ runs }: RunHistoryProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Distance</TableHead>
            <TableHead>Durée</TableHead>
            <TableHead>Allure</TableHead>
            <TableHead>Vitesse</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {runs.map((run) => (
            <TableRow key={run.id}>
              <TableCell>{new Date(run.date).toLocaleDateString()}</TableCell>
              <TableCell>{run.name || "-"}</TableCell>
              <TableCell>{run.distance.toFixed(2)} {run.unit}</TableCell>
              <TableCell>{formatDuration(run.duration)}</TableCell>
              <TableCell>{formatPace(run.pace, run.unit)}</TableCell>
              <TableCell>{run.speed.toFixed(1)} {run.unit}/h</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RunHistory;