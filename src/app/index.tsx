import { useContext } from 'react';

import Home from '@/app/(auth)/home';
import Login from '@/app/(login)/login';
import { AuthContext } from '@/context/auth';

export default function App() {
	const { signed } = useContext(AuthContext);
	//signed ? <Home /> : <Login />;
	return signed ? (
		<Home
			uuid={''}
			options_1={''}
			options_2={''}
			options_3={''}
			anotacao={''}
			options_4={''}
			options_5={''}
		/>
	) : (
		<Login />
	);
}
