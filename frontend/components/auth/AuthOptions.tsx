import Image from "next/image";
import { cva, type VariantProps } from "class-variance-authority";
import { signIn } from "next-auth/react";

import { cn } from "@/lib/utils";

type Provider = "google" | "github" | "facebook"; // Add more providers as needed

const authOptionsVariants = cva(
  "w-full rounded-md px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 transform transition-all duration-200 ease-in-out hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      provider: {
        google:
          "bg-white text-gray-700 hover:bg-white border border-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700",
        github:
          "bg-gray-800 text-white hover:bg-gray-900 border border-gray-800 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-800",
        facebook:
          "bg-blue-600 text-white hover:bg-blue-700 border border-blue-600 dark:bg-blue-700 dark:text-gray-100 dark:border-blue-700",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
      },
    },
    defaultVariants: {
      provider: "google",
      size: "default",
    },
  },
);

type Props = {
  disabled?: boolean;
  provider?: Provider;
} & VariantProps<typeof authOptionsVariants>;

const AuthOptions = ({ disabled, provider = "google", size }: Props) => {
  const providerDetails = {
    google: {
      icon: "/google-icon.svg",
      text: "Continue with Google",
    },
    github: {
      icon: "",
      text: "Continue with GitHub",
    },
    facebook: {
      icon: "",
      text: "Continue with Facebook",
    },
  };

  const { icon, text } = providerDetails[provider];

  return (
    <button
      type="button"
      onClick={() => signIn(provider)}
      disabled={disabled}
      className={cn(authOptionsVariants({ provider, size }))}
    >
      <div className="flex items-center justify-center gap-3">
        {icon && (
          <Image
            src={icon}
            alt={`${provider} icon`}
            width={20}
            height={20}
            className="h-5 w-5"
          />
        )}
        <span>{text}</span>
      </div>
    </button>
  );
};
export default AuthOptions;
