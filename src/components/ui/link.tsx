"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { LinkProps } from "react-aria-components";
import { Link } from "react-aria-components";

import type { RACProps } from "./utils";

export interface RACLinkProps extends RACProps<LinkProps> {
	prefetch?: boolean;
}

export function RACLink({
	href,
	className,
	isDisabled,
	prefetch = true,
	...props
}: RACLinkProps) {
	const router = useRouter();

	useEffect(() => {
		if (prefetch && href?.startsWith("/") && !isDisabled) {
			console.log("prefetching", href);
			router.prefetch(href);
		}
	}, [href, isDisabled, prefetch, router]);

	return (
		<Link
			{...props}
			href={href}
			className={className}
			isDisabled={isDisabled}
		/>
	);
}
