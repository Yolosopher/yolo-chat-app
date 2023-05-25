export const isSameSenderMargin = (messages, m, i, userId) => {
	if (
		i < messages.length - 1 &&
		messages[i + 1].sender._id === m.sender._id &&
		messages[i].sender._id !== userId
	)
		return 33;
	else if (
		(i < messages.length - 1 &&
			messages[i + 1].sender._id !== m.sender._id &&
			messages[i].sender._id !== userId) ||
		(i === messages.length - 1 && messages[i].sender._id !== userId)
	)
		return 0;
	else return 'auto';
};

export const isSameSender = (messages, m, i, userId) => {
	return (
		i < messages.length - 1 &&
		(messages[i + 1].sender._id !== m.sender._id ||
			messages[i + 1].sender._id === undefined) &&
		messages[i].sender._id !== userId
	);
};

export const isLastMessage = (messages, i, userId) => {
	return (
		i === messages.length - 1 &&
		messages[messages.length - 1].sender._id !== userId &&
		messages[messages.length - 1].sender._id
	);
};

export const isSameUser = (messages, m, i) => {
	return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

export const getSender = (loggedUser, users) => {
	return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};

export const getSenderFully = (loggedUser, users) => {
	return users[0]._id === loggedUser._id ? users[1] : users[0];
};

export const shrinkPic = pic => {
	const replaced = pic.replace('upload/', 'upload/w_100,h_100,c_fill/');
	return replaced;
};

//groupSameChatNotificationsTogether
export const gscnt = notifs => {
	const newGroupOfNotifs = new Map();

	for (let i = 0; i < notifs.length; i++) {
		const notif = notifs[i];
		if (!newGroupOfNotifs.has(notif.chat._id)) {
			newGroupOfNotifs.set(notif.chat._id, [notif]);
		} else {
			newGroupOfNotifs.get(notif.chat._id).push(notif);
		}
	}

	return newGroupOfNotifs;
};
