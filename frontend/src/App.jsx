// import { Button } from '@chakra-ui/react';
import { Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import './App.css';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { ChatState } from './context/ChatProvider';

function App() {
	const history = useHistory();
	const { logout } = ChatState();

	useEffect(() => {
		const userInfo = JSON.parse(localStorage.getItem('userInfo'));

		if (!userInfo) {
			logout();
		}
	}, [history]);

	return (
		<div className='App'>
			<Route path='/' component={HomePage} exact />
			<Route path='/chats' component={ChatPage} />
		</div>
	);
}

export default App;
