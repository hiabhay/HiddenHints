import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const _user = session?.user;

    if (!session || !_user) {
      return new Response(
        JSON.stringify({ success: false, message: 'Not authenticated' }),
        { status: 401 }
      );
    }

    const userId = new mongoose.Types.ObjectId(_user._id);
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: { path: '$messages', preserveNullAndEmptyArrays: true } },
      { $sort: { 'messages.createdAt': -1 } },
      { $group: { _id: '$_id', messages: { $push: '$messages' } } },
    ]).exec();

    if (!user || user.length === 0) {
      return new Response(
        JSON.stringify({ message: 'User not found', success: false }),
        { status: 404 }
      );
    }

    const messages = user[0].messages.filter(Boolean);

    return new Response(
      JSON.stringify({ messages: messages, success: true }),
      { status: 200 }
    );
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error', success: false }),
      { status: 500 }
    );
  }
}

// import { getServerSession } from "next-auth";
// import { authOptions } from "../auth/[...nextauth]/options";
// import dbConnect from "@/lib/dbConnect";
// import UserModel from "@/model/User";
// import { User } from "next-auth";
// import mongoose from "mongoose";

// export async function GET(request: Request) {
//     await dbConnect();
//     //get currently loggedIn user
//     const session = await getServerSession(authOptions);

//     //we can extract user directly from session, as we have injected the user via api\auth\[...nextauth]\options.ts

//     //imported user from jwt to token, and then from token to session (refer option.ts)
//     const user: User = session?.user as User;

//     if (!session || !session.user) {
//         return Response.json(
//             {
//                 success: false,
//                 message: "Not authenticated",
//             },
//             { status: 401 }
//         );
//     }

//     //because the userid is in string format which would trouble us when using mongodb aggregation pipeline
//     const userId = new mongoose.Types.ObjectId(user._id);

//     try {

//         // $unwind: "$messages" : the $unwind stage is used to deconstruct an array field from the input documents to output a document for each element in the array. This means that if a document contains an array, the $unwind stage will create a separate document for each element in the array, effectively "flattening" the array

//         // flow of below code: 
//         // $match: first we got the user to match with the requested user
//         // $unwind: explained above
//         // $sort: sort the messages according to their date of creation
//         // $group: group all messages for a single user(as a single object)

//         const user = await UserModel.aggregate([
//             { $match: { id: userId } },
//             { $unwind: "$messages" },
//             { $sort: { 'messages.createdAt': -1 } },
//             { $group: { _id: '$_id', messages: { $push: '$messages' } } }
//         ])

//         if (!user || user.length === 0) {
//             return Response.json(
//                 {
//                     success: false,
//                     message: "User not found",
//                 },
//                 { status: 401 }
//             )
//         }

//         //the above user is an array
//         return Response.json(
//             {
//                 success: true,
//                 messages: user[0].messages,
//             },
//             { status: 200 }
//         )
//     } catch (error) {
//         console.log("Error getting user messages", error)
//         return Response.json(
//             {
//                 success: false,
//                 message: "Error getting user messages",
//             },
//             { status: 500 }
//         );
//     }
// }

