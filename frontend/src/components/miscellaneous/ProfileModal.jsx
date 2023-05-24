import React from 'react';
import { ViewIcon } from '@chakra-ui/icons';
import {
	Button,
	IconButton,
	Image,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	useDisclosure,
} from '@chakra-ui/react';
import { shrinkPic } from '../../config/ChatLogics';

const ProfileModal = ({ user, children }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	return (
		<>
			{children ? (
				<span onClick={onOpen}>{children}</span>
			) : (
				<IconButton
					onClick={onOpen}
					icon={<ViewIcon />}
					display={{ base: 'flex' }}
				/>
			)}
			<Modal size={'lg'} isCentered isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent h='410px'>
					<ModalHeader
						fontSize={'40px'}
						fontFamily={'Work sans'}
						display='flex'
						justifyContent='center'>
						{user.name}
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody
						display={'flex'}
						flexDir={'column'}
						alignItems={'center'}
						justifyContent={'center'}>
						<Image
							borderRadius={'full'}
							objectFit={'cover'}
							boxSize='150px'
							src={shrinkPic(user.pic)}
							alt={user.name}
						/>
						<Text
							fontSize={{ base: '22px', md: '24px' }}
							fontFamily={'Work sans'}>
							Email: {user.email}
						</Text>
					</ModalBody>

					<ModalFooter>
						<Button colorScheme='blue' mr={3} onClick={onClose}>
							Close
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default ProfileModal;
