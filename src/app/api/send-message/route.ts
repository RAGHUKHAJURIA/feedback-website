import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { Message } from "@/models/User";
import { success } from "zod";
import { fa } from "zod/locales";

export async function POST(request: Request) {
  await dbConnect();

  const { username, content } = await request.json();

  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "user not found",
        },
        { status: 400 }
      );
    }

    // is user accepting the messages or not
    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: "user is not accepting the messages",
        },
        { status: 403 }
      );
    }

    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message);
    await user.save();
    return Response.json(
      {
        success: true,
        message: "message sent successully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("error adding message ", error);
    return Response.json(
      {
        success: false,
        message: "error adding message",
      },
      { status: 500 }
    );
  }
}
