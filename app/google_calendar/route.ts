// pages/api/getCalendarEvents.js

import { NextApiRequest, NextApiResponse } from "next";
import { getAccessToken } from "../utils/getAccessToken";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const accessToken = getAccessToken();
  const calendarUrl = 
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${startDate}&timeMax=${endDate}&singleEvents=true&orderBy=startTime`;

  try {
    const response = await fetch(calendarUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Google Calendar events');
    }

    const data = await response.json();
    res.status(200).json({ events: data.items });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
