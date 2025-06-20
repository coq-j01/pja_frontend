import type { FC, MouseEvent } from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { logoutUser } from "../../services/authApi";
import "./LogoutModal.css";
import { store } from "../../store/store";
import { clearAccessToken } from "../../store/authSlice";

interface LogoutModalProps {
  onConfirm: () => void;
  onClose: () => void;
}

const LogoutModal: FC<LogoutModalProps> = ({ onConfirm, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await logoutUser();

      // 로그아웃 성공 시 모든 인증 관련 데이터 제거
      store.dispatch(clearAccessToken());

      onConfirm(); // 성공 콜백 호출
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "로그아웃에 실패했습니다.";
      console.error("❌ 로그아웃 실패:", errorMessage);
      setError(errorMessage);

      // 401 오류인 경우 토큰이 이미 만료되었으므로 강제 로그아웃
      if (errorMessage.includes("인증이 만료")) {
        console.log("🔧 토큰 만료로 인한 강제 로그아웃");
        store.dispatch(clearAccessToken());

        // 약간의 지연 후 자동으로 로그아웃 처리
        setTimeout(() => {
          onConfirm();
        }, 1500);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="logout-confirmation-overlay"
      onClick={handleOverlayClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="logout-confirmation-content"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="logout-confirmation-header-bar" />
        <p className="logout-modal-message">로그아웃 하시겠습니까?</p>

        <div className="logout-confirmation-actions">
          <button
            onClick={() => {
              console.log("🟢 버튼 클릭됨");
              handleLogout();
            }}
            className={`logout-confirmation-button confirm ${
              isLoading ? "loading" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "로그아웃 중..." : "로그아웃"}
          </button>
          <button
            onClick={onClose}
            className="logout-confirmation-button cancel"
            disabled={isLoading}
          >
            취소
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LogoutModal;
