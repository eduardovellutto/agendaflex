"use client"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface TimeRange {
  start: string
  end: string
}

interface TimeRangePickerProps {
  value: TimeRange[]
  onChange: (value: TimeRange[]) => void
}

export function TimeRangePicker({ value, onChange }: TimeRangePickerProps) {
  const addTimeRange = () => {
    onChange([...value, { start: "09:00", end: "17:00" }])
  }

  const removeTimeRange = (index: number) => {
    const newTimeRanges = [...value]
    newTimeRanges.splice(index, 1)
    onChange(newTimeRanges)
  }

  const updateTimeRange = (index: number, field: keyof TimeRange, newValue: string) => {
    const newTimeRanges = [...value]
    newTimeRanges[index] = {
      ...newTimeRanges[index],
      [field]: newValue,
    }
    onChange(newTimeRanges)
  }

  return (
    <div className="space-y-3">
      {value.map((timeRange, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className="grid flex-1 grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">De</span>
              <Input
                type="time"
                value={timeRange.start}
                onChange={(e) => updateTimeRange(index, "start", e.target.value)}
                className="h-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">até</span>
              <Input
                type="time"
                value={timeRange.end}
                onChange={(e) => updateTimeRange(index, "end", e.target.value)}
                className="h-9"
              />
            </div>
          </div>
          {value.length > 1 && (
            <Button type="button" variant="ghost" size="icon" onClick={() => removeTimeRange(index)}>
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Remover horário</span>
            </Button>
          )}
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" className="mt-2" onClick={addTimeRange}>
        <Plus className="mr-2 h-4 w-4" />
        Adicionar horário
      </Button>
    </div>
  )
}
