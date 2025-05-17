import React, { useState } from 'react';
import BookingForm from '../BookingForm';
import Modal from './Modal'
const BookingWithModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <button onClick={openModal}>Időpont foglalás</button>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <BookingForm />
      </Modal>
    </div>
  );
};

export default BookingWithModal;
