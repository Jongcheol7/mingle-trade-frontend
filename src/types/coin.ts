export type CoinInfo = {
  closeDate: string;
  symbol: string;
  prevClosePrice: number;
  price: number;
  rate: number;
  volume: number;
  logoUrl: string;
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

export type UpbitCoinPairs = {
  market: string;
  korean_name: string;
  english_name: string;
};

export type UpbitStreamTicker = {
  type: "ticker"; // 메시지 타입 (항상 "ticker")
  code: string; // 종목 코드 (예: "KRW-BTC")
  trade_price: number; // 현재가
  opening_price: number; // 시가
  high_price: number; // 고가
  low_price: number; // 저가
  prev_closing_price: number; // 전일 종가
  change: "RISE" | "FALL" | "EVEN"; // 등락 상태
  change_price: number; // 전일 대비 변화 금액
  change_rate: number; // 전일 대비 변화율 (0.01 = 1%)
  signed_change_price: number; // 부호가 있는 등락 금액
  signed_change_rate: number; // 부호가 있는 등락률 (0.01 = 1%)
  trade_volume: number; // 체결 거래량
  acc_trade_volume: number; // 누적 거래량
  acc_trade_volume_24h: number; // 24시간 누적 거래량
  acc_trade_price: number; // 누적 거래대금
  acc_trade_price_24h: number; // 24시간 누적 거래대금
  acc_bid_volume: number; // 누적 매수량
  acc_ask_volume: number; // 누적 매도량
  ask_bid: "ASK" | "BID"; // 매수/매도 구분
  highest_52_week_price: number; // 52주 최고가
  highest_52_week_date: string; // 52주 최고가 일자 (YYYY-MM-DD)
  lowest_52_week_price: number; // 52주 최저가
  lowest_52_week_date: string; // 52주 최저가 일자 (YYYY-MM-DD)
  market_state: string; // 시장 상태 ("ACTIVE" 등)
  market_warning: string; // 유의 종목 여부 ("NONE" 등)
  is_trading_suspended: boolean; // 거래 정지 여부
  delisting_date: string | null; // 상장폐지 예정일 (없으면 null)
  trade_date: string; // 거래 일자 (YYYYMMDD)
  trade_time: string; // 거래 시간 (HHmmss)
  trade_timestamp: number; // 거래 타임스탬프
  timestamp: number; // 전체 타임스탬프
  stream_type: string; // 데이터 스트림 타입 ("SNAPSHOT" | "REALTIME")
};
