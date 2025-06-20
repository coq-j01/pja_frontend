import { useEffect, useState } from "react";
import type { user } from "../types/user";
import { getuser } from "../services/userApi";
import { getmyworkspaces } from "../services/workspaceApi";
import type { workspace } from "../types/workspace";

export function useUserData() {
  const [userData, setUserData] = useState<user>();
  const [myWSData, setMyWSData] = useState<workspace>();

  // ✅ useEffect 및 return보다 위에서 정의해야 함
  const fetchUser = async () => {
    try {
      const response = await getuser();
      setUserData(response.data);
    } catch (error) {
      console.error("❌ 유저 정보 불러오기 실패:", error);
    }
  };

  const fetchMyWorkspaces = async () => {
    try {
      const response = await getmyworkspaces();
      setMyWSData(response.data);
    } catch (error) {
      console.error("❌ 내 워크스페이스 정보 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchMyWorkspaces();
  }, []);

  return {
    userData,
    myWSData,
    refetchUser: fetchUser,
    refetchWorkspaces: fetchMyWorkspaces,
  };
}
