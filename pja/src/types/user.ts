// 사용자 데이터 타입
export interface user {
  name: string;
  profileImage: string;
}
export interface users {
  user_id: number;
  email: string;
  password: string;
  uid: string;
  name: string;
  profile_image?: string;
}
export interface auth_code {
  auth_id: number;
  auth_code: string;
  user_id: number;
}

// export interface user_log{
//   user_log_id :
// }
