const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const { isTimeSlotAvailable } = require('../services/googleCalendarService');

router.post('/booking', async (req, res) => {
  const { name, email, date, description } = req.body;

  const start = new Date(date);
  const end = new Date(start.getTime() + 45 * 60 * 1000);

  const startDateTime = start.toISOString();
  const endDateTime = end.toISOString();

  try {
    const isAvailable = await isTimeSlotAvailable({ startDateTime, endDateTime });

    if (!isAvailable) {
      return res.status(400).json({ status: 'error', message: 'Ez az időpont már foglalt.' });
    }

    const auth = require('../services/googleCalendarService'); // biztosan csak egyszer töltsd be!
    const calendar = google.calendar({ version: 'v3', auth });

    const event = {
      summary: `Foglalás: ${name}`,
      description: description || '',
      start: {
        dateTime: startDateTime,
        timeZone: 'Europe/Budapest',
      },
      end: {
        dateTime: endDateTime,
        timeZone: 'Europe/Budapest',
      },
      attendees: email ? [{ email }] : [],
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });

    res.status(200).json({ status: 'success', message: 'Foglalás sikeres.', event: response.data });

  } catch (err) {
    console.error('Hiba a foglalásnál:', err);
    res.status(500).json({ status: 'error', message: 'Nem sikerült a foglalás.', error: err.message });
  }
});

module.exports = router;
