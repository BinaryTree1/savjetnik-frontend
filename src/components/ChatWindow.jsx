// ChatWindow.js
import React, { useState, useEffect, useRef } from 'react';
import { Box, Flex, Text, Input, Button } from '@chakra-ui/react';

function ChatWindow({ chat, onSendMessage }) {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim() === '') return;
        onSendMessage(chat.id, input);
        setInput('');
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chat.messages]);

    return (
        <Flex direction="column" h="100%">
            {/* Messages */}
            <Box flex="1" overflowY="auto" p={3} bg="gray.100">
                {chat.messages.length === 0 ? (
                    <Flex h="100%" justify="center" align="center">
                        <Text fontSize="4xl">Your Logo Here</Text>
                    </Flex>
                ) : (
                    chat.messages.map((message, index) => (
                        <Flex
                            key={index}
                            mb={3}
                            justify={message.sender === 'user' ? 'flex-end' : 'flex-start'}
                        >
                            <Box
                                p={2}
                                rounded="md"
                                bg={message.sender === 'user' ? 'blue.500' : 'gray.600'}
                                color="white"
                                maxWidth="60%"
                            >
                                {message.text}
                            </Box>
                        </Flex>
                    ))
                )}
                <div ref={messagesEndRef} />
            </Box>
            {/* Input Form */}
            <Box as="form" onSubmit={handleSubmit} bg="gray.800" p={3}>
                <Flex>
                    <Input
                        type="text"
                        placeholder="Type your message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        mr={2}
                        color="white"
                    />
                    <Button type="submit" colorScheme="blue">
                        Send
                    </Button>
                </Flex>
            </Box>
        </Flex>
    );
}

export default ChatWindow;
