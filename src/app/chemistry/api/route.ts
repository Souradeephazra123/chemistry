import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { generateStoryline } from "../_actions/generate-storyline";
import path from "path";
import fs from "fs/promises";

export const dynamic = "force-dynamic";

async function uploadImage(file: File) {
  const uploadDir = process.env.UPLOAD_DIR || "public/images";
  const fileName = "img1.png"; //sanitize the file name
  const fileExtension = fileName.split(".").pop() || "";
  const allowedExtensions = ["jpg", "jpeg", "png", "webp"];
  if (!allowedExtensions.includes(fileExtension)) {
    console.error("Only jpg, jpeg, png, webp files are allowed");
    return;
  }

  const filePath = path.join(uploadDir, fileName);
  // Use fs to write the file
  const buffer = Buffer.from(await file.arrayBuffer());
  console.log("Buffer", buffer);
   await fs.writeFile(filePath, buffer);
//   console.log("file uplaoding", res);
  console.log("File uploaded to", filePath);
  //   await file.mv(filePath);
  console.log("File uploaded to", filePath);
}

async function removefile(filePath: string) {
  try {
    await fs.unlink(filePath);
    console.log("File removed", filePath);
  } catch (error) {
    console.error("Error removing file", error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const userInput = req.nextUrl.searchParams.get("userInput");
    const reset = req.nextUrl.searchParams.get("reset") === "true";

    const formData = await req.formData();
    const image = formData.get("file") as File;
    console.log("Image", image);
    // await uploadImage(image);
    // const imgName = image.name;
    if (!userInput) {
      return NextResponse.json({ error: "Invalid Input" }, { status: 400 });
    }

    const answer = await generateStoryline(userInput,reset,image);

    console.log("Answer", answer);

    // Remove the file after processing
    // const uploadDir = process.env.UPLOAD_DIR || "public/images";
    // const fileName = "img1.jpg";
    // const filePath = path.join(uploadDir, fileName);
    // await removefile(filePath);


    return Response.json({ answer: answer });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
