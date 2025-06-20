import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import "./EmailVerificationPage.css";
import emailLogoImage from "../../../assets/img/emailLogo.png";
import verficatedemailIcon from "../../../assets/img/verficatedemail.png";
import hintIcon from "../../../assets/img/hint.png";
import CustomModal from "../CustomModal";
import api from "../../../lib/axios";

interface EmailVerificationApiResponse {
  status: string;
  message?: string;
  data?: any;
}

interface VerificationCheckApiResponse {
  status: string;
  message?: string;
  data?: any;
}

const EmailVerificationPage: React.FC = () => {
  const [userEmail, setUserEmail] = useState<string>("");
  const [verificationToken, setVerificationToken] = useState<string>("");
  const [isResending, setIsResending] = useState<boolean>(false);
  const [resendCooldown, setResendCooldown] = useState<number>(0);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>("");

  const openModal = (message: string): void => {
    setModalMessage(message);
    setShowModal(true);
  };

  const closeModal = (): void => {
    setShowModal(false);
    setModalMessage("");
  };

  const handleVerification = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVerificationToken(e.target.value);
  };

  // 이메일 인증 완료 처리
  const handleVerificationComplete = async () => {
    if (!verificationToken.trim()) {
      alert("인증 토큰을 입력해주세요.");
      return;
    }

    try {
      // const response = await axios.post<VerificationCheckApiResponse>(
      //   `/api/auth/verify-email`,
      //   {
      //     email: userEmail,
      //     token: verificationToken,
      //   },
      //   {
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //   }
      // );

      const response = await api.post(
        `/auth/verify-email`,
        {
          email: userEmail,
          token: verificationToken,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 && response.data.status === "success") {
        openModal("회원가입이 완료되었습니다!");
        // 로그인 페이지로 이동
        window.location.href = "/login";
      } else {
        openModal(response.data.message || "인증 번호가 올바르지 않습니다.");
      }
    } catch (error) {
      console.error("이메일 인증 실패", error);
      if (axios.isAxiosError(error) && error.response) {
        const { status, data } = error.response;
        switch (status) {
          case 400:
            alert(data.message || "유효하지 않은 이메일 형식입니다.");
            break;
          case 401:
            alert(data.message || "인증되지 않은 사용자입니다.");
            break;
          case 404:
            alert(data.message || "일치하는 사용자를 찾을 수 없습니다.");
            break;
          case 500:
            alert(data.message || "서버 오류로 인해 인증이 실패했습니다.");
            break;
          default:
            alert("인증 처리 중 오류가 발생했습니다.");
        }
      } else {
        alert("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  // 이메일 재전송 (기존 API 유지 - 별도 API 스펙이 없으므로)
  const handleResendEmail = async () => {
    if (isResending || resendCooldown > 0) return;

    setIsResending(true);
    try {
      const response = await api.post(
        `/auth/send-email`,
        { email: userEmail },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("userEmail:", userEmail);

      if (response.status === 200 && response.data.status === "success") {
        alert("인증 이메일이 재전송되었습니다");
        // 60초 쿨타임 설정
        setResendCooldown(60);
        const timer = setInterval(() => {
          setResendCooldown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        alert(response.data.message || "이메일 재전송에 실패했습니다");
      }
    } catch (error) {
      console.error("이메일 재전송 실패", error);
      if (axios.isAxiosError(error) && error.response) {
        alert(error.response.data.message || "이메일 재전송에 실패했습니다");
      } else {
        alert("네트워크 오류가 발생했습니다");
      }
    } finally {
      setIsResending(false);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get("email");

    if (email) {
      setUserEmail(decodeURIComponent(email));
    } else {
      // URL에 이메일 파라미터가 없을 때 회원가입 페이지로 리다이렉트
      alert("잘못된 접근입니다. 회원가입부터 진행해주세요");
      window.location.href = "/signup";
    }
  }, []);

  return (
    <div className="emailverification-wrapper">
      <div className="emailverification-logo-image">
        <img src={emailLogoImage} alt="PJA Logo" className="emaillogo-image" />
      </div>
      <div className="emailverification-box-wrapper">
        <div className="emailverification-box">
          <div className="emailverification-title">이메일 인증</div>
          <motion.img
            src={verficatedemailIcon}
            alt="email Icon"
            className="verficatedemail-icon"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 1, 0.7, 1],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 1,
              ease: "easeInOut",
            }}
          />
          {/*이메일 주소 표시 박스*/}
          <div className="verification-email-box">
            {userEmail ? (
              <div>
                <span>{userEmail}</span>
              </div>
            ) : (
              <div>
                <span>이메일 주소를 불러오는 중...</span>
              </div>
            )}
          </div>
          <div className="verification-message">
            <span className="first-line">
              해당 이메일로 인증 번호가 발송되었습니다😄
            </span>
            <br />
          </div>
          <div className="verification-button-wrapper">
            <input
              type="text"
              placeholder="인증 토큰을 입력해주세요"
              value={verificationToken}
              onChange={handleVerification}
              className="verificationcode-input"
            />
            <button
              className="verification-button"
              onClick={handleVerificationComplete}
            >
              <span>인증완료</span>
            </button>
          </div>
          <div className="email-resend-message">
            <img src={hintIcon} alt="인증 알림" className="hint-icon" />
            <span>인증메일을 받지 못하셨나요? </span>
            <button
              onClick={handleResendEmail}
              disabled={isResending || resendCooldown > 0}
              style={{
                background: "none",
                border: "none",
                color: "#007bff",
                textDecoration: "underline",
                cursor: resendCooldown > 0 ? "not-allowed" : "pointer",
                fontSize: "inherit",
              }}
            >
              {isResending
                ? "전송 중..."
                : resendCooldown > 0
                ? `재전송 (${resendCooldown}s)`
                : "재전송"}
            </button>
          </div>
        </div>
      </div>
      {showModal && <CustomModal message={modalMessage} onClose={closeModal} />}
    </div>
  );
};

export default EmailVerificationPage;
