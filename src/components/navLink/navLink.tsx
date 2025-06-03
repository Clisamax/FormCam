import { Link, LinkProps as ExpoLinkProps } from 'expo-router';

interface NavLinkProps extends ExpoLinkProps {
	children: React.ReactNode;
	className?: string;
}

const NavLink = ({ children, ...props }: NavLinkProps) => {
	return (
		<Link
			{...props}
			style={[
				{
					textDecorationLine: 'none',
				},
				props.style,
			]}
		>
			{children}
		</Link>
	);
};

export default NavLink;