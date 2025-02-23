// @ts-nocheck
// @ts-ignore
"use server";

import { generateObject } from "ai";
import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import OpenAI from "openai";
import { v2 as cloudinary } from "cloudinary";
import { v4 as uuidv4 } from "uuid";
import stream from "stream";

import { google } from "@ai-sdk/google";

import { z } from "zod";

const VideoAdGenResponseSchema = z.object({
  answer: z.string(),
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Reads API key from environment variable
});

const gemini2FlashExpModel = google("gemini-2.0-flash-exp");

/**
 * Generates a detailed storyline for a video advertisement based on the provided user input.
 *
 * @param videoAdGenId - The ID of the video ad generation record.
 * @param userInput - The subject or theme of the video advertisement for which the storyline is to be generated.
 */

async function uploadImageToCloudinary(buffer, uid) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { public_id: uid },
      (error, result) => {
        if (error) {
          console.error("Error uploading to Cloudinary:", error);
          reject({ status: "500", msg: error.message });
        } else {
          console.log("Upload successful:", result);
          resolve({ status: "200", url: result.secure_url });
        }
      }
    );

    const readableStream = new stream.PassThrough();
    readableStream.end(buffer);
    readableStream.pipe(uploadStream);
  });
}

async function uploadImage(filePath: string, file) {
  try {
    // if (!filePath) {
    //   return { msg: "No files were uploaded." };
    // }

    const buffer = Buffer.from(await file.arrayBuffer());
    console.log("Buffer", buffer);
    //upload to cloudinary
    // Configuration
    cloudinary.config({
      cloud_name: "dsgpbsrxt",
      api_key: "124451358676636",
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Upload an image
    const uid = uuidv4();
    // const uploadResult = await cloudinary.uploader
    //   .upload(filePath, {
    //     public_id: uid,
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });

    // const uploadResult = await cloudinary.uploader.upload_stream(
    //   { public_id: uid },
    //   function (error, result) {
    //     if (error) {
    //       console.log(result, error);
    //       return { status: "500", msg: error.message };
    //     }
    //     return result;
    //   }
    // );

    const uploadResult = await uploadImageToCloudinary(buffer, uid);
    console.log("uploadResult", uploadResult);
    // const readableStream = new stream.PassThrough();
    // readableStream.end(buffer);
    // readableStream.pipe(uploadResult);

    if (uploadResult && uploadResult.url) {
      return { status: "200", url: uploadResult.url };
    } else {
      return { status: "500", msg: "Image upload failed." };
    }
  } catch (error) {
    console.error(error);
    return { status: "500", msg: (error as Error).message };
  }
}

export async function generateStoryline(
  userInput: string,
  reset: boolean,
  file
) {
  try {
    const systemPrompt = `You are a student of M.Sc. chemistry final year in IIT Bombay, you have to provide of these questions

i will provide you images organic reaction , you have to analyze , from a reactant to product, you have to show mechanism by providing answer
Describe every step involves here, why this mechanism is preferred, means why feasible

`;
    if (!systemPrompt) {
      throw new Error("Advt. Video Base Prompt' missing in system prompts");
    }

    const userPrompt = userInput;

    // const imageFolderPath = path.resolve("public/images");

    // if (!fs.existsSync(imageFolderPath)) {
    //   fs.mkdirSync(imageFolderPath);
    // }
    //get all images in this folder
    // let images = fs.readdirSync(imageFolderPath);

    // console.log("images", images[0]);

    const imagePath = "";
    const imgUrl = await uploadImage(imagePath, file);
    console.log("imgUrl", imgUrl);

    const messages = [
      {
        role: "system",
        content: `You are an expert in MSc-level chemistry. Analyze the given image and provide a detailed response based on the user’s input.
	  I will provide you images of organic reactions, you have to analyze them, from reactant to product, and show the mechanism by providing an answer.
	  Describe every step involved, explain why this mechanism is preferred, and why it is feasible.`,
      },
    ];

    // Function to add user input and AI responses to the conversation
    interface MessageContent {
      type: string;
      text?: string;
      image_url?: { url: string };
    }

    interface Message {
      role: string;
      contents: MessageContent | MessageContent[];
    }

    function addMessage(role, content) {
      messages.push({ role, content });
    }

    // Add user input and image
    addMessage("user", [
      { type: "text", text: userPrompt },
      { type: "image_url", image_url: { url: imgUrl.url } },
    ]);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
    });

    addMessage("assistant", completion.choices[0].message["content"]);

    function resetConversation() {
      messages.length = 0; // Clears the existing messages
      messages.push({
        role: "system",
        content: `You are an expert in MSc-level chemistry. Analyze the given image and provide a detailed response based on the user’s input.
        I will provide you images of organic reactions, you have to analyze them, from reactant to product, and show the mechanism by providing an answer.
        Describe every step involved, explain why this mechanism is preferred, and why it is feasible.`,
      });
    }
    if (reset) {
      resetConversation();
    }

    return completion.choices[0].message["content"];
  } catch (error) {
    console.error("Error in generateStoryline", error);
  }
}

export async function generateStorylineReasoning(
  userInput: string,
  reset: boolean,

) {
  try {
    const systemPrompt = `You are a student of M.Sc. chemistry final year in IIT Bombay, you have to provide of these questions

i will provide you images organic reaction , you have to analyze , from a reactant to product, you have to show mechanism by providing answer
Describe every step involves here, why this mechanism is preferred, means why feasible

`;
    if (!systemPrompt) {
      throw new Error("Advt. Video Base Prompt' missing in system prompts");
    }

    const userPrompt = userInput;

    // const imageFolderPath = path.resolve("public/images");

    // if (!fs.existsSync(imageFolderPath)) {
    //   fs.mkdirSync(imageFolderPath);
    // }
    //get all images in this folder
    // let images = fs.readdirSync(imageFolderPath);

    // console.log("images", images[0]);

    const messages = [
      {
        role: "system",
        content: `You are an expert in MSc-level chemistry. Analyze the given image and provide a detailed response based on the user’s input.
	  I will provide you images of organic reactions, you have to analyze them, from reactant to product, and show the mechanism by providing an answer.
	  Describe every step involved, explain why this mechanism is preferred, and why it is feasible.`,
      },
    ];

    // Function to add user input and AI responses to the conversation
    interface MessageContent {
      type: string;
      text?: string;
      image_url?: { url: string };
    }

    interface Message {
      role: string;
      contents: MessageContent | MessageContent[];
    }

    function addMessage(role, content) {
      messages.push({ role, content });
    }

    // Add user input and image
    addMessage("user", [{ type: "text", text: userPrompt }]);

    const completion = await openai.chat.completions.create({
      model: "o3-mini",
      reasoning_effort: "high",
      messages: messages,
    });

    addMessage("assistant", completion.choices[0].message["content"]);

    function resetConversation() {
      messages.length = 0; // Clears the existing messages
      messages.push({
        role: "system",
        content: `You are an expert in MSc-level chemistry. Analyze the given image and provide a detailed response based on the user’s input.
        I will provide you images of organic reactions, you have to analyze them, from reactant to product, and show the mechanism by providing an answer.
        Describe every step involved, explain why this mechanism is preferred, and why it is feasible.`,
      });
    }
    if (reset) {
      resetConversation();
    }

    return completion.choices[0].message["content"];
  } catch (error) {
    console.error("Error in generateStoryline", error);
  }
}
