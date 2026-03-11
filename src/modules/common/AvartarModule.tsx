import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = {
  src: string;
};

export default function AvartarModule({ src }: Props) {
  return (
    <Avatar className="w-6 h-6 border border-border shadow-sm">
      <AvatarImage src={src} />
      <AvatarFallback className="text-xs font-bold bg-muted text-muted-foreground">
        {""}
      </AvatarFallback>
    </Avatar>
  );
}
