"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MethodologyPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/#methodology");
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center text-white">
      <p className="text-sm text-text-secondary">Redirecting to single page...</p>
    </div>
  );
}
