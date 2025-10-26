import { create } from "zustand";

type Market = {
  market: "Upbit" | "Binance";
  setMarket: (val: Market["market"]) => void;
};

export const useCryptoMarketStore = create<Market>((set) => ({
  market: "Upbit",
  setMarket: (val) => set({ market: val }),
}));
