import Link from "next/link";
import { Mail } from "lucide-react";
import { Button } from "@/ui/components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/ui/components/card";

export default function VerifyEmailPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div>
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Check Your Email
            </CardTitle>
            <div className="flex justify-center">
              <Mail className="h-12 w-12 text-rose-500" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">
              We've sent a verification link to your email address. Please check
              your inbox and click the link to verify your account.
            </p>
            <div className="p-4 rounded-lg">
              <p className="text-sm text-center font-medium">
                If you don't see the email, check your spam folder.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full">Resend Verification Email</Button>
            <div className="text-center text-sm text-muted-foreground">
              <Link href="/login" className="hover:underline">
                Back to Login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
