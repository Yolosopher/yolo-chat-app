import React, { useEffect } from 'react';
import { ChatState } from '../context/ChatProvider';
import {
	Box,
	FormControl,
	IconButton,
	Input,
	Spinner,
	Text,
	useToast,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFully } from '../config/ChatLogics';
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import { useState } from 'react';
import axios from 'axios';
import './styles.css';
import ScrollableChat from './ScrollableChat';

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
	const [messages, setMessages] = useState([]);
	const [loading, setLoading] = useState(false);
	const [newMessage, setNewMessage] = useState('');

	const { user, selectedChat, setSelectedChat } = ChatState();

	const toast = useToast();

	const fetchMessages = async () => {
		if (!selectedChat) return;

		setLoading(true);
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};

			const { data } = await axios.get(
				`/api/message/${selectedChat._id}`,
				config
			);

			console.log(data);
			setMessages(data);
		} catch (error) {
			toast({
				title: 'An error occurred.',
				description: 'Unable to Load the messages.',
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'bottom',
			});
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchMessages();
	}, [selectedChat]);
	const sendMessage = async e => {
		if (e.key === 'Enter' && newMessage) {
			// Send message logic here
			try {
				const config = {
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${user.token}`,
					},
				};

				const { data } = await axios.post(
					'/api/message',
					{
						content: newMessage,
						chatId: selectedChat._id,
					},
					config
				);

				console.log(data);

				setMessages('');
				setMessages(prevstate => [...prevstate, data]);
			} catch (error) {
				toast({
					title: 'An error occurred.',
					description: 'Unable to send message.',
					status: 'error',
					duration: 5000,
					isClosable: true,
					position: 'bottom',
				});
			}
		}
	};
	const typingHandler = e => {
		setNewMessage(e.target.value);

		// Typing indicator logic here
	};
	return (
		<>
			{selectedChat ? (
				<>
					<Text
						fontSize={{
							base: '28px',
							md: '30px',
						}}
						pb={3}
						px={2}
						w={'100%'}
						fontFamily={'Work sans'}
						display={'flex'}
						justifyContent={{ base: 'space-between' }}
						alignItems={'center'}>
						<IconButton
							display={{
								base: 'flex',
								md: 'none',
							}}
							icon={<ArrowBackIcon />}
							onClick={() => setSelectedChat(null)}
						/>
						{!selectedChat.isGroupChat ? (
							<>
								{getSender(
									user,
									selectedChat.users
								).toUpperCase()}
								<ProfileModal
									user={getSenderFully(
										user,
										selectedChat.users
									)}
								/>
							</>
						) : (
							<>
								{selectedChat.chatName.toUpperCase()}
								<UpdateGroupChatModal
									fetchAgain={fetchAgain}
									setFetchAgain={setFetchAgain}
									fetchMessages={fetchMessages}
								/>
							</>
						)}
					</Text>
					<Box
						display={'flex'}
						flexDir={'column'}
						justifyContent={'flex-end'}
						p={3}
						bg={'#e8e8e8'}
						w={'100%'}
						h={'100%'}
						borderRadius={'lg'}
						overflowY={'hidden'}>
						{loading ? (
							<Spinner
								size={'1xl'}
								w={20}
								h={20}
								alignSelf={'center'}
								margin={'auto'}
							/>
						) : (
							<div className='messages'>
								{/* Messages Here */}
								<ScrollableChat messages={messages} />
							</div>
						)}
						<FormControl onKeyDown={sendMessage} isRequired mt='3'>
							<Input
								placeholder='Enter a message...'
								variant={'filled'}
								bg={'#e0e0e0'}
								onChange={typingHandler}
								value={newMessage}
							/>
						</FormControl>
					</Box>
				</>
			) : (
				<Box
					display={'flex'}
					justifyContent={'center'}
					alignItems={'center'}
					h={'100%'}>
					<Text fontSize={'3xl'} pb={3} fontFamily={'Work sans'}>
						Click on a user to start chatting
					</Text>
				</Box>
			)}
		</>
	);
};

export default SingleChat;
