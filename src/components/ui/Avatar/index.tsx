import type { ImgHTMLAttributes, ReactElement, ReactNode } from "react";

export type AvatarProps = {
	className?: string;
	children?: ReactNode;
} & ImgHTMLAttributes<HTMLImageElement>;

export function Avatar({ className = "", children, ...rest }: AvatarProps): ReactElement {
	if (children) {
		return (
			<span
				className={`inline-flex select-none items-center justify-center overflow-hidden rounded-full align-middle ${className}`}
			>
				{children}
			</span>
		);
	}
	return (
		<img
			className={`inline-block select-none overflow-hidden rounded-full object-cover align-middle ${className}`}
			{...rest}
		/>
	);
}

export default Avatar;