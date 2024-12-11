export interface Run {
  id: string;
  date: Date;
  name?: string;
  distance: number; // in kilometers
  duration: number; // in seconds
  pace: number; // in minutes per kilometer
  speed: number; // in kilometers per hour
}

export interface RunFormData {
  name: string;
  distance: number;
  hours: number;
  minutes: number;
  seconds: number;
}