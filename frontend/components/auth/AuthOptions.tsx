import Image from "next/image";
import { signIn } from "next-auth/react";

import { cn } from "@/lib/utils";

type Provider = "google" | "github" | "facebook"; // Add more providers as needed

type Props = {
  disabled?: boolean;
  provider?: Provider;
};

const AuthOptions = ({ disabled, provider = "google" }: Props) => {
  const getProviderDetails = (provider: Provider) => {
    switch (provider) {
      case "google":
        return {
          icon: "/google-icon.svg",
          text: "Continue with Google",
          bgColor: "bg-white",
          textColor: "text-gray-700",
          hoverBg: "hover:bg-gray-50",
          borderColor: "border-gray-300",
          darkBg: "dark:bg-gray-800",
          darkText: "dark:text-gray-100",
          darkBorder: "dark:border-gray-700",
        };
      // Add cases for other providers
      default:
        return {
          icon: "",
          text: "Continue",
          bgColor: "bg-white",
          textColor: "text-gray-700",
          hoverBg: "hover:bg-gray-50",
          borderColor: "border-gray-300",
          darkBg: "dark:bg-gray-800",
          darkText: "dark:text-gray-100",
          darkBorder: "dark:border-gray-700",
        };
    }
  };

  const {
    icon,
    text,
    bgColor,
    textColor,
    hoverBg,
    borderColor,
    darkBg,
    darkText,
    darkBorder,
  } = getProviderDetails(provider);

  return (
    <button
      type="button"
      onClick={() => signIn(provider)}
      disabled={disabled}
      className={cn(
        "w-full rounded-md px-4 py-2 text-sm font-medium shadow-sm",
        "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
        "transform transition-all duration-200 ease-in-out hover:scale-[1.02]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        bgColor,
        textColor,
        hoverBg,
        borderColor,
        darkBg,
        darkText,
        darkBorder,
      )}
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
