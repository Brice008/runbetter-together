export interface Run {
  id: string;
  date: Date;
  name?: string;
  distance: number;
  duration: number; // in seconds
  pace: number; // in minutes per kilometer/mile
  speed: number; // in kilometers/miles per hour
  unit: "km" | "mi";
}

export interface RunFormData {
  name: string;
  distance: number;
  hours: number;
  minutes: number;
  seconds: number;
  date: Date;
  unit: "km" | "mi";
}