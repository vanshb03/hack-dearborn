"use client";

import { useState, useEffect } from "react"
import { format, startOfWeek, addDays, isSameDay, parseISO } from "date-fns"
import { Calendar, ChevronLeft, ChevronRight, Plus, User } from "lucide-react"
import axios from 'axios'
import { useAuth } from "../hooks/useAuth"  // Adjust the import path as necessary

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function UserDashboard() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState([])
  const { user } = useAuth();  // Get the authenticated user

  // Function to fetch events from the API
  const fetchEvents = async (token) => {
    try {
      const response = await axios.post('/api/getEvents', { token });
      console.log('Fetched events:', response.data.events);
      return response.data.events;
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  };

  // Helper function to safely parse dates
  const safeParseDate = (dateString) => {
    if (!dateString) return null;
    try {
      return parseISO(dateString);
    } catch (error) {
      console.error('Error parsing date:', dateString, error);
      return null;
    }
  };

  useEffect(() => {
    const fetchEventsData = async () => {
      console.log('All localStorage keys:', Object.keys(localStorage));

      const authData = localStorage.getItem('sb-hftxskqhefzqnwyiqplt-auth-token');
      console.log('Auth data:', authData);

      if (authData) {
        try {
          const parsedAuthData = JSON.parse(authData);
          console.log('Parsed auth data:', parsedAuthData);
          
          const providerToken = parsedAuthData.provider_token;
          console.log('Provider token:', providerToken);

          if (providerToken) {
            const fetchedEvents = await fetchEvents(providerToken);
            const formattedEvents = fetchedEvents.map((event, index) => {
              const startDate = safeParseDate(event.start);
              return {
                id: event.id || `event-${index}`,
                title: event.title || event.summary || 'Untitled Event',
                date: startDate,
                color: `bg-${['blue', 'red', 'green', 'yellow', 'purple'][index % 5]}-500`,
              };
            }).filter(event => event.date !== null);  // Remove events with invalid dates
            console.log('Formatted events:', formattedEvents);
            setEvents(formattedEvents);
          } else {
            console.log('No provider token found in parsed auth data');
          }
        } catch (error) {
          console.error('Error parsing auth data:', error);
        }
      } else {
        console.log('No auth data found in localStorage');
      }
    };

    fetchEventsData();
  }, []);

  const startDate = startOfWeek(currentDate)
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i))

  const addEvent = (newEvent) => {
    setEvents([...events, { ...newEvent, id: `event-${events.length + 1}` }])
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-card p-6 shadow-md">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
            <User className="w-6 h-6 text-secondary-foreground" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">{user ? user.name : 'Loading...'}</h2>
            <p className="text-sm text-muted-foreground">{user ? user.email : 'Loading...'}</p>
          </div>
        </div>
        <nav>
          <Button variant="ghost" className="w-full justify-start mb-2 text-foreground hover:bg-secondary hover:text-secondary-foreground">
            <Calendar className="mr-2 h-4 w-4" /> Calendar
          </Button>
          {/* Add more navigation items here */}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto bg-background">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-foreground">Your Calendar</h1>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" onClick={() => setCurrentDate(addDays(currentDate, -7))}
                    className="text-foreground border-border hover:bg-secondary">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-medium text-foreground">
              {format(startDate, "MMMM d, yyyy")} - {format(addDays(startDate, 6), "MMMM d, yyyy")}
            </span>
            <Button variant="outline" size="icon" onClick={() => setCurrentDate(addDays(currentDate, 7))}
                    className="text-foreground border-border hover:bg-secondary">
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
                  const formData = new FormData(e.target)
                  const newEvent = {
                    title: formData.get("title"),
                    date: new Date(formData.get("date")),
                    color: formData.get("color"),
                  }
                  addEvent(newEvent)
                }}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="title" className="text-foreground">Event Title</Label>
                  <Input id="title" name="title" required className="bg-input text-foreground" />
                </div>
                <div>
                  <Label htmlFor="date" className="text-foreground">Date and Time</Label>
                  <Input id="date" name="date" type="datetime-local" required className="bg-input text-foreground" />
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
        <div className="grid grid-cols-7 gap-4">
          {weekDays.map((day) => (
            <Card key={day.toISOString()} className="h-[calc(100vh-12rem)] overflow-hidden bg-card">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2 text-foreground">{format(day, "EEE d")}</h3>
                <div className="space-y-2">
                  {events
                    .filter((event) => event.date && isSameDay(event.date, day))
                    .map((event) => (
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
      </main>
    </div>
  )
}