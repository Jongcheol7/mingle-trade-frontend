export type CoinInfo = {
  closeDate: string;
  symbol: string;
  prevClosePrice: number;
  price: number;
  rate: number;
  volume: number;
};

export type BinanceStreamTicker = {
  e: "24hrTicker"; // 이벤트 타입
  E: number; // 이벤트 시간 (timestamp)
  s: string; // 심볼 (예: BTCUSDT)
  p: string; // 가격 변화량
  P: string; // 가격 변화율 (%)
  w: string; // 가중 평균 가격
  x: string; // 첫 거래 가격 (24시간 전)
  c: string; // 현재 가격 (마지막 거래)
  Q: string; // 마지막 거래 수량
  b: string; // 현재 매수 호가
  B: string; // 매수 호가 수량
  a: string; // 현재 매도 호가
  A: string; // 매도 호가 수량
  o: string; // 시가
  h: string; // 최고가
  l: string; // 최저가
  v: string; // 거래량 (base asset)
  q: string; // 거래량 (quote asset)
  O: number; // 통계 시작 시간
  C: number; // 통계 종료 시간
  F: number; // 첫 거래 ID
  L: number; // 마지막 거래 ID
  n: number; // 거래 횟수
};
