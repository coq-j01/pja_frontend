import api from "../lib/axios";
import type { ApiResponse } from "../types/common";
import type {
  ERDData,
  getcolumn,
  ERDField,
  gettable,
  getrelation,
  ERDRelation,
  RelationType,
} from "../types/erd";
import type { GenerateApiResponse } from "../types/api";
//ERD 관련 테이블

//erd ai자동생성 요청
export const postErdAI = async (workspaceId: number) => {
  try {
    await api.post(`/workspaces/${workspaceId}/erds/recommendations`);
    console.log("erd ai 생성 :");
  } catch (error: any) {
    console.error("🔴 [postErdAI] Erd AI 생성 실패:", error);

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

//erd 전체 조회
export const getAllErd = async (
  workspaceId: number,
  erdId: number
): Promise<ApiResponse<ERDData>> => {
  try {
    const response = await api.get(
      `/workspaces/${workspaceId}/erd/${erdId}/flow`
    );

    return response.data;
  } catch (error: any) {
    console.error("🔴 [getAllErd] Erd 조회 실패:", error);

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

//erdId 조회
export const getErdId = async (
  workspaceId: number
): Promise<ApiResponse<{ erdId: number }>> => {
  try {
    const response = await api.get(`/workspaces/${workspaceId}/erd`);
    return response.data;
  } catch (error: any) {
    console.error("🔴 [getErdId] Erd id 조회 실패:", error);

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

//erd table 생성
export const postErdTable = async (
  workspaceId: number,
  erdId: number
): Promise<ApiResponse<gettable>> => {
  try {
    const response = await api.post(
      `/workspaces/${workspaceId}/erd/${erdId}/table`,
      {
        tableName: "새테이블",
      }
    );
    console.log("erd 테이블 생성 :", response);
    return response.data;
  } catch (error: any) {
    console.error("🔴 [postErdTable] Erd 테이블 생성 실패:", error);

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

//erd table 이름 수정
export const putErdTable = async (
  workspaceId: number,
  erdId: number,
  tableId: string,
  newTableName: string
): Promise<ApiResponse<gettable>> => {
  try {
    const response = await api.put(
      `/workspaces/${workspaceId}/erd/${erdId}/table/${tableId}`,
      {
        newTableName,
      }
    );
    console.log("erd 테이블이름 수정 :", response);
    return response.data;
  } catch (error: any) {
    console.error("🔴 [putErdTable] Erd 테이블 수정 실패:", error);

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

//erd table 삭제
export const deleteErdTable = async (
  workspaceId: number,
  erdId: number,
  tableId: string
) => {
  try {
    await api.delete(
      `/workspaces/${workspaceId}/erd/${erdId}/table/${tableId}`
    );
    console.log("erd 테이블 삭제 :");
  } catch (error: any) {
    console.error("🔴 [deleteErdTable] Erd 테이블 삭제 실패:", error);

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

//erd 컬럼 생성
export const postErdColumn = async (
  workspaceId: number,
  erdId: number,
  tableId: string
): Promise<ApiResponse<getcolumn>> => {
  try {
    const response = await api.post(
      `/workspaces/${workspaceId}/erd/${erdId}/table/${tableId}/column`,
      {
        columnName: "새 필드",
        dataType: "",
        primaryKey: false,
        foreignKey: false,
        nullable: false,
      }
    );
    console.log("erd 필드 생성 :", response);
    return response.data;
  } catch (error: any) {
    console.error("🔴 [postErdColumn] Erd 필드 생성 실패:", error);
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

//erd 컬럼 삭제
export const deleteErdColumn = async (
  workspaceId: number,
  erdId: number,
  tableId: string,
  columnId: string
): Promise<ApiResponse<void>> => {
  try {
    const response = await api.delete(
      `/workspaces/${workspaceId}/erd/${erdId}/table/${tableId}/column/${columnId}`
    );
    console.log("erd 필드 삭제 :", response);
    return response.data;
  } catch (error: any) {
    console.error("🔴 [deleteErdColumn] Erd 필드 삭제 실패:", error);
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

//erd 컬럼 수정
export const putErdColumn = async (
  workspaceId: number,
  erdId: number,
  tableId: string,
  columnId: string,
  updateField: ERDField
): Promise<ApiResponse<getcolumn>> => {
  try {
    const response = await api.put(
      `/workspaces/${workspaceId}/erd/${erdId}/table/${tableId}/column/${columnId}`,
      {
        columnName: updateField.name,
        dataType: updateField.type,
        primaryKey: updateField.primary,
        foreignKey: updateField.foreign,
        nullable: updateField.nullable,
      }
    );
    console.log("erd 필드 수정 :", response);
    return response.data;
  } catch (error: any) {
    console.error("🔴 [putErdColumn] Erd 필드 수정 실패:", error);
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

//erd 관계 생성
export const postErdRelation = async (
  workspaceId: number,
  erdId: number,
  newRelation: ERDRelation
): Promise<ApiResponse<getrelation>> => {
  try {
    const response = await api.post(
      `/workspaces/${workspaceId}/erd/${erdId}/relation`,
      {
        fromTableId: newRelation.source,
        toTableId: newRelation.target,
        foreignKeyId: newRelation.sourceHandle,
        toTableKeyId: newRelation.targetHandle,
        foreignKeyName: "외래키이름",
        constraintName: "기본키이름",
        type: newRelation.label,
      }
    );
    console.log("erd 관계 생성 :", response);
    return response.data;
  } catch (error: any) {
    console.error("🔴 [postErdRelation] Erd 관계 생성 실패:", error);
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

//erd 관계 삭제
export const deleteErdRelation = async (
  workspaceId: number,
  erdId: number,
  relationId: string
) => {
  try {
    const response = await api.delete(
      `/workspaces/${workspaceId}/erd/${erdId}/relation/${relationId}`
    );
    console.log("erd 관계 삭제 :", response);
    return response.data;
  } catch (error: any) {
    console.error("🔴 [deleteErdRelation] Erd 관계 삭제 실패:", error);
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

//erd 관계 라벨 수정
export const patchRelationLabel = async (
  workspaceId: number,
  erdId: number,
  relationId: string,
  type: RelationType
) => {
  try {
    await api.patch(
      `/workspaces/${workspaceId}/erd/${erdId}/relation/${relationId}/type`,
      {
        type,
      }
    );
    console.log("erd 관계 라벨 수정 :");
  } catch (error: any) {
    console.error("🔴 [patchRelationLabel] Erd 관계 라벨 수정 실패:", error);
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

//api 명세서 생성 요청
export const generateApiSpec = async (
  workspaceId: number
): Promise<GenerateApiResponse> => {
  try {
    const response = await api.post<GenerateApiResponse>(
      `/workspaces/${workspaceId}/apis/generate`
    );
    return response.data;
  } catch (error: any) {
    console.error("API 명세서 생성 API 호출 실패:", error);
    // 에러를 다시 throw하여 호출한 쪽(컴포넌트)에서 catch할 수 있도록 합니다.

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
