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

export default function AuthPopup({ setAuthVisible }: Props) {
  return (
    <div>
      <motion.div
        className="fixed z-50 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <Card className="bg-gray-200 w-[300px]">
          <CardHeader>
            <p className="text-center font-bold text-xl">
              Select Login Options
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <button
                className="p-2 rounded-md font-bold text-white bg-red-400 cursor-pointer"
                onClick={() =>
                  (window.location.href =
                    "http://localhost:8080/oauth2/authorization/google")
                }
              >
                Google Login
              </button>
              <button className="p-2 rounded-md font-bold text-white bg-yellow-400 cursor-pointer">
                Kakao Login
              </button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <button
              className="py-2 px-3 bg-gray-600 rounded-md text-white font-bold cursor-pointer"
              onClick={() => setAuthVisible(false)}
            >
              Cancel
            </button>
          </CardFooter>
        </Card>
      </motion.div>
      <motion.div
        className=" fixed inset-0 z-40 bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={() => setAuthVisible(false)}
      />
    </div>
  );
}
