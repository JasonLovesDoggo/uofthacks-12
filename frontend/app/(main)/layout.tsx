import { SessionProvider } from "next-auth/react";

import { auth } from "@/lib/auth";
import Navbar from "@/components/Navbar";

type Props = {
  children: React.ReactNode;
};

const MainLayout = async ({ children }: Props) => {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <Navbar />
      <main className="mt-20">{children}</main>
    </SessionProvider>
  );
};

export default MainLayout;
