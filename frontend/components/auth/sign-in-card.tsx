import { Card } from "@/components/ui/card";

import AuthFooter from "./auth-footer";
import SignInForm from "./sign-in-form";

export function SignInCard() {
  return (
    <Card
      variant="dots"
      title="Welcome Back"
      description="Sign in to continue to your account"
      className="bg-gray-50"
    >
      <div className="mt-4 space-y-8">
        <SignInForm />
        <AuthFooter showSignIn={false} />
      </div>
    </Card>
  );
}
