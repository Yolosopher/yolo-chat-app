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
import io from 'socket.io-client';
import Lottie from 'lottie-react';
import animationData from '../animations/typing.json';

const ENDPOINT = 'http://localhost:5000';
var socket, selectedChatCompare;

const showTyping = (typers, selfId) => {
	if (typers.length === 0) return false;

	const typer = typers.find(t => t.typing === true && t.typer !== selfId);
	if (!typer) return false;

	return true;
};

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
	const {
		user,
		selectedChat,
		setSelectedChat,
		notifications,
		setNotifications,
	} = ChatState();
	const [messages, setMessages] = useState([]);
	const [loading, setLoading] = useState(false);
	const [newMessage, setNewMessage] = useState('');
	const [socketConnected, setSocketConnected] = useState(false);
	const [typing, setTyping] = useState(false);
	const [typingTimeOutFunc, setTypingTimeOutFunc] = useState(null);
	const [typers, setTypers] = useState([]);

	const toast = useToast();

	useEffect(() => {
		socket = io(ENDPOINT);
		socket.emit('setup', user);
		socket.on('connected', () => setSocketConnected(true));
		socket.on('typing', ({ chatId, typer }) => {
			setTypers(prevstate =>
				prevstate.map(t => {
					return {
						typer: t.typer,
						typing: t.typer === typer ? true : t.typing,
					};
				})
			);
		});
		socket.on('stop typing', ({ chatId, typer }) => {
			setTypers(prevstate =>
				prevstate.map(t => {
					return {
						typer: t.typer,
						typing: t.typer === typer ? false : t.typing,
					};
				})
			);
			if (typer === user._id) {
				return;
			}
		});
	}, []);

	useEffect(() => {
		fetchMessages();

		selectedChatCompare = selectedChat;

		if (selectedChat) {
			if (Array.isArray(selectedChat.users)) {
				setTypers(
					selectedChat.users.map(usr => {
						return { typer: usr._id, typing: false };
					})
				);
			}
			readRemoveNotifications(selectedChat._id);
		}
	}, [selectedChat]);

	useEffect(() => {
		socket.on('message recieved', newMessageRecieved => {
			if (
				!selectedChatCompare || // if chat is not selected or doesn't match current chat
				selectedChatCompare._id !== newMessageRecieved.chat._id
			) {
				// give notification
				if (!notifications.includes(newMessageRecieved)) {
					setNotifications([newMessageRecieved, ...notifications]);

					setFetchAgain(!fetchAgain);
				}
			} else {
				setMessages([...messages, newMessageRecieved]);
				// remove from notifications db
				readRemoveNotifications(newMessageRecieved.chat._id);
			}
		});
	});
	const readRemoveNotifications = async chatid => {
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};

			const { data } = await axios.delete(
				`/api/notification/chat/${chatid}`,
				config
			);

			console.log('remove notif data');
			console.log(data);

			setNotifications(data.messages);
		} catch (error) {
			console.log(error.message);
		}
	};
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

			// REMOVE notification
			const filteredNotifs = notifications.filter(
				notif => notif.chat._id !== selectedChat._id
			);
			setNotifications(filteredNotifs);
			readRemoveNotifications(selectedChat.id);

			setMessages(data);
			socket.emit('join chat', selectedChat._id);
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

	const sendMessage = async e => {
		if (e.key === 'Enter' && newMessage) {
			clearTimeout(typingTimeOutFunc);
			setTyping(false);
			socket.emit('stop typing', {
				chatId: selectedChat._id,
				typer: user._id,
			});
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

				// send message
				socket.emit('new message', data);

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
			} finally {
				setNewMessage('');
			}
		}
	};
	const typingHandler = e => {
		setNewMessage(e.target.value);

		if (!socketConnected) return;

		if (!typing) {
			setTyping(true);
			socket.emit('typing', {
				chatId: selectedChat._id,
				typer: user._id,
			});
		}
		let lastTypingTime = new Date().getTime();
		var timerLength = 3000;

		clearTimeout(typingTimeOutFunc);
		setTypingTimeOutFunc(
			setTimeout(() => {
				var timeNow = new Date().getTime();
				var timeDiff = timeNow - lastTypingTime;
				if (timeDiff >= timerLength && typing) {
					socket.emit('stop typing', {
						chatId: selectedChat._id,
						typer: user._id,
					});
					setTyping(false);
				}
			}, timerLength)
		);
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
							{showTyping(typers, user._id) ? (
								<div>
									<Lottie
										animationData={animationData}
										loop={true}
										// renderer='xMidYMid slice'
										// // options={defaultOptions}
										style={{
											marginBottom: 15,
											marginLeft: 0,
											width: 70,
										}}
									/>
								</div>
							) : null}
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
