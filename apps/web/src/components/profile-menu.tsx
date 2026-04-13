"use client";

import { useState, useRef, useEffect } from "react";
import { User2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "./userProvider";

function getInitialFromEmail(email?: string) {
  if (!email) return "U";
  const localPart = email.split("@")[0];
  if (!localPart) return "U";
  return localPart.charAt(0).toUpperCase();
}

export function ProfileMenu() {
  const { user, loading, logout } = useUser();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dialogRef.current &&
        !dialogRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    router.push("/");
  };

  const handleLogin = () => {
    setOpen(false);
    router.push("/login");
  };

  const handleChangePassword = () => {
    setOpen(false);
    router.push("/change-password" as any);
  };

  if (loading) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-700">
        <div className="h-4 w-4 animate-pulse rounded-full bg-zinc-400 dark:bg-zinc-500" />
      </div>
    );
  }

  const initial = getInitialFromEmail(user?.email);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm font-semibold text-white transition hover:border-violet-400/30 hover:bg-white/10"
        aria-label={user?.email ? `Profile menu for ${user.email}` : "Open profile menu"}
      >
        {user ? (
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-violet-500/15 text-violet-200">
            {initial}
          </span>
        ) : (
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-zinc-200">
            <User2 className="h-5 w-5" />
          </span>
        )}
      </button>

      {open && (
        <div
          ref={dialogRef}
          className="absolute right-0 top-full z-50 mt-3 w-56 rounded-2xl border border-white/10 bg-[#090A0F] p-2 shadow-2xl shadow-black/40 backdrop-blur-xl"
        >
          {user ? (
            <>
              <div className="border-b border-zinc-200 px-3 py-2 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
                {user.email}
              </div>
              <button
                onClick={handleChangePassword}
                className="mt-1 w-full rounded-md px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Change Password
              </button>
              <button
                onClick={handleLogout}
                className="mt-1 w-full rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={handleLogin}
              className="w-full rounded-md px-3 py-2 text-left text-sm text-zinc-800 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              Login
            </button>
          )}
        </div>
      )}
    </div>
  );
}