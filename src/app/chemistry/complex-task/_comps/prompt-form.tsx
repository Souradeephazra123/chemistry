"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

import { Button } from "@/components/ui/button";
import { PROMPT_FORM_CLASS, PromptInput } from "@/components/ui/prompt-input";
// import { toastError } from "@/components/ui/toast";
// import { useMutateSWRCache } from "@/hooks/use-infinite-list";
import { ToastContainer, toast } from "react-toastify";
import Image from "next/image";

interface PromptFormProps {
  children: React.ReactNode;
  defaultPrompt?: string;
}

// function autoFormatText(text:string) {
//   let formattedText = text;

//   // Heuristic 1: Convert lines that are fully enclosed in ** to a small heading.
//   // This regex checks if the entire line starts and ends with ** and captures the inner text.
//   formattedText = formattedText.replace(/^\\*\\*(.+)\\*\\*$/gm, '### $1');

//   // Heuristic 2: Wrap potential chemical formulas with LaTeX delimiters.
//   // This simple pattern looks for words containing at least one digit.
//   formattedText = formattedText.replace(/\b([A-Z][a-z]*\\d+[A-Za-z0-9]*)\\b/g, '\\($1\\)');

//   // Heuristic 3: Bold headings that start with "###" (if needed).
//   formattedText = formattedText.replace(/^(### .+)$/gm, '**$1**');

//   // Additional formatting rules can be added here

//   return formattedText;
// }

function formatText(text: string) {
  // Split the text into lines
  const lines = text.split("\n");

  const formattedLines = lines.map((line) => {
    let trimmed = line.trim();
    let processedLine = line; // Start with the original line

    // Rule 1: Lines starting with "###" -> Bold & large text
    if (trimmed.startsWith("###")) {
      // Remove leading '#' characters and any following whitespace
      let content = trimmed.replace(/^#+\s*/, "");
      // Apply chemical formula wrapping to the content
      content = content.replace(
        /\b([A-Z][a-z]*\d+[A-Za-z0-9]*)\b/g,
        "\\($1\\)"
      );
      // Wrap in a div with large, bold styling
      return `<div style="font-size:24px; font-weight:bold;">${content}</div>`;
    }

    // Rule 2: Lines that start and end with "**" -> Slight bold & medium text
    if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
      // Remove the wrapping "**" from both ends
      let content = trimmed.slice(2, -2).trim();
      // Apply chemical formula wrapping to the content
      content = content.replace(
        /\b([A-Z][a-z]*\d+[A-Za-z0-9]*)\b/g,
        "\\($1\\)"
      );
      // Wrap in a div with medium, bold styling
      return `<div style="font-size:18px; font-weight:bold;">${content}</div>`;
    }

    // Rule 3: For all other text, wrap potential chemical formulas with LaTeX delimiters.
    processedLine = processedLine.replace(
      /\b([A-Z][a-z]*\d+[A-Za-z0-9]*)\b/g,
      "\\($1\\)"
    );

    return processedLine;
  });

  // Join the processed lines back into a single string.
  return formattedLines.join("\n");
}

export function PromptForm({ children, defaultPrompt }: PromptFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [reset, setReset] = useState<boolean>(false);
  // const refreshHistory = useMutateSWRCache("/generate/gen-video/api/history");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    const userInput = new FormData(e.currentTarget).get("prompt") as string;
    setInput(userInput);
    if (!userInput) {
      toast.error("Please enter a prompt");
    } else {
      const resp = await fetch(
        `/chemistry/complex-task/api?userInput=${userInput}&reset=${reset}`,
        {
          method: "POST",
        }
      );
      if (resp.ok) {
        const { answer } = (await resp.json()) as {
          answer: string;
        };

        const formattedAnswer = answer;
        console.log(formattedAnswer);
        setData((prev) => [
          ...prev,
          "\n \n \n Next part \n \n \n",
          formattedAnswer,
        ]);
      } else {
        toast.error("Failed to generate video ad");
        console.error(((await resp.json()) as { error: unknown }).error);
      }
    }
    setIsLoading(false);
  };

  return (
    <div className=" p-10">
      <form
        onSubmit={handleSubmit}
        className={twMerge(
          PROMPT_FORM_CLASS,
          "max-w-[52rem] items-center gap-8 md:flex-col"
        )}
      >
        {children}
        <PromptInput
          defaultValue={"Explain this mechanism"}
          placeholder="What would you like to question me?"
        />

        <div className=" flex gap-5">
          <Button
            type="submit"
            isDisabled={isLoading}
            className="shrink-0 max-md:w-full"
          >
            Generate
          </Button>
          <Button
            type="submit"
            variant="danger"
            onPress={() => setReset(true)}
            isDisabled={isLoading}
            className="shrink-0 max-md:w-full"
          >
            Reset Conversation
          </Button>
        </div>
        <ToastContainer />
      </form>
      <div>
        <div className="w-full ">
          <div className=" max-w-1/2 flex flex-col gap-3 justify-end items-end bg-[#433e3e] p-2 rounded-md">
            <p>{input}</p>
          </div>
        </div>
        <h2>Response</h2>
        <pre className=" text-wrap bg-[#433e3e] p-2 rounded-md">{data}</pre>
      </div>
    </div>
  );
}
