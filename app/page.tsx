'use client';

import { useState, useEffect } from "react"
import { format, startOfWeek, addDays, isSameDay } from "date-fns"
import { Calendar, ChevronLeft, ChevronRight, Plus, User, LogOut, Settings, UserCircle } from "lucide-react"
import { useAuth } from "./hooks/useAuth"
import { useRouter } from 'next/navigation'
import { supabase } from "@/app/utils/createSupaBaseClient"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { DatePickerDemo } from "@/components/ui/calendar-test"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export default function Home() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<any[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState<string>("")
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  // Initialize with empty events
  useEffect(() => {
    if (user) {
      setEvents([])
    }
  }, [user])

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>

  if (!user) return null // This will redirect in useEffect

  const startDate = startOfWeek(currentDate)
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i))

  const addEvent = (newEvent: any) => {
    setEvents([...events, { ...newEvent, id: `event-${events.length + 1}` }])
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-card p-6 shadow-md">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user?.user_metadata?.avatar_url} alt="Avatar" />
              <AvatarFallback className="bg-secondary text-secondary-foreground">
                {user?.user_metadata?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-foreground truncate">
                {user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}
              </h2>
              <p className="text-sm text-muted-foreground truncate">{user?.email || 'No email'}</p>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <UserCircle className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <nav className="space-y-2">
          <Button variant="ghost" className="w-full justify-start text-foreground hover:bg-secondary hover:text-secondary-foreground">
            <Calendar className="mr-2 h-4 w-4" /> Calendar
          </Button>
          <Button variant="ghost" className="w-full justify-start text-foreground hover:bg-secondary hover:text-secondary-foreground" asChild>
            <a href="/tasks">
              <Settings className="mr-2 h-4 w-4" /> Tasks
            </a>
          </Button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto bg-background">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-foreground">Your Calendar</h1>
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setCurrentDate(addDays(currentDate, -7))}
              className="text-foreground border-border hover:bg-secondary"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-medium text-foreground">
              {format(startDate, "MMMM d, yyyy")} - {format(addDays(startDate, 6), "MMMM d, yyyy")}
            </span>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setCurrentDate(addDays(currentDate, 7))}
              className="text-foreground border-border hover:bg-secondary"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" /> Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card">
              <DialogHeader>
                <DialogTitle className="text-foreground">Add New Event</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.target as HTMLFormElement)
                  
                  let eventDate = selectedDate || new Date()
                  if (selectedTime) {
                    const [hours, minutes] = selectedTime.split(':').map(Number)
                    eventDate = new Date(eventDate)
                    eventDate.setHours(hours, minutes, 0, 0)
                  }
                  
                  const newEvent = {
                    title: formData.get("title"),
                    date: eventDate,
                    color: formData.get("color"),
                  }
                  addEvent(newEvent)
                  setSelectedDate(undefined)
                  setSelectedTime("")
                  e.currentTarget.reset()
                }}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="title" className="text-foreground">Event Title</Label>
                  <Input id="title" name="title" required className="bg-input text-foreground" />
                </div>
                <div>
                  <Label className="text-foreground">Date</Label>
                  <DatePickerDemo 
                    date={selectedDate} 
                    onSelect={setSelectedDate}
                  />
                </div>
                <div>
                  <Label htmlFor="time" className="text-foreground">Time</Label>
                  <Input 
                    id="time" 
                    type="time" 
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="bg-input text-foreground" 
                  />
                </div>
                <div>
                  <Label htmlFor="color" className="text-foreground">Color</Label>
                  <Select name="color" defaultValue="bg-blue-500">
                    <SelectTrigger className="bg-input text-foreground">
                      <SelectValue placeholder="Select a color" />
                    </SelectTrigger>
                    <SelectContent className="bg-card">
                      <SelectItem value="bg-blue-500">Blue</SelectItem>
                      <SelectItem value="bg-red-500">Red</SelectItem>
                      <SelectItem value="bg-green-500">Green</SelectItem>
                      <SelectItem value="bg-yellow-500">Yellow</SelectItem>
                      <SelectItem value="bg-purple-500">Purple</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">Add Event</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Weekly Calendar */}
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)] text-center bg-card rounded-lg border border-dashed border-border">
            <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No events yet</h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Get started by adding your first event to the calendar. Click the "Add Event" button above to create one.
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus className="mr-2 h-4 w-4" /> Add Your First Event
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card">
                <DialogHeader>
                  <DialogTitle className="text-foreground">Add New Event</DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const formData = new FormData(e.target as HTMLFormElement)
                    
                    let eventDate = selectedDate || new Date()
                    if (selectedTime) {
                      const [hours, minutes] = selectedTime.split(':').map(Number)
                      eventDate = new Date(eventDate)
                      eventDate.setHours(hours, minutes, 0, 0)
                    }
                    
                    const newEvent = {
                      title: formData.get("title"),
                      date: eventDate,
                      color: formData.get("color"),
                    }
                    addEvent(newEvent)
                    setSelectedDate(undefined)
                    setSelectedTime("")
                    e.currentTarget.reset()
                  }}
                  className="space-y-4"
                >
                  <div>
                    <Label htmlFor="title" className="text-foreground">Event Title</Label>
                    <Input id="title" name="title" required className="bg-input text-foreground" />
                  </div>
                  <div>
                    <Label className="text-foreground">Date</Label>
                    <DatePickerDemo 
                      date={selectedDate} 
                      onSelect={setSelectedDate}
                    />
                  </div>
                  <div>
                    <Label htmlFor="time" className="text-foreground">Time</Label>
                    <Input 
                      id="time" 
                      type="time" 
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="bg-input text-foreground" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="color" className="text-foreground">Color</Label>
                    <Select name="color" defaultValue="bg-blue-500">
                      <SelectTrigger className="bg-input text-foreground">
                        <SelectValue placeholder="Select a color" />
                      </SelectTrigger>
                      <SelectContent className="bg-card">
                        <SelectItem value="bg-blue-500">Blue</SelectItem>
                        <SelectItem value="bg-red-500">Red</SelectItem>
                        <SelectItem value="bg-green-500">Green</SelectItem>
                        <SelectItem value="bg-yellow-500">Yellow</SelectItem>
                        <SelectItem value="bg-purple-500">Purple</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">Add Event</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-4">
            {weekDays.map((day) => (
              <Card key={day.toISOString()} className="h-[calc(100vh-12rem)] overflow-hidden bg-card">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 text-foreground">{format(day, "EEE d")}</h3>
                  <div className="space-y-2">
                    {events
                      .filter((event: any) => event.date && isSameDay(event.date, day))
                      .map((event: any) => (
                        <div
                          key={event.id}
                          className={`${event.color} text-white p-2 rounded-md text-sm`}
                        >
                          <p className="font-semibold">{event.title}</p>
                          <p>{event.date ? format(event.date, "h:mm a") : 'No time specified'}</p>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
