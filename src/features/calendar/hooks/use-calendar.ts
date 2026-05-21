import { useQuery } from '@tanstack/react-query'
import { getAllContentsForCalendar } from '../api/calendar-api'

export function useCalendarContents() {
  return useQuery({
    queryKey: ['calendar-contents'],
    queryFn: getAllContentsForCalendar,
  })
}
