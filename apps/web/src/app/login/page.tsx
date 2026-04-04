import { SignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const { userId } = await auth();
  
  if (userId) {
    redirect("/");
  }
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4">
      <SignIn fallbackRedirectUrl="/" signUpFallbackRedirectUrl="/" />
    </div>
  );
}
