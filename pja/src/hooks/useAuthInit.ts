import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setAccessToken, clearAccessToken } from "../store/authSlice";
import { refreshAccessToken } from "../services/authApi";
import { useNavigate } from "react-router-dom";

//Base64URL을 일반 Base64로 변환해서 atob()를 사용
function base64UrlDecode(str: string) {
  // URL-safe -> standard Base64
  str = str.replace(/-/g, "+").replace(/_/g, "/");

  // Add padding if missing
  while (str.length % 4 !== 0) {
    str += "=";
  }

  return atob(str);
}

// 토큰 만료 확인
function isTokenExpired(token: string): boolean {
  try {
    const base64Payload = token.split(".")[1];
    const jsonPayload = base64UrlDecode(base64Payload);
    console.log("jsonPayload : ", jsonPayload);
    const payload = JSON.parse(jsonPayload);
    const exp = payload.exp;
    if (!exp) return true;
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
}

export function useAuthInit() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //토큰이 저장되는 동안 privateroute에서 토큰이 없다고 판단해서 리다이렉트된 것 같음
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    console.log("useEffect 호출됨");
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        if (!token || isTokenExpired(token)) {
          const response = await refreshAccessToken(); // 새 토큰 요청
          const accessToken = response.data?.accessToken;
          console.log("date :", accessToken);
          if (!accessToken) {
            console.warn("accessToken이 없음 - 토큰 갱신 실패 처리");
            throw new Error("토큰 갱신 실패 - accessToken 없음");
          } else {
            console.log("새 accessToken:", accessToken);
            dispatch(setAccessToken(accessToken));
          }
        } else {
          console.log("유효한 토큰");
          dispatch(setAccessToken(token));
        }
      } catch (err) {
        console.warn("토큰 갱신 실패", err);
        dispatch(clearAccessToken());
        // window.location.href = "/login";
        return;
      }
      setAuthInitialized(true);
    };
    initializeAuth();
  }, [dispatch, navigate]);
  return authInitialized;
}
