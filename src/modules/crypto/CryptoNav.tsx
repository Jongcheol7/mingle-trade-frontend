import NavLink from "../common/NavLink";

export default function CryptoNav() {
  return (
    <nav className="flex pl-8 bg-amber-50/70 border-b border-amber-100 mb-5">
      <div className="flex gap-8 h-10 items-center">
        <NavLink href="/crypto/news">코인뉴스</NavLink>
        <NavLink href="/crypto/freeBoard">자유게시판</NavLink>
      </div>
    </nav>
  );
}
