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
      <TableCell className="whitespace-nowrap">{new Date(run.date).toLocaleDateString()}</TableCell>
      <TableCell className="max-w-[120px] truncate">{run.name || "-"}</TableCell>
      <TableCell className="whitespace-nowrap">{run.distance.toFixed(2)} {run.unit}</TableCell>
      <TableCell className="whitespace-nowrap">{formatDuration(run.duration)}</TableCell>
      <TableCell className="hidden sm:table-cell whitespace-nowrap">{formatPace(run.pace, run.unit)}</TableCell>
      <TableCell className="hidden sm:table-cell whitespace-nowrap">{run.speed.toFixed(1)} {run.unit}/h</TableCell>
      <TableCell>
        <div className="flex gap-1 sm:gap-2 justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(run)}
            className="h-8 w-8"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(run)}
            className="h-8 w-8"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default RunHistoryRow;