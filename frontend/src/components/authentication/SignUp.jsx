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

const SignUp = () => {
	const history = useHistory();

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmpassword, setConfirmpassword] = useState('');
	const [pic, setPic] = useState('');
	const [show, setShow] = useState(false);
	const [loading, setLoading] = useState(false);
	const toast = useToast();

	const submitHandler = async e => {
		e.preventDefault();
		setLoading(true);
		if (!name || !email || !password || !confirmpassword) {
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

		if (password !== confirmpassword) {
			toast({
				title: 'Passwords do not match!',
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
				'/api/user/register',
				{
					name,
					email,
					password,
					pic,
				},
				config
			);

			toast({
				title: 'Registration successful',
				status: 'success',
				duration: 5000,
				isClosable: true,
				position: 'bottom',
			});

			localStorage.setItem('userInfo', JSON.stringify(data));

			setLoading(false);

			history.push('/chats');
		} catch (error) {
			console.log(error?.response?.data?.message || error.message);
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
	const postDetails = async pic => {
		setLoading(true);
		if (pic === undefined) {
			toast({
				title: 'Please select an image!',
				status: 'warning',
				duration: 5000,
				isClosable: true,
				position: 'bottom',
			});
			return;
		}

		if (pic.type === 'image/jpeg' || pic.type === 'image/png') {
			const data = new FormData();
			data.append('file', pic);
			data.append('upload_preset', 'yolosopher-chat-app');
			data.append('cloud_name', 'yolosopher');

			fetch('https://api.cloudinary.com/v1_1/yolosopher/image/upload', {
				method: 'post',
				body: data,
			})
				.then(res => res.json())
				.then(data => {
					setPic(data.url.toString());
					console.log(data.url.toString());
					setLoading(false);
				})
				.catch(err => {
					console.log(err);
					setLoading(false);
				});
		} else {
			toast({
				title: 'Please select an image!',
				status: 'warning',
				duration: 5000,
				isClosable: true,
				position: 'bottom',
			});
			setLoading(false);
			return;
		}
	};
	return (
		<VStack spacing='5px'>
			<FormControl id='first-name' isRequired>
				<FormLabel>Name</FormLabel>
				<Input
					placeholder='Enter Your Name'
					onChange={e => setName(e.target.value)}
				/>
			</FormControl>
			<FormControl id='email' isRequired>
				<FormLabel>Email</FormLabel>
				<Input
					placeholder='Enter Your Email'
					onChange={e => setEmail(e.target.value)}
				/>
			</FormControl>
			<FormControl id='password' isRequired>
				<FormLabel>Password</FormLabel>
				<InputGroup>
					<Input
						type={show ? 'text' : 'password'}
						placeholder='Enter Your Password'
						onChange={e => setPassword(e.target.value)}
					/>
					<InputRightElement width='4.5rem' children='👁'>
						<Button
							h='1.75rem'
							size='sm'
							onClick={() => setShow(prevstate => !prevstate)}>
							{show ? 'Hide' : 'Show'}
						</Button>
					</InputRightElement>
				</InputGroup>
			</FormControl>

			<FormControl id='confirmpassword' isRequired>
				<FormLabel>Confirm Password</FormLabel>
				<InputGroup>
					<Input
						type={show ? 'text' : 'password'}
						placeholder='Confirm Your Password'
						onChange={e => setConfirmpassword(e.target.value)}
					/>
					<InputRightElement width='4.5rem' children='👁'>
						<Button
							h='1.75rem'
							size='sm'
							onClick={() => setShow(prevstate => !prevstate)}>
							{show ? 'Hide' : 'Show'}
						</Button>
					</InputRightElement>
				</InputGroup>
			</FormControl>
			<FormControl id='pic'>
				<FormLabel>Upload your Picture</FormLabel>
				<Input
					type='file'
					p={1.5}
					accept='image/'
					onChange={e => postDetails(e.target.files[0])}
				/>
			</FormControl>

			<Button
				colorScheme='blue'
				w={'100%'}
				style={{
					marginTop: 15,
				}}
				onClick={submitHandler}
				isLoading={loading}>
				Sign Up
			</Button>
		</VStack>
	);
};

export default SignUp;
