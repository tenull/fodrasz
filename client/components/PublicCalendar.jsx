import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import BookingForm from './BookingForm';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    useDisclosure,
} from '@chakra-ui/react';

const PublicCalendar = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedStart, setSelectedStart] = useState(null);
    const [selectedEnd, setSelectedEnd] = useState(null);
    const [headerToolbar, setHeaderToolbar] = useState({
        left: 'prev,next',
        center: 'title',
        right: 'timeGridWeek,timeGridDay',
    });

    const handleDateClick = (arg) => {
        const localDate = arg.date;

        const endDate = new Date(localDate.getTime() + 45 * 60 * 1000);
        const toLocalISOString = (date) => {
            const pad = (n) => n.toString().padStart(2, '0');
            return (
                date.getFullYear() +
                '-' +
                pad(date.getMonth() + 1) +
                '-' +
                pad(date.getDate()) +
                'T' +
                pad(date.getHours()) +
                ':' +
                pad(date.getMinutes())
            );
        };

        const isoStart = toLocalISOString(localDate);
        const isoEnd = toLocalISOString(endDate);

        setSelectedStart(isoStart);
        setSelectedEnd(isoEnd);
        onOpen();
    };

    useEffect(() => {
        if (window.innerWidth < 768) {
            setHeaderToolbar({
                left: 'prev,next',
                center: 'title',
                right: '', // mobilon nem kell nézetváltás
            });
        }
    }, []);

    return (
        <div style={{ padding: '2rem' }}>
            <FullCalendar
                headerToolbar={headerToolbar}
                plugins={[timeGridPlugin, interactionPlugin, googleCalendarPlugin]}
                initialView="timeGridWeek"
                nowIndicator={true}
                height="auto"
                googleCalendarApiKey="AIzaSyCKMWz0g-DQocKPyP5FD0brB9E9K5a9Vc4"
                events={{ googleCalendarId: 'fodrasz91@gmail.com' }}
                slotMinTime="08:00:00"
                slotMaxTime="20:00:00"
                slotDuration='00:15'
                allDaySlot={false}
                locale="hu"
                dateClick={handleDateClick}
            />

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent maxW="400px" p={4}>
                    <ModalCloseButton />
                    <ModalHeader>Időpont foglalás</ModalHeader>
                    <ModalBody>
                        <BookingForm
                            startDate={selectedStart}
                            endDate={selectedEnd}
                            onClose={onClose}
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    );
};

export default PublicCalendar;
