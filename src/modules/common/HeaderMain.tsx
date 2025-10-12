"use client";
import Image from "next/image";
import NavLink from "./NavLink";

export default function HeaderMain() {
  return (
    <div className="flex justify-between mb-8">
      <div className="flex items-center gap-2">
        <Image src={"/mingle_logo.png"} alt="로고" width={50} height={50} />
        <h1 className="font-bold text-2xl">Mingle Trade</h1>
      </div>
      <div className="flex gap-3 absolute left-1/2 -translate-x-1/2">
        <NavLink href={"/crypto"}>암호화폐</NavLink>
        <NavLink href={"/stock"}>주식</NavLink>
      </div>
      <div>
        <p>로그인</p>
        <p>로그아웃</p>
      </div>
    </div>
  );
}
