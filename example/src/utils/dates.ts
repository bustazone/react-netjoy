import moment from 'moment'

export function serializeDate(date: Date): string {
  return date.toISOString()
}

export function deserializeDate(dateStr: string): Date {
  return new Date(dateStr)
}

export function formatDateToSendToService(date?: Date | string): string | null {
  return date ? `${moment(date).format('YYYY-MM-DDTHH:mm:00.000')}Z` : null
}

export function getHoursFromEndToInitialStringDates(endDate?: string | Date, initialDate?: string | Date): number | undefined {
  if (!initialDate || !endDate) return undefined
  const end = moment(endDate)
  const init = moment(initialDate)
  return end.diff(init, 'hours', true)
}
