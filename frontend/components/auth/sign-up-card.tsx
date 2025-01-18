import { Card } from "@/components/ui/card";

import AuthFooter from "./auth-footer";
import SignUpForm from "./sign-up-form";

export function SignUpCard() {
  return (
    <Card
      variant="dots"
      title="Create Account"
      description="Welcome! Please enter your details to get started."
      className="bg-gray-50"
    >
      <div className="mt-4 space-y-8">
        <SignUpForm />
        <AuthFooter showSignUp={false} />
      </div>
    </Card>
  );
}
