import React from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import {
	isLastMessage,
	isSameSender,
	isSameSenderMargin,
	isSameUser,
} from '../config/ChatLogics';
import { ChatState } from '../context/ChatProvider';
import { Avatar, Tooltip } from '@chakra-ui/react';

const ScrollableChat = ({ messages }) => {
	const { user } = ChatState();

	return (
		<ScrollableFeed>
			{messages &&
				messages.map((m, mIndex) => (
					<div style={{ display: 'flex' }} key={m._id}>
						{(isSameSender(messages, m, mIndex, user._id) ||
							isLastMessage(messages, mIndex, user._id)) && (
							<Tooltip
								label={m.sender.name}
								placement='bottom-start'
								hasArrow>
								<Avatar
									mt={'7px'}
									mr={1}
									size={'sm'}
									cursor={'pointer'}
									name={m.sender.name}
									src={m.sender.pic}
								/>
							</Tooltip>
						)}
						<span
							style={{
								backgroundColor: `${
									m.sender._id === user._id
										? '#bee3f8'
										: '#b9f5d0'
								}`,
								borderRadius: '20px',
								padding: '5px 15px',
								maxWidth: '75%',
								marginLeft: isSameSenderMargin(
									messages,
									m,
									mIndex,
									user._id
								),
								marginTop: isSameUser(
									messages,
									m,
									mIndex,
									user._id
								)
									? 3
									: 10,
							}}>
							{m.content}
						</span>
					</div>
				))}
		</ScrollableFeed>
	);
};

export default ScrollableChat;
