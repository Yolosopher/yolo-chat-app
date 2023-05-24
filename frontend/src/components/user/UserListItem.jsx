import React from 'react';
import { ChatState } from '../../context/ChatProvider';
import { Avatar, Box, Text } from '@chakra-ui/react';

const UserListItem = ({ userItem, handleFunction }) => {
	return (
		<Box
			onClick={handleFunction}
			cursor='pointer'
			_hover={{ background: '#38B2AC', color: 'white' }}
			w='100%'
			display='flex'
			alignItems={'center'}
			color='black'
			px='3'
			py='2'
			mb='2'
			bg='#e8e8e8'
			borderRadius='lg'>
			<Avatar
				mr={2}
				size={'sm'}
				name={userItem.name}
				src={userItem.pic}
			/>
			<Box>
				<Text>{userItem.name}</Text>
				<Text fontSize={'xs'}>
					<b>Email :</b>
					{userItem.email}
				</Text>
			</Box>
		</Box>
	);
};

export default UserListItem;
