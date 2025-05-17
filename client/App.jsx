import React from 'react'
import { Box, Heading, Text } from '@chakra-ui/react'
import Calendar from './components/components-bug/Calendar'
import { GiHairStrands } from "react-icons/gi";
import PublicCalendar from './components/PublicCalendar';
import BookingForm from './components/BookingForm';
import BookingWithModal from './components/components-bug/BookingWithModal';

function App() {
  return (
    <Box mt={10} p={{base:'0',md:'6'}} >
      <Box display='flex' flexDirection='column' alignItems='center'>
        <GiHairStrands  fontSize='100'/>
       <Heading mb={4}>Fodrász Időpont Foglalás</Heading>
       
      </Box>
     
         <PublicCalendar/>
     
    </Box>
  )
}

export default App
