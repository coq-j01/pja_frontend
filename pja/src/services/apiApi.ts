import api from "../lib/axios";
import { isAxiosError } from "axios";
import type {
  // GET 요청의 응답 타입을 위해 BackendApiSpec 타입을 import 합니다.
  BackendApiSpec,
  CreateApiRequest,
  CreatedApiData,
  ApiSuccessResponse,
  ApiErrorResponse,
  GetApisResponse,
} from "../types/api";

export const getApisByWorkspace = async (
  workspaceId: string | number
): Promise<BackendApiSpec[]> => {
  try {
    const response = await api.get<GetApisResponse>(
      `/workspaces/${workspaceId}/apis`
    );
    // 성공 응답의 data 필드를 반환합니다.
    return response.data.data;
  } catch (error) {
    console.error(`워크스페이스(id: ${workspaceId}) API 조회 실패:`, error);
    // 에러를 상위로 전파하여 컴포넌트에서 처리할 수 있도록 합니다.
    throw error;
  }
};

// 새로운 API 명세를 생성하는 함수(POST) - 기존 코드
export const createApi = async (
  workspaceId: string | number,
  apiData: CreateApiRequest
): Promise<BackendApiSpec> => {
  try {
    const response = await api.post<ApiSuccessResponse<BackendApiSpec>>(
      `/workspaces/${workspaceId}/apis`,
      apiData
    );
    //resonsedata {status, message , data}
    return response.data.data;
  } catch (error) {
    console.error(" API 요청 실패:", error);
    if (isAxiosError(error) && error.response) {
      const errorMessage =
        (error.response.data as ApiErrorResponse).message ||
        "API 생성 중 오류가 발생했습니다.";
      throw new Error(errorMessage);
    }
    throw new Error("알 수 없는 오류가 발생했습니다.");
  }
};

export const updateApi = async (
  workspaceId: string | number,
  apiId: number,
  apiData: CreateApiRequest
): Promise<BackendApiSpec> => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    throw new Error("인증 토큰이 없습니다. 다시 로그인해주세요.");
  }

  try {
    const response = await api.put<{
      status: string;
      message: string;
      data: BackendApiSpec;
    }>(`/workspaces/${workspaceId}/apis/${apiId}`, apiData);

    // API 응답 구조에 따라 실제 데이터(data.data)를 반환합니다.
    return response.data.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      // 서버에서 보낸 에러 메시지가 있다면 그것을 사용합니다.
      const errorMessage =
        error.response.data?.message || "API 수정 중 오류가 발생했습니다.";
      throw new Error(errorMessage);
    }
    // 그 외 네트워크 에러 등
    throw new Error(
      "네트워크 오류 또는 알 수 없는 문제로 API를 수정하지 못했습니다."
    );
  }
};

//삭제 api
export const deleteApi = async (
  workspaceId: number | string,
  apiId: number
): Promise<BackendApiSpec> => {
  try {
    const response = await api.delete<{
      status: string;
      message: string;
      data: BackendApiSpec;
    }>(`/workspaces/${workspaceId}/apis/${apiId}`);

    // 성공 응답에서 실제 데이터(data)를 반환합니다.
    return response.data.data;
  } catch (error: any) {
    console.error("API 삭제 요청 실패:", error);
    // 에러를 다시 throw하여 호출한 쪽에서 처리할 수 있도록 합니다.

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
