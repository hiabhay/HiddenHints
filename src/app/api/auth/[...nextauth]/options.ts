//While it's possible to implement user authentication, JWT generation, and session management manually, using next-auth simplifies the process, ensuring security and providing a standardized framework. It helps you focus on building your application rather than dealing with the complexities and potential pitfalls of implementing authentication from scratch.

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs'
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
// import { error } from "console";

export const authOptions: NextAuthOptions = {
    providers: [

        //this is the syntax to access credentials (email, password), this can be changed if we are signing in via github/facebook or anything else
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "Your email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect()
                try {
                    const user = await UserModel.findOne({

                        //custom way provided by mongoose to check for either of the options : $or
                        $or: [
                            { email: credentials.identifier },

                            //for future, if we want to make the user login woth username as well
                            { username: credentials.identifier },
                        ]
                    })
                    if (!user) {
                        throw new Error("No User found with given credentials.")
                    }
                    if (!user.isVerified) {
                        throw new Error("Please verify your account first.")
                    }

                    //this is an inconsistency on the behalf of nextauth as the username/email is accessed via credentials.identifier but password can be directly accessed
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

                    if (isPasswordCorrect) {
                        return user
                    } else {
                        throw new Error("Incorrect Password")
                    }
                } catch (err: any) {
                    throw new Error(err)
                }
            }
        })
    ],
    callbacks: {

        //This callback is used to customize the JSON Web Token (JWT) that is generated during the sign-in process. Purpose : so that we dont need to query database again and again
        async jwt({ token, user }) {

            if (user) {
                token._id = user._id?.toString()
                token.isVerified = user.isVerified;
                token.isAcceptingMessage = user.isAcceptingMessage;
                token.username = user.username;
            }
            return token;
        },

        //This callback is used to customize the session object that is sent to the client. This session object is derived from the JWT.
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessage = token.isAcceptingMessage
                session.user.username = token.username
            }
            return session
        },
    },
    pages: {
        signIn: "/sign-in"
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
}