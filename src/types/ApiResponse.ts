import { Message } from "@/model/User";

export interface ApiResponse{
    success: boolean,
    message: String,
    isAcceptingMessage?: boolean,
    messages?: Array<Message>
}

