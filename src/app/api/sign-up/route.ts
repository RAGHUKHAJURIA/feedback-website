import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helper/sendVerificationEmail";
import { success } from "zod";
import { fa } from "zod/locales";

export async function POST(request: Request) {
    await dbConnect()

    try {
        const {username, email, password} = await request.json()
    } catch (error) {
        console.error("error regestring user", error);
        return Response.json(
            {
                success: false,
                message: 'error regestring user'
            },
            {
                status: 500
            }
        )
    }
}

