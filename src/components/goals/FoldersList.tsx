import { GoalFolder } from "@/types/goals";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Folder } from "lucide-react";
import { Card } from "@/components/ui/card";

interface FoldersListProps {
  folders: GoalFolder[];
  onDelete: (id: string) => void;
  onEdit: (folder: GoalFolder) => void;
  selectedFolderId?: string;
  onSelect: (id: string) => void;
}

const FoldersList = ({ folders, onDelete, onEdit, selectedFolderId, onSelect }: FoldersListProps) => {
  return (
    <div className="space-y-2">
      {folders.map((folder) => (
        <Card 
          key={folder.id}
          className={`p-2 cursor-pointer hover:bg-accent ${selectedFolderId === folder.id ? 'bg-accent' : ''}`}
          onClick={() => onSelect(folder.id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Folder className="h-4 w-4" />
              <span>{folder.name}</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(folder);
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(folder.id);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default FoldersList;