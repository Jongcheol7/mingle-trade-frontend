import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = {
  src: string;
};

export default function AvartarModule({ src }: Props) {
  return (
    <Avatar className="w-6 h-6 border-1 border-white shadow-md">
      <AvatarImage src={src} />
      <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-amber-300 to-yellow-400 text-white">
        {""}
      </AvatarFallback>
    </Avatar>
  );
}
