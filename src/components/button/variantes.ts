import { COLORS } from "@/styles/global/color";
export interface ButtonStyle {
	button: {
		width: number,
		height: number,
		backgroundColor: string;
		borderWidth?: number;
		borderColor?: string;
	};
	title: {
		color: string;

	};
	icon: {
		color: string;
	};
}

export interface ButtonVariant {
	enabled: ButtonStyle;
	disabled: ButtonStyle;
}

const buttonPrimary: ButtonVariant = {
	enabled: {
		button: {
			width: 150,
			height: 60,
			backgroundColor: COLORS.red[500],
		},
		title: {
			color: COLORS.white,
		},
		icon: {
			color: COLORS.white,
		},
	},
	disabled: {
		button: {
			width: 150,
			height: 60,
			backgroundColor: COLORS.gray[500],
		},
		title: {
			color: COLORS.white,
		},
		icon: {
			color: COLORS.white,
		},
	},
};
export const buttonOutline: ButtonVariant = {
	enabled: {
		button: {
			width: 120,
			height: 60,
			backgroundColor: "transparent",
			borderWidth: 2,
			borderColor: COLORS.red[500],
		},
		title: {
			color: COLORS.red[500],
		},
		icon: {
			color: COLORS.red[500],
		},
	},
	disabled: {
		button: {
			width: 150,
			height: 60,
			backgroundColor: "transparent",
			borderWidth: 2,
			borderColor: COLORS.gray[500],
		},
		title: {
			color: COLORS.gray[500],
		},
		icon: {
			color: COLORS.gray[500],
		},

	},
};

export const buttonVariants = {
	primary: buttonPrimary,
	outline: buttonOutline,
};