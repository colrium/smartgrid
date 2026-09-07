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
		// eslint-disable-next-line @next/next/no-img-element -- generic primitive: consumers pass arbitrary <img> props (often external URLs), next/image would break its contract
		<img
			alt=""
			draggable={false}
			onContextMenu={(event) => event.preventDefault()}
			className={`inline-block select-none overflow-hidden rounded-full object-cover align-middle ${className}`}
			{...rest}
		/>
	);
}

export default Avatar;