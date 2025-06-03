import { styles } from '@/components/progress/styles';

import { View } from 'react-native';

type Props = {
	progress: number;
};

const Progress = ({ progress }: Props) => {
	return (
		<View style={styles.container}>
			<View style={[styles.progress, { width: `${progress}%` }]} />
		</View>
	);
};

export default Progress;
