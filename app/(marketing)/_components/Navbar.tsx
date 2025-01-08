"use client";
import { useScrollTop } from "@/hooks/useScrollTop";
import { Poppins } from "next/font/google";
import { ModeToggle } from "@/components/ToggleTheme";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  useConvexAuth,
  Authenticated,
  Unauthenticated,
  AuthLoading,
} from "convex/react";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";

const poppins = Poppins({
  //   variable: "--font-poppins",
  subsets: ["latin"],
  weight: "500",
  fallback: [
    "-apple-system",
    "BlinkMacSystemFont",
    "Helvetica Neue",
    "Segoe UI",
    "Hiragino Sans GB",
    "sans-serif",
    "Apple Color Emoji",
    "Segoe UI Emoji",
    "Segoe UI Symbol",
    "Noto Color Emoji",
  ],
});

export default function Navbar() {
  // const { isLoading, isAuthenticated } = useConvexAuth();
  const scrolled = useScrollTop({ threshold: 10 });

  return (
    <nav className="fixed z-10 w-full bg-background">
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between gap-x-2 px-8 py-3 md:px-20 ${scrolled ? "border-b-2 border-border" : ""}`}
      >
        <div className="hidden sm:flex sm:items-center sm:gap-x-2">
          <img src="/favicon.svg" alt="logo" />
          <span className={poppins.className}>Jotion</span>
        </div>

        <div className="flex flex-1 items-center justify-between gap-x-3 sm:justify-end">
          <Unauthenticated>
            <SignInButton mode="modal">
              <Button>Sign in</Button>
            </SignInButton>

            <Link href="/">
              <Button variant="outline">Get Jotion free</Button>
            </Link>
          </Unauthenticated>

          <Authenticated>
            <div className="flex h-9 w-9 items-center justify-center">
              <UserButton />
            </div>

            <Link href="/documents">
              <Button variant="outline">Enter Jotion</Button>
            </Link>
          </Authenticated>

          <AuthLoading>
            <div className="flex items-center justify-center">
              <Spinner />
            </div>
          </AuthLoading>

          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}
