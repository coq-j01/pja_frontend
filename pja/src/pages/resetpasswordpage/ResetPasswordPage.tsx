import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ResetPasswordPage.css";
import logoImage from "../../assets/img/logo.png";
import newlockIcon from "../../assets/img/newlock.png";
import { changePassword } from "../../services/authApi";

const ResetPasswordPage = () => {
  const [newpassword, setNewPassword] = useState<string>("");
  const [confirmpassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { uid, email, authcode } = location.state || {};

  //데이터가 없는 경우 처리
  if (!uid || !email || !authcode) {
    return <div>잘못된 접근입니다 비밀번호 찾기를 다시 진행해주세요</div>;
  }
  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  //변경 버튼 클릭
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newpassword !== confirmpassword) {
      setError("비밀번호가 일치하지 않습니다");
      return;
    }

    setLoading(true);

    try {
      await changePassword(uid, newpassword, confirmpassword);

      //성공 시
      alert(
        "비밀번호가 성공적으로 변경되었습니다. 로그인 페이지로 이동합니다."
      );

      navigate("/login");
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

  const handleClearNewPassword = () => setNewPassword("");
  const handleClearConfirmPassword = () => setConfirmPassword("");
  return (
    <div className="resetpassword-wrapper">
      <img src={logoImage} alt="PJA Logo" className="newpw-logo" />
      <h2 className="resetpassword-title">비밀번호 변경</h2>

      <div className="newpw-group">
        <label htmlFor="new-pw">새 비밀번호</label>
        <div className="newpw-input-wrapper">
          <img src={newlockIcon} alt="아이디 아이콘" className="newpw-icon" />
          <input
            type={showNewPassword ? "text" : "password"}
            placeholder="비밀번호"
            value={newpassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="new-pw-input"
          />
          {newpassword && (
            <button
              type="button"
              onClick={handleClearNewPassword}
              className="newpw-clear-pw-icon"
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
            onClick={toggleNewPasswordVisibility}
            className="text-gray-400 hover:text-gray-600 visibility-toggle-icon"
            aria-label={showNewPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
          >
            {showNewPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5" // 스타일 일관성을 위해 클래스 추가
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
                className="w-5 h-5" // 스타일 일관성을 위해 클래스 추가
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            )}
          </button>
        </div>
        <div className="newpw-group">
          <label htmlFor="new-confirmpw">비밀번호 확인</label>

          <div className="newpw-confirm-input-wrapper">
            <img
              src={newlockIcon}
              alt="비밀번호 확인 아이콘"
              className="newconfirm-icon"
            />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="비밀번호 확인"
              value={confirmpassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="newpw-confirm-input"
            />
            {confirmpassword && (
              <button
                type="button"
                onClick={handleClearConfirmPassword}
                className="newpw-clear-pw-icon"
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
              onClick={toggleConfirmPasswordVisibility}
              className="text-gray-400 hover:text-gray-600 visibility-toggle-icon"
              aria-label={
                showConfirmPassword ? "비밀번호 숨기기" : "비밀번호 보기"
              }
            >
              {showConfirmPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
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
                  className="w-5 h-5"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
            </button>
          </div>
          <div className="button-container">
            <button
              type="submit"
              onClick={handleSubmit}
              className="change-button"
              disabled={!newpassword || !confirmpassword || loading}
            >
              변경
            </button>
          </div>
        </div>
      </div>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default ResetPasswordPage;
