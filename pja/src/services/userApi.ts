import api from "../lib/axios";
import type { ApiResponse } from "../types/common";
import type {
  user,
  ChangePasswordRequest,
  ChangeNameRequest,
} from "../types/user";
//사용자 정보관련 api

// 사용자 정보 get
export const getuser = async (): Promise<ApiResponse<user>> => {
  try {
    const response = await api.get("/user/read-info");
    console.log("사용자 정보 조회 응답 : ", response.data);
    return response.data;
  } catch (error: any) {
    console.error("🔴 [getuser] 유저 정보 요청 실패:", error);

    if (error.response) {
      console.error("응답 상태코드:", error.response.status);
      console.error("서버 status:", error.response.data?.status);
      console.error("서버 message:", error.response.data?.message);
      // data는 응답이 없을 수도 문제가 생겨 안 올 수도 있음
      // 그래서 항상 방어적으로 data?.message 형태로 접근하는 것이 안전
    } else if (error.request) {
      console.error("요청은 보냈지만 응답 없음:", error.request);
    } else {
      console.error("요청 설정 중 에러 발생:", error.message);
    }

    throw error; // 호출한 쪽에서 이 에러를 다시 처리하도록 던짐
  }
};

//프로필 이미지 업데이트
export const updateProfileImage = async (
  file: File
): Promise<ApiResponse<null>> => {
  //FormData 객체를 생성해 파일을 닫음
  const formData = new FormData();
  formData.append("file", file);

  try {
    // axios가 formData를 전송할 때, Content-Type을 'multipart/form-data'로 자동 설정합니다.
    const response = await api.post("/user/profile-image", formData);
    console.log("프로필 이미지 업데이트 응답 : ", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "[updateProfileImage] 프로필 이미지 업데이트 요청 실패:",
      error
    );

    if (error.response) {
      console.error("응답 상태코드:", error.response.status);
      console.error("서버 status:", error.response.data?.status);
      console.error("서버 message:", error.response.data?.message);
    } else if (error.request) {
      console.error("요청은 보냈지만 응답 없음:", error.request);
    } else {
      console.error("요청 설정 중 에러 발생:", error.message);
    }
    throw error;
  }
};

//비밀번호 변경

export const changePassword = async (
  data: ChangePasswordRequest
): Promise<ApiResponse<null>> => {
  try {
    // 🔽 변경점: api.post를 api.patch로 변경했습니다.
    const response = await api.patch("/user/change-pw", data);
    console.log("비밀번호 변경 응답 : ", response.data);
    return response.data;
  } catch (error: any) {
    console.error(" [changePassword - PATCH] 비밀번호 변경 요청 실패:", error);

    if (error.response) {
      console.error("응답 상태코드:", error.response.status);
      console.error("서버 status:", error.response.data?.status);
      console.error("서버 message:", error.response.data?.message);
    } else if (error.request) {
      console.error("요청은 보냈지만 응답 없음:", error.request);
    } else {
      console.error("요청 설정 중 에러 발생:", error.message);
    }
    throw error;
  }
};

//이름 변경
export const changeName = async (
  data: ChangeNameRequest
): Promise<ApiResponse<null>> => {
  try {
    const response = await api.patch("/user/change-name", data);
    console.log("이름 변경 응답:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("[changeName - PATCH] 이름 변경 요청 실패:", error);

    if (error.response) {
      console.error("응답 상태코드:", error.response.status);
      console.error("서버 status:", error.response.data?.status);
      console.error("서버 message:", error.response.data?.message);
    } else if (error.request) {
      console.error("요청은 보냈지만 응답 없음:", error.request);
    } else {
      console.error("요청 설정 중 에러 발생:", error.message);
    }

    throw error;
  }
};
