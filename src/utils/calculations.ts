export const calculatePace = (distance: number, duration: number, unit: "km" | "mi" = "km"): number => {
  return duration / 60 / distance; // minutes per kilometer/mile
};

export const calculateSpeed = (distance: number, duration: number, unit: "km" | "mi" = "km"): number => {
  return (distance / duration) * 3600; // km/h or mi/h
};

export const formatPace = (pace: number, unit: "km" | "mi" = "km"): string => {
  const minutes = Math.floor(pace);
  const seconds = Math.round((pace - minutes) * 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}/${unit}`;
};

export const formatDuration = (duration: number): string => {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = duration % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  }
  return `${minutes}m ${seconds}s`;
};