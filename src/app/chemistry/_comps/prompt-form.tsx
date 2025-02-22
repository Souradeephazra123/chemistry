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

export function PromptForm({ children, defaultPrompt }: PromptFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<string[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [input, setInput] = useState("");
  const [reset, setReset] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
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
      console.log("User image", image);
      const formData = new FormData();
      if (image) {
        formData.append("file", image);
      }
      const resp = await fetch(
        `/chemistry/api?userInput=${userInput}&reset=${reset}`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (resp.ok) {
        const { answer } = (await resp.json()) as {
          answer: string;
        };

        console.log(answer);
        setData((prev) => [...prev, "\n \n \n Next part \n \n \n", answer]);
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
          defaultValue={defaultPrompt ?? ""}
          placeholder="What would you like to question me?"
        />
        <input
          type="file"
          name="image"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              const file = e.target.files[0];
              setImage(e.target.files[0]);

              const reader = new FileReader();
              reader.onload = () => {
                if (reader.readyState === 2) {
                  setPreviewImage(reader.result as string);
                }
              };
              reader.readAsDataURL(file);
            }
          }}
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
            {image && (
              <Image
                src={previewImage as string}
                alt="image"
                width={500}
                height={240}
              />
            )}
            <p>{input}</p>
          </div>
        </div>
        <h2>Response</h2>
        <pre className=" text-wrap bg-[#433e3e] p-2 rounded-md">{data}</pre>
      </div>
    </div>
  );
}
