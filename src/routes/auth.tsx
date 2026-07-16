import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  forgotPassword,
  login,
  register as registerAccount,
  resendOtp,
  resetPassword,
  verifyRegisterOtp,
} from "@/features/auth/services/authApi";
import {
  forgotPasswordSchema,
  loginSchema,
  otpSchema,
  resetPasswordSchema,
  signupSchema,
  type ForgotPasswordFormValues,
  type LoginFormValues,
  type OtpFormValues,
  type ResetPasswordFormValues,
  type SignupFormValues,
} from "@/features/auth/schemas/authSchemas";
import { getApiErrorMessage } from "@/lib/axios";
import { isAdminRole, useAuthStore } from "@/store/authStore";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Login – SRFOOD" }] }),
  component: AuthPage,
});

function PasswordInput({
  field,
  autoFocus,
}: {
  field: UseFormRegisterReturn;
  autoFocus?: boolean;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <Input type={visible ? "text" : "password"} className="pr-10" autoFocus={autoFocus} {...field} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}

function AuthPage() {
  const [pendingMobile, setPendingMobile] = useState<string | null>(null);
  const [forgotMode, setForgotMode] = useState(false);

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-center mb-6">Welcome to SRFOOD</h1>
      <div className="bg-card border rounded-2xl p-5">
        {forgotMode ? (
          <ForgotPasswordFlow onDone={() => setForgotMode(false)} />
        ) : (
          <Tabs defaultValue="login">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm onForgotPassword={() => setForgotMode(true)} />
            </TabsContent>
            <TabsContent value="signup">
              {pendingMobile ? (
                <OtpForm mobile={pendingMobile} />
              ) : (
                <SignupForm onRegistered={setPendingMobile} />
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}

function LoginForm({ onForgotPassword }: { onForgotPassword: () => void }) {
  const nav = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);
  const {
    register: field,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const { tokens, user } = await login(values.mobile, values.password);
      setSession(user, tokens.accessToken, tokens.refreshToken);
      toast.success(`Welcome back, ${user.name}`);
      nav({ to: isAdminRole(user.role) ? "/admin" : "/" });
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Invalid mobile number or password"));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="space-y-1.5">
        <Label>Mobile Number</Label>
        <Input inputMode="numeric" maxLength={10} placeholder="9876543210" {...field("mobile")} />
        {errors.mobile && <p className="text-xs text-destructive">{errors.mobile.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label>Password</Label>
        <PasswordInput field={field("password")} />
        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
      </div>
      <button
        type="button"
        onClick={onForgotPassword}
        className="block ml-auto text-xs text-primary hover:underline"
      >
        Forgot password?
      </button>
      <Button type="submit" className="w-full rounded-full" disabled={isSubmitting}>
        {isSubmitting ? "Logging in…" : "Login"}
      </Button>
    </form>
  );
}

function SignupForm({ onRegistered }: { onRegistered: (mobile: string) => void }) {
  const {
    register: field,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({ resolver: zodResolver(signupSchema) });

  const onSubmit = async (values: SignupFormValues) => {
    try {
      await registerAccount(values);
      toast.success("Account created — enter the OTP sent to your mobile");
      onRegistered(values.mobile);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not create account"));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="space-y-1.5">
        <Label>Full Name</Label>
        <Input {...field("name")} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label>Mobile Number</Label>
        <Input inputMode="numeric" maxLength={10} placeholder="9876543210" {...field("mobile")} />
        {errors.mobile && <p className="text-xs text-destructive">{errors.mobile.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label>Password</Label>
        <PasswordInput field={field("password")} />
        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
      </div>
      <Button type="submit" className="w-full rounded-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating account…" : "Create Account"}
      </Button>
    </form>
  );
}

function OtpForm({ mobile }: { mobile: string }) {
  const nav = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);
  const {
    register: field,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OtpFormValues>({ resolver: zodResolver(otpSchema) });

  const onSubmit = async (values: OtpFormValues) => {
    try {
      const { tokens, user } = await verifyRegisterOtp(mobile, values.code);
      setSession(user, tokens.accessToken, tokens.refreshToken);
      toast.success("Account verified!");
      nav({ to: "/" });
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Incorrect or expired OTP"));
    }
  };

  const handleResend = async () => {
    try {
      await resendOtp(mobile);
      toast.success("OTP resent");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not resend OTP"));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <p className="text-sm text-muted-foreground">Enter the 6-digit code sent to +91 {mobile}</p>
      <div className="space-y-1.5">
        <Label>OTP Code</Label>
        <Input inputMode="numeric" maxLength={6} {...field("code")} />
        {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
      </div>
      <Button type="submit" className="w-full rounded-full" disabled={isSubmitting}>
        {isSubmitting ? "Verifying…" : "Verify & Continue"}
      </Button>
      <button
        type="button"
        onClick={handleResend}
        className="w-full text-center text-xs text-primary hover:underline"
      >
        Resend OTP
      </button>
    </form>
  );
}

function ForgotPasswordFlow({ onDone }: { onDone: () => void }) {
  const [mobile, setMobile] = useState<string | null>(null);

  return mobile ? (
    <ResetPasswordForm mobile={mobile} onDone={onDone} onBack={() => setMobile(null)} />
  ) : (
    <ForgotMobileForm onSent={setMobile} onBack={onDone} />
  );
}

function ForgotMobileForm({
  onSent,
  onBack,
}: {
  onSent: (mobile: string) => void;
  onBack: () => void;
}) {
  const {
    register: field,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      await forgotPassword(values.mobile);
      toast.success("If this number is registered, an OTP has been sent");
      onSent(values.mobile);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not send OTP"));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <h2 className="font-bold text-lg">Reset your password</h2>
      <p className="text-sm text-muted-foreground">
        Enter your registered mobile number — we'll send an OTP to reset your password.
      </p>
      <div className="space-y-1.5">
        <Label>Mobile Number</Label>
        <Input inputMode="numeric" maxLength={10} placeholder="9876543210" {...field("mobile")} />
        {errors.mobile && <p className="text-xs text-destructive">{errors.mobile.message}</p>}
      </div>
      <Button type="submit" className="w-full rounded-full" disabled={isSubmitting}>
        {isSubmitting ? "Sending…" : "Send OTP"}
      </Button>
      <button
        type="button"
        onClick={onBack}
        className="w-full text-center text-xs text-muted-foreground hover:underline"
      >
        Back to login
      </button>
    </form>
  );
}

function ResetPasswordForm({
  mobile,
  onDone,
  onBack,
}: {
  mobile: string;
  onDone: () => void;
  onBack: () => void;
}) {
  const {
    register: field,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({ resolver: zodResolver(resetPasswordSchema) });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    try {
      await resetPassword(mobile, values.code, values.newPassword);
      toast.success("Password reset — please log in with your new password");
      onDone();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Incorrect or expired OTP"));
    }
  };

  const handleResend = async () => {
    try {
      await forgotPassword(mobile);
      toast.success("OTP resent");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not resend OTP"));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <h2 className="font-bold text-lg">Enter OTP & new password</h2>
      <p className="text-sm text-muted-foreground">
        Enter the 6-digit code sent to +91 {mobile} and choose a new password.
      </p>
      <div className="space-y-1.5">
        <Label>OTP Code</Label>
        <Input inputMode="numeric" maxLength={6} {...field("code")} />
        {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label>New Password</Label>
        <PasswordInput field={field("newPassword")} />
        {errors.newPassword && <p className="text-xs text-destructive">{errors.newPassword.message}</p>}
      </div>
      <Button type="submit" className="w-full rounded-full" disabled={isSubmitting}>
        {isSubmitting ? "Resetting…" : "Reset Password"}
      </Button>
      <div className="flex justify-between text-xs">
        <button type="button" onClick={handleResend} className="text-primary hover:underline">
          Resend OTP
        </button>
        <button type="button" onClick={onBack} className="text-muted-foreground hover:underline">
          Change number
        </button>
      </div>
    </form>
  );
}
