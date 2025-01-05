import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";
import AddGoalDialog from "@/components/AddGoalDialog";
import { Goal, GoalFolder } from "@/types/goals";
import FoldersList from "@/components/goals/FoldersList";
import AddFolderDialog from "@/components/goals/AddFolderDialog";
import GoalsHeader from "@/components/goals/GoalsHeader";
import GoalsAlertDialogs from "@/components/goals/GoalsAlertDialogs";
import GoalsSection from "@/components/goals/GoalsSection";

const GOALS_STORAGE_KEY = "running-tracker-goals";
const FOLDERS_STORAGE_KEY = "running-tracker-folders";

const Goals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [folders, setFolders] = useState<GoalFolder[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string>();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAddFolderDialogOpen, setIsAddFolderDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [editingFolder, setEditingFolder] = useState<GoalFolder | null>(null);
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null);
  const [folderToDelete, setFolderToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const savedGoals = localStorage.getItem(GOALS_STORAGE_KEY);
    const savedFolders = localStorage.getItem(FOLDERS_STORAGE_KEY);
    
    if (savedGoals) {
      const parsedGoals = JSON.parse(savedGoals).map((goal: Goal) => ({
        ...goal,
        deadline: goal.deadline ? new Date(goal.deadline) : undefined,
        completedAt: goal.completedAt ? new Date(goal.completedAt) : undefined,
      }));
      setGoals(parsedGoals);
    }
    
    if (savedFolders) {
      const parsedFolders = JSON.parse(savedFolders).map((folder: GoalFolder) => ({
        ...folder,
        createdAt: new Date(folder.createdAt),
      }));
      setFolders(parsedFolders);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(folders));
  }, [folders]);

  const handleAddGoal = (goalData: Omit<Goal, "id" | "completed">) => {
    const newGoal: Goal = {
      ...goalData,
      id: uuidv4(),
      completed: false,
      folderId: selectedFolderId,
    };
    setGoals((prev) => [...prev, newGoal]);
    setIsAddDialogOpen(false);
    toast({
      title: "Objectif ajouté",
      description: "L'objectif a été ajouté avec succès",
    });
  };

  const handleEditGoal = (goalData: Omit<Goal, "id" | "completed">) => {
    if (!editingGoal) return;
    
    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === editingGoal.id
          ? { ...goal, ...goalData }
          : goal
      )
    );
    setEditingGoal(null);
    setIsAddDialogOpen(false);
    toast({
      title: "Objectif modifié",
      description: "L'objectif a été modifié avec succès",
    });
  };

  const handleDeleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== id));
    setGoalToDelete(null);
    toast({
      title: "Objectif supprimé",
      description: "L'objectif a été supprimé avec succès",
    });
  };

  const handleMoveGoal = (goalId: string, folderId?: string) => {
    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === goalId
          ? { ...goal, folderId }
          : goal
      )
    );
    toast({
      title: "Objectif déplacé",
      description: "L'objectif a été déplacé avec succès",
    });
  };

  const handleAddFolder = (name: string) => {
    const newFolder: GoalFolder = {
      id: uuidv4(),
      name,
      createdAt: new Date(),
    };
    setFolders((prev) => [...prev, newFolder]);
    setIsAddFolderDialogOpen(false);
    toast({
      title: "Dossier ajouté",
      description: "Le dossier a été ajouté avec succès",
    });
  };

  const handleEditFolder = (name: string) => {
    if (!editingFolder) return;
    
    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === editingFolder.id
          ? { ...folder, name }
          : folder
      )
    );
    setEditingFolder(null);
    setIsAddFolderDialogOpen(false);
    toast({
      title: "Dossier modifié",
      description: "Le dossier a été modifié avec succès",
    });
  };

  const handleDeleteFolder = (id: string) => {
    setFolders((prev) => prev.filter((folder) => folder.id !== id));
    setGoals((prev) => prev.filter((goal) => goal.folderId !== id));
    if (selectedFolderId === id) {
      setSelectedFolderId(undefined);
    }
    setFolderToDelete(null);
    toast({
      title: "Dossier supprimé",
      description: "Le dossier et ses objectifs ont été supprimés avec succès",
    });
  };

  const handleToggleComplete = (id: string, completedAt?: Date) => {
    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === id
          ? {
              ...goal,
              completed: completedAt ? true : !goal.completed,
              completedAt: completedAt || (goal.completed ? undefined : new Date()),
            }
          : goal
      )
    );
    toast({
      title: "Statut mis à jour",
      description: "Le statut de l'objectif a été mis à jour",
    });
  };

  const filteredGoals = selectedFolderId
    ? goals.filter(goal => goal.folderId === selectedFolderId)
    : goals.filter(goal => !goal.folderId);

  const activeGoals = filteredGoals.filter(goal => !goal.completed);
  const completedGoals = filteredGoals.filter(goal => goal.completed);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <GoalsHeader
        onAddGoal={() => setIsAddDialogOpen(true)}
        onAddFolder={() => setIsAddFolderDialogOpen(true)}
      />

      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Dossiers</h2>
          <FoldersList
            folders={folders}
            onDelete={(id) => setFolderToDelete(id)}
            onEdit={setEditingFolder}
            selectedFolderId={selectedFolderId}
            onSelect={setSelectedFolderId}
          />
        </div>

        <GoalsSection
          activeGoals={activeGoals}
          completedGoals={completedGoals}
          onDelete={(id) => setGoalToDelete(id)}
          onEdit={(goal) => {
            setEditingGoal(goal);
            setIsAddDialogOpen(true);
          }}
          onToggleComplete={handleToggleComplete}
          onMove={handleMoveGoal}
          folders={folders}
        />
      </div>

      <AddGoalDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={editingGoal ? handleEditGoal : handleAddGoal}
        goal={editingGoal}
      />

      <AddFolderDialog
        open={isAddFolderDialogOpen}
        onOpenChange={setIsAddFolderDialogOpen}
        onSubmit={editingFolder ? handleEditFolder : handleAddFolder}
        folder={editingFolder}
      />

      <GoalsAlertDialogs
        goalToDelete={goalToDelete}
        folderToDelete={folderToDelete}
        onGoalDeleteConfirm={handleDeleteGoal}
        onFolderDeleteConfirm={handleDeleteFolder}
        onGoalDeleteCancel={() => setGoalToDelete(null)}
        onFolderDeleteCancel={() => setFolderToDelete(null)}
      />
    </div>
  );
};

export default Goals;