import NextAuth from "next-auth/next"
import { authOptions } from "./options"

// Default Exports: Use import DefaultExport from "module" when the module exports a default value, such as a class, function, or main object.

// Named Exports: Use import { NamedExport } from "module" when the module exports specific named items that you want to import individually


const handler = NextAuth(authOptions)

//handler: This variable is assigned the result of calling NextAuth with authOptions. In this context, NextAuth is likely a function that takes configuration options (authOptions) and returns a handler or middleware function for authentication purposes.

export { handler as GET, handler as POST }

// /Exporting handler under different names (GET and POST) can be useful in scenarios where you want to handle different HTTP methods or operations using the same underlying logic or function. This approach allows you to maintain a single entry point (handler) for authentication logic while exposing it to different routes or endpoints in your application.