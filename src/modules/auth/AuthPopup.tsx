import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { motion } from "framer-motion";

type Props = {
  setAuthVisible: (val: boolean) => void;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AuthPopup({ setAuthVisible }: Props) {
  return (
    <div>
      <motion.div
        className="fixed z-50 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="bg-card w-[320px] shadow-xl border border-border">
          <CardHeader>
            <p className="text-center font-bold text-xl text-foreground">
              로그인
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <button
                className="p-2.5 rounded-lg font-semibold text-white bg-[#ea4335] hover:bg-[#d33426] transition-colors cursor-pointer"
                onClick={() =>
                  (window.location.href =
                    `${API_URL}/oauth2/authorization/google`)
                }
              >
                Google 로그인
              </button>
              <button className="p-2.5 rounded-lg font-semibold text-[#3c1e1e] bg-[#fee500] hover:bg-[#f5dc00] transition-colors cursor-pointer">
                Kakao 로그인
              </button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <button
              className="py-2 px-4 bg-muted rounded-lg text-muted-foreground font-semibold hover:bg-muted/80 transition-colors cursor-pointer"
              onClick={() => setAuthVisible(false)}
            >
              취소
            </button>
          </CardFooter>
        </Card>
      </motion.div>
      <motion.div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={() => setAuthVisible(false)}
      />
    </div>
  );
}
