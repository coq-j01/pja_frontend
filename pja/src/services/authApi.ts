import api from "../lib/axios";
import type { ApiResponse } from "../types/common";
import type { userToken } from "../types/auth";
import axios from "axios";

export const login = async (
  uid: string,
  password: string
): Promise<ApiResponse<userToken>> => {
  const response = await api.post<ApiResponse<userToken>>("/auth/login", {
    uid,
    password,
  });
  return response.data;
};

export const logoutUser = async (): Promise<ApiResponse<void>> => {
  try {
    const response = await api.post("/auth/logout");
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        error.response.data?.message || `서버 오류 (${error.response.status})`
      );
    }
    if (error.message.includes("fetch")) {
      throw new Error(
        "서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요."
      );
    }
    if (error.message.includes("CORS")) {
      throw new Error("CORS 오류가 발생했습니다. 서버 설정을 확인해주세요.");
    }
    throw error;
  }
};

//토큰 재요청
export const refreshAccessToken = async (): Promise<
  ApiResponse<{ accessToken: string }>
> => {
  try {
    console.log("토큰 재요청api 시작");
    const response = await api.post("/auth/reissue");
    console.log("response : ", response);

    return response.data; // { accessToken: "..." }
  } catch (error: any) {
    console.error("🔴 [refreshAccessToken] 토큰 재발급 실패:", error);

    // AxiosError라면 응답 메시지 출력
    if (error.response) {
      console.error("응답 상태코드:", error.response.status);
      console.error("응답 데이터:", error.response.data);
    } else if (error.request) {
      console.error("요청은 보냈지만 응답 없음:", error.request);
    } else {
      console.error("요청 설정 중 에러 발생:", error.message);
    }

    throw error; // 호출한 곳에서 다시 처리할 수 있도록 재던짐
  }
};

//아이디 찾기
export interface FindIdSuccessResponse {
  status: "success";
  message: string;
  data: {
    uid: string;
  };
}

//*
// @param
// @returns
//@throws */

export const findIdByEmail = async (
  email: string
): Promise<FindIdSuccessResponse> => {
  try {
    const response = await api.post<FindIdSuccessResponse>("/auth/find-id", {
      email,
    });
    //성공 시 response.data를 그대로 반환
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    //네트워크 오류 등 예외 상황 처리
    throw new Error("서버와 통신하는 데 실패했습니다. 네트워크를 확인해주세요");
  }
};

//비밀번호 찾기 인증번호 발송
export interface RequestPwCodeSuccessResponse {
  status: "success";
  message: string;
  data: null;
}

export const requestPasswordCode = async (
  uid: string,
  email: string
): Promise<RequestPwCodeSuccessResponse> => {
  try {
    const response = await api.post<RequestPwCodeSuccessResponse>(
      "/auth/find-pw",
      {
        uid,
        email,
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      //백엔드가 보내주는 구체적인 실패 메세지를 에러로 전달
      throw new Error(error.response.data.message);
    }
    //네트워크 오류 등 예외 상황 처리
    throw new Error("서버와 통신하는 데 실패했습니다. 네트워크를 확인해주세요");
  }
};

//인증 번호 확인
export interface VerifyCodeSuccessReponse {
  status: "success";
  message: string;
  data: null;
}

export const verifyPasswordCode = async (
  email: string,
  token: string //API명세서에 맞춰서 'token'으로 명시
): Promise<VerifyCodeSuccessReponse> => {
  try {
    const response = await api.post<VerifyCodeSuccessReponse>(
      "/auth/verify-pw-code",

      {
        email,
        token,
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      //백엔드가 보내주는 에러 메시지
      throw new Error(error.response.data.message);
    }
    //네트워크 오류 등 예외 상황 처리
    throw new Error("서버와 통신하는 데 실패했습니다. 네트워크를 확인해주세요");
  }
};

//비밀번호 변경

export const changePassword = async (
  uid: string,
  newPw: string,
  confirmPw: string
): Promise<ApiResponse<void>> => {
  try {
    const response = await axios.patch<ApiResponse<void>>(
      "http://localhost:8080/api/auth/change-pw",
      {
        uid,
        newPw,
        confirmPw,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("서버와 통신하는 데 실패했습니다. 네트워크를 확인해주세요");
  }
};
