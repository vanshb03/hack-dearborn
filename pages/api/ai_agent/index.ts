import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';

interface GoogleEvent {title: string, description: string, startDate: string, endDate: string}
const TimeFormat = z.object({
  startDate: z.string(),
  endDate: z.string(),
});

const EventsFormat = z.object({
  title: z.string(),
  description: z.string(),
  startDate: z.string(),
  endDate: z.string(),
});

const EventArray = z.object({
  data: z.array(EventsFormat)
})

const openAi = new OpenAI();

export default async function handler(req: NextApiRequest
  , res: NextApiResponse) {

    const message = req.body.message;
    const accessToken: any = req.headers.authorization;
    try {
      const { timeLapse } = await fetchTimeLapFromTheText(message);

      const { calendarList } = await fetchGoogleCalendar(timeLapse, accessToken);

      const completion = await fetchNewEventsJson(message, calendarList)
      
      await createGoogleEvents(completion.timeLapse.data, accessToken)
      res.status(200).json({data: completion});
    } catch(err: any) {
      console.log({err})
      res.status(err?.status || 400).json({ err })
    }

}

const fetchTimeLapFromTheText = async (message: string) => {
    const completion: any = await openAi.beta.chat.completions.parse({
      model: 'gpt-4o-2024-08-06',
      messages: [
            { role: "system", content: "You are a helpful assistant." },
            {
                role: "user",
                content: `give me the date range that is required to schedule the events in this message: ${message} and give me output in the form of json having structure {startDate, endDate} in ISOString format`,
            },
        ],
        response_format: zodResponseFormat(TimeFormat, 'time_format')
    });
    return {timeLapse: completion?.choices[0]?.message?.parsed}
}

const fetchNewEventsJson = async (message: string, calenderList: any) => {
  const completion: any = await openAi.beta.chat.completions.parse({
    model: 'ft:gpt-4o-mini-2024-07-18:personal::AHlDfTXd',
    messages: [
          { role: "system", content: "You are a helpful assistant." },
          {
              role: "user",
              content: `this is my calendar information for the concerned time ${calenderList} 
                and I want you to ${message}, please create my tasks on my behalf based on my 
                availability otherwise if there is no slot for a task, suggest some suitable time for it based on my availability, plus don't schedule any event in the past`,
          },
      ],
      response_format: zodResponseFormat(EventArray, 'events_format')
  });
  return ({timeLapse: completion?.choices[0]?.message?.parsed})
}

const fetchGoogleCalendar = async (timeLapse: {startDate: string, endDate: string}, accessToken: string) => {
  const {startDate, endDate} = timeLapse;
  const calendarUrl = 
  `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${startDate}&timeMax=${endDate}&singleEvents=true&orderBy=startTime`;

  const response: any = await axios.get(calendarUrl, {
    headers: {
      'Authorization': `${accessToken}`,
    },
  });
    return { calendarList: response?.data?.items };
}

const createGoogleEvents = async (events: GoogleEvent[], accessToken: string) => {
    const mappedEvents = events?.map((event: GoogleEvent) => {
    const { title, startDate, endDate, description } = event;
    const eventMapped = {
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
      return eventMapped;
    })

    const calendarUrl = `https://www.googleapis.com/calendar/v3/calendars/primary/events`;

    const apiCalls = mappedEvents.map(async (_: any) => {
      return await axios.post(calendarUrl, _, {
        headers: {
          Authorization: `${accessToken}`,
          "Content-Type": "application/json",
        },
      });
    })

    const response = await Promise.all(apiCalls);

    return response;
}