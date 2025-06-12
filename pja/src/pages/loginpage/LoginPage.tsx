import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setAccessToken } from "../../store/authSlice";
import axios from "axios";
import "./LoginPage.css";
import { login } from "../../services/authApi";
import logoImage from "../../assets/img/logo.png";
import GoogleImage from "../../assets/img/Google.png";
import CustomModal from "../signuppage/CustomModal";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const [id, setId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState<React.ReactNode>(false);
  const [modalMessage, setModalMessage] = useState<React.ReactNode>("");
  const navigate = useNavigate();

  const openModal = (message: string): void => {
    setModalMessage(message);
    setShowModal(true);
  };

  const closeModal = (): void => {
    setShowModal(false);
    setModalMessage("");
  };

  const handleIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setId(event.target.value);
    if (showModal) closeModal();
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    if (showModal) closeModal();
  };

  const handleClearId = () => setId("");
  const handleClearPassword = () => setPassword("");
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !isLoading) {
      handleLogin();
    }
  };

  const handleLogin = async () => {
    if (!id.trim()) {
      openModal("아이디를 입력해주세요");
      return;
    }
    if (!password.trim()) {
      openModal("비밀번호를 입력해주세요");
      return;
    }

    setIsLoading(true);
    closeModal();

    try {
      const result = await login(id, password);
      const accessToken = result.data?.accessToken;

      if (result.status === "success" && accessToken) {
        localStorage.setItem("accessToken", accessToken); // 로컬스토리지 저장
        dispatch(setAccessToken(accessToken)); // redux 저장
        openModal(result.message);

        setTimeout(() => {
          navigate("/main");
        }, 1500);
      }
    } catch (error) {
      console.error("로그인 요청 중 오류 발생:", error);
      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data;
        openModal(errorData.message || "로그인에 실패했습니다.");
      } else {
        openModal("네트워크 오류 또는 알 수 없는 문제가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // 3. Google 로그인도 프록시를 통해 상대 경로로 요청
    window.location.href = "/oauth2/authorization/google";
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-logo">
          <img src={logoImage} alt="logo" className="logo-image"></img>
        </div>
        <h1 className="login-title">로그인</h1>
        <div className="input-section">
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="아이디"
              className="id-input"
              value={id}
              onChange={handleIdChange}
              onKeyPress={handleKeyPress} // Enter 키 감지를 위해 추가
            />
            {id && (
              <button
                type="button"
                onClick={handleClearId}
                className="clear-icon"
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

        <div className="input-section">
          <div className="input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="비밀번호"
              className="pw-input"
              value={password}
              onChange={handlePasswordChange}
              onKeyPress={handleKeyPress} // Enter 키 감지를 위해 추가
            />
            {password && (
              <button
                type="button"
                onClick={handleClearPassword}
                className="clear-icon"
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
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="visibility-toggle-icon"
              aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="button-section">
          <button
            type="button"
            onClick={handleLogin}
            className="login-button"
            disabled={isLoading}
            style={{
              opacity: isLoading ? 0.6 : 1,
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </button>
        </div>

        <div className="search-section">
          <div className="search-wrapper">
            <div className="search-group">
              <a href="/find-id" className="search-link">
                아이디 찾기
              </a>
              <span className="search-separator">|</span>
              <a href="/find-pw" className="search-link">
                비밀번호 찾기
              </a>
            </div>
            <a href="/signup" className="search-link">
              회원가입
            </a>
          </div>
        </div>

        <div className="google-login-wrapper">
          <button className="google-login-button" onClick={handleGoogleLogin}>
            <img src={GoogleImage} alt="Google logo" className="google-logo" />
            <span className="google-text">Google 계정으로 로그인</span>
          </button>
        </div>
      </div>
      {showModal && <CustomModal message={modalMessage} onClose={closeModal} />}
    </div>
  );
};

export default LoginPage;
