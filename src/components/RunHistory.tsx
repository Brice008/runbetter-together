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
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RunHistoryProps {
  runs: Run[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, updatedRun: Partial<Run>) => void;
}

const RunHistory = ({ runs, onDelete, onUpdate }: RunHistoryProps) => {
  const [editingRun, setEditingRun] = useState<Run | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingRun) return;

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const distance = parseFloat(formData.get("distance") as string);
    const hours = parseInt(formData.get("hours") as string);
    const minutes = parseInt(formData.get("minutes") as string);
    const seconds = parseInt(formData.get("seconds") as string);
    const unit = formData.get("unit") as "km" | "mi";
    const date = new Date(formData.get("date") as string);

    const duration = hours * 3600 + minutes * 60 + seconds;

    onUpdate(editingRun.id, {
      name,
      distance,
      duration,
      unit,
      date,
    });

    setIsDialogOpen(false);
  };

  const openEditDialog = (run: Run) => {
    setEditingRun(run);
    setIsDialogOpen(true);
  };

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
            <TableHead>Actions</TableHead>
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
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(run)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(run.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la course</DialogTitle>
          </DialogHeader>
          {editingRun && (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  defaultValue={new Date(editingRun.date).toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nom (optionnel)</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingRun.name}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="distance">Distance</Label>
                  <Input
                    id="distance"
                    name="distance"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={editingRun.distance}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unité</Label>
                  <Select name="unit" defaultValue={editingRun.unit}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="km">Kilomètres</SelectItem>
                      <SelectItem value="mi">Miles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hours">Heures</Label>
                  <Input
                    id="hours"
                    name="hours"
                    type="number"
                    min="0"
                    defaultValue={Math.floor(editingRun.duration / 3600)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minutes">Minutes</Label>
                  <Input
                    id="minutes"
                    name="minutes"
                    type="number"
                    min="0"
                    max="59"
                    defaultValue={Math.floor((editingRun.duration % 3600) / 60)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seconds">Secondes</Label>
                  <Input
                    id="seconds"
                    name="seconds"
                    type="number"
                    min="0"
                    max="59"
                    defaultValue={editingRun.duration % 60}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">
                  Enregistrer
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RunHistory;