import { Run } from "@/types/running";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { formatPace, formatDuration } from "@/utils/calculations";

interface RunHistoryRowProps {
  run: Run;
  onEdit: (run: Run) => void;
  onDelete: (run: Run) => void;
}

const RunHistoryRow = ({ run, onEdit, onDelete }: RunHistoryRowProps) => {
  return (
    <TableRow>
      <TableCell>{new Date(run.date).toLocaleDateString()}</TableCell>
      <TableCell>{run.name || "-"}</TableCell>
      <TableCell>{run.distance.toFixed(2)} {run.unit}</TableCell>
      <TableCell>{formatDuration(run.duration)}</TableCell>
      <TableCell>{formatPace(run.pace, run.unit)}</TableCell>
      <TableCell>{run.speed.toFixed(1)} {run.unit}/h</TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(run)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(run)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default RunHistoryRow;