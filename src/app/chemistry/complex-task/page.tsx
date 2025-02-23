// model: "o3-mini",
// reasoning_effort: "high",

import React from "react";
import { PromptForm } from "./_comps/prompt-form";

const page = () => {
  return (
    <div>
      <PromptForm>
        <p className=" text-white text-3xl font-bold">Do more complex task</p>
      </PromptForm>
    </div>
  );
};

export default page;
