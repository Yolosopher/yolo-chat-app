import {
	Avatar,
	Box,
	Button,
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerHeader,
	DrawerOverlay,
	Input,
	Menu,
	MenuButton,
	MenuDivider,
	MenuItem,
	MenuList,
	Spinner,
	Text,
	Tooltip,
	useDisclosure,
	useToast,
} from '@chakra-ui/react';
import React from 'react';
import { useState } from 'react';
import { SearchIcon, BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { ChatState } from '../../context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import ChatLoading from '../ChatLoading';
import UserListItem from '../user/UserListItem';

const SideDrawer = () => {
	const history = useHistory();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { user, logout, setSelectedChat, chats, setChats } = ChatState();

	const toast = useToast();

	const [search, setSearch] = useState('');
	const [searchResults, setSearchResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const [loadingChat, setLoadingChat] = useState(true);

	const logoutHandler = () => {
		logout();
		history.push('/');
	};

	const handleSearch = async e => {
		e.preventDefault();
		console.log('searching');
		if (!search) {
			toast({
				title: 'Please enter something to search',
				status: 'warning',
				duration: 5000,
				isClosable: true,
				position: 'top-left',
			});
			return;
		}

		try {
			setLoading(true);

			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};

			const { data } = await axios.get(
				`/api/user?search=${search}`,
				config
			);

			setLoading(false);
			setSearchResults(data);
		} catch (error) {
			setLoading(false);
			toast({
				title: 'Error occured',
				description: 'Failed to load search results',
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'bottom-left',
			});
		}
	};

	const accessChat = async userId => {
		try {
			setLoadingChat(true);
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${user.token}`,
				},
			};

			const { data } = await axios.post('/api/chat', { userId }, config);

			if (!chats.find(c => c._id === data._id)) {
				setChats(prevstate => [...prevstate, data]);
			}

			setSelectedChat(data);
			setLoadingChat(false);
			onClose();
		} catch (error) {
			toast({
				title: 'Error when accessing chat',
				description: error.message,
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'bottom-left',
			});
			setLoadingChat(false);
		}
	};

	return (
		<>
			<Box
				display='flex'
				justifyContent='space-between'
				alignItems={'center'}
				bg={'white'}
				w='100%'
				p='5px 10px 5px 10px'
				borderWidth={'5px'}>
				<Tooltip
					hasArrow
					placement='bottom-end'
					label='Search Users to chat'>
					<Button onClick={onOpen} variant='ghost'>
						<SearchIcon />
						<Text px='4' display={{ base: 'none', md: 'flex' }}>
							Search User
						</Text>
					</Button>
				</Tooltip>

				<Text fontSize={'2xl'} fontFamily={'Work sans'}>
					YolosopherChat
				</Text>
				<div>
					<Menu>
						<MenuButton p={1}>
							<BellIcon fontSize={'2xl'} m={1} />
						</MenuButton>
						{/* <MenuList></MenuList> */}
					</Menu>
					<Menu>
						<MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
							<Avatar
								size={'sm'}
								cursor={'pointer'}
								name={user.name}
								src={user.pic}
							/>
						</MenuButton>
						<MenuList>
							<ProfileModal user={user}>
								<MenuItem>My Profile</MenuItem>
							</ProfileModal>
							<MenuDivider />
							<MenuItem onClick={logoutHandler}>Logout</MenuItem>
						</MenuList>
					</Menu>
				</div>
			</Box>
			<Drawer placement='left' onClose={onClose} isOpen={isOpen}>
				<DrawerOverlay />
				<DrawerContent>
					<DrawerHeader borderBottomWidth={'1px'}>
						Search Users
					</DrawerHeader>
					<DrawerBody>
						<form onSubmit={handleSearch}>
							<Box display={'flex'} pb={2}>
								<Input
									placeholder='Search by name or email'
									mr='2'
									value={search}
									onChange={e => setSearch(e.target.value)}
								/>
								<Button type='submit'>Go</Button>
							</Box>
						</form>
						{loading ? (
							<ChatLoading />
						) : (
							searchResults?.map(user => (
								<UserListItem
									key={user._id}
									userItem={user}
									handleFunction={() => {
										accessChat(user._id);
									}}
								/>
							))
						)}
						{loadingChat && (
							<Box
								justifyContent={'center'}
								alignItems={'center'}
								display='flex'>
								<Spinner />
							</Box>
						)}
					</DrawerBody>
				</DrawerContent>
			</Drawer>
		</>
	);
};

export default SideDrawer;
