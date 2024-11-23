import React, { useState } from 'react';
import { Box } from '@mui/material';
import ChatMessages from './ChatMessages.jsx';
import ChatInput from './ChatInput.jsx';
import useStore from '../../store/index.jsx';

/**
 * ChatWindow Component
 *
 * Main component that displays chat messages and provides an input area for sending messages.
 */
const ChatWindow = () => {
    const [message, setMessage] = useState('');

    const selectedChatId = useStore((state) => state.selectedChatId);
    const chats = useStore((state) => state.chats);
    const sendMessage = useStore((state) => state.sendMessage);

    const messages =
        chats.find((chat) => chat.id === selectedChatId)?.messages || [];

    const handleSendMessage = () => {
        if (message.trim() !== '') {
            sendMessage(message.trim());
            setMessage('');
        }
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            height="100vh"
            bgcolor="background.default"
        >
            {/* Messages Area */}
            <ChatMessages messages={messages} />

            {/* Input Area */}
            <Box
                position="sticky"
                bottom={0}
                p={2}
                borderTop={1}
                borderColor="divider"
                bgcolor="background.default"
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mt: 2,
                }}
            >
                <Box
                    sx={{
                        width: {
                            xs: '100%',
                            sm: '90%',
                            md: '80%',
                            lg: '80%',
                            xl: '70%',
                        },
                        mx: {
                            xs: 0,
                            sm: 'auto',
                            md: 'auto',
                        },
                        p: {
                            xs: 0,
                            sm: 1,
                            md: 2,
                        },
                    }}
                >
                    <ChatInput
                        message={message}
                        setMessage={setMessage}
                        onSend={handleSendMessage}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default ChatWindow;
