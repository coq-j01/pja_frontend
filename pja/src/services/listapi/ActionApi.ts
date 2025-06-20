import api from "../../lib/axios";
import type { ApiResponse } from "../../types/common";
import type {
  getaction,
  getaiaction,
  Importance,
  recommendedActions,
  responseactionid,
  Status,
} from "../../types/list";
//액션 관련 api

//액션 생성 -> 생성된 액션 기본키 반환
export const addaction = async (
  workspaceId: number,
  categoryId: number,
  featureId: number,
  name: string
): Promise<ApiResponse<responseactionid>> => {
  try {
    console.log("액션 생성 api");
    const response = await api.post(
      `/workspaces/${workspaceId}/project/category/${categoryId}/feature/${featureId}/action`,
      {
        name,
        startDate: "",
        endDate: "",
        state: "BEFORE",
        hasTest: false,
        importance: 0,
        participantsId: [],
      }
    );
    console.log("액션 생성 :", response);
    return response.data;
  } catch (error: any) {
    console.error("🔴 [addaction] 액션 생성 실패:", error);

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

//액션 이름 수정
export const patchactionname = async (
  workspaceId: number,
  categoryId: number,
  featureId: number,
  actionId: number,
  name: string
) => {
  try {
    console.log("액션 이름 수정 api");
    await api.patch(
      `/workspaces/${workspaceId}/project/category/${categoryId}/feature/${featureId}/action/${actionId}`,
      {
        name,
      }
    );
  } catch (error: any) {
    console.error("🔴 [dipatchactionname] 액션 이름 수정 실패:", error);

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

//액션 테스트 수정
export const patchactiontest = async (
  workspaceId: number,
  categoryId: number,
  featureId: number,
  actionId: number,
  hasTest: boolean
) => {
  try {
    console.log("액션 테스트 수정 api");
    await api.patch(
      `/workspaces/${workspaceId}/project/category/${categoryId}/feature/${featureId}/action/${actionId}`,
      {
        hasTest,
      }
    );
  } catch (error: any) {
    console.error("🔴 [dipatchactiontest] 액션 테스트 수정 실패:", error);

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

//액션 시작일 수정
export const patchactionstart = async (
  workspaceId: number,
  categoryId: number,
  featureId: number,
  actionId: number,
  startDate: Date
) => {
  try {
    console.log("액션 시작일 수정 api");
    await api.patch(
      `/workspaces/${workspaceId}/project/category/${categoryId}/feature/${featureId}/action/${actionId}`,
      {
        startDate,
      }
    );
  } catch (error: any) {
    console.error("🔴 [dipatchactionstart] 액션 시작일 수정 실패:", error);

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

//액션 마감일 수정
export const patchactionend = async (
  workspaceId: number,
  categoryId: number,
  featureId: number,
  actionId: number,
  endDate: Date
) => {
  try {
    console.log("액션 마감일 수정 api");
    await api.patch(
      `/workspaces/${workspaceId}/project/category/${categoryId}/feature/${featureId}/action/${actionId}`,
      {
        endDate,
      }
    );
  } catch (error: any) {
    console.error("🔴 [dipatchactionend] 액션 마감일 수정 실패:", error);

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

//액션 상태 수정
export const patchactionstate = async (
  workspaceId: number,
  categoryId: number,
  featureId: number,
  actionId: number,
  state: Status
) => {
  try {
    console.log("액션 상태 수정 api");
    await api.patch(
      `/workspaces/${workspaceId}/project/category/${categoryId}/feature/${featureId}/action/${actionId}`,
      {
        state,
      }
    );
  } catch (error: any) {
    console.error("🔴 [dipatchactionstate] 액션 상태 수정 실패:", error);

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

//액션 중요도 수정
export const patchactionimportance = async (
  workspaceId: number,
  categoryId: number,
  featureId: number,
  actionId: number,
  importance: Importance
) => {
  try {
    console.log("액션 중요도 수정 api");
    await api.patch(
      `/workspaces/${workspaceId}/project/category/${categoryId}/feature/${featureId}/action/${actionId}`,
      {
        importance,
      }
    );
  } catch (error: any) {
    console.error("🔴 [dipatchactionimportance] 액션 중요도 수정 실패:", error);

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

//액션 참여자 수정
export const patchactionparti = async (
  workspaceId: number,
  categoryId: number,
  featureId: number,
  actionId: number,
  participantIds: number[]
) => {
  try {
    console.log("액션 참여자 수정 api");
    await api.patch(
      `/workspaces/${workspaceId}/project/category/${categoryId}/feature/${featureId}/action/${actionId}`,
      {
        participantIds,
      }
    );
  } catch (error: any) {
    console.error("🔴 [patchactionparti] 액션 참여자 수정 실패:", error);

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

//액션 삭제
export const deleteaction = async (
  workspaceId: number,
  categoryId: number,
  featureId: number,
  actionId: number
) => {
  try {
    console.log("액션 삭제 api");
    await api.delete(
      `/workspaces/${workspaceId}/project/category/${categoryId}/feature/${featureId}/action/${actionId}`
    );
  } catch (error: any) {
    console.error("🔴 [deleteaction] 액션 삭제 실패:", error);

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

//액션리스트 불러오기
export const getactionlist = async (
  workspaceId: number
): Promise<ApiResponse<getaction[]>> => {
  try {
    console.log("액션리스트 조회 api");
    const response = await api.get(`/workspaces/${workspaceId}/action`);
    return response.data;
  } catch (error: any) {
    console.error("🔴 [geteactionlist] 액션리스트 조회 실패:", error);

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

//액션ai 추천받기
export const getActionAI = async (
  workspaceId: number,
  featureId: number
): Promise<ApiResponse<getaiaction>> => {
  try {
    console.log("액션리스트 조회 api");
    const response = await api.post(
      `/workspaces/${workspaceId}/feature/${featureId}/generation`
    );
    return response.data;
  } catch (error: any) {
    console.error("🔴 [getActionAI] ai액션 가져오기 실패:", error);

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
//액션 ai를 메인 액션에 생성 -> 생성된 액션 기본키 반환
export const addAIAction = async (
  workspaceId: number,
  categoryId: number,
  featureId: number,
  aiaction: recommendedActions
): Promise<ApiResponse<responseactionid>> => {
  try {
    console.log("액션 생성 api");
    const response = await api.post(
      `/workspaces/${workspaceId}/project/category/${categoryId}/feature/${featureId}/action`,
      {
        name: aiaction.name,
        startDate: aiaction.startDate,
        endDate: aiaction.endDate,
        state: "BEFORE",
        hasTest: false,
        importance: aiaction.importance,
        participantsId: [],
      }
    );
    console.log("ai액션 추가 :", response);
    return response.data;
  } catch (error: any) {
    console.error("🔴 [addAIAction] ai 액션 추가 실패:", error);

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
