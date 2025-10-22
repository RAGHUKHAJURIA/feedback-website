import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";
import UserModel from "@/models/User";
import { json, success, z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UserNameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    // console.log(searchParams)
    const queryParams = {
      username: searchParams.get("username"),
    };
    
    const result = UserNameQuerySchema.safeParse(queryParams);
    console.log(result);
    if(!result.success){
        const userNameErrors = z.flattenError(result.error).fieldErrors.username || [];
        return Response.json({
            success : false,
            message: 'Username must be atleast 2 character'
        }, {status: 400})
    }

    const {username} = result.data
    const existingVerifiedUser = await UserModel.findOne({username, isVerified: true});

    if(existingVerifiedUser){
        return Response.json({
            success: false,
            message: 'Username is already taken'
        }, {status: 400})
    }

    return Response.json({
        success: true,
        message: 'Username is available'
    }, {status: 200})

  } catch (error) {
    console.log("Error checking username: ", error);
    return Response.json(
      {
        success: false,
        message: "Error checking username",
      },
      { status: 500 }
    );
  }
}
