import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helper/sendVerificationEmail";
import { success } from "zod";
import { fa } from "zod/locales";
import { stat } from "fs";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "user already exits with this email",
          },
          { status: 400 }
        );
      }else{
        const hasedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hasedPassword;
        existingUserByEmail.verifyCode = verifyCode
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
        await existingUserByEmail.save()

      }
    } else {
      // new user h use phla database me register karna pde ga
      const hasedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hasedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      await newUser.save();
    }

    // send verification email

    const emailResponse = sendVerificationEmail(email, username, verifyCode);

    // ek bar isko check krna h jab test kru ga

    if (!(await emailResponse).success) {
      return Response.json(
        {
          success: false,
          message: (await emailResponse).message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "user register successfully please verify your email",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("error regestring user", error);
    return Response.json(
      {
        success: false,
        message: "error regestring user",
      },
      {
        status: 500,
      }
    );
  }
}
