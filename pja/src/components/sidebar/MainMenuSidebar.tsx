import type { IsClose } from "../../types/common";
import { useState } from "react";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./MainMenuSidebar.css";
import LogoutModal from "../modal/LogoutModal";
import { useUserData } from "../../hooks/useUserData";

export default function MainMenuSidebar({ onClose }: IsClose) {
  const { userData } = useUserData();
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  //계정설정
  const goToAccountSettings = () => {
    navigate("/account-settings");
  };

  //로그아웃 모달
  const handleLogout = () => {
    setShowLogoutModal(false);
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="mainmenu-overlay">
      <motion.div
        className="mainmenu-container"
        ref={menuRef}
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: "0%", opacity: 1 }}
        exit={{ x: "-100%", opacity: 0 }}
        transition={{ type: "tween", duration: 0.3 }}
      >
        <div className="mainmenu-layout">
          {userData?.profileImage ? (
            <img
              src={userData.profileImage}
              alt="프로필 이미지"
              className="mainmenu-profile-image"
            />
          ) : (
            <div className="mainmenu-profile">
              {userData?.username.charAt(0)}
            </div>
          )}
          <p className="mainmenu-username">{userData?.username}</p>
          <div className="mainmenu-list">
            <p onClick={goToAccountSettings} style={{ cursor: "pointer" }}>
              계정설정
            </p>
            <p>공지</p>
            <p
              onClick={() => setShowLogoutModal(true)}
              style={{ cursor: "pointer" }}
            >
              로그아웃
            </p>
            <p>탈퇴</p>
          </div>
        </div>
      </motion.div>
      {/* LogoutModal이 렌더링된 후 localStorage에서 토근 가져와 서버에 로그아웃 요청*/}
      {showLogoutModal && (
        <LogoutModal
          onConfirm={handleLogout}
          onClose={() => setShowLogoutModal(false)}
        />
      )}
    </div>
  );
}
