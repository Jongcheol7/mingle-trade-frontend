import CryptoNav from "@/modules/crypto/CryptoNav";
import { LayoutProp } from "@/types/common";

export default function Layout({ children }: LayoutProp) {
  return (
    <div>
      <CryptoNav />
      {children}
    </div>
  );
}
