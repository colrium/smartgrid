import NextLink, { LinkProps as NextLinkProps } from "next/link";
import type { AnchorHTMLAttributes, ReactElement, ReactNode } from "react";

export type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> &
	NextLinkProps & {
		href: NextLinkProps["href"];
		children: ReactNode;
	};

const isInternalLink = (href: NextLinkProps["href"]): boolean => {
	return (
		typeof href === "string" &&
		(href.startsWith("/") || href.startsWith("#") || href.startsWith("?"))
	);
};

export default function Link(props: LinkProps): ReactElement {
	const {
		href,
		as,
		replace,
		scroll,
		shallow,
		prefetch,
		locale,
		legacyBehavior,
		children,
		target,
		rel,
		...anchorProps
	} = props;

	if (isInternalLink(href)) {
		return (
			<NextLink
				href={href}
				as={as}
				replace={replace}
				scroll={scroll}
				shallow={shallow}
				prefetch={prefetch}
				locale={locale}
				legacyBehavior={legacyBehavior}
                target={target} rel={rel} {...anchorProps}
			>
				{children}
			</NextLink>
		);
	}

	return (
		<a href={typeof href === "string" ? href : undefined} target={target} rel={rel} {...anchorProps}>
			{children}
		</a>
	);
}
