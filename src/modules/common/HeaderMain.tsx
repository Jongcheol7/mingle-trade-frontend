import Image from "next/image";
import NavLink from "./NavLink";

export default function HeaderMain() {
  return (
    <div className="flex justify-between">
      <div className="flex items-center gap-1">
        <Image src={"/mingle_logo.png"} alt="로고" width={50} height={50} />
        <h1>Mingle Trade</h1>
      </div>
      <div className="flex gap-2">
        <NavLink href={"/"}>암호화폐</NavLink>
        <NavLink href={"/"}>주식</NavLink>
      </div>
      <div>
        <p>로그인</p>
        <p>로그아웃</p>
      </div>
    </div>
  );
}
