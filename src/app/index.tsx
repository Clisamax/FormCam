import { useContext } from 'react';

import Home from '@/app/(auth)/home';
import Login from '@/app/(login)/login';
import { AuthContext } from '@/context/auth';
import Camera from '@/app/(auth)/camera';

export default function App() {
	const { signed } = useContext(AuthContext);
	//signed ? <Home /> : <Login />;
	return <Camera/>
}
