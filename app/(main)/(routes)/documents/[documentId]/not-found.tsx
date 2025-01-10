"use client";

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-y-3 p-4">
      <img src="/404.svg" alt="404" className="max-w-40" />
      <p className="text-lg">Page not found</p>
    </div>
  );
}
