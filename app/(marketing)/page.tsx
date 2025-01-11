"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import {
  useConvexAuth,
  Authenticated,
  Unauthenticated,
  AuthLoading,
} from "convex/react";
import { Spinner } from "@/components/ui/spinner";

const poppins = Poppins({
  variable: "--font-poppins",
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

export default function MarketingPage() {
  const { user } = useUser();

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-8 sm:px-20">
      <main className="flex flex-col items-center gap-5 pb-4 pt-16 text-center md:pt-24">
        <h1 className="mt-8 text-2xl font-bold sm:text-4xl lg:text-5xl">
          Your ideas, Documents & Plans Unified.
          <br />
          Welcome to <span className="underline decoration-[3px]">Jotion</span>
        </h1>
        <h3 className="text-lg sm:text-2xl">
          Jotion is the connected workspace where better, faster work happens.
        </h3>
        <div>
          <AuthLoading>
            <Spinner />
          </AuthLoading>

          <Unauthenticated>
            <Link href="/">
              <Button>
                Get Jotion Free <ArrowRight />
              </Button>
            </Link>
          </Unauthenticated>

          <Authenticated>
            <p className="py-2 text-lg">Hi, {user?.firstName} </p>
            <Link href="/documents">
              <Button>
                Enter Jotion <ArrowRight />
              </Button>
            </Link>
          </Authenticated>
        </div>

        <div className="flex max-w-3xl items-center justify-center gap-4">
          <div className="hidden sm:block sm:basis-[30%]">
            <img src="/landing_page2.svg" alt="landing_page2" />
          </div>

          <div className="sm:basis-[70%]">
            <img src="/landing_page1.svg" alt="landing_page1" />
          </div>
        </div>
      </main>

      <footer className="py-3 sm:flex sm:justify-between sm:gap-x-2">
        <div className="hidden sm:flex sm:items-center sm:gap-2">
          <img src="/favicon.svg" alt="logo" />
          <span className={poppins.className}>Jotion</span>
        </div>

        <div className="flex items-center justify-end gap-3 text-sm font-light">
          <span className="cursor-pointer">Terms of Service</span>
          <span className="cursor-pointer">Privacy Policy</span>
        </div>
      </footer>
    </div>
  );
}
