import React, { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import "./AccountSettingPage.css";
import profileIcon from "../../assets/img/profile.png";
import profilepersonIcon from "../../assets/img/profileperson.png";
import profilelockIcon from "../../assets/img/profilelock.png";
import { validateNewPassword } from "./newPasswordValidator";
import { BasicModal } from "../../components/modal/BasicModal";

import {
  getuser,
  updateProfileImage,
  changePassword,
  changeName,
} from "../../services/userApi";

import { LeaveHeader } from "../../components/header/LeaveHeader";

const AccountSettingPage: React.FC = () => {
  const [initialName, setInitialName] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [isNameFocused, setIsNameFocused] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  //프로필 변경
  const [profileImage, setProfileImage] = useState<string | null>(null);

  //로딩 및 에러 상태
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalDescription, setModalDescription] = useState("");

  const showModal = (title: string, description: string) => {
    setModalTitle(title);
    setModalDescription(description);
    setModalOpen(true);
  };

  //비밀번호 유효성 검사 상태
  const [passwordValidation, setPasswordValidation] = useState<{
    isValid: boolean;
    message: string;
  }>({ isValid: false, message: "" });

  //비밀번호 유효성 검사 상태
  const [confirmPasswordValidation, setConfirmPasswordValidation] = useState<{
    isValid: boolean;
    message: string;
  }>({ isValid: true, message: "" });

  useEffect(() => {}, [profileImage]);

  useEffect(() => {
    // API 호출을 위한 별도의 함수를 정의하고 즉시 실행
    const loadUserInfo = async () => {
      try {
        setIsLoading(true);

        const userData = await getuser();

        // API 응답에 맞춰 상태를 업데이트합니다. (username -> name)
        if (userData.data) {
          setName(userData.data.username);
          setInitialName(userData.data.username);
          setProfileImage(userData.data.profileImage);
        }
      } catch (err: any) {
        // fetchUserInfoAPI에서 던진 에러를 여기서 잡습니다.
        setError(
          err.message || "사용자 정보 조회 중 알 수 없는 오류가 발생했습니다."
        );
      } finally {
        // 성공하든 실패하든 로딩 상태를 해제합니다.
        setIsLoading(false);
      }
    };
    loadUserInfo();
  }, []);

  // 로딩 중일 때 보여줄 UI
  if (isLoading) {
    return <div className="loading-message">정보를 불러오는 중입니다...</div>;
  }

  // 에러 발생 시 보여줄 UI
  if (error) {
    return <div className="error-message">오류: {error}</div>;
  }

  const handleNameChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => setName(event.target.value);

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setPassword(event.target.value);
  };

  const handleNewPasswordChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    const newPasswordValue = event.target.value;
    setNewPassword(event.target.value);
    const validation = validateNewPassword(newPasswordValue);
    setPasswordValidation(validation);

    //비밀번호 확인과 일치 여부 검사
    const confirmValidation = validatePasswordConfirmation(
      newPasswordValue,
      confirmNewPassword
    );
    setConfirmPasswordValidation(confirmValidation);
  };

  const handleConfirmNewPasswordChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    const confirmValue = event.target.value as string;
    setConfirmNewPassword(confirmValue);

    // 비밀번호 일치 여부 검사
    const confirmValidation = validatePasswordConfirmation(
      newPassword,
      confirmValue
    );
    setConfirmPasswordValidation(confirmValidation);
  };

  //비밀번호 확인 검증 함수
  const validatePasswordConfirmation = (
    newPassword: string,
    confirmPassword: string
  ) => {
    if (!confirmPassword) {
      return {
        isValid: true, //빈 값일때는 오류 표시안함
        message: "",
      };
    }

    if (newPassword !== confirmPassword) {
      return {
        isValid: false,
        message: "비밀번호가 일치하지 않습니다.",
      };
    }
    return {
      isValid: true,
      message: "",
    };
  };

  const handleNameChangeSubmit = async () => {
    if (!name.trim()) return showModal("", "이름을 입력해주세요.");
    if (name === initialName)
      return showModal("", "새로운 이름이 기존 이름과 동일합니다.");

    try {
      await changeName({ newName: name });
      showModal("이름 변경", "이름이 성공적으로 변경되었습니다.");
      // 성공 시, 초기 이름 상태도 업데이트하여 중복 요청을 방지
      setInitialName(name);
    } catch (err: any) {
      showModal("이름 변경 실패", err.response?.data?.message || err.message);
      // 실패 시, 입력 필드의 값을 원래 이름으로 되돌립니다.
      setName(initialName);
    }
  };

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      //미리보기 이미지
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      //이미지 변경 api 호출
      try {
        await updateProfileImage(file);
        showModal("", "프로필 이미지가 성공적으로 변경되었습니다.");
        const userData = await getuser();
        if (userData.data) {
          setProfileImage(userData.data.profileImage);
        }
      } catch (err: any) {
        showModal(
          "프로필 이미지 변경 실패",
          err.response?.data?.message || err.message
        );
      }
    }
  };

  //삭제 아이콘 클릭 시 아이디 값을 빈 문자열로 설정
  const handleClearName = () => setName("");
  const handleClearPassword = () => setPassword("");
  // 새 비밀번호 입력 초기화
  const handleClearNewPassword = () => {
    setNewPassword("");
  };

  // 새 비밀번호 확인 입력 초기화
  const handleClearConfirmNewPassword = () => {
    setConfirmNewPassword("");
    setConfirmPasswordValidation({ isValid: true, message: "" }); // 초기화시 검증 상태도 리셋
  };

  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword);
  };

  const toggleNewPasswordVisibility = () => setShowNewPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword((prev) => !prev);

  //비밀번호 변경 버튼
  const handlePasswordChangeSubmit = async () => {
    // 1. 프론트엔드 유효성 검사
    if (!password || !newPassword || !confirmNewPassword) {
      return showModal("", "모든 비밀번호 필드를 입력해주세요.");
    }
    if (!passwordValidation.isValid) {
      return showModal("", passwordValidation.message);
    }
    if (!confirmPasswordValidation.isValid) {
      alert(confirmPasswordValidation.message);
      return;
    }

    // 2. API 호출
    try {
      await changePassword({
        currentPw: password,
        newPw: newPassword,
        confirmPw: confirmNewPassword,
      });
      showModal("", "비밀번호가 성공적으로 변경되었습니다.");
      // 성공 시 입력 필드 초기화
      setPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err: any) {
      // API 에러 메시지를 사용자에게 표시
      showModal(
        "비밀번호 변경 실패",
        err.response?.data?.message || err.message
      );
    }
  };

  return (
    <div className="accountsetting-wrapper">
      <div className="accounting-service-header">
        <LeaveHeader />
      </div>
      <h1 className="accountsetting-title">계정설정</h1>
      <div />
      <div className="account-underline" />
      <div className="accountsetting-content">
        <div className="profile-title">프로필 변경</div>

        <div className="profile-image-container">
          {profileImage ? (
            <img
              src={profileImage}
              alt="프로필 이미지"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          ) : (
            <div className="profile-image-placeholder" />
          )}
          <label htmlFor="imageUpload" className="image-upload-button">
            <img src={profileIcon} alt="프로필 이미지" />
          </label>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </div>

        <div className="profile-input-section">
          <div className="profile-input-wrapper">
            <div className="profile-name-title">이름</div>
            <div className="profile-id-wrapper">
              <img
                src={profilepersonIcon}
                alt="이메일"
                className="profile-icon-inside"
              />
              <input
                type="text"
                placeholder="이름"
                className="profile-id-input"
                value={name}
                onChange={handleNameChange}
                onFocus={() => setIsNameFocused(true)}
                onBlur={() => setIsNameFocused(false)}
              />
              {name && isNameFocused && (
                <button
                  type="button"
                  onClick={handleClearName}
                  className="profile-clear-icon"
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
            <div className="profile-button-item">
              <button
                className="profile btn confirm"
                onClick={handleNameChangeSubmit}
              >
                변경
              </button>
            </div>
          </div>

          <div className="profile-pw-change-wrapper">
            <div className="pw-change-title">비밀번호 변경</div>

            {/* 현재 비밀번호 */}
            <div className="profile-pw-input-wrapper">
              <div className="profile-pw-title">현재 비밀번호</div>
              <div className="profile-pw-wrapper">
                <img
                  src={profilelockIcon}
                  alt="현재 비밀번호"
                  className="profile-pw-icon-inside"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="비밀번호"
                  className="profile-pw-input"
                  value={password}
                  onChange={handlePasswordChange}
                />
                {/* 비밀번호 보이기/숨기기 버튼 */}
                {password && (
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="visibility-toggle-icon"
                    aria-label={
                      showPassword ? "비밀번호 숨기기" : "비밀번호 보기"
                    }
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
                )}
                {password && (
                  <button
                    type="button"
                    onClick={handleClearPassword}
                    className="profile-clear-icon"
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

            {/* 새 비밀번호 */}
            <div className="profile-new-pw-input-wrapper">
              <div className="profile-new-pw-title">새 비밀번호</div>
              <div className="profile-new-pw-wrapper">
                <img
                  src={profilelockIcon}
                  alt="새 비밀번호"
                  className="profile-pw-icon-inside"
                />
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="새 비밀번호"
                  className="profile-new-pw-input"
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                />

                {newPassword && (
                  <button
                    type="button"
                    onClick={toggleNewPasswordVisibility}
                    className="visibility-toggle-icon"
                    aria-label={
                      showNewPassword ? "비밀번호 숨기기" : "비밀번호 보기"
                    }
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
                )}
                {newPassword && (
                  <button
                    type="button"
                    onClick={handleClearNewPassword}
                    className="profile-clear-icon"
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
              {/* 유효성 검사 */}
              {!passwordValidation.isValid && newPassword && (
                <div className="password-error-message">
                  {passwordValidation.message}
                </div>
              )}
            </div>

            {/* 비밀번호 확인 */}
            <div className="profile-new-pwcf-input-wrapper">
              <div className="profile-new-pwcf-title">비밀번호 확인</div>
              <div className="profile-new-pwcf-wrapper">
                <img
                  src={profilelockIcon}
                  alt="비밀번호 확인"
                  className="profile-pw-icon-inside"
                />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="비밀번호 확인"
                  className="profile-new-pwcf-input"
                  value={confirmNewPassword}
                  onChange={handleConfirmNewPasswordChange}
                />
                {confirmNewPassword && (
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="visibility-toggle-icon"
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
                )}
                {confirmNewPassword && (
                  <button
                    type="button"
                    onClick={handleClearConfirmNewPassword}
                    className="profile-clear-icon"
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
              {!confirmPasswordValidation.isValid && confirmNewPassword && (
                <div className="password-error-message">
                  {confirmPasswordValidation.message}
                </div>
              )}
              <div className="profile-new-button-item">
                <button
                  className="profile-new-btn-confirm"
                  onClick={handlePasswordChangeSubmit}
                >
                  변경
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {modalOpen && (
        <BasicModal
          modalTitle={modalTitle}
          modalDescription={modalDescription}
          Close={(open) => setModalOpen(open)}
        />
      )}
    </div>
  );
};
export default AccountSettingPage;
