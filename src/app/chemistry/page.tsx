"use client";
import React from "react";
import { PromptForm } from "./_comps/prompt-form";
import { Link } from "react-aria-components";

const page = () => {
  return (
    <div>
      <PromptForm>
        <div className=" flex gap-40 text-purple-500">
          <Link href="/chemistry/complex-task" className=" ">
            Do more complex task
          </Link>
          <p className=" text-white text-3xl font-bold">Your chemistry Tutor</p>
        </div>
      </PromptForm>
    </div>
  );
};

export default page;
