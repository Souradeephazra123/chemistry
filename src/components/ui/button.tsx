"use client";

import type { ButtonProps } from "react-aria-components";
import { Button } from "react-aria-components";
import { useFormStatus } from "react-dom";
import { twMerge } from "tailwind-merge";

import type { RACLinkProps } from "./link";
import { RACLink } from "./link";
import type { RACProps } from "./utils";
import { BUTTON_BASE_CLASS } from "./utils";

export type ButtonVariants =
	| "primary"
	| "secondary"
	| "outline"
	| "success"
	| "danger"
	| "danger2";

type RACButtonProps = RACProps<ButtonProps>;

interface MyButtonProps extends RACButtonProps {
	variant?: ButtonVariants;
}

function getButtonClass(
	variant: ButtonVariants,
	className: string | undefined,
) {
	return twMerge(
		BUTTON_BASE_CLASS,
		variant === "primary" && "bg-blue-500 text-white",
		variant === "secondary" && "bg-accent2 text-primaryText",
		variant === "outline" && "border border-accent bg-transparent",
		variant === "success" && "bg-success text-white",
		variant === "danger" && "bg-red-300 text-white",
		variant === "danger2" && "bg-error/20 text-error",
		className,
	);
}

function MyButton({ className, variant = "primary", ...props }: MyButtonProps) {
	return <Button {...props} className={getButtonClass(variant, className)} />;
}

export { MyButton as Button };
export { type MyButtonProps as ButtonProps };

export function FormButton({
	isDisabled,
	type = "submit",
	...props
}: MyButtonProps) {
	const { pending } = useFormStatus();

	return <MyButton {...props} type={type} isDisabled={pending || isDisabled} />;
}

export { Button as RACButton };
export type { RACButtonProps };

interface LinkButtonProps extends RACLinkProps {
	variant?: ButtonVariants;
}

export function LinkButton({
	className,
	variant = "primary",
	...props
}: LinkButtonProps) {
	return <RACLink {...props} className={getButtonClass(variant, className)} />;
}
