import "next-auth";
import { DefaultSession } from "next-auth";


//cannot directly interface packages


// The next-auth.d.ts file is used to extend the default types provided by next-auth with your custom user properties. This is useful when you need to add additional fields to the User object and access them in the jwt and session callbacks.

//This is extending the User interface provided by next-auth with your custom properties by declaring a module augmentation. This allows to add additional fields to the User interface that next-auth uses, making it possible to include these fields in JWT and session objects.

declare module "next-auth" {
    interface User {
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessage?: boolean;
        username?: string
    }
    interface Session {
        user: {
            _id?: string,
            isVerified?: boolean;
            isAcceptingMessage?: boolean;
            username?: string
        } & DefaultSession['user']

        //DefaultSession['user']: This part includes the properties from the default user object in the session, such as name, email, and image. 
        //Custom Properties: You add your own properties like _id, isVerified, isAcceptingMessage, and username.
    }
}


//another way to do the same work as above
declare module 'next-auth/jwt' {
    interface JWT {
        _id?: string,
        isVerified?: boolean;
        isAcceptingMessage?: boolean;
        username?: string
    }
}