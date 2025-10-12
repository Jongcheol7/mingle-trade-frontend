export function formatVolume(num: number) {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2) + "B"; // 10억 이상
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + "M"; // 백만 이상
  if (num >= 1_000) return (num / 1_000).toFixed(2) + "K"; // 천 이상
  return num.toFixed(2);
}
