import api from "../lib/axios";
import type { MemberRole } from "../types/invite";

// 멤버 불러오기
export const getMemberList = async(workspaceId: number) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await api.get(`/workspaces/${workspaceId}/members`, {
      headers,
    });

    return response.data;
  } catch (error: any) {
    console.error("멤버 목록 불러오기 실패", error);
    throw error;
  }
};

// 멤버 역할 불러오기
export const getMemberRole = async(workspaceId: number) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await api.get(`/workspaces/${workspaceId}/role`, {
      headers,
    });

    return response.data;
  } catch(error: any) {
    console.error("멤버 역할 불러오기 실패", error);
    throw error;
  }
}

// 멤버 역할 수정
export const updateMemberRole = async(workspaceId: number, payload: { userId: number; workspaceRole: MemberRole }) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    
    const response = await api.put(
      `/workspaces/${workspaceId}/members`,
      payload,
      { headers }
    );

    return response.data;
  } catch(error: any) {
    console.error("멤버 역할 수정하기 실패", error);
    throw error;
  }
}

// 멤버 삭제
export const deleteMember = async (workspaceId: number, memberId: number) => {
  try {
    const response = await api.delete(
      `workspaces/${workspaceId}/members/${memberId}`
    );
    return response.data;
  } catch (error: any) {
    console.error("멤버 삭제 실패", error);

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
