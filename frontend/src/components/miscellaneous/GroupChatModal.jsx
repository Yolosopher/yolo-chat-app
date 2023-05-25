import {
	Box,
	Button,
	FormControl,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Spinner,
	useDisclosure,
	useToast,
} from '@chakra-ui/react';
import React from 'react';
import { useState } from 'react';
import { ChatState } from '../../context/ChatProvider';
import axios from 'axios';
import UserListItem from '../user/UserListItem';
import UserBadgeItem from '../user/UserBadgeItem';

const GroupChatModal = ({ children }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [groupChatName, setGroupChatName] = useState('');
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [search, setSearch] = useState('');
	const [searchResult, setSearchResult] = useState([]);
	const [loading, setLoading] = useState(false);

	const toast = useToast();

	const { user, chats, setChats } = ChatState();

	const handleSearch = async query => {
		setSearch(query);
		if (!query) {
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
			setSearchResult(data);
		} catch (error) {
			toast({
				title: 'An error occurred.',
				description: error.message,
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'bottom-left',
			});
			setLoading(false);
		}
	};
	const handleGroup = userToAdd => {
		if (selectedUsers.includes(userToAdd)) {
			toast({
				title: 'User already added',
				status: 'warning',
				duration: 5000,
				isClosable: true,
				position: 'top',
			});
			return;
		}

		setSelectedUsers(prevstate => [...prevstate, userToAdd]);
	};
	const handleDetele = userToDelete => {
		setSelectedUsers(prevstate =>
			prevstate.filter(sel => sel._id !== userToDelete._id)
		);
	};
	const handleSubmit = async () => {
		if (!groupChatName || selectedUsers.length === 0) {
			toast({
				title: 'Please fill all the fields',
				status: 'warning',
				duration: 5000,
				isClosable: true,
				position: 'top',
			});
			return;
		}

		try {
			setLoading(true);
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${user.token}`,
				},
			};

			const { data } = await axios.post(
				'/api/chat/group',
				{
					name: groupChatName,
					users: selectedUsers.map(u => u._id),
				},
				config
			);

			setChats(prevstate => [...prevstate, data]);
			toast({
				title: 'Group chat created successfully',
				status: 'success',
				duration: 5000,
				isClosable: true,
				position: 'top',
			});
			setLoading(false);
			onClose();
		} catch (error) {
			toast({
				title: 'Failed to create group chat',
				description: error.message,
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'top',
			});

			setLoading(false);
		}
	};

	return (
		<>
			<span onClick={onOpen}>{children}</span>

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader
						fontSize={'35px'}
						fontFamily={'Work sans'}
						display={'flex'}
						justifyContent={'center'}>
						Create Group Chat
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody
						display={'flex'}
						flexDir={'column'}
						alignItems={'center'}>
						<FormControl id=''>
							<Input
								placeholder='Chat Name'
								mb={3}
								onChange={e => setGroupChatName(e.target.value)}
							/>
						</FormControl>
						<FormControl id=''>
							<Input
								placeholder='Add Users eg: John, Nick, Jane'
								mb={1}
								onChange={e => handleSearch(e.target.value)}
							/>
						</FormControl>
						{/* show selected users */}
						<Box display={'flex'} w={'100%'} flexWrap={'wrap'}>
							{selectedUsers?.map(u => (
								<UserBadgeItem
									key={u._id}
									userItem={u}
									handleFunction={() => handleDetele(u)}
								/>
							))}
						</Box>
						{/* show found users */}
						{loading ? (
							<Box
								my={'4'}
								display={'flex'}
								alignItems={'center'}>
								<Spinner />
							</Box>
						) : (
							searchResult?.slice(0, 4).map(user => (
								<UserListItem
									key={user._id}
									userItem={user}
									handleFunction={() => {
										handleGroup(user);
									}}
								/>
							))
						)}
					</ModalBody>

					<ModalFooter>
						<Button colorScheme='blue' onClick={handleSubmit}>
							Create Chat
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default GroupChatModal;
