import type { FC, MouseEvent } from "react";
import { motion } from "framer-motion";
import "./LeaveTeamModal.css";

interface LeaveTeamModalProps {
  onConfirm: () => void;
  onClose: () => void;
}

const LeaveTeamModal: FC<LeaveTeamModalProps> = ({ onConfirm, onClose }) => {
  //이벤트 핸들러 마우스 이벤트 타입 지정
  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    //클릭된 요소(e.target)가 이벤트 리스너가 연결된 요소 (e.currentTarget)와
    //같을 때만 모달을 닫음

    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <motion.div
      className="leave-team-modal-overlay"
      onClick={handleOverlayClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/*모달 컨텐츠*/}
      <motion.div
        className="leave-team-modal-content"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="leave-team-modal-header-bar"></div>
        <p className="leave-team-modal-message">팀을 탈퇴하시겠습니까?</p>
        <div className="leave-team-modal-actions">
          <button
            onClick={onConfirm}
            className="leave-team-modal-button confirm"
          >
            탈퇴하기
          </button>
          <button onClick={onClose} className="leave-team-modal-button  cancel">
            취소
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LeaveTeamModal;
