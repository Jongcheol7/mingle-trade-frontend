"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CryptoMain() {
  const router = useRouter();
  useEffect(() => {
    router.push("/crypto/freeboard");
  }, [router]);

  return <div></div>;
}
