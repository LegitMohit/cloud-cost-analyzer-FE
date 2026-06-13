"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { toast } from "sonner";

interface User {
  email: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  logout: () => {},
  refreshUser: async () => {},
});

const protectedPaths = [
  "/aws",
  "/costs",
  "/recommendations",
  "/connect-aws",
  "/change-password",
];

const isProtectedPath = (pathname: string) =>
  protectedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [pathname, setPathname] = useState<string | null>(null);

  const refreshUser = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
        localStorage.removeItem("token");
      }
    } catch {
      setUser(null);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Logged out successfully");
    window.location.href = "/login";
  }, []);

  useEffect(() => {
    if (!pathname) {
      return;
    }

    const token = localStorage.getItem("token");
    const currentLocation = `${pathname}${window.location.search}`;

    if (isProtectedPath(pathname) && !token) {
      window.location.href = `/login?redirect=${encodeURIComponent(currentLocation)}`;
      return;
    }

    refreshUser();
  }, [pathname, refreshUser]);

  useEffect(() => {
    if (!pathname || !loading || !isProtectedPath(pathname) || user) {
      return;
    }

    const currentLocation = `${pathname}${window.location.search}`;
    window.location.href = `/login?redirect=${encodeURIComponent(currentLocation)}`;
  }, [loading, pathname, user]);

  const isProtected = pathname ? isProtectedPath(pathname) : true;
  const shouldRenderChildren = !isProtected || (!loading && !!user);

  return (
    <UserContext.Provider value={{ user, loading, logout, refreshUser }}>
      {shouldRenderChildren ? children : null}
    </UserContext.Provider>
  );
}