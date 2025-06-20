import { useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import "./FindPwPage.css";
import logoImage from "../../../assets/img/logo.png";
import findPwIcon from "../../../assets/img/findPw.png";
import findEmailIcon from "../../../assets/img/findEmail.png";
import authIcon from "../../../assets/img/auth.png";
import alertIcon from "../../../assets/img/alert.png";
import {
  requestPasswordCode,
  verifyPasswordCode,
} from "../../../services/authApi";
//import { verify } from "crypto";

const FindPwPage: React.FC = () => {
  const [clickBtn, setClickBtn] = useState(false);
  const [id, setId] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  //API 연동을 위한 상태
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isCodeSent, setIsCodeSent] = useState(false);
  //인증번호 코드
  const [authcode, setAuthcode] = useState<string>("");
  const [isVerified, setIsVerified] = useState(false);

  const navigate = useNavigate();

  const handleIdChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => setId(event.target.value);

  const handleEmailChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => setEmail(event.target.value);

  const handleAuthcodeChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => setAuthcode(event.target.value);

  //삭제 아이콘 클릭 시 아이디 값을 빈 문자열로 설정
  const handleClearId = () => setId("");
  //삭제 아이콘 클릭 시 이메일 값을 빈 문자열로 설정
  const handleClearEmail = () => setEmail("");
  //삭제 아이콘 클릭 시 이메일 값을 빈 문자열로 설정
  const handleClearAuthcode = () => setAuthcode("");

  //인증번호 받기 버튼 클릭 핸들러
  const handleRequestCode = async () => {
    //기본 유효성 검사
    if (!id || !email) {
      setError("아이디와 이메일을 모두 입력해주세요");
      setSuccessMessage(null);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await requestPasswordCode(id, email);
      setSuccessMessage(response.message); //인증번호 발송 성공

      setIsCodeSent(true);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("알 수 없는 오류가 발생했습니다");
      }
    } finally {
      setLoading(false);
    }
  };

  //인증번호 확인
  const handleVerifyCode = async () => {
    if (!authcode.trim()) {
      setError("인증번호를 입력해주세요");
      setSuccessMessage(null);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      //API 함수 호출 시 사용자가 입력한 authCode 값을 'token'로 전달
      const response = await verifyPasswordCode(email, authcode);

      setSuccessMessage(response.message); //인증이 안료되었습니다
      setIsVerified(true);
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("알 수 없는 오류가 발생했습니다");
      }
      setIsVerified(false);
    } finally {
      setLoading(false);
    }
  };

  //비밀번호 재설정 버튼 클릭
  const handleResetPassword = () => {
    //비밀번호 변경 페이지로 이동
    navigate("/reset-password", {
      state: {
        uid: id,
        email: email,
        authcode: authcode,
      },
      replace: true,
    });
  };

  return (
    <div className="findpw-container">
      <img src={logoImage} alt="PJA Logo" className="logo" />
      <h2 className="title">비밀번호 찾기</h2>

      <div className="form-group">
        <label htmlFor="username">아이디</label>
        <div className="input-wrapper">
          <img src={findPwIcon} alt="아이디 아이콘" className="icon" />
          <input
            type="text"
            id="username"
            placeholder="아이디"
            value={id}
            onChange={handleIdChange}
            className="find-pw-input"
            autoComplete="off"
            readOnly={isVerified}
          />
          {id && (
            <button
              type="button"
              onClick={handleClearId}
              className="findpw-clear-id-icon"
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

      <div className="form-group">
        <label htmlFor="email">이메일</label>

        <div className="input-wrapper">
          <img src={findEmailIcon} alt="이메일 아이콘" className="icon" />
          <input
            type="email"
            id="email"
            placeholder="이메일"
            value={email}
            onChange={handleEmailChange}
            className="find-pw-input"
            autoComplete="off"
            readOnly={isVerified}
          />
          {email && (
            <button
              type="button"
              onClick={handleClearEmail}
              className="findpw-clear-email-icon"
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

          <div className="button-group">
            <button
              className="btn small"
              onClick={handleRequestCode}
              disabled={loading}
            >
              {loading
                ? "전송 중"
                : isCodeSent
                ? "인증번호 다시 보내기"
                : "인증번호 받기"}
            </button>
          </div>
        </div>
        {/*성공 or 에러 메세지 표시*/}
        {successMessage && <p className="success">{successMessage}</p>}
        {error && <p className="error">{error}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="code">인증번호</label>
        <div className="input-wrapper">
          <img src={authIcon} alt="이메일 아이콘" className="icon" />
          <input
            type="text"
            id="code"
            placeholder="인증번호를 입력하세요."
            value={authcode}
            onChange={handleAuthcodeChange}
            readOnly={isVerified} //인증완료 시 수정 불가
            autoComplete="off"
            className="find-pw-input"
          />

          {authcode && !isVerified && (
            <button
              type="button"
              onClick={handleClearAuthcode}
              className="findpw-clear-email-icon"
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

          <div className="pw-button-item">
            <button
              className="pw-btn confirm"
              onClick={handleVerifyCode}
              disabled={loading || isVerified}
            >
              확인
            </button>
          </div>
        </div>
        {/*인증 성공 시 메세지*/}
        {isVerified && successMessage && (
          <p className="success">{successMessage}</p>
        )}
      </div>

      <div className="bottom-check">
        <div className="tooltip-wrapper">
          <img src={alertIcon} alt="알림아이콘" className="alert-icon" />
          <span>인증메일을 받지 못 하셨나요?</span>
          <span className="tooltip-text">
            <p>
              전송한 메일함을 확인하시고, 이름과 이메일을 정확히 입력했는지
              확인해 주세요.{" "}
            </p>
            <p>메일 수신까지 다소 시간이 걸릴 수 있습니다.</p>
          </span>
        </div>
      </div>

      <div className="btn-container">
        <button
          className="btn reset"
          disabled={!isVerified}
          onClick={handleResetPassword}
        >
          비밀번호 재설정
        </button>
      </div>
    </div>
  );
};

export default FindPwPage;
