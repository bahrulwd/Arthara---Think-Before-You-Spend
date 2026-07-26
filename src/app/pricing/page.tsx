"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PricingPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/#pricing");
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center text-white">
      <p className="text-sm text-text-secondary">Redirecting to single page...</p>
    </div>
  );
}
