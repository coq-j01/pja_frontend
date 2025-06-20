import api from "../lib/axios";
import type { ApiResponse } from "../types/common";

// 초대 정보 조회 응답 데이터 타입
export interface InviteInfo {
  workspaceId: number;
  projectName: string;
  teamName: string;
  ownerName: string;
  role: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED";
}

// 초대 수락/거절 응답 데이터 타입
export interface AcceptDeclineResponse {
  workspaceId: number;
  invitedEmail: string;
  role: string;
}

// 초대 수락/거절 응답의 data 필드 타입
export interface AcceptDeclineResponseData {
  workspaceId: number;
  invitedEmail: string;
  role: string;
}

export interface AcceptInvitationSuccessResponse {
  status: "success";
  message: string;
  data: AcceptDeclineResponseData;
}

export interface DeclineInvitationSuccessResponse {
  status: "success";
  message: string;
  data: AcceptDeclineResponseData;
}

const handleResponse = async (response: Response) => {
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "알 수 없는 오류가 발생했습니다.");
  }
  return result;
};

export const getInvitationInfo = async (
  token: string,
  accessToken: string
): Promise<InviteInfo> => {
  const response = await fetch(`/api/invitations?token=${token}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return (await handleResponse(response)).data;
};

export const acceptInvitation = async (
  token: string,
  accessToken: string
): Promise<AcceptInvitationSuccessResponse> => {
  const response = await fetch(`/api/invitations/${token}/accept`, {
    method: "PATCH", // 수락/거절은 보통 POST 또는 PUT을 사용합니다.
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return handleResponse(response);
};

export const declineInvitation = async (
  token: string,
  accessToken: string
): Promise<DeclineInvitationSuccessResponse> => {
  const response = await fetch(`/api/invitations/${token}/decline`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return handleResponse(response);
};
