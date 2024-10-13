import { google, calendar_v3 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

async function fetchGoogleCalendarEvents(
  auth: OAuth2Client,
  calendarId: string = 'primary'
): Promise<calendar_v3.Schema$Event[]> {
  const calendar = google.calendar({ version: 'v3', auth });
  
  try {
    const response = await calendar.events.list({
      calendarId: calendarId,
      timeMin: (new Date()).toISOString(),
      maxResults: 2500,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items;
    
    if (!events || events.length === 0) {
      console.log('No upcoming events found.');
      return [];
    }
    
    return events;
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    throw error;
  }
}

// Usage example
// const auth = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
// auth.setCredentials({ access_token: 'YOUR_ACCESS_TOKEN' });
// const events = await fetchGoogleCalendarEvents(auth);