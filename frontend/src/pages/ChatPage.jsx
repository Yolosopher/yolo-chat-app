import React, { useLayoutEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import { Button, Alert, AlertIcon, Box } from '@chakra-ui/react';
import BeatLoader from 'react-spinners/BeatLoader';
import { useEffect } from 'react';
import { ChatState } from '../context/ChatProvider';
import SideDrawer from '../components/miscellaneous/SideDrawer';
import MyChats from '../components/MyChats';
import ChatBox from '../components/ChatBox';
import { useHistory } from 'react-router-dom';

const ChatPage = () => {
	const history = useHistory();
	const { user } = ChatState();

	const [fetchAgain, setFetchAgain] = useState(false);

	useLayoutEffect(() => {
		const userInfo = JSON.parse(localStorage.getItem('userInfo'));

		if (!userInfo) history.push('/');
	}, [history]);

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
