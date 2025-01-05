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

interface GoalsAlertDialogsProps {
  goalToDelete: string | null;
  folderToDelete: string | null;
  onGoalDeleteConfirm: (id: string) => void;
  onFolderDeleteConfirm: (id: string) => void;
  onGoalDeleteCancel: () => void;
  onFolderDeleteCancel: () => void;
}

const GoalsAlertDialogs = ({
  goalToDelete,
  folderToDelete,
  onGoalDeleteConfirm,
  onFolderDeleteConfirm,
  onGoalDeleteCancel,
  onFolderDeleteCancel,
}: GoalsAlertDialogsProps) => {
  return (
    <>
      <AlertDialog open={!!goalToDelete} onOpenChange={() => onGoalDeleteCancel()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cet objectif sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={() => goalToDelete && onGoalDeleteConfirm(goalToDelete)}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!folderToDelete} onOpenChange={() => onFolderDeleteCancel()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Ce dossier et tous ses objectifs seront définitivement supprimés.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={() => folderToDelete && onFolderDeleteConfirm(folderToDelete)}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default GoalsAlertDialogs;