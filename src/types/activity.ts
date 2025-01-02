export type ActivityType = 'running' | 'musculation' | 'abdo';

export interface Activity {
  id: string;
  type: ActivityType;
  date: Date;
  duration: number; // en minutes
  name?: string;
}