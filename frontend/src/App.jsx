// import { Button } from '@chakra-ui/react';
import { Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import './App.css';

function App() {
	return (
		<div className='App'>
			<Route path='/' component={HomePage} exact />
			<Route path='/chats' component={ChatPage} />
		</div>
	);
}

export default App;
