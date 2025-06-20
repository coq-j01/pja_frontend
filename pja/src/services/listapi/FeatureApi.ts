import api from "../../lib/axios";
import type { ApiResponse } from "../../types/common";
//기능 관련 api

//기능 생성 -> 생성된 기능 기본키 반환
export const addfeature = async (
  workspaceId: number,
  categoryId: number,
  name: string
): Promise<ApiResponse<number>> => {
  try {
    console.log("기능 생성 api");
    const response = await api.post(
      `/workspaces/${workspaceId}/project/category/${categoryId}/feature`,
      {
        name,
        state: false, //false넣으면 오류남,,
        hasTest: false,
      }
    );
    console.log("기능 생성 :", response);
    return response.data;
  } catch (error: any) {
    console.error("🔴 [addfeature] 기능 생성 실패:", error);

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

//기능 이름 수정
export const patchfeaturename = async (
  workspaceId: number,
  categoryId: number,
  featureId: number,
  name: string
) => {
  try {
    console.log("기능 이름 수정 api");
    await api.patch(
      `/workspaces/${workspaceId}/project/category/${categoryId}/feature/${featureId}`,
      {
        name,
      }
    );
  } catch (error: any) {
    console.error("🔴 [patchfeaturename] 기능 이름 수정 실패:", error);

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

//기능 상태 수정
export const patchfeaturestate = async (
  workspaceId: number,
  categoryId: number,
  featureId: number,
  state: boolean
) => {
  try {
    console.log("기능 상태 수정 api");
    await api.patch(
      `/workspaces/${workspaceId}/project/category/${categoryId}/feature/${featureId}`,
      {
        state,
      }
    );
  } catch (error: any) {
    console.error("🔴 [patchfeaturestate] 기능 상태 수정 실패:", error);

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

//기능 순서 수정
export const patchfeatureorder = async (
  workspaceId: number,
  categoryId: number,
  featureId: number,
  orderIndex: number
) => {
  try {
    console.log("기능 순서 수정 api");
    await api.patch(
      `/workspaces/${workspaceId}/project/category/${categoryId}/feature/${featureId}`,
      {
        orderIndex,
      }
    );
  } catch (error: any) {
    console.error("🔴 [patchfeatureorder] 기능 순서 수정 실패:", error);

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

//기능 테스트 수정
export const patchfeaturetest = async (
  workspaceId: number,
  categoryId: number,
  featureId: number,
  hasTest: boolean
) => {
  try {
    console.log("기능 테스트 수정 api");
    await api.patch(
      `/workspaces/${workspaceId}/project/category/${categoryId}/feature/${featureId}`,
      {
        hasTest,
      }
    );
  } catch (error: any) {
    console.error("🔴 [patchfeaturetest] 기능 테스트 수정 실패:", error);

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

//기능 삭제
export const deletefeature = async (
  workspaceId: number,
  categoryId: number,
  featureId: number
) => {
  try {
    console.log("기능 삭제 api");
    await api.delete(
      `/workspaces/${workspaceId}/project/category/${categoryId}/feature/${featureId}`
    );
  } catch (error: any) {
    console.error("🔴 [deletefeature] 기능 삭제 실패:", error);

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
