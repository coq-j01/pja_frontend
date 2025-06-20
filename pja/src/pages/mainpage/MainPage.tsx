import { useEffect, useState } from "react";
import { MainHeader } from "../../components/header/MainHeader";
import { Myworkspace } from "./Myworkspace";
import MainMenu from "../../components/sidebar/MainMenuSidebar";
import { AnimatePresence } from "framer-motion";
import "./MainPage.css";
import { useUserData } from "../../hooks/useUserData";

export default function MainPage() {
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const { refetchUser, refetchWorkspaces } = useUserData();
  useEffect(() => {
    refetchUser();
    refetchWorkspaces();
  }, []);
  return (
    <>
      <div className="main-container">
        <MainHeader onMenuToggle={() => setOpenMenu((prev) => !prev)} />
        <Myworkspace />
        <AnimatePresence>
          {openMenu && <MainMenu onClose={() => setOpenMenu(false)} />}
        </AnimatePresence>
      </div>
    </>
  );
}
