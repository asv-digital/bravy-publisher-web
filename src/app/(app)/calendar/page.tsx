import { PageHeader } from '@/components/layout/page-header'
import { CalendarView } from '@/features/calendar/components/calendar-view'

export default function CalendarPage() {
  return (
    <div>
      <PageHeader
        title="Calendario"
        description="Visualize o cronograma de publicacoes"
      />
      <CalendarView />
    </div>
  )
}
