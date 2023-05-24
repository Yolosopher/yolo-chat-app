import { ViewIcon } from '@chakra-ui/icons';
import {
	Box,
	Button,
	FormControl,
	IconButton,
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
import { ChatState } from '../../context/ChatProvider';
import { useState } from 'react';
import UserBadgeItem from '../user/UserBadgeItem';
import axios from 'axios';
import UserListItem from '../user/UserListItem';

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain }) => {
	const { user, selectedChat, setSelectedChat } = ChatState();

	const { isOpen, onOpen, onClose } = useDisclosure();
	const [groupChatName, setGroupChatName] = useState(selectedChat.chatName);
	const [search, setSearch] = useState('');
	const [searchResult, setSearchResult] = useState([]);
	const [loading, setLoading] = useState(false);
	const [renameLoading, setRenameLoading] = useState(false);

	const toast = useToast();

	const handleRemove = async userToRemove => {
		if (
			selectedChat.groupAdmin._id !== user._id &&
			userToRemove._id !== user._id
		) {
			toast({
				title: 'You are not authorized to remove this user.',
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'bottom',
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

			const { data } = await axios.put(
				'/api/chat/group/remove',
				{
					chatId: selectedChat._id,
					userId: userToRemove._id,
				},
				config
			);

			userToRemove._id === user._id
				? setSelectedChat(null)
				: setSelectedChat(data);
			setFetchAgain(!fetchAgain);
		} catch (error) {
			toast({
				title: 'Error Occured',
				description: error?.response?.data?.messsage ?? error.message,
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'bottom',
			});
		} finally {
			setLoading(false);
		}
	};

	const handleRename = async () => {
		if (!groupChatName) return;

		try {
			setRenameLoading(true);

			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};

			const { data } = await axios.put(
				'/api/chat/group',
				{
					name: groupChatName,
					chatId: selectedChat._id,
				},
				config
			);

			setSelectedChat(data);
			setFetchAgain(!fetchAgain);
		} catch (error) {
			toast({
				title: 'Error Occured',
				description: error?.response?.data?.messsage ?? error.message,
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'bottom',
			});
		} finally {
			setRenameLoading(false);
		}
	};

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
			console.log(data);
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

	const handleAddUser = async userToAdd => {
		if (selectedChat.users.find(u => u._id === userToAdd._id)) {
			toast({
				title: 'User already in the group.',
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'bottom',
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

			const { data } = await axios.put(
				'/api/chat/group/add',
				{
					chatId: selectedChat._id,
					userId: userToAdd._id,
				},
				config
			);

			setSelectedChat(data);
			setFetchAgain(!fetchAgain);
		} catch (error) {
			toast({
				title: 'Error Occured',
				description: error?.response?.data?.messsage ?? error.message,
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'bottom',
			});
			setLoading(false);
		}
	};

	return (
		<>
			<IconButton
				display={{ base: 'flex' }}
				icon={<ViewIcon />}
				onClick={onOpen}
			/>
			<Modal isOpen={isOpen} onClose={onClose} isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader
						fontSize={'35px'}
						display={'flex'}
						justifyContent={'center'}
						fontFamily={'Work sans'}>
						{selectedChat.chatName}
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Box
							display={'flex'}
							w={'100%'}
							flexWrap={'wrap'}
							pb={3}>
							{selectedChat.users.map(u => (
								<UserBadgeItem
									key={u._id}
									userItem={u}
									handleFunction={() => handleRemove(u)}
								/>
							))}
						</Box>
						<FormControl display={'flex'}>
							<Input
								placeholder='Chat Name'
								mb={3}
								value={groupChatName}
								onChange={e => setGroupChatName(e.target.value)}
							/>
							<Button
								variant={'solid'}
								colorScheme='teal'
								ml={1}
								isLoading={renameLoading}
								onClick={handleRename}>
								Update
							</Button>
						</FormControl>
						<FormControl>
							<Input
								placeholder='Add User to the group'
								mb={1}
								onChange={e => handleSearch(e.target.value)}
							/>
						</FormControl>
						{/* show found users */}
						{loading ? (
							<Box
								my={'4'}
								display={'flex'}
								alignItems={'center'}>
								<Spinner size={'lg'} />
							</Box>
						) : (
							searchResult?.slice(0, 4).map(user => (
								<UserListItem
									key={user._id}
									userItem={user}
									handleFunction={() => {
										handleAddUser(user);
									}}
								/>
							))
						)}
					</ModalBody>

					<ModalFooter>
						<Button
							onClick={() => handleRemove(user)}
							colorScheme='red'>
							Leave Group
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default UpdateGroupChatModal;
