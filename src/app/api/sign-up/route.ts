import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect();

    try {

        const { username, email, password } = await request.json()

        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true,
        })

        if (existingUserVerifiedByUsername) {
            return Response.json({
                success: false,
                message: "Username already taken"
            }, { status: 400 })
        }

        const existingUserByEmail = await UserModel.findOne({ email })

        if (existingUserByEmail) {
            return Response.json({
                success: false,
                message: "Email already registered"
            }, { status: 400 })
        }
        else {
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()

            //can change the value of const because it is an object
            expiryDate.setHours(expiryDate.getHours() + 1)
            const verifyCode = 111111;

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCodeExpiry: expiryDate,
                isVerified: true,
                verifyCode,
                isAcceptingMessage: true,
                messages: []
            })

            await newUser.save();
        }

        return Response.json(
            {
                success: true,
                message: 'User registered successfully. Please Login.',
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error registering user:', error);
        return Response.json(
            {
                success: false,
                message: 'Error registering user',
            },
            { status: 500 }
        );
    }
}