import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function DELETE(request: Request, {params}: {params: {messageid: string}}) {
    const messageId = params.messageid
    await dbConnect();
    //get currently loggedIn user
    const session = await getServerSession(authOptions);

    //we can extract user directly from session, as we have injected the user via api\auth\[...nextauth]\options.ts

    //imported user from jwt to token, and then from token to session (refer option.ts)
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not authenticated",
            },
            { status: 401 }
        );
    }

    try {
        const updateResult = await UserModel.updateOne(
            {_id: user._id},
            {$pull: {messages: {_id: messageId}}}
        )
        if(updateResult.modifiedCount === 0){
            return Response.json(
                {
                    success: false,
                    message: "Message not found or is already deleted.",
                },
                { status: 404 }
            );
        }
        return Response.json(
            {
                success: true,
                message: "Message deleted.",
            },
            { status: 200 }
        );
    } catch (error) {
        console.log("Error in delete message route", error)
        return Response.json(
            {
                success: false,
                message: "Error deleting message",
            },
            { status: 500 }
        );
    }
    
}