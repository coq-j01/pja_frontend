export interface IsClose {
  onClose: () => void;
}
export interface IsOpen {
  onMenuToggle: () => void;
}

// 공통 응답 타입
export interface ApiResponse<T> {
  status: string;
  message: string;
  data?: T;
}
