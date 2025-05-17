import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  Button, FormControl, FormLabel, Input, useDisclosure, useToast
} from "@chakra-ui/react";

function EventModal({ isOpen, onClose, startDateTime,onEventCreated  }) {
  const [summary, setSummary] = useState("");
  const toast = useToast();

  // A végidő fixen +45 perc a startDateTime-hez képest
  const start = new Date(startDateTime);
  const endDateTime =  new Date(start.getTime() + 45 * 60000)

  const handleCreateEvent = async () => {
    if (!summary) {
      toast({
        title: "Hiányzó adat",
        description: "Kérlek adj meg egy esemény nevet.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    const start = new Date(startDateTime);
    const end = new Date(start.getTime() + 45 * 60000);
    const event = {
        summary,
        start: {
          dateTime: start.toISOString(),
          timeZone: "Europe/Budapest",
        },
        end: {
          dateTime: end.toISOString(),
          timeZone: "Europe/Budapest",
        },
      };
      
      console.log("start:", startDateTime);
      console.log("end:", endDateTime);
      
    try {
      await gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
      });
  
      toast({
        title: "Sikeres foglalás",
        description: "Az esemény hozzáadva a naptárhoz.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      if (onEventCreated) {
        onEventCreated(); 
      }
      onClose();
    } catch (error) {
      toast({
        title: "Hiba történt",
        description: "Nem sikerült létrehozni az eseményt.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.error(error);
    }
  };
  console.log("converted end date:", new Date(endDateTime));

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Esemény létrehozása</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={3}>
            <FormLabel>Név</FormLabel>
            <Input
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Add meg a nevedet"
            />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Kezdés időpontja</FormLabel>
            <Input
              type="datetime-local"
              value={new Date(startDateTime).toISOString().slice(0, 16)}
              readOnly
            />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Befejezés időpontja (fix 45 perc)</FormLabel>
            <Input
             type="datetime-local"
             value={ new Date(new Date(startDateTime).getTime() + 45 * 60000).toISOString().slice(0, 16)}
              readOnly 
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleCreateEvent}>
            Létrehozás
          </Button>
          <Button onClick={onClose}>Mégse</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default function CalendarWithModal({events, onEventCreated}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedStart, setSelectedStart] = useState(null);

  const handleDateClick = (arg) => {
    setSelectedStart(arg.date);
    onOpen();
  };

  return (
    <>
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        selectable={true}
        dateClick={handleDateClick}
        events={events}
        nowIndicator
      />

      {selectedStart && (
        <EventModal
          isOpen={isOpen}
          onClose={() => {
            onClose();
            setSelectedStart(null);
          }}
          startDateTime={selectedStart}
          onEventCreated={onEventCreated}
        />
      )}
    </>
  );
}
