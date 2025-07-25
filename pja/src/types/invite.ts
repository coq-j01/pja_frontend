export interface InviteRequest {
  emails: string[];
  role: "MEMBER" | "GUEST";
}

// API 성공 응답의 data 필드 타입을 정의
export interface InviteSuccessData {
  invitedEmails: string[];
  role: "MEMBER" | "GUEST";
}

export interface InviteApiResponse {
  status: "success" | "fail" | "error";
  message: string;
  data?: any;
}

export type MemberRole = "MEMBER" | "OWNER" | "GUEST";
export interface Member {
  memberId: string;
  name: string;
  email: string;
  profile: string | null;
  workspaceRole: MemberRole;
}
