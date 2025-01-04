import { useState, useEffect } from "react";
import RunningStats from "@/components/RunningStats";
import { Run } from "@/types/running";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths, isWithinInterval } from 'date-fns';
import { fr } from 'date-fns/locale';

const STORAGE_KEY = "running-tracker-runs";

const Stats = () => {
  const [runs, setRuns] = useState<Run[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);

  useEffect(() => {
    const savedRuns = localStorage.getItem(STORAGE_KEY);
    if (savedRuns) {
      const parsedRuns = JSON.parse(savedRuns).map((run: Run) => ({
        ...run,
        date: new Date(run.date)
      }));
      setRuns(parsedRuns);

      const last12Months = eachMonthOfInterval({
        start: subMonths(new Date(), 11),
        end: new Date()
      });

      const monthlyStats = last12Months.map(month => {
        const monthInterval = {
          start: startOfMonth(month),
          end: endOfMonth(month)
        };

        const runsInMonth = parsedRuns.filter(run => 
          isWithinInterval(new Date(run.date), monthInterval)
        );

        return {
          month: format(month, 'MMM yyyy', { locale: fr }),
          count: runsInMonth.length
        };
      });

      setMonthlyData(monthlyStats);
    }
  }, []);

  return (
    <div className="container mx-auto p-4 sm:py-8 space-y-6 sm:space-y-8">
      <div className="flex items-center gap-4">
        <Link to="/">
          <Button variant="outline" size="icon" className="shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl sm:text-4xl font-bold">Statistiques</h1>
      </div>
      
      {runs.length > 0 ? (
        <>
          <RunningStats runs={runs} />
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Nombre de courses par mois</h2>
            <div className="h-[300px] w-full -ml-8 -mr-8">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={monthlyData}
                  margin={{ 
                    top: 20,
                    right: 0,
                    left: -15,
                    bottom: 5 
                  }}
                >
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    allowDecimals={false}
                  />
                  <Tooltip />
                  <Bar 
                    dataKey="count" 
                    fill="#3B82F6" 
                    name="Nombre de courses"
                    radius={[4, 4, 0, 0]}
                  >
                    <LabelList 
                      dataKey="count"
                      position="top"
                      fill="#6B7280"
                      fontSize={12}
                      formatter={(value: number) => value > 0 ? value : ''}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </>
      ) : (
        <p className="text-center text-gray-500 py-8">
          Aucune course enregistrée pour le moment
        </p>
      )}
    </div>
  );
};

export default Stats;