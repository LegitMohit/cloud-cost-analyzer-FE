import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SSOCallback() {
  const { userId } = await auth();
  
  if (userId) {
    redirect("/");
  }
  
  redirect("/login");
}