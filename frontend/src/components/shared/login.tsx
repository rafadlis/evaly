"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetCallbackUrl } from "@/hooks/use-get-callback-url";
import { authClient } from "@/lib/auth.client";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [redirecting, setRedirecting] = useTransition();

  const callbackURL = useGetCallbackUrl();

  if (redirecting) {
    return <div className="text-lg font-medium">Redirecting...</div>;
  }

  if (otp !== null) {
    return (
      <Card className="z-50 max-w-md w-full">
        <CardHeader>
          <CardTitle>Verify your email</CardTitle>
          <CardDescription>
            Enter the 6 digit code sent to your email
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 border-t border-dashed">
          <form
            onSubmit={async (e) => {
              e.preventDefault();

              setLoading(true);
              const res = await authClient.signIn.emailOtp({
                email,
                otp,
              });
              setLoading(false);

              if (res.error) {
                toast.error(res.error?.message || "Something went wrong");
                return;
              }

              if (res.data?.user) {
                setRedirecting(() => {
                  router.replace(callbackURL || "/dashboard");
                });
              }

              console.log(res.data);
            }}
            className="grid gap-4"
          >
            <div className="grid gap-2">
              <Label htmlFor="otp">Enter the OTP</Label>
              <InputOTP
                maxLength={6}
                onChange={(e) => {
                  setOtp(e);
                }}
                value={otp || ""}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <Label>
                Please enter the one-time password sent to your email.
              </Label>
            </div>
            <Button
              type="submit"
              className="w-full mt-4"
              disabled={loading || redirecting}
            >
              {loading || redirecting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="z-50 max-w-md w-full">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Enter your email to sign in</CardDescription>
      </CardHeader>
      <CardContent className="pt-6 border-t border-dashed">
        <form
          onSubmit={async (e) => {
            e.preventDefault();

            setLoading(true);
            const res = await authClient.emailOtp.sendVerificationOtp({
              email,
              type: "sign-in",
            });
            setLoading(false);

            if (!res.data?.success) {
              toast.error(res.error?.message || "Something went wrong");
              return;
            }

            setOtp("");
          }}
          className="grid gap-4"
        >
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              disabled={loading}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
            />
          </div>
          <Button type="submit" className="w-full mt-4" disabled={loading}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Login"}
          </Button>
          <div className="flex flex-wrap items-center gap-2 w-full">
            <Button
              variant="outline"
              type="button"
              className="gap-2 flex-1 w-full py-4"
              onClick={async () => {
                await authClient.signIn.social({
                  provider: "google",
                  callbackURL:
                    callbackURL || `${window.location.origin}/dashboard`,
                });
              }}
            >
              <GoogleIcon />
              Continue with Google
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
export default LogIn;

const GoogleIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      className="w-5 h-5"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
};
