// src/components/Calendar.js
import React, { useEffect, useState } from 'react';
import { gapi } from 'gapi-script';
import { Box, Button, VStack } from '@chakra-ui/react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid'; // napi / heti nézethez
import interactionPlugin from '@fullcalendar/interaction'; // interakciókhoz
import CalendarWithModal from './EventModal';

const CLIENT_ID = '273440497888-2c4iq79b260qrg38k59mdgg89tot1smt.apps.googleusercontent.com';
const API_KEY = 'AIzaSyCKMWz0g-DQocKPyP5FD0brB9E9K5a9Vc4';
const SCOPES = 'https://www.googleapis.com/auth/calendar.events';

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [refreshEvents, setRefreshEvents] = useState(0);
    console.log(events)

  useEffect(() => {
    function start() {
      gapi.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
          scope: SCOPES,
        })
        .then(() => {
          const authInstance = gapi.auth2.getAuthInstance();
          setIsSignedIn(authInstance.isSignedIn.get());
          authInstance.isSignedIn.listen(setIsSignedIn);
        });
    }

    gapi.load('client:auth2', start);
  }, []);

  const handleSignIn = () => {
    gapi.auth2.getAuthInstance().signIn();
  };

  const handleSignOut = () => {
    gapi.auth2.getAuthInstance().signOut();
    setEvents([]);
  };

  const loadEvents = async () => {
    const response = await gapi.client.calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 100,
      orderBy: 'startTime',
    });
  
    const googleEvents = response.result.items;
    console.log("Google raw events:", googleEvents);
  
    const formattedEvents = googleEvents.map(event => ({
      title: event.summary,
      start: event.start.dateTime || event.start.date,
      end: event.end.dateTime || event.end.date
    }));
    setEvents(response.result.items || []);
    console.log("Formatted events:", formattedEvents);
    setEvents(formattedEvents);
  };

  useEffect(() => {
    if (isSignedIn) {
      loadEvents();
    }
  }, [isSignedIn,refreshEvents]);
 
  
  return (
    <Box p={4}>
      {isSignedIn ? (
        <VStack spacing={4} align="start">
          <Button onClick={handleSignOut} colorScheme="red">Kijelentkezés</Button>
        
          <Box w="100%" h="700px">
          <CalendarWithModal events={events}  onEventCreated={() => setRefreshEvents(prev => prev + 1)} />


           
          </Box>
        </VStack>
      ) : (
        <Button onClick={handleSignIn} colorScheme="green">Bejelentkezés Google-lel</Button>
      )}
    </Box>
  );
};

export default Calendar;
