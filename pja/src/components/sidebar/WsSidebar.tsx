import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { IsClose } from "../../types/common";
import "./WsSidebar.css";
import git_icon from "../../assets/git_icon.png";
import { WSSidebarHeader } from "../header/WSSidebarHeader";
import ProgressStep from "./ProgressStep";
import LeaveTeamModal from "../modal/LeaveTeamModal";
import MemberTabComp from "../sidebarcompo/MemberTabComp";
import { leaveWorkspace, getGitInfo } from "../../services/sideApi";
import type { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import NotifyTabComp from "../sidebarcompo/NotifyTabComp";
import type { MemberRole } from "../../types/invite";
import { BasicModal } from "../modal/BasicModal";
import {
  readAllNotifications,
  deleteAllNotifications,
  getNotifications,
} from "../../services/notiApi";
import { notreadNotification, type Notification } from "../../services/notiApi";

export default function WsSidebar({ onClose }: IsClose) {
  //모달 열림/닫힘 상태를 관리하는 useState
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState<boolean>(false);

  const [isGitModalOpen, setIsGitModalOpen] = useState<boolean>(false);
  const [gitModalMessage, setGitModalMessage] = useState<string>("");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalDescription, setModalDescription] = useState("");
  const [isNoti, setIsNoti] = useState<boolean>(false);

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const navigate = useNavigate();
  const selectedWS = useSelector(
    (state: RootState) => state.workspace.selectedWS
  );

  // 사이드바 전체 영역 ref
  const sidebarRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 감지해서 activeTab 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setActiveTab(null);
      }
    }
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // 알림 초기 로드
  useEffect(() => {
    if (!selectedWS?.workspaceId) return;

    const fetchNotifications = async () => {
      try {
        const data = await getNotifications(selectedWS.workspaceId);
        setNotifications(data);
      } catch (error) {
        console.error("알림 불러오기 실패:", error);
      }
    };

    const notreadnoti = async () => {
      try {
        const response = await notreadNotification(selectedWS.workspaceId);

        setIsNoti(response.data ?? false);
      } catch (error) {
        console.error("알림 읽음 여부 조회 실패:", error);
      }
    };

    fetchNotifications();
    notreadnoti();
  }, [selectedWS?.workspaceId]);

  //✅ 멤버 역할 변경 함수
  const handleRoleChange = (memberId: string, newRole: MemberRole) => {
    // TODO: 나중에 실제 API 호출로 멤버 역할을 변경하는 로직을 추가해야 합니다.
    alert(
      `(관리자 기능) ID: ${memberId} 멤버의 역할을 ${newRole}(으)로 변경합니다.`
    );
  };

  //팀 탈퇴 메뉴 클릭 시 모달을 여는 함수
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  //모달을 닫는 함수
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Git 모달을 닫는 함수
  const handleCloseGitModal = (open: boolean) => {
    setIsGitModalOpen(open);
  };

  //팀원 초대 모달을 여는 함수
  const handleInviteClick = () => {
    setIsInviteModalOpen((prev) => !prev);
  };

  //팀원 초대 모달을 닫는 함수
  const handleCloseInviteModal = () => {
    setIsInviteModalOpen(false);
  };

  //팀 탈퇴 모달 함수 및 api
  const handleConfirmLeave = async () => {
    // selectedWS나 workspaceId가 없으면 실행하지 않습니다.
    if (!selectedWS || !selectedWS.workspaceId) {
      alert("워크스페이스 정보가 없습니다. 다시 시도해 주세요.");
      return;
    }

    try {
      // API 호출
      await leaveWorkspace(selectedWS.workspaceId);

      // 성공 처리
      setModalTitle("팀탈퇴 완료");
      setModalDescription("팀에서 성공적으로 탈퇴했습니다.");
      setModalOpen(true);
      handleCloseModal();
      if (!open) {
        navigate("/");
      }
    } catch (error: any) {
      // 실패 처리
      const errorMessage =
        error.response?.data?.message || "팀 탈퇴 중 오류가 발생했습니다.";
      console.log(errorMessage);
    }
  };

  //Git  연동 클릭 시 실행될 함수
  const handleGitLinkClick = async () => {
    if (!selectedWS || !selectedWS.workspaceId) {
      alert("워크스페이스를 먼저 선택해주세요.");
      return;
    }
    try {
      const response = await getGitInfo(selectedWS.workspaceId);
      const gitUrl = response.data.gitUrl;

      if (gitUrl) {
        // Git 주소가 존재하면 새 탭에서 열기
        window.open(gitUrl, "_blank", "noopener,noreferrer");
      } else {
        // Git 주소가 없으면 사용자에게 알림
        setGitModalMessage(
          "연동된 Git 저장소 주소가 없습니다.\n 설정에서 추가해주세요."
        );
        setIsGitModalOpen(true);
      }
    } catch (error: any) {
      // API 호출 실패 시 에러 메시지 표시
      let userMessage =
        "연동된 Git 저장소 주소가 없습니다.\n 설정에서 추가해주세요.";

      if (error.response) {
        console.error("응답 상태코드:", error.response.status);
        console.error("서버 status:", error.response.data?.status);
        console.error("서버 message:", error.response.data?.message);
      } else if (error.request) {
        // 요청은 보냈지만, 응답을 받지 못했을 경우
        console.error("요청은 보냈지만 응답 없음:", error.request);
        userMessage =
          "서버로부터 응답이 없습니다. 네트워크 연결을 확인해주세요.";
      } else {
        // 요청을 설정하는 중에 에러가 발생했을 경우
        console.error("요청 설정 중 에러 발생:", error.message);
        userMessage = "요청을 보내는 중 문제가 발생했습니다.";
      }

      setGitModalMessage(userMessage);
      setIsGitModalOpen(true);
    }
  };

  // 알림 전체 읽음 처리
  const handleReadAllNotifications = async () => {
    if (!selectedWS?.workspaceId) {
      alert("워크스페이스 정보를 찾을 수 없습니다.");
      return;
    }
    try {
      await readAllNotifications(selectedWS.workspaceId);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setIsNoti(false);
    } catch (error: any) {
      console.error(error);
      alert(
        error.response?.data?.message ||
          error.message ||
          "알림 읽음 처리 중 오류가 발생했습니다."
      );
    }
  };

  // 알림 전체 삭제 처리
  const handleDeleteAllNotifications = async () => {
    if (!selectedWS?.workspaceId) {
      alert("워크스페이스 정보를 찾을 수 없습니다.");
      return;
    }
    try {
      await deleteAllNotifications(selectedWS.workspaceId);
      setNotifications([]);
      setIsNoti(false);
    } catch (error: any) {
      console.error(error);
      alert(
        error.response?.data?.message ||
          error.message ||
          "알림 삭제 중 오류가 발생했습니다."
      );
    }
  };

  return (
    <>
      <motion.div
        ref={sidebarRef}
        className="wssidebar-container"
        initial={{ x: "-80%", opacity: 0 }}
        animate={{ x: "0%", opacity: 1 }}
        exit={{ x: "-80%", opacity: 0 }}
        transition={{ type: "tween", duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        <WSSidebarHeader onClose={onClose} />
        <div className="wssidebar-list-container">
          <div
            className={`wssidebar-list ${
              activeTab === "member" ? "active" : ""
            }`}
            onClick={() => {
              setActiveTab(activeTab === "member" ? null : "member");
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
              fill="#1f1f1f"
            >
              <path d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z" />
            </svg>
            <p>멤버</p>
          </div>
          <div
            className={`wssidebar-list ${
              activeTab === "notify" ? "active" : ""
            }`}
            onClick={() => {
              setActiveTab(activeTab === "notify" ? null : "notify");
            }}
          >
            <div className="noti-svg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20px"
                viewBox="0 -960 960 960"
                width="20px"
                fill="#000000"
              >
                <path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z" />
              </svg>
              {isNoti && <div className="noti-circle"></div>}
            </div>
            <p>알림</p>
          </div>
          <div className="wssidebar-list" onClick={handleGitLinkClick}>
            <div className="wssidebar-img">
              <img src={git_icon} alt="git아이콘" />
            </div>
            <p>Git</p>
          </div>
          <div
            className="wssidebar-list"
            onClick={() => navigate(`/ws/${selectedWS?.workspaceId}/search`)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
              fill="#000000"
            >
              <path d="M765-144 526-383q-30 22-65.79 34.5-35.79 12.5-76.18 12.5Q284-336 214-406t-70-170q0-100 70-170t170-70q100 0 170 70t70 170.03q0 40.39-12.5 76.18Q599-464 577-434l239 239-51 51ZM384-408q70 0 119-49t49-119q0-70-49-119t-119-49q-70 0-119 49t-49 119q0 70 49 119t119 49Z" />
            </svg>
            <p>유사 프로젝트</p>
          </div>

          <div
            className="wssidebar-list"
            onClick={() => navigate(`/ws/${selectedWS?.workspaceId}/settings`)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
              fill="#000000"
            >
              <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z" />
            </svg>
            <p>설정</p>
          </div>

          <div className="wssidebar-list" onClick={handleOpenModal}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
              fill="#000000"
            >
              <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
            </svg>
            <p>팀 탈퇴</p>
          </div>
          {activeTab === "member" && (
            <div className="tab-content">
              <div className="tab-title">
                <p>멤버</p>
                <button
                  type="button"
                  className="membertab-btn"
                  onClick={handleInviteClick}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#000000"
                  >
                    <path d="M720-400v-120H600v-80h120v-120h80v120h120v80H800v120h-80Zm-360-80q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm80-80h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0-80Zm0 400Z" />
                  </svg>
                  <p>팀원초대</p>
                </button>
              </div>
              <div className="line"></div>
              <div className="member-list-scroll-container">
                <MemberTabComp
                  isInviteModalOpen={isInviteModalOpen} // 모달 상태 전달
                  onCloseInviteModal={handleCloseInviteModal} // 모달 닫기 함수 전달
                  onRoleChange={handleRoleChange}
                />
              </div>
            </div>
          )}
          {activeTab === "notify" && (
            <div className="tab-content">
              <div className="tab-title">
                <p>알림</p>
                <div className="notifytab-icons">
                  <svg
                    onClick={handleReadAllNotifications}
                    style={{ cursor: "pointer" }}
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#000000"
                  >
                    <path d="M638-80 468-250l56-56 114 114 226-226 56 56L638-80ZM480-520l320-200H160l320 200Zm0 80L160-640v400h206l80 80H160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v174l-80 80v-174L480-440Zm0 0Zm0-80Zm0 80Z" />
                  </svg>
                  <svg
                    onClick={handleDeleteAllNotifications}
                    style={{ cursor: "pointer" }}
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#000000"
                  >
                    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                  </svg>
                </div>
              </div>
              <div className="line"></div>
              <NotifyTabComp
                notifications={notifications}
                setNotifications={setNotifications}
                setIsNoti={setIsNoti}
              />
            </div>
          )}
        </div>
        <ProgressStep />
      </motion.div>
      <AnimatePresence>
        {isModalOpen && (
          <LeaveTeamModal
            onConfirm={handleConfirmLeave}
            onClose={handleCloseModal}
          />
        )}
      </AnimatePresence>
      {isGitModalOpen && (
        <BasicModal
          modalTitle="알림"
          modalDescription={gitModalMessage}
          Close={handleCloseGitModal}
        />
      )}

      {modalOpen && (
        <BasicModal
          modalTitle={modalTitle}
          modalDescription={modalDescription}
          Close={(open) => setModalOpen(open)}
        />
      )}
    </>
  );
}
