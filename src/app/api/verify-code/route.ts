import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, code } = await request.json();

        //just in case the uri is not properly read(spaces %20, etc)
        const decodedUsername = decodeURIComponent(username);

        const user = await UserModel.findOne({ username: decodedUsername })
        if (!user) {
            console.error("User not found")
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 500 })
        }

        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        // if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true
            await user.save();
            return Response.json({
                success: true,
                message: "Account verified successfully"
            }, { status: 200 })
        if (!isCodeNotExpired) {
            return Response.json({
                success: false,
                message: "Verification code expired, please signup again to get a new code"
            }, { status: 400 })
        } else{
            return Response.json({
                success: false,
                message: "Incorrect verification code"
            }, { status: 400 })
        }


    } catch (error) {
        console.error("Error verifying user", error)
        return Response.json({
            success: false,
            message: "Error verifying user"
        }, { status: 500 })
    }
}