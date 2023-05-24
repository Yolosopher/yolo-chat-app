import React from 'react';
import { ChatState } from '../context/ChatProvider';
import { Box } from '@chakra-ui/react';
import SingleChat from './SingleChat';

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
	const { selectedChat } = ChatState();

	return (
		<Box
			display={{ base: selectedChat ? 'flex' : 'none', md: 'flex' }}
			w={{ base: '100%', md: '68%' }}
			p={3}
			bg='white'
			borderRadius='lg'
			borderWidth={'1px'}
			flexDir='column'
			alignItems='center'>
			<SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
		</Box>
	);
};

export default ChatBox;
