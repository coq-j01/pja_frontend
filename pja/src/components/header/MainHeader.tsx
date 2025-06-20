import "./MainHeader.css";
import type { IsOpen } from "../../types/common";
import { useUserData } from "../../hooks/useUserData";

export function MainHeader({ onMenuToggle }: IsOpen) {
  const { userData } = useUserData();
  return (
    <>
      <div className="mainheader-container">
        {userData?.profileImage ? (
          <img
            src={userData.profileImage}
            alt="프로필 이미지"
            className="profile-image" // 이미지일 때 CSS
            onClick={onMenuToggle}
          />
        ) : (
          <div className="profile" onClick={onMenuToggle}>
            {userData?.username.charAt(0)}
          </div>
        )}
        <h1>{userData?.username}님의 워크스페이스</h1>
        <div className="div-right"></div>
      </div>
    </>
  );
}
