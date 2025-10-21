import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

export async function POST(request: Request) {
  await dbConnect();

  try {
    console.log(request);
    const { username, code } = await request.json();
    const decodedUsernaem = decodeURIComponent(username);

    const user = await UserModel.findOne({ username: decodedUsernaem });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 500 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        {
          success: true,
          message: "User verified success",
        },
        { status: 200 }
      );
    }else if(!isCodeNotExpired){
        return Response.json(
        {
          success: false,
          message: "verification code has expired, please sighup again to get a code",
        },
        { status: 400 }
      );
    }else{
        return Response.json(
        {
          success: false,
          message: "please enter a valid code",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log("Error verifying user ", error);
    return Response.json(
      {
        success: false,
        message: "Error verifying user",
      },
      { status: 500 }
    );
  }
}
