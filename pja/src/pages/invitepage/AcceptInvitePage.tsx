import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./AcceptInvitePage.css";
import logoImage from "../../assets/img/logo.png";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import {
  getInvitationInfo,
  acceptInvitation,
  declineInvitation,
} from "../../services/inviteApi";
import { getStepIdFromNumber } from "../../utils/projectSteps";

interface InviteInfo {
  workspaceId: number;
  projectName: string;
  teamName: string;
  ownerName: string;
  role: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED";
}

const AcceptInvitePage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [inviteInfo, setInviteInfo] = useState<InviteInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [declineMessage, setDeclineMessage] = useState<string | null>(null);
  const selectedWS = useSelector(
    (state: RootState) => state.workspace.selectedWS
  );

  useEffect(() => {
    const fetchInviteInfo = async () => {
      console.log("초대 정보를 불러오는 중...");
      if (!token) {
        setError("유효하지 않은 초대 링크입니다.");
        setLoading(false);
        return;
      }
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        // 로그인 페이지로 보내고, 로그인 후 돌아올 현재 경로를 state로 전달할 수 있습니다.
        setError(
          "로그인이 필요합니다. 초대받은 이메일로 로그인 후 다시 시도해주세요."
        );
        setLoading(false);
        navigate("/login", {
          state: { from: window.location.pathname + window.location.search },
        });
        return;
      }

      try {
        // 분리된 API 함수를 호출합니다.
        const data = await getInvitationInfo(token, accessToken);
        setInviteInfo(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInviteInfo();
  }, [token, navigate]);

  // 수락 처리 함수
  const handleAccept = async () => {
    if (!token || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null); // 이전 성공 메시지 초기화
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      setError("로그인 정보가 없습니다. 다시 로그인해주세요.");
      setIsSubmitting(false);
      return;
    }

    try {
      // API가 이제 { status, message, data } 객체를 반환합니다.
      const response = await acceptInvitation(token, accessToken);

      // API 응답의 status가 'success'인지 확인하고 메시지를 설정합니다.
      if (response.status === "success") {
        setSuccessMessage(response.message); // "초대를 성공적으로 수락하였습니다."

        const stepId = getStepIdFromNumber(selectedWS?.progressStep ?? "0");

        // 성공 메시지를 1.5초간 보여준 후 워크스페이스로 이동합니다.
        setTimeout(() => {
          navigate(`/ws/${selectedWS?.workspaceId}/step/${stepId}`);
        }, 1500);
      } else {
        // 성공은 했으나 status가 다른 경우에 대한 예외 처리
        setError("초대 수락 중 알 수 없는 응답이 발생했습니다.");
      }
    } catch (err: any) {
      // 실패 응답 처리 로직은 기존과 동일하게 유지합니다.
      if (err.message === "이미 초대를 수락하셨습니다.") {
        setInviteInfo((prev) =>
          prev ? { ...prev, status: "ACCEPTED" } : null
        );
      } else if (err.message === "이미 초대를 거절하셨습니다.") {
        setInviteInfo((prev) =>
          prev ? { ...prev, status: "DECLINED" } : null
        );
      } else {
        setError(err.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // 거절 처리 함수
  const handleDecline = async () => {
    if (!token || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);
    setDeclineMessage(null);
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      setError("로그인 정보가 없습니다. 다시 로그인해주세요.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await declineInvitation(token, accessToken);

      if (response.status === "success") {
        setDeclineMessage(response.message); // "초대를 성공적으로 수락하였습니다."

        // 거절 메시지를 1.5초간 보여준 후 메인 페이지로 이동합니다.
        setTimeout(() => {
          navigate("/"); // 거절했으므로 워크스페이스가 아닌 메인 페이지 등으로 이동
        }, 1500);
      } else {
        // 성공은 했으나 status가 다른 경우에 대한 예외 처리
        setError("초대 거절 중 알 수 없는 응답이 발생했습니다.");
      }
    } catch (err: any) {
      if (err.message === "이미 초대를 거절하셨습니다.") {
        setInviteInfo((prev) =>
          prev ? { ...prev, status: "DECLINED" } : null
        );
      } else if (err.message === "이미 초대를 수락하셨습니다.") {
        setInviteInfo((prev) =>
          prev ? { ...prev, status: "ACCEPTED" } : null
        );
      } else {
        setError(err.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // 렌더링 로직
  const renderContent = () => {
    if (loading)
      return <div className="status-message">초대 정보를 불러오는 중...</div>;
    if (error) return <div className="status-message error">{error}</div>;
    if (successMessage)
      return <div className="status-message success">{successMessage}</div>;

    if (!inviteInfo) return null;

    const projectInitial = inviteInfo.projectName
      ? inviteInfo.projectName[0].toUpperCase()
      : "?";

    const projectCircle = (
      <div className="project-initial-circle">
        <span>{projectInitial}</span>
      </div>
    );

    switch (inviteInfo.status) {
      case "PENDING":
        return (
          <div className="invite-content-container">
            {projectCircle}
            <p className="invite-text">
              <strong>{inviteInfo.ownerName}</strong>님이 회원님을{" "}
              <strong>{inviteInfo.projectName}</strong> 워크스페이스에 팀원으로
              초대했습니다.
            </p>
            <div className="invite-actions">
              <button
                onClick={handleAccept}
                className="accept-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? "처리 중..." : "수락"}
              </button>
              <button
                onClick={handleDecline}
                className="reject-button"
                disabled={isSubmitting}
              >
                거절
              </button>
            </div>
          </div>
        );
      case "ACCEPTED":
        return (
          <div className="invite-content-container">
            {projectCircle}
            <p className="status-text">
              <strong>{inviteInfo.projectName}</strong> 워크스페이스의 초대를
              이미 수락하셨습니다.
            </p>
          </div>
        );
      case "DECLINED":
        return (
          <div className="invite-content-container">
            {projectCircle}
            <p className="status-text">
              <strong>{inviteInfo.projectName}</strong> 워크스페이스의 초대를
              이미 거절하셨습니다.
            </p>
          </div>
        );
      default:
        return (
          <div className="status-message error">
            알 수 없는 초대 상태입니다.
          </div>
        );
    }
  };

  return (
    <div className="invite-wrapper">
      <div className="invite-logo-container">
        <img src={logoImage} alt="invite logo" className="invite-logo" />
      </div>
      {renderContent()}
    </div>
  );
};

export default AcceptInvitePage;
