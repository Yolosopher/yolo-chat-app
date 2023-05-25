import React, { useEffect, useLayoutEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import { Box } from '@chakra-ui/react';
import { ChatState } from '../context/ChatProvider';
import SideDrawer from '../components/miscellaneous/SideDrawer';
import MyChats from '../components/MyChats';
import ChatBox from '../components/ChatBox';

const ChatPage = () => {
	const { user, setNotifications } = ChatState();

	const [fetchAgain, setFetchAgain] = useState(false);

	const fetchNotifications = async () => {
		if (!user) return;
		const config = {
			headers: {
				Authorization: `Bearer ${user.token}`,
			},
		};

		const { data } = await axios.get('/api/notification', config);

		setNotifications(data.messages);

		try {
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		fetchNotifications();
	}, []);
	// useLayoutEffect(() => {
	// 	const userInfo = JSON.parse(localStorage.getItem('userInfo'));

	// 	if (!userInfo) history.push('/');
	// }, [history]);

	return (
		<div style={{ width: '100%' }}>
			{user && <SideDrawer />}
			<Box
				display='flex'
				justifyContent='space-between'
				w='100%'
				h='91.5vh'
				p='10px'>
				{user && <MyChats fetchAgain={fetchAgain} />}
				{user && (
					<ChatBox
						fetchAgain={fetchAgain}
						setFetchAgain={setFetchAgain}
					/>
				)}
			</Box>
		</div>
	);
};

export default ChatPage;
