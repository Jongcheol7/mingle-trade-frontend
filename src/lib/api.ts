import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 15000,
});

// 응답 인터셉터: { status, data, message } 패턴 자동 처리
api.interceptors.response.use(
  (response) => {
    const body = response.data;

    // 백엔드 표준 응답 형식인 경우
    if (body && typeof body === "object" && "status" in body) {
      if (body.status === "error") {
        const message = body.message || "요청 처리에 실패했습니다.";
        return Promise.reject(new Error(message));
      }
    }

    return response;
  },
  (error) => {
    if (error.code === "ECONNABORTED") {
      toast.error("요청 시간이 초과되었습니다.");
    } else if (!error.response) {
      toast.error("서버에 연결할 수 없습니다.");
    } else {
      const status = error.response.status;
      if (status === 401) {
        toast.error("로그인이 필요합니다.");
      } else if (status === 403) {
        toast.error("접근 권한이 없습니다.");
      } else if (status >= 500) {
        toast.error("서버 오류가 발생했습니다.");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
