export function timeTransform(time: Date) {
  const koreanDate = new Date(time).toLocaleDateString("ko-KR", {
    timeZone: "Asia/Seoul",
  });
  const koreanTime = new Date(time).toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return { date: koreanDate, time: koreanTime };
}
