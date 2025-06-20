import React, { useState } from "react";
import logoImage from "../../../assets/img/logo.png";
import "./FindIdPage.css";
import findEmailIcon from "../../../assets/img/findEmail.png";
import { findIdByEmail } from "../../../services/authApi";

interface FindIdSuccessResponse {
  status: "success";
  message: string;
  data: {
    uid: string;
  };
}

interface FindIdErrorResponse {
  status: "fail" | "error";
  message: string;
}

type FindIdResponse = FindIdSuccessResponse | FindIdErrorResponse;

const FindIdPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [foundUserId, setFoundUserId] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  // 이메일 유효성 검사
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleFindId = async (): Promise<void> => {
    if (!email.trim()) {
      setErrorMessage("이메일을 입력해주세요.");

      setShowModal(true);
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage("올바른 이메일 형식을 입력해주세요.");
      setShowModal(true);
      return;
    }

    setLoading(true);
    setFoundUserId("");

    try {
      const response = await findIdByEmail(email.trim());

      //성공 시 응답 데이터에서 uid를 추출하여 상태에 저장
      setFoundUserId(response.data.uid);
    } catch (error) {
      //실패 시 API 함수에서 throw한 에러를 잡음
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("알 수 없는 오류가 발생했습니다 ");
      }
    } finally {
      //성공 / 실패 여부와 관계없이 항상 실행
      setLoading(false);
      setShowModal(true);
    }
  };

  const handleCloseModal = (): void => {
    setShowModal(false);
  };

  // 삭제 아이콘 클릭 시 이메일 값을 빈 문자열로 설정
  const handleClearEmail = (): void => {
    setEmail("");
  };

  return (
    <>
      <div className="findid-container">
        <div className="findid-box">
          <img src={logoImage} alt="logo" className="logo-image" />

          <h1 className="findid-title">아이디 찾기</h1>

          <div className="findid-input-wrapper">
            <div className="find-email-title">이메일</div>
            <div className="findemail-wrapper">
              <img
                src={findEmailIcon}
                alt="이메일"
                className="findemail-icon-inside"
              />
              <input
                type="email"
                placeholder="이메일"
                className="findid-email-input"
                value={email}
                onChange={handleEmailChange}
              />
              {email && (
                <button
                  type="button"
                  onClick={handleClearEmail}
                  className="findid-clear-icon"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M15 9l-6 6" />
                    <path d="M9 9l6 6" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          <div className="findid-section">
            <button
              type="button"
              onClick={handleFindId}
              className="findid-button"
              disabled={loading}
            >
              {loading ? "찾는 중..." : "아이디 찾기"}
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="findid-modal-overlay">
          <div className="findid-modal-content">
            <div className="findid-modal-header" />
            {foundUserId ? (
              <p>
                아이디는 <strong>{foundUserId}</strong>입니다
              </p>
            ) : (
              <p style={{ color: "#ff4444" }}>{errorMessage}</p>
            )}

            <div className="findid-modal-footer">
              <button
                type="button"
                className="findid-modal-close-button"
                onClick={handleCloseModal}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FindIdPage;
