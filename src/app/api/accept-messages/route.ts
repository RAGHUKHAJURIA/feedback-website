import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";
import { success } from "zod";

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "not authenticated",
      },
      { status: 401 }
    );
  }

  const userId = user._id; // conditon if user is undefined later i will remove condtion after api check
  const acceptMessages = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        isAcceptingMessage: acceptMessages,
      },
      { new: true }
    );

    if(!updatedUser){
        return Response.json(
      {
        success: false,
        message: "error updating user to accept message",
      },
      { status: 401 }
    );
    }

    return Response.json(
      {
        success: true,
        message: "user updated to accept messages",
        updatedUser
      },
      { status: 200 }
    );

  } catch (error) {
    console.log("error updating user to accept message");
    return Response.json(
      {
        success: false,
        message: "error updating user to accept message",
      },
      { status: 500 }
    );
  }
}

export async function GET(request:Request) {
    await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "not authenticated",
      },
      { status: 401 }
    );
  }

  const userId = user._id; // conditon if user is undefined later i will remove condtion after api check

  try {
    const foundUser = await UserModel.findById(userId)

  if(!foundUser){
    return Response.json(
      {
        success: false,
        message: "user not found",
      },
      { status: 404 }
    );
  }

  return Response.json(
      {
        success: true,
        isAcceptingMessage: foundUser.isAcceptingMessage
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("error updating user to accept message");
    return Response.json(
      {
        success: false,
        message: "error in getting message update status",
      },
      { status: 500 }
    );
  }

}
