import { useContext } from 'react';

import Home from '@/app/(auth)/home';
import Login from '@/app/(login)/login';
import { AuthContext } from '@/context/auth';
import LoadingScreen from '@/app/(auth)/loading';

export default function App() {
	const { signed } = useContext(AuthContext);
	//signed ? <Home /> : <Login />;
	return <LoadingScreen />
		
	
}
