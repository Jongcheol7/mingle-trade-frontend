import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { usePortfolioUpdate } from "@/hooks/crypto/portfolio/usePortfolioReactQuery";
import { useUserStore } from "@/store/useUserStore";
import { portfolio } from "@/types/portfolio";
import { motion } from "framer-motion";
import { RefreshCcw } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type Props = {
  portfolio: portfolio;
  name: string;
  setVisibleEdit: (val: boolean) => void;
};

type FormData = {
  enterPrice: number;
  quantity: number;
};

export default function PortfolioEdit({
  portfolio,
  name,
  setVisibleEdit,
}: Props) {
  const { register, reset, handleSubmit, watch } = useForm({
    defaultValues: {
      enterPrice: portfolio.enterPrice,
      quantity: portfolio.quantity,
    },
  });
  const { mutate } = usePortfolioUpdate();
  const { email } = useUserStore();
  const enterPrice = watch("enterPrice");
  const quantity = watch("quantity");
  const evalValue = Number(enterPrice || 0) * Number(quantity || 0);

  const onSubmit = (data: FormData) => {
    if (!email) {
      toast.error("이메일이 없습니다.");
      return;
    }
    mutate({
      enterPrice: data.enterPrice,
      quantity: data.quantity,
      email: email,
      symbol: portfolio.symbol,
    });

    setVisibleEdit(false);
  };

  return (
    <div>
      <motion.div
        className="fixed z-50 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <Card className="w-[350px]">
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardHeader className="flex justify-between mb-3">
              <div className="flex items-center space-x-3">
                <Avatar className=" w-6 h-6 border-1 border-white shadow-md">
                  <AvatarImage
                    src={
                      `https://static.upbit.com/logos/${portfolio.symbol.toUpperCase()}.png` ||
                      "/default_profile.png"
                    }
                  />
                  <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-amber-300 to-yellow-400 text-white">
                    {""}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-lg">{name}</p>
                  <p className="text-sm text-gray-500">{portfolio.symbol}</p>
                </div>
              </div>
              <div className="flex items-center">
                <button
                  className="p-2 rounded-full hover:bg-gray-100"
                  onClick={(e) => {
                    e.preventDefault();
                    reset({
                      enterPrice: portfolio.enterPrice,
                      quantity: portfolio.quantity,
                    });
                  }}
                >
                  <RefreshCcw className="w-5 h-5" />
                </button>
                <button
                  className="p-2 bg-gray-300 rounded-md cursor-pointer hover:bg-gray-400 transition-all"
                  type="submit"
                >
                  저장
                </button>
              </div>
            </CardHeader>
            <CardContent className="text-[17px] text-gray-700">
              <div className="flex gap-2 justify-between">
                <label>평균매수가 :</label>
                <input
                  className="text-right"
                  {...register("enterPrice", { valueAsNumber: true })}
                />
              </div>
              <div className="flex gap-2 justify-between">
                <label>수량 :</label>
                <input
                  className="text-right"
                  {...register("quantity", { valueAsNumber: true })}
                />
              </div>
              <div className="flex gap-2 justify-between">
                <label>매수총금액 :</label>
                <p>{evalValue.toLocaleString()}</p>
              </div>
            </CardContent>
          </form>
        </Card>
      </motion.div>
      <motion.div
        className="fixed inset-0 z-40 bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={() => setVisibleEdit(false)}
      />
    </div>
  );
}
