export interface Goal {
  id: string;
  name: string;
  targetDistance: number;
  targetTime?: number;
  targetSpeed?: number;
  completed: boolean;
  deadline?: Date;
  completedAt?: Date;
  folderId?: string;
}

export interface GoalFolder {
  id: string;
  name: string;
  createdAt: Date;
}