import React, { useState, useEffect } from 'react';
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CFormInput } from '@coreui/react';

const MessageBox = ({ visible, onClose, postOwner, socket }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const name = localStorage.getItem("name");
    socket.emit('join', name);

    const handleMessageReceive = (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    };

    socket.on('receive_message', handleMessageReceive);

    return () => {
      socket.off('receive_message', handleMessageReceive);
    };
  }, [socket]);

  const name = localStorage.getItem("name");

  const handleSendMessage = () => {
    if (message.trim() === '') return;
    const messageData = { sender: name, text: message, receiver: postOwner };
    socket.emit('send_message', messageData, (response) => {
      if (response.status !== 'ok') {
        console.error('Message failed to send');
      }
    });

    setMessage('');
  };

  return (
    <CModal visible={visible} onClose={onClose} alignment="center">
      <CModalHeader>
        <CModalTitle className='ms-3'>User Name: {postOwner}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {messages.map((msg, index) => (
            <div key={index}>
              <strong>{msg.sender}:</strong> {msg.text}
            </div>
          ))}
        </div>
        <CFormInput
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
        />
      </CModalBody>
      <CModalFooter>
        <CButton color="primary" onClick={handleSendMessage}>Send Message</CButton>
        <CButton color="secondary" onClick={onClose}>Close</CButton>
      </CModalFooter>
    </CModal>
  );
};

export default MessageBox;