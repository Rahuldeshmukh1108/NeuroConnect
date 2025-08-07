"use client"

import type React from "react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarDays } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Re-using interfaces from jobs page for consistency
interface UserProfile {
  id: string
  name: string
  email: string
}

interface Job {
  id: string
  title: string
  company: string
}

interface InterviewSchedulerProps {
  isOpen: boolean
  onClose: () => void
  job: Job
  applicant: UserProfile
  onScheduleConfirm: (date: Date, time: string, link?: string) => void
}

const availableTimeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"]

const InterviewScheduler: React.FC<InterviewSchedulerProps> = ({
  isOpen,
  onClose,
  job,
  applicant,
  onScheduleConfirm,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined)
  const [interviewLink, setInterviewLink] = useState("")
  const { toast } = useToast()

  const handleSchedule = () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Missing Information",
        description: "Please select both a date and a time for the interview.",
        variant: "destructive",
      })
      return
    }

    onScheduleConfirm(selectedDate, selectedTime, interviewLink)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" /> Schedule Interview
          </DialogTitle>
          <DialogDescription>
            Scheduling interview for <span className="font-semibold">{applicant.name}</span> for the{" "}
            <span className="font-semibold">{job.title}</span> position at{" "}
            <span className="font-semibold">{job.company}</span>.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="interview-date" className="mb-2 block">
                Select Date
              </Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
                className="rounded-md border shadow"
              />
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="interview-time" className="mb-2 block">
                Select Time
              </Label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger id="interview-time" className="w-full">
                  <SelectValue placeholder="Choose time" />
                </SelectTrigger>
                <SelectContent>
                  {availableTimeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="space-y-2 pt-4">
                <Label htmlFor="interview-link" className="mb-2 block">
                  Interview Link (Optional)
                </Label>
                <Input
                  id="interview-link"
                  placeholder="e.g., Google Meet, Zoom link"
                  value={interviewLink}
                  onChange={(e) => setInterviewLink(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSchedule} disabled={!selectedDate || !selectedTime}>
            <CalendarDays className="mr-2 h-4 w-4" /> Confirm Schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default InterviewScheduler
