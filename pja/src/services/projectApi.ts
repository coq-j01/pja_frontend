import api from "../lib/axios";
import type { ApiResponse } from "../types/common";
import type { getproject, setproject } from "../types/project";
import type { setrequire } from "../types/requirement";
//프로젝트 요약 페이지 api

//프로젝트 요약 생성
export const postProjectAI = async (
  workspaceId: number,
  requirements: setrequire[]
): Promise<ApiResponse<getproject>> => {
  try {
    const response = await api.post(
      `workspaces/${workspaceId}/project-info`,
      requirements
    );
    console.log("프로젝트 요약 생성 :", response);
    return response.data;
  } catch (error: any) {
    console.error("🔴 [postProjectAI] 프로젝트 요약 생성 실패:", error);

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

//프로젝트 정보 조회
export const getProject = async (
  workspaceId: number
): Promise<ApiResponse<getproject>> => {
  try {
    const response = await api.get(`/workspaces/${workspaceId}/project-info`);
    console.log("프로젝트 조회 :", response);
    return response.data;
  } catch (error: any) {
    console.error("🔴 [getProject] 프로젝트 조회 실패:", error);

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

//프로젝트 정보 수정
export const putProject = async (
  workspaceId: number,
  projectInfoId: number,
  projects: setproject
): Promise<ApiResponse<getproject>> => {
  try {
    const response = await api.put(
      `/workspaces/${workspaceId}/prject-info/${projectInfoId}`,
      projects
    );
    console.log("프로젝트 수정 :", response);
    return response.data;
  } catch (error: any) {
    console.error("🔴 [getProject] 프로젝트 수정 실패:", error);

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
