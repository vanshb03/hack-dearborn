"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DatePickerDemo({ 
  date, 
  onSelect 
}: { 
  date?: Date, 
  onSelect?: (date: Date | undefined) => void 
}) {
  const [internalDate, setInternalDate] = React.useState<Date>()
  
  const selectedDate = date ?? internalDate
  const handleSelect = onSelect ?? setInternalDate

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal bg-input",
            !selectedDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            console.log('Calendar clicked, selected:', date)
            handleSelect(date)
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}