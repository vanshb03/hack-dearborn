import { getAccessToken, getUserData } from "@/app/utils/getAccessToken";
import { supabase } from "@/supabaseClient";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const appAccessToken = await getAccessToken();
  console.log(appAccessToken)
  const accessToken = req.headers.authorization || `Bearer ${appAccessToken}`;
  console.log(accessToken)
  if (req.method === 'GET') {
    const { startDate, endDate } = req.query;
  
    const calendarUrl = 
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${startDate}&timeMax=${endDate}&singleEvents=true&orderBy=startTime`;
    
    try {
      const response = await axios.get(calendarUrl, {
        headers: {
          'Authorization': `${accessToken}`,
        },
      });
  
      res.status(200).json({ events: response.data.items });
    } catch (error: any) {
      res.status(500).json({ error: error.response?.data || error.message });
    }
  } else if (req.method === 'POST') {
    const user = getUserData();
    const { title, startDate, endDate, description } = req.body;

    console.log(user)
  try {
    const calendarUrl = `https://www.googleapis.com/calendar/v3/calendars/primary/events`;

    const event = {
      summary: title,
      description: description,
      start: {
        dateTime: startDate,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: endDate, 
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    };

    const response = await axios.post(calendarUrl, event, {
      headers: {
        Authorization: `${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    res.status(200).json({ success: true, event: response.data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
  }
}
