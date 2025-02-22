// import type { TFormActionReturnObj } from "@/utils/client-utils";
import type { FormProps } from "react-aria-components";

// Utility type to add required children and optional className to a component
export type RCProps<IncludeClassName = false> = {
	children: React.ReactNode;
} & (IncludeClassName extends true ? { className?: string } : unknown);

// Utility type to convert React Aria Components' className prop type from render function/string to string
// as we will be using tailwind classes for state based styling
export type RACProps<CompProps> = Omit<CompProps, "className"> & {
	className?: string;
};

// server action status
export enum FormActionStatus {
	Error = "error",
	Success = "success",
}

export interface TFormActionReturnObj<T = unknown> {
	// status of the action
	status: FormActionStatus;
	// extras is optional and can be used to pass any extra data
	// that might be useful to the client to take action post server action
	extras?: T;
	// to show toast message on client
	message?: string;
	// form errors if any - will be passed to React Aria `Form`
	errors?: FormProps["validationErrors"];
}

// Utility type to include server action as a prop to a component
// using this type to the `Form` enforces the server action to return a FormActionReturnObj
// and the `Form` component will handle the form submission and validation
// and appropriate toast messages
export interface TSAProps<T = unknown> {
	successCB?: (extras?: T) => unknown;
	errorCB?: (extras?: T) => unknown;
	action: (
		prev: unknown,
		formData: FormData,
	) => Promise<TFormActionReturnObj<T>>;
}

// utility type for items to be passed to `Select`, `Combobox`
export type RACCollectionItem = { id: string } & Record<
	string,
	string | number | boolean
>;

export type FormFieldProps<T = unknown> = {
	name: string;
	label: string;
	className?: string;
	hideLabel?: boolean;
	placeholder?: string;
	description?: string;
	isRequired?: boolean;
	inputClassName?: string;
	children?: React.ReactNode;
	descriptionClassName?: string;
	labelClassName?: string;
} & Omit<T, "name" | "className" | "placeholder" | "isRequired">;

export interface TImageDimensionValidation {
	aspectRatio: number;
	minHeight: number;
	maxHeight: number;
	minWidth: number;
	maxWidth: number;
}

export interface TImageValidationProps {
	max: number;
	maxSize: number;
	dimensions: TImageDimensionValidation[];
}

export const BUTTON_BASE_CLASS =
	"inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold capitalize transition disabled:opacity-50";

export const ICON_BUTTON_BASE_CLASS =
	"inline-flex size-12 items-center justify-center rounded-full transition disabled:opacity-50";

export const DIALOG_BASE_CLASS =
	"flex max-h-[calc(100dvh-1rem)] flex-col gap-4 overflow-auto rounded-10 bg-white p-6 outline-none md:mx-auto md:max-w-[calc(100dvw-0.5rem)]";
