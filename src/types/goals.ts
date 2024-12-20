export interface Goal {
  id: string;
  name: string;
  targetDistance: number;
  targetTime?: number;
  targetSpeed?: number;
  completed: boolean;
  deadline?: Date;
  completedAt?: Date;
}