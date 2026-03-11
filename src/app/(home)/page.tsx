import HomeMain from "@/modules/home/HomeMain";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense>
      <HomeMain />
    </Suspense>
  );
}
