import Link from "next/link";

type Props = {
  showSignIn?: boolean;
  showSignUp?: boolean;
  showResetPassword?: boolean;
  showContactUs?: boolean;
  customSignInLabel?: string;
};

const AuthFooter = ({
  showSignIn = true,
  showSignUp = true,
  showResetPassword = true,
  showContactUs = true,
  customSignInLabel,
}: Props) => {
  return (
    <div className="flex flex-col space-y-3">
      {showSignIn && (
        <p className="text-center text-sm text-muted-foreground">
          {customSignInLabel || "Already have an account?"}{" "}
          <Link
            href="/sign-in"
            className="font-medium text-primary transition-all hover:text-primary/80 hover:underline"
          >
            Sign In
          </Link>
        </p>
      )}
      {showSignUp && (
        <p className="text-center text-sm text-muted-foreground">
          New to FlowShield?{" "}
          <Link
            href="/sign-up"
            className="font-medium text-primary transition-all hover:text-primary/80 hover:underline"
          >
            Sign Up
          </Link>
        </p>
      )}
      <div className="flex items-center justify-around">
        {/* {showResetPassword && (
          <Link
            href="/forgot-password"
            className="text-center text-sm font-medium text-primary transition-all hover:text-primary/80 hover:underline"
          >
            Forgot your password?
          </Link>
        )} */}
      </div>
    </div>
  );
};

export default AuthFooter;
