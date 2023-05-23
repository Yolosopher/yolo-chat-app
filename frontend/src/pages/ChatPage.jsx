import React from 'react';
import axios from 'axios';
import { useState } from 'react';
import { Button, Alert, AlertIcon } from '@chakra-ui/react';
import BeatLoader from 'react-spinners/BeatLoader';
import { useEffect } from 'react';

const ChatPage = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [chats, setChats] = useState([]);

	const fetchChats = async () => {
		try {
			setLoading(true);
			const res = await axios.get('/api/chats');
			const data = await res.data;

			setChats(data);
		} catch (error) {
			setError(error.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchChats();
	}, []);

	return (
		<div>
			{loading ? (
				<Button
					isLoading
					colorScheme='blue'
					spinner={<BeatLoader size={8} color='white' />}>
					Click me
				</Button>
			) : error ? (
				<Alert status='error'>
					<AlertIcon />
					{error}
				</Alert>
			) : (
				<div>
					{chats.map(chat => (
						<div key={chat._id}>{chat.chatName}</div>
					))}
				</div>
			)}
		</div>
	);
};

export default ChatPage;
