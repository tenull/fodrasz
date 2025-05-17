// backend/services/googleCalendarService.js
const { google } = require('googleapis');
const path = require('path');

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, '../config/service-account.json'),
  scopes: ['https://www.googleapis.com/auth/calendar'],
});

const calendar = google.calendar({ version: 'v3', auth });

async function createCalendarEvent({ summary, description, startDateTime, endDateTime }) {
    console.lo(endDateTime)
  const event = {
    summary,
    description,
    start: {
      dateTime: startDateTime,
      timeZone: 'Europe/Budapest',
    },
    end: {
      dateTime: endDateTime,
      timeZone: 'Europe/Budapest',
    },
  };

  try {
    const response = await calendar.events.insert({
      calendarId: 'fodrasz91@gmail.com',
      resource: event,
    });
    return response.data;
  } catch (error) {
    console.error('Google Calendar API error:', error);
    throw error;
  }
}

async function isTimeSlotAvailable({ startDateTime, endDateTime }) {
    try {
      const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin: startDateTime,
        timeMax: endDateTime,
        singleEvents: true,
        orderBy: 'startTime',
      });
  
      console.log('Talált események:', response.data.items);
  
      const events = response.data.items;
      return events.length === 0;
    } catch (error) {
      console.error('Időpont ellenőrzési hiba:', error);
      throw error;
    }
  }
  

  module.exports = {
    createCalendarEvent,
    isTimeSlotAvailable,
  };
  
