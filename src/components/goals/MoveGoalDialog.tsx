import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GoalFolder } from "@/types/goals";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MoveGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folders: GoalFolder[];
  onMove: (folderId?: string) => void;
}

const MoveGoalDialog = ({ open, onOpenChange, folders, onMove }: MoveGoalDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Déplacer l'objectif</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                onMove(undefined);
                onOpenChange(false);
              }}
            >
              Page principale
            </Button>
            {folders.map((folder) => (
              <Button
                key={folder.id}
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  onMove(folder.id);
                  onOpenChange(false);
                }}
              >
                {folder.name}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default MoveGoalDialog;