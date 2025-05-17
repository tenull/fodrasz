import React, { useState, useEffect } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Box,
  Stack,
  useToast
} from '@chakra-ui/react';

const BookingForm = ({ startDate, endDate, onClose }) => {
    const toast =useToast()
  const [form, setForm] = useState({
    name: '',
    email: '',
    date: startDate || '',
    description: '',
  });

  useEffect(() => {
    if (startDate) {
      setForm(prev => ({ ...prev, date: startDate }));
    }
  }, [startDate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://fodrasz.onrender.com', {
        method: 'POST',
        body: JSON.stringify({ ...form, endDate }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Szerver hiba: ${response.status} - ${text}`);
      }

      const data = await response.json();

      if (data.status === 'success') {
        toast({
        //   title: 'Sikeres foglalás',
          description: 'A foglalás sikeresen megtörtént.',
          status: 'success',
          isClosable: true,
          duration: 4000,
        });
        onClose();
      } else {
        toast({
        //   title: 'Sikertelen foglalás',
          description: data.message || 'Valami hiba történt.',
          status: 'error',
          isClosable: true,
          duration: 4000,
        });
      }
    } catch (err) {
      toast({
        // title: 'Hiba történt',
        description: err.message || 'Ismeretlen hiba.',
        status: 'error',
        isClosable: true,
        duration: 4000,
      });
  };
}
  return (
    <Box as="form" p={0} onSubmit={handleSubmit}>
      <Stack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Név</FormLabel>
          <Input
            type="text"
            name="name"
            placeholder="Név"
            value={form.name}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Kezdő időpont</FormLabel>
          <Input
            type="datetime-local"
            name="date"
            value={form.date}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Foglalás vége (fix 45 perc)</FormLabel>
          <Input
            type="datetime-local"
            name="endDate"
            value={endDate}
            readOnly
            isDisabled
          />
        </FormControl>

        <FormControl>
          <FormLabel>Megjegyzés</FormLabel>
          <Textarea
            name="description"
            placeholder="Megjegyzés"
            value={form.description}
            onChange={handleChange}
          />
        </FormControl>

        <Button colorScheme="green" type="submit">
          Időpont foglalása
        </Button>
      </Stack>
    </Box>
  );
};

export default BookingForm;
