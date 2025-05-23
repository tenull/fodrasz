const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const app = express();
const PORT = process.env.PORT || 3001;

  
app.use(cors({
    origin: '*',
    methods: ['GET','POST','PUT','DELETE'],
  }));
  

require('dotenv').config();

app.use(express.json());

const webhookUrl = process.env.GOOGLE_CALENDAR_WEBHOOK ;
app.post('/proxy', async (req, res) => {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    res.json({ status: 'success', message: 'Foglalás mentve!', data });

  } catch (error) {
    console.error('Hiba a proxy során:', error);
    res.status(500).json({ status: 'error', message: 'Hiba a proxyban', error: error.message });
  }
});

app.listen(PORT, () => console.log(`Proxy szerver fut a ${PORT} -es porton`));
