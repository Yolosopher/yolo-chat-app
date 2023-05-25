import { useState } from 'react';
import { createContext, useContext } from 'react';
// import { useHistory } from 'react-router-dom';

export const ChatContext = createContext();

const ChatProvider = ({ children }) => {
	const defaultUser = localStorage.getItem('userInfo')
		? JSON.parse(localStorage.getItem('userInfo'))
		: null;

	const [user, setUser] = useState(defaultUser);
	const [selectedChat, setSelectedChat] = useState(null);
	const [chats, setChats] = useState([]);
	const [notifications, setNotifications] = useState([]);

	const logout = () => {
		localStorage.removeItem('userInfo');
		setUser(null);
	};

	const login = userInfo => {
		setUser(userInfo);
		localStorage.setItem('userInfo', JSON.stringify(userInfo));
	};

	return (
		<ChatContext.Provider
			value={{
				user,
				login,
				logout,
				selectedChat,
				setSelectedChat,
				chats,
				setChats,
				notifications,
				setNotifications,
			}}>
			{children}
		</ChatContext.Provider>
	);
};

export const ChatState = () => {
	return useContext(ChatContext);
};

export default ChatProvider;
