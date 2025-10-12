import NavLink from "../common/NavLink";

export default function StockNav() {
  return (
    <div>
      <div className="flex gap-3 absolute left-1/2 -translate-x-1/2">
        <NavLink href={"/crypto"}>암호화폐</NavLink>
        <NavLink href={"/stock"}>주식</NavLink>
      </div>
    </div>
  );
}
