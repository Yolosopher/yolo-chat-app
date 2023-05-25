import {
	Box,
	Container,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Text,
} from '@chakra-ui/react';
import React, { useLayoutEffect } from 'react';
import SignUp from '../components/authentication/SignUp';
import Login from '../components/authentication/Login';
import { useHistory } from 'react-router-dom';

const HomePage = () => {
	const history = useHistory();

	useLayoutEffect(() => {
		const userInfo = JSON.parse(localStorage.getItem('userInfo'));

		if (userInfo) history.push('/chats');
	}, [history]);

	return (
		<Container maxW='xl' centerContent>
			<Box
				display='flex'
				justifyContent='center'
				bg='white'
				p='3'
				w='100%'
				m='40px 0 15px 0'
				borderRadius='lg'
				borderWidth='1px'>
				<Text fontSize='4xl' fontFamily='Work sans'>
					Yolosopher's Chat App
				</Text>
			</Box>
			<Box
				bg='white'
				w='100%'
				p={4}
				borderRadius={'lg'}
				borderWidth={'1px'}>
				<Tabs variant='soft-rounded'>
					<TabList mb='1em'>
						<Tab w={'50%'}>Login</Tab>
						<Tab w={'50%'}>Sign Up</Tab>
					</TabList>
					<TabPanels>
						<TabPanel>{<Login />}</TabPanel>
						<TabPanel>{<SignUp />}</TabPanel>
					</TabPanels>
				</Tabs>
			</Box>
		</Container>
	);
};

export default HomePage;
