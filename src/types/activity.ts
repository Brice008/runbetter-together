export interface Activity {
  id: string;
  date: Date;
  type: 'cardio' | 'musculation' | 'autre';
  name: string;
  duration: number;
}