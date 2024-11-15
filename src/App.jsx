// App.js
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import { Flex, Box } from '@chakra-ui/react';

function App() {
    const [chats, setChats] = useState([
        {
            id: 1,
            title: 'Chat 1',
            messages: [],
        },
    ]);
    const [currentChatId, setCurrentChatId] = useState(1);

    const currentChat = chats.find((chat) => chat.id === currentChatId);

    const handleNewChat = () => {
        const newChatId = chats.length + 1;
        setChats([
            ...chats,
            { id: newChatId, title: `Chat ${newChatId}`, messages: [] },
        ]);
        setCurrentChatId(newChatId);
    };

    const handleSelectChat = (chatId) => {
        setCurrentChatId(chatId);
    };

    const handleSendMessage = async (chatId, messageText) => {
        const updatedChats = chats.map((chat) => {
            if (chat.id === chatId) {
                const newMessage = { sender: 'user', text: messageText };
                return { ...chat, messages: [...chat.messages, newMessage] };
            }
            return chat;
        });
        setChats(updatedChats);

        // Simulate API call
        try {
            const response = await fetch('https://api.example.com/chat', {
                method: 'POST',
                body: JSON.stringify({ message: messageText }),
            });
            const data = await response.json();
            const botReply = data.reply || 'This is a dummy reply from the bot.';

            // Update with bot's reply
            const updatedChatsWithBotReply = updatedChats.map((chat) => {
                if (chat.id === chatId) {
                    const newMessage = { sender: 'bot', text: botReply };
                    return { ...chat, messages: [...chat.messages, newMessage] };
                }
                return chat;
            });
            setChats(updatedChatsWithBotReply);
        } catch (error) {
            console.error('Error fetching bot reply:', error);
        }
    };

    return (
        <Flex h="100vh">
            {/* Sidebar */}
            <Box w={{ base: '100%', md: '25%' }} h="100%" p={0}>
                <Sidebar
                    chats={chats}
                    currentChatId={currentChatId}
                    onNewChat={handleNewChat}
                    onSelectChat={handleSelectChat}
                />
            </Box>
            {/* Chat Window */}
            <Box w={{ base: '100%', md: '75%' }} h="100%" p={0}>
                <ChatWindow chat={currentChat} onSendMessage={handleSendMessage} />
            </Box>
        </Flex>
    );
}

export default App;
