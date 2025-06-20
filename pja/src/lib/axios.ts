import axios from "axios";
import { setAccessToken, clearAccessToken } from "../store/authSlice";
import { store } from "../store/store";
import { refreshAccessToken } from "../services/authApi";

const MAX_RETRIES = 3;

// 1. axios 인스턴스 생성
const api = axios.create({
  baseURL: "/api", // 백엔드 API 기본 주소
  withCredentials: true, // 쿠키 전송 허용
});

//  2. 요청 인터셉터 설정: 요청 전에 JWT 토큰 자동 삽입
api.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let pendingRequests: (() => void)[] = [];

// 3. 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 네트워크 에러 + 재시도 횟수 제한 체크
    if (!originalRequest._retryCount && error.message === "Network Error") {
      originalRequest._retryCount = 0;
    }

    if (
      error.message === "Network Error" &&
      originalRequest._retryCount < MAX_RETRIES
    ) {
      originalRequest._retryCount += 1;
      // 재시도 전 약간 대기 (exponential backoff 적용 가능)
      await new Promise((res) =>
        setTimeout(res, 500 * originalRequest._retryCount)
      );
      return api(originalRequest);
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isRefreshing
    ) {
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await refreshAccessToken(); // 🔄 accessToken 재발급
        const accessToken = response.data?.accessToken ?? null;
        store.dispatch(setAccessToken(accessToken));
        pendingRequests.forEach((cb) => cb()); // 대기 중인 요청 재실행
        pendingRequests = [];
        isRefreshing = false;

        // 원래 요청에 새 토큰 설정하고 재시도
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        // 재발급 실패 → 로그아웃 처리
        store.dispatch(clearAccessToken());
        pendingRequests = [];
        isRefreshing = false;
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // 동시에 여러 요청이 실패했을 경우 → 재발급 완료 후 재시도
    if (error.response?.status === 401 && isRefreshing) {
      return new Promise((resolve) => {
        pendingRequests.push(() => {
          const token = store.getState().auth.accessToken;
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(api(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

export default api;
