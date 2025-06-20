import api from "../lib/axios";
import type { ApiResponse } from "../types/common";
import type { workspace } from "../types/workspace";
import type { setworkspace } from "../types/workspace";
//워크스페이스 관련 api

//내 워크스페이스 가져오기
export const getmyworkspaces = async (): Promise<ApiResponse<workspace>> => {
  try {
    const response = await api.get("/workspaces");
    console.log("myworkspace", response.data);
    return response.data;
  } catch (error: any) {
    console.error("🔴 [getmyworkspaces] 워크스페이스 정보 요청 실패:", error);

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

//워크스페이스 단일 조회
export const getworkspace = async (workspaceId: number): Promise<ApiResponse<workspace>> => {
  try {
    const response = await api.get(`/workspaces/${workspaceId}`);
    console.log("Select workspace", response.data);
    return response.data;
  } catch (error: any) {
    console.error("🔴 [getworkspace] 워크스페이스 단일 정보 요청 실패:", error);

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
}

//워크스페이스 생성하기
export const addworkspace = async ({
  projectName,
  teamName,
  isPublic,
}: setworkspace): Promise<ApiResponse<workspace>> => {
  try {
    const response = await api.post("/workspaces", {
      projectName,
      teamName,
      isPublic,
    });
    return response.data;
  } catch (error: any) {
    console.error("🔴 [addworkspace] 워크스페이스 생성 실패:", error);

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

//워크스페이스 진행도 수정
export const progressworkspace = async (
  workspaceId: number,
  progressStep: string
) => {
  try {
    const response = await api.patch(`workspaces/${workspaceId}/progress`, {
      progressStep,
    });
    return response.data;
  } catch (error: any) {
    console.error("🔴 [addworkspace] 워크스페이스 진행도 수정 실패:", error);

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

//워크스페이스 진행도 완료
export const completeworkspace = async (workspaceId: number) => {
  try {
    const response = await api.patch(
      `workspaces/${workspaceId}/progress/complete`
    );
    return response.data;
  } catch (error: any) {
    console.error("🔴 [addworkspace] 워크스페이스 완료 실패:", error);

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

//워크스페이스 삭제
export const deleteworkspace = async (workspaceId: number) => {
  try {
    const response = await api.delete(`workspaces/${workspaceId}`);
    return response.data;
  } catch (error: any) {
    console.error("🔴 [addworkspace] 워크스페이스 삭제 실패:", error);

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
