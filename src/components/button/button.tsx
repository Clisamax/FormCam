import { AntDesign } from '@expo/vector-icons';
import {
	ActivityIndicator,
	Text,
	TouchableOpacity,
	TouchableOpacityProps,
	View,
} from 'react-native';
import { buttonVariants } from './variants';

import { style } from '@/components/button/styles';
import { FONTES } from '@/styles/global/fonts';

interface ButtonProps {
	title: string;
	// uma função para o botão
	onPress: () => void;
	// se o botão está carregando
	isLoading?: boolean;
	// nome do ícone do ant design, keyof typeof AntDesign.glyphMap para mapear os atributos
	iconName?: keyof typeof AntDesign.glyphMap;
	// se o botão está desabilitado
	disabled?: boolean;
	// variant do botão, "primary" ou "outline"
	variant?: 'primary' | 'outline';
	// estilos adicionais para o botão, TouchableOpacityProps["style"] para estilizar o componente TouchableOpacity
	styles?: TouchableOpacityProps['style'];
	size?: number;
	fontSize?: number;
}

const Button: React.FC<ButtonProps> = ({
	title,
	onPress,
	isLoading = false,
	iconName,
	disabled,
	variant = 'primary',
	styles,
	size = 24,
	fontSize = 16,
}) => {
	// define as cores, estilos e ícones dos botões de acordo com a variant
	const ButtonVariant = buttonVariants[variant];
	// define o estilo do botão baseado na variant e se está desabilitado ou carregando

	const ButtonStyle = disabled ? ButtonVariant.disabled : ButtonVariant.enabled;
	return (
		// exibe o botão com o conteúdo especificado pelo props do componente
		<TouchableOpacity
			disabled={isLoading || disabled}
			onPress={onPress}
			style={[style.container, { ...ButtonStyle.button }, styles]}
		>
			{isLoading ? (
				// exibe o ícone ou o texto do botão dependendo do isLoading ou disabled
				<ActivityIndicator color={ButtonStyle.icon.color} />
			) : (
				<View style={style.content}>
					{iconName && (
						// exibe o ícone se for fornecido
						<AntDesign
							style={{ marginRight: 12 }}
							size={size}
							color={ButtonStyle.icon.color}
							name={iconName}
						/>
					)}
					<Text
						style={{
							color: ButtonStyle.title.color,
							fontSize: fontSize,
							fontFamily: FONTES.FONTS.button,
						}}
					>
						{title}
					</Text>
				</View>
			)}
		</TouchableOpacity>
	);
};

export default Button;
