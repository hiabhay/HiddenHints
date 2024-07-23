import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(email: string, username: string, verifyCode: string): Promise<ApiResponse> {
    try {
        console.log("Attempting to send verification email to:", email);
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Verification Code | Invisibuzz',
            react: VerificationEmail({username, otp: verifyCode}),
        });
        console.log("Verification email sent successfully to:", email);
        return { success: true, message: "Verification email sent successfully" };
    } catch (emailError) {
        console.error("Error sending verification email to:", email, emailError);
        return { success: false, message: "Failed to send verification email" };
    }
}
