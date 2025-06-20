import "./AddWSPage.css";
import type { IsClose } from "../../../types/common";
import { useEffect, useState } from "react";
import { addworkspace } from "../../../services/workspaceApi";
import { useNavigate } from "react-router-dom";
import { setSelectedWS } from "../../../store/workspaceSlice";
import { useDispatch } from "react-redux";
import { initinputidea } from "../../../services/ideaApi";

export default function AddWSName({ onClose }: IsClose) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState<string>("");
  const [teamName, setTeamName] = useState<string>("");
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [newWSId, setNewWSId] = useState<number>();

  const isValid = projectName.trim() !== "" && teamName.trim() !== "";

  useEffect(() => {
    if (typeof newWSId === "number") {
      const initIdea = async () => {
        try {
          const response = await initinputidea(newWSId);
          console.log("아이디어 초기화 완료:", response.data);
          onClose();
        } catch (error) {
          console.error("아이디어 초기화 실패:", error);
        }
      };
      initIdea();
    }
  }, [newWSId]);

  const handleAddWS = () => {
    console.log("projectName", projectName);
    console.log("teamName", teamName);
    console.log("isPublic", isPublic);
    const addWs = async () => {
      try {
        const response = await addworkspace({ projectName, teamName, isPublic });
        console.log("워크스페이스 생성:", response.data);
        if (response.data) {
          dispatch(setSelectedWS(response.data));
          setNewWSId(response.data.workspaceId);
        }
      } catch (error) {
        console.error("워크스페이스 생성 실패:", error);
      }
    }
    addWs();
  };

  return (
    <div className="addws-container">
      <div className="addws-box">
        <div className="addws-title">
          <p>워크스페이스 생성</p>
          <svg
            onClick={() => navigate("/main")}
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#FFFFFF"
          >
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
          </svg>
        </div>
        <div className="addws-content">
          <div>
            <p>프로젝트명</p>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="프로젝트명"
              className="addws-content-input"
            />
          </div>
          <div>
            <p>팀명</p>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="팀명"
              className="addws-content-input"
            />
          </div>
          <div>
            <p>워크스페이스 공개</p>
            <select
              className="addws-content-select"
              value={isPublic.toString()}
              onChange={(e) => setIsPublic(e.target.value === "true")}
            >
              <option value="true">public</option>
              <option value="false">private</option>
            </select>
          </div>
        </div>
        <div className="addws-btn-container">
          {/* 생성하기 누르면 db에 저장 시키기! */}
          <button
            onClick={() => handleAddWS()}
            disabled={!isValid}
            className="addws-btn1"
          >
            생성하기
          </button>
        </div>
      </div>
    </div>
  );
}
