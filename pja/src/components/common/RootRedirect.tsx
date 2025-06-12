import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { RootState } from "../../store/store";
import { useAuthInit } from "../../hooks/useAuthInit";

const RootRedirect = () => {
  const token = useSelector((state: RootState) => state.auth.accessToken);

  const authInitialized = useAuthInit();

  if (!authInitialized) {
    return <>로딩중....</>;
    // 나중에 여기에 로딩 페이지 만들게....
  }

  return token ? (
    <Navigate to="/main" replace />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default RootRedirect;
