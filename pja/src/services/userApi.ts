import api from "../lib/axios";
import type { ApiResponse } from "../types/common";
import type { user } from "../types/user";

export const getuser = async (): Promise<ApiResponse<user>> => {
  const response = await api.get("/user/read-info");
  return response.data;
};
