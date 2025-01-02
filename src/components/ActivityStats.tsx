import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { fr } from "date-fns/locale";

interface Activity {
  id: string;
  date: Date;
  type: string;
  duration: number;
}

const ActivityStats = () => {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const savedActivities = localStorage.getItem("sports-activities");
    if (savedActivities) {
      const parsedActivities = JSON.parse(savedActivities).map((activity: any) => ({
        ...activity,
        date: new Date(activity.date)
      }));
      setActivities(parsedActivities);
    }
  }, []);

  const now = new Date();
  const weekStart = startOfWeek(now, { locale: fr });
  const weekEnd = endOfWeek(now, { locale: fr });
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const countActivitiesByType = (start: Date, end: Date) => {
    const counts = {
      musculation: 0,
      abdos: 0,
      cardio: 0,
      autre: 0
    };

    activities.forEach(activity => {
      if (isWithinInterval(new Date(activity.date), { start, end })) {
        counts[activity.type as keyof typeof counts]++;
      }
    });

    return counts;
  };

  const weekCounts = countActivitiesByType(weekStart, weekEnd);
  const monthCounts = countActivitiesByType(monthStart, monthEnd);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Cette semaine</h2>
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Musculation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{weekCounts.musculation}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Abdominaux</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{weekCounts.abdos}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cardio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{weekCounts.cardio}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Autre</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{weekCounts.autre}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Ce mois</h2>
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Musculation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{monthCounts.musculation}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Abdominaux</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{monthCounts.abdos}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cardio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{monthCounts.cardio}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Autre</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{monthCounts.autre}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ActivityStats;