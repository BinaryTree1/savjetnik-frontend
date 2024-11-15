// Sidebar.js
import React from 'react';
import { Flex, Button, VStack, Box } from '@chakra-ui/react';

function Sidebar({ chats, currentChatId, onNewChat, onSelectChat }) {
    return (
        <Flex direction="column" bg="gray.800" color="white" h="100%">
            {/* New Chat Button */}
            <Button colorScheme="blue" m={3} onClick={onNewChat}>
                + New Chat
            </Button>

            {/* Chats List */}
            <VStack spacing={0} flex="1" overflowY="auto">
                {chats.map((chat) => (
                    <Box
                        key={chat.id}
                        as="button"
                        onClick={() => onSelectChat(chat.id)}
                        bg={chat.id === currentChatId ? 'gray.700' : 'gray.800'}
                        color="white"
                        width="100%"
                        textAlign="left"
                        px={3}
                        py={2}
                        _hover={{ bg: 'gray.700' }}
                    >
                        {chat.title}
                    </Box>
                ))}
            </VStack>
        </Flex>
    );
}

export default Sidebar;
