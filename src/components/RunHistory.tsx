import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Run } from "@/types/running";
import { useState } from "react";
import EditRunDialog from "./EditRunDialog";
import RunHistoryRow from "./RunHistoryRow";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface RunHistoryProps {
  runs: Run[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, updatedRun: Partial<Run>) => void;
}

const RunHistory = ({ runs, onDelete, onUpdate }: RunHistoryProps) => {
  const [editingRun, setEditingRun] = useState<Run | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [runToDelete, setRunToDelete] = useState<Run | null>(null);

  const handleEdit = (run: Run) => {
    setEditingRun(run);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (run: Run) => {
    setRunToDelete(run);
  };

  const confirmDelete = () => {
    if (runToDelete) {
      onDelete(runToDelete.id);
      setRunToDelete(null);
    }
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
            <RunHistoryRow
              key={run.id}
              run={run}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </TableBody>
      </Table>

      <EditRunDialog
        run={editingRun}
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onUpdate={onUpdate}
      />

      <AlertDialog open={runToDelete !== null} onOpenChange={(open) => !open && setRunToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cette course sera définitivement supprimée de votre historique.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RunHistory;