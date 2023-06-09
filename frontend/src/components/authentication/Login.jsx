import {
	Button,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	InputRightElement,
	VStack,
	useToast,
} from '@chakra-ui/react';
import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { ChatState } from '../../context/ChatProvider';

const Login = () => {
	const history = useHistory();
	const { login } = ChatState();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [show, setShow] = useState(false);
	const [loading, setLoading] = useState(false);
	const toast = useToast();

	const submitHandler = async e => {
		e.preventDefault();
		setLoading(true);
		if (!email || !password) {
			toast({
				title: 'Please fill all the fields!',
				status: 'warning',
				duration: 5000,
				isClosable: true,
				position: 'bottom',
			});
			setLoading(false);
			return;
		}

		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
				},
			};
			const { data } = await axios.post(
				'/api/user',
				{
					email,
					password,
				},
				config
			);

			toast({
				title: 'Login successful',
				status: 'success',
				duration: 5000,
				isClosable: true,
				position: 'bottom',
			});

			login(data);
			setLoading(false);

			history.push('/chats');
		} catch (error) {
			toast({
				title: 'Error occured',
				description: error.response.data.message,
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'bottom',
			});
			setLoading(false);
		}
	};
	const handleGetUserCredentials = async () => {
		setEmail('guest@example.com');
		setPassword('123456');
		setShow(true);
	};
	return (
		<VStack spacing='5px'>
			<form onSubmit={submitHandler}>
				<FormControl id='email1' isRequired>
					<FormLabel>Email</FormLabel>
					<Input
						placeholder='Enter Your Email'
						onChange={e => setEmail(e.target.value)}
						value={email}
					/>
				</FormControl>
				<FormControl id='password1' isRequired>
					<FormLabel>Password</FormLabel>
					<InputGroup>
						<Input
							type={show ? 'text' : 'password'}
							placeholder='Enter Your Password'
							value={password}
							onChange={e => setPassword(e.target.value)}
						/>
						<InputRightElement width='4.5rem'>
							<Button
								h='1.75rem'
								size='sm'
								onClick={() =>
									setShow(prevstate => !prevstate)
								}>
								{show ? 'Hide' : 'Show'}
							</Button>
						</InputRightElement>
					</InputGroup>
				</FormControl>

				<Button
					colorScheme='blue'
					w={'100%'}
					style={{
						marginTop: 15,
					}}
					type='submit'
					isLoading={loading}>
					Login
				</Button>
				<Button
					colorScheme='red'
					w={'100%'}
					style={{
						marginTop: 15,
					}}
					onClick={handleGetUserCredentials}
					isLoading={loading}>
					Get Guest User Credentials
				</Button>
			</form>
		</VStack>
	);
};

export default Login;
