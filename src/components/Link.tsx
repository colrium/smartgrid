import NextLink, { LinkProps as NextLinkProps } from "next/link";
import MuiLink, { LinkProps as MuiLinkProps } from "@mui/material/Link";
import type { ReactNode } from "react";

export type LinkProps = Omit<MuiLinkProps, "href"> &
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

export default function Link(props: LinkProps) {
  const {
    href,
    as,
    replace,
    scroll,
    shallow,
    passHref = true,
    prefetch,
    locale,
    legacyBehavior,
    children,
    target,
    rel,
    ...muiProps
  } = props;

  if (isInternalLink(href)) {
    return (
      <NextLink
        href={href}
        as={as}
        replace={replace}
        scroll={scroll}
        shallow={shallow}
        passHref={passHref}
        prefetch={prefetch}
        locale={locale}
        legacyBehavior={legacyBehavior}
      >
        <MuiLink target={target} rel={rel} {...muiProps}>
          {children}
        </MuiLink>
      </NextLink>
    );
  }

  return (
    <MuiLink href={typeof href === "string" ? href : undefined} target={target} rel={rel} {...muiProps}>
      {children}
    </MuiLink>
  );
}
