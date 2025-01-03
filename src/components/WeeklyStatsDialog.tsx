import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Run } from "@/types/running"
import { format, startOfWeek, endOfWeek, eachWeekOfInterval, isWithinInterval } from 'date-fns'
import { fr } from 'date-fns/locale'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface WeeklyStatsDialogProps {
  isOpen: boolean
  onClose: () => void
  runs: Run[]
  month: Date | null
}

const WeeklyStatsDialog = ({ isOpen, onClose, runs, month }: WeeklyStatsDialogProps) => {
  if (!month || !runs.length) return null

  const weeksInMonth = eachWeekOfInterval({
    start: startOfWeek(month),
    end: endOfWeek(month)
  })

  const weeklyData = weeksInMonth.map(weekStart => {
    const weekInterval = {
      start: startOfWeek(weekStart),
      end: endOfWeek(weekStart)
    }

    const runsInWeek = runs.filter(run => 
      isWithinInterval(new Date(run.date), weekInterval)
    )

    return {
      week: format(weekStart, "'Semaine du' dd MMM", { locale: fr }),
      count: runsInWeek.length
    }
  })

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            Courses du mois de {format(month, 'MMMM yyyy', { locale: fr })}
          </DialogTitle>
        </DialogHeader>
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="week" 
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
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default WeeklyStatsDialog