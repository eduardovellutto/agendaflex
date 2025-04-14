export interface TimeRange {
  start: string
  end: string
}

export interface DayAvailability {
  enabled: boolean
  timeRanges: TimeRange[]
}

export interface Availability {
  professionalId: string
  monday: DayAvailability
  tuesday: DayAvailability
  wednesday: DayAvailability
  thursday: DayAvailability
  friday: DayAvailability
  saturday: DayAvailability
  sunday: DayAvailability
  appointmentDuration: number
  breakBetweenAppointments: number
}
