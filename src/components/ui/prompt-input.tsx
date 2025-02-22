"use client";

import { forwardRef } from "react";
import type { TextAreaProps } from "react-aria-components";
import { TextArea } from "react-aria-components";
import { twMerge } from "tailwind-merge";

import type { RACProps } from "./utils";

export const PROMPT_FORM_CLASS =
  "flex w-full flex-col items-start gap-4 md:flex-row text-black";

export const PromptInput = forwardRef<
  HTMLTextAreaElement,
  RACProps<TextAreaProps>
>(({ className, name = "prompt", onKeyDown, ...props }, ref) => {
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.shiftKey && e.key === "Enter") {
      e.preventDefault();
      const textarea = e.currentTarget;

      const cursorPos = textarea.selectionStart;
      const textBefore = textarea.value.substring(0, cursorPos);
      const textAfter = textarea.value.substring(cursorPos);
      textarea.value = textBefore + "\n" + textAfter;
      textarea.selectionEnd = cursorPos + 1;
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const parentForm = e.currentTarget.form;
      parentForm?.requestSubmit();
    }

    onKeyDown?.(e);
  }

  return (
    // <div className=" min-w-[50vw] w-full">
      <TextArea
        {...props}
        ref={ref}
        
        name={name}
        onKeyDown={handleKeyDown}

        className={twMerge(
          "custom-scrollbar prompt-inp max-h-56 w-full resize-none rounded-[25px] border px-6 py-3 font-medium placeholder-shown:h-[calc(3rem+2px)] placeholder-shown:truncate invalid:border-error invalid:ring-error focus:outline-none",
          className
        )}
      />
    // </div>
  );
});

PromptInput.displayName = "PromptInput";
