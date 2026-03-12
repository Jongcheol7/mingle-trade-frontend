import { useEffect, useRef } from "react";

type Options = {
  url: string;
  onMessage: (event: MessageEvent) => void;
  onOpen?: (ws: WebSocket) => void;
  enabled?: boolean;
  maxRetries?: number;
};

export function useReconnectingWebSocket({
  url,
  onMessage,
  onOpen,
  enabled = true,
  maxRetries = 5,
}: Options) {
  const wsRef = useRef<WebSocket | null>(null);
  const retryCountRef = useRef(0);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (!enabled) return;

    function connect() {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        retryCountRef.current = 0;
        onOpen?.(ws);
      };

      ws.onmessage = onMessage;

      ws.onclose = (event) => {
        // 정상 종료가 아닌 경우 재연결
        if (!event.wasClean && retryCountRef.current < maxRetries) {
          const delay = Math.min(1000 * 2 ** retryCountRef.current, 30000);
          retryCountRef.current += 1;
          retryTimerRef.current = setTimeout(connect, delay);
        }
      };

      ws.onerror = () => {
        ws.close();
      };
    }

    connect();

    return () => {
      retryCountRef.current = maxRetries; // 클린업 시 재연결 방지
      clearTimeout(retryTimerRef.current);
      wsRef.current?.close();
    };
  }, [url, enabled]); // eslint-disable-line react-hooks/exhaustive-deps

  return wsRef;
}
