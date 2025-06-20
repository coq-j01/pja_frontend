import api from "../../lib/axios";
import type { ApiResponse } from "../../types/common";
//카테고리 관련 api

//카테고리 생성 -> 생성된 카테고리 기본키 반환
export const addcategory = async (
  workspaceId: number,
  name: string
): Promise<ApiResponse<number>> => {
  try {
    console.log("카테고리 생성 api");
    const response = await api.post(
      `/workspaces/${workspaceId}/project/category`,
      {
        name,
        state: false,
        hasTest: false,
      }
    );
    console.log("카테고리 생성 :", response);
    return response.data;
  } catch (error: any) {
    console.error("🔴 [addcategory] 카테고리 생성 실패:", error);

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

//카테고리 이름 수정
export const patchcategoryname = async (
  workspaceId: number,
  categoryId: number,
  name: string
) => {
  try {
    console.log("카테고리 이름 수정 api");
    await api.patch(
      `/workspaces/${workspaceId}/project/category/${categoryId}`,
      {
        name,
      }
    );
  } catch (error: any) {
    console.error("🔴 [patchcategoryname] 카테고리 이름 수정 실패:", error);

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

//카테고리 상태 수정
export const patchcategorystate = async (
  workspaceId: number,
  categoryId: number,
  state: boolean
) => {
  try {
    console.log("카테고리 상태 수정 api");
    await api.patch(
      `/workspaces/${workspaceId}/project/category/${categoryId}`,
      {
        state,
      }
    );
  } catch (error: any) {
    console.error("🔴 [patchcategorystate] 카테고리 상태 수정 실패:", error);

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

//카테고리 순서 수정
export const patchcategoryorder = async (
  workspaceId: number,
  categoryId: number,
  orderIndex: number
) => {
  try {
    console.log("카테고리 순서 수정 api");
    await api.patch(
      `/workspaces/${workspaceId}/project/category/${categoryId}`,
      {
        orderIndex,
      }
    );
  } catch (error: any) {
    console.error("🔴 [patchcategoryorder] 카테고리 순서 수정 실패:", error);

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

//카테고리 테스트 여부 수정
export const patchcategorytest = async (
  workspaceId: number,
  categoryId: number,
  hasTest: boolean
) => {
  try {
    console.log("카테고리 테스트여부 수정 api");
    await api.patch(
      `/workspaces/${workspaceId}/project/category/${categoryId}`,
      {
        hasTest,
      }
    );
    console.log("테스트여부 수정 완료");
  } catch (error: any) {
    console.error(
      "🔴 [patchcategorytest] 카테고리 테스트여부 수정 실패:",
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

//카테고리 삭제
export const deletecategory = async (
  workspaceId: number,
  categoryId: number
) => {
  try {
    console.log("카테고리 삭제 api");
    await api.delete(
      `/workspaces/${workspaceId}/project/category/${categoryId}`
    );
  } catch (error: any) {
    console.error("🔴 [deletecategory] 카테고리 삭제 실패:", error);

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
