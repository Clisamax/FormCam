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
	anotacao: string;

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
	//confirmPassword: string
}

export interface produtosFormData {
	uuid: string;
	name: string;
	produto: string;

}


