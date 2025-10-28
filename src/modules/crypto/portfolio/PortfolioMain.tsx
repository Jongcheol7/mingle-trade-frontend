"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useUserStore } from "@/store/useUserStore";
import { portfolio } from "@/types/portfolio";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function PortfolioMain() {
  const { email } = useUserStore();
  const [portfolio, setPortfolio] = useState<portfolio[]>([]);
  useEffect(() => {
    if (!email) return;

    try {
      const getMyPortfolio = async () => {
        const res = await axios.get("api/portfolio/select", {
          params: { email },
        });
        console.log(res.data);
        return res.data;
      };
      getMyPortfolio();
    } catch (err) {
      toast.error("포트폴리오 조회 실패 " + err);
    }
  }, [email]);

  return (
    <div>
      <Card>
        <CardHeader></CardHeader>
        <CardContent>
          <ul>
            {/* {portfolio.map((p) => (
              <li key={p.id}>test</li>
            ())} */}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
