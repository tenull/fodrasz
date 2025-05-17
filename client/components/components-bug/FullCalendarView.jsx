// src/components/FullCalendarView.js
import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { gapi } from 'gapi-script';

const CLIENT_ID = '273440497888-2c4iq79b260qrg38k59mdgg89tot1smt.apps.googleusercontent.com';
const API_KEY = 'AIzaSyCKMWz0g-DQocKPyP5FD0brB9E9K5a9Vc4';
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

const FullCalendarView = ({events}) => {

console.log(events)
  useEffect(() => {
    function initClient() {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        scope: SCOPES,
      }).then(() => {
        gapi.auth2.getAuthInstance().signIn().then(() => {
          loadEvents();
        });
      });
    }

    gapi.load('client:auth2', initClient);
  }, []);

  const loadEvents = async () => {
    const response = await gapi.client.calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 100,
      orderBy: 'startTime',
      
    });
    console.log('Google Calendar API response:', response);
    const formattedEvents = response.result.items.map(event => ({
      title: event.summary || 'Foglalt',
      start: event.start.dateTime || event.start.date,
      end: event.end.dateTime || event.end.date,
    }));

    setEvents(formattedEvents);
  };

  return (
    <div>
      <FullCalendar
        plugins={[timeGridPlugin]}
        initialView="timeGridWeek"
        slotDuration="00:15:00"
        allDaySlot={false}
        events={events}
        height="auto"
        nowIndicator
      />
    </div>
  );
};

export default FullCalendarView;
