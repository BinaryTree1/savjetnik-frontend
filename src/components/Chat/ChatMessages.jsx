// src/components/Chat/ChatMessages.jsx
import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import PropTypes from 'prop-types';
import ChatMessage from './ChatMessage.jsx';
import EmptyChatPlaceholder from './EmptyChatPlaceholder.jsx';

/**
 * ChatMessages Component
 *
 * Renders a list of chat messages or a placeholder if there are none.
 * Automatically scrolls to the latest message.
 *
 * @param {Object} props - Component props.
 * @param {Array} props.messages - Array of message objects.
 */
const ChatMessages = ({ messages }) => {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    if (messages.length === 0) {
        return <EmptyChatPlaceholder />;
    }

    return (
        <Box flexGrow={1} overflow="auto">
            {messages.map((msg, index) => (
                <ChatMessage
                    key={index}
                    text={msg.text}
                    sender={msg.sender}
                    index={index}
                />
            ))}
            <div ref={messagesEndRef} />
        </Box>
    );
};

ChatMessages.propTypes = {
    messages: PropTypes.arrayOf(
        PropTypes.shape({
            text: PropTypes.string.isRequired,
            sender: PropTypes.oneOf(['user', 'bot']).isRequired,
        })
    ).isRequired,
};

export default React.memo(ChatMessages);
