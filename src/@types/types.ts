import { Feather } from "@expo/vector-icons";
import { Control, FieldValues, Path, RegisterOptions, UseControllerProps } from "react-hook-form";
import { TextInputProps, ViewStyle } from "react-native";

export interface Iuser {
	token: string;
	sap: string;
	name: string;
	userId: string
}

export interface IContext {
	user: Iuser | null;
	signed: boolean;
	loading: boolean;
	Authenticate: (sap: string, password: string) => Promise<void>;
	Logout: () => Promise<void>;
}

export interface IAuthProvider {
	children: React.ReactNode;
}

export interface homeFormData {
	uuid: string;
	options_1: string;
	options_2: string;
	options_3: string;
	options_4: string;
	options_5: string;
	annotation: string;
}
export interface LoginFormData {
	sap: string;
	password: string;
}

export interface CadastroFormData {
	name: string;
	sap: string;
	password: string;
	passwordConfirm: string;
}

export interface produtosFormData {
	uuid: string;
	product: string;
	quantity: string;
	occurrenceDate: string;
	annotation: string;
	nameOfResponsible: string;
	unit: string;
}

export interface InputDatePickerProps<T extends FieldValues> {
	formProps: {
		name: Path<T>;
		control: Control<T>;
		rules?: Omit<
			RegisterOptions<T, Path<T>>,
			'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
		>;
	};
	inputProps?: TextInputProps;
	error?: string;
}
export interface DateInputProps {
	control: Control<FieldValues>;
	name: string;
	label?: string;
	icon: string;
}

export interface ProductProps {
	icon: keyof typeof Feather.glyphMap;
	iconRight?: keyof typeof Feather.glyphMap;
	formProps: UseControllerProps;
	inputProps?: TextInputProps;
	error?: string;
	style?: ViewStyle;
	increment?: () => void;
	decrement?: () => void;
}


