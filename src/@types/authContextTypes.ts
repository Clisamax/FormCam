export interface Iuser {
	token: string;
	sap: string;
	name: string;
	userId: string
}

export interface IContext {
	user: Iuser | null;
	signed: boolean;
	Authenticate: (sap: string, password: string) => Promise<void>;
	Logout: () => Promise<void>;
}

export interface IAuthProvider {
	children: React.ReactNode;
} 		

