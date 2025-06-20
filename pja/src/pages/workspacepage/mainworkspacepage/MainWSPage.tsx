import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSelectedWS } from "../../../store/workspaceSlice";
import { getworkspace } from "../../../services/workspaceApi";
import WsSidebar from "../../../components/sidebar/WsSidebar";
import "./MainWSPage.css";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import IdeaPage from "../ideapage/IdeaPage";
import RequirementsPage from "../requirementpage/RequirementsPage";
import ERDPage from "../erdpage/ERDPage";
import ApiPage from "../apispecpage/ApiPage";
import DevelopmentPage from "../developmentpage/DevelopmentPage";
import ProjectSummaryPage from "../projectsummarypage/ProjectSummaryPage";
import { ReactFlowProvider } from "reactflow";

export default function MainWSPage() {
  const { wsid, stepId } = useParams<{
    wsid: string;
    stepId: string;
  }>();
  const dispatch = useDispatch(); //redux에 값 저장하는 함수 필요
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showIcon, setShowIcon] = useState(false);

  useEffect(() => {
    const getws = async () => {
      try {
        const response = await getworkspace(Number(wsid));
        console.log("getworkspace 결과 : ", response);
        //redux저장
        if (response.data) {
          dispatch(setSelectedWS(response.data));
        }
      } catch (err) {
        console.log("getworkspace 실패 : ", err);
      }
    };
    getws();
  }, [wsid]);
  const renderStepComponent = () => {
    switch (stepId) {
      case "idea":
        return <IdeaPage />;
      case "requirements":
        return <RequirementsPage />;
      case "project":
        return <ProjectSummaryPage />;
      case "erd":
        return (
          <ReactFlowProvider>
            <ERDPage />
          </ReactFlowProvider>
        );
      case "api":
        return <ApiPage />;
      case "develop":
      case "complete":
        return <DevelopmentPage />;
      default:
        return <div>잘못된 스텝입니다.</div>;
    }
  };

  return (
    <div className="mainws-container">
      <AnimatePresence
        onExitComplete={() => {
          setShowIcon(true); // 사이드바 사라진 후 아이콘 보이기
        }}
      >
        {sidebarOpen && (
          <WsSidebar
            onClose={() => {
              setSidebarOpen(false);
              setShowIcon(false); // 아이콘 숨김 처리
            }}
          />
        )}
      </AnimatePresence>
      {!sidebarOpen && showIcon && (
        <div className="sidebar-closed">
          <div className="sidebar-icon" onClick={() => setSidebarOpen(true)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#000000"
            >
              <path d="M360-120v-720h80v720h-80Zm160-160v-400l200 200-200 200Z" />
            </svg>
          </div>
        </div>
      )}
      <div className="wscontent-container">{renderStepComponent()}</div>
    </div>
  );
}
