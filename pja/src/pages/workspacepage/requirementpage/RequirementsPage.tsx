import { WSHeader } from "../../../components/header/WSHeader";
import "./RequirementsPage.css";
import type { setrequire, getrequire } from "../../../types/requirement";
import { useEffect, useState } from "react";
import {
  deleterequirement,
  getrequirement,
  inputrequirement,
  putrequirement,
  Requirementgenerate,
} from "../../../services/requirementApi";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { RequireCancleModal } from "../../../components/modal/WsmenuModal";
import { progressworkspace } from "../../../services/workspaceApi";
import type { workspace } from "../../../types/workspace";
import { setSelectedWS } from "../../../store/workspaceSlice";
import { getStepIdFromNumber } from "../../../utils/projectSteps";
import { postProjectAI } from "../../../services/projectApi";

export default function RequirementsPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedWS = useSelector(
    (state: RootState) => state.workspace.selectedWS
  );
  const [requireDone, setRequireDone] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [nextPageloading, setNextPageLoading] = useState(false);
  const [requirements, setRequirements] = useState<getrequire[]>([]);
  const [aiRecommend, setAiRecommend] = useState<boolean>(false);
  const [openAIModal, setOpenAIModal] = useState<boolean>(false);
  const [aiRequirements, setAiRequirements] = useState<setrequire[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>("");
  const getRequire = async () => {
    if (selectedWS?.workspaceId) {
      const response = await getrequirement(selectedWS?.workspaceId);
      console.log("요구사항 조회 결과 :", response);
      if (response.data) {
        setRequirements(response.data); // undefined가 아닐 때만 설정
      }
    }
  };

  useEffect(() => {
    getRequire();
  }, [selectedWS]);

  useEffect(() => {
    if (requirements) {
      if (
        requirements.filter((req) => req.requirementType === "FUNCTIONAL")
          .length >= 3 &&
        requirements.filter((req) => req.requirementType === "PERFORMANCE")
          .length >= 3
      ) {
        setAiRecommend(true);
      } else {
        setAiRecommend(false);
      }
    }
  }, [requirements]);

  const handleAddFunction = async (content: string) => {
    try {
      if (selectedWS?.workspaceId) {
        const response = await inputrequirement(
          selectedWS?.workspaceId,
          "FUNCTIONAL",
          content
        );
        console.log("function 생성 결과 :", response);
        getRequire();
      }
    } catch (err) {
      console.log("function 생성 실패", err);
    }
  };
  const handleAddPerformance = async (content: string) => {
    try {
      if (selectedWS?.workspaceId) {
        const response = await inputrequirement(
          selectedWS?.workspaceId,
          "PERFORMANCE",
          content
        );
        console.log("performance 생성 결과 :", response);
        getRequire();
      }
    } catch (err) {
      console.log("performance 생성 실패", err);
    }
  };

  // ai 추천받기
  const handleAiRequirements = async () => {
    if (aiRecommend) {
      setLoading(true);
      try {
        if (selectedWS?.workspaceId) {
          const setrequirements: setrequire[] = requirements.map(
            ({ requirementType, content }) => ({
              requirementType,
              content,
            })
          );
          const response = await Requirementgenerate(
            selectedWS.workspaceId,
            setrequirements
          );
          console.log("요구사항 저장 성공:", response);
          setAiRequirements(response.data ?? []);
        }
      } catch (err) {
        console.error("요구사항 저장 실패", err);
      } finally {
        setLoading(false);
      }
    } else {
      setOpenAIModal(true);
    }
  };

  // AI 추천 결과 중 하나 완료
  const handleAiAccept = async (ai: setrequire) => {
    if (selectedWS?.workspaceId) {
      try {
        if (ai.requirementType === "FUNCTIONAL") {
          await handleAddFunction(ai.content);
        } else if (ai.requirementType === "PERFORMANCE") {
          await handleAddPerformance(ai.content);
        }
        setAiRequirements((prev) => prev.filter((item) => item !== ai));
      } catch (err) {
        console.error("AI 요구사항 저장 실패", err);
      }
    }
  };

  // AI 추천 항목 취소
  const handleAiCancel = (ai: setrequire) => {
    setAiRequirements((prev) => prev.filter((item) => item !== ai));
  };

  const handleEditClick = (req: getrequire) => {
    setEditingId(req.requirementId);
    setEditText(req.content);
  };

  const handleEditSubmit = async () => {
    if (editingId !== null && selectedWS?.workspaceId) {
      const original = requirements.find(
        (req) => req.requirementId === editingId
      );

      // 변경 내용이 없으면 종료
      if (!original || original.content === editText.trim()) {
        setEditingId(null);
        setEditText("");
        return;
      }
      await putrequirement(selectedWS?.workspaceId, editingId, editText);
      setRequirements((prev) =>
        prev.map((req) =>
          req.requirementId === editingId ? { ...req, content: editText } : req
        )
      );
      setEditingId(null);
      setEditText("");
    }
  };

  const handleReqDelete = async (requirementId: number) => {
    if (selectedWS?.workspaceId) {
      await deleterequirement(selectedWS?.workspaceId, requirementId);
      setRequirements((prev) =>
        prev.filter((req) => req.requirementId !== requirementId)
      );
    }
  };

  const handleCompleteReq = async () => {
    if (!selectedWS) return;
    setNextPageLoading(true);
    try {
      if (selectedWS.progressStep === "1") {
        //프로젝트 정보 생성해주는 api
        const setrequirements: setrequire[] = requirements.map(
          ({ requirementType, content }) => ({
            requirementType,
            content,
          })
        );
        const projectdata = await postProjectAI(
          selectedWS.workspaceId,
          setrequirements
        );
        console.log("프로젝트 정보 : ", projectdata);
        // if (!projectdata || !projectdata.data)
        //   throw new Error("프로젝트 정보 생성 실패");
        // else {
        //   console.log("프로젝트 정보 : ", projectdata);
        // }

        await progressworkspace(selectedWS.workspaceId, "2");
        console.log("다음페이지로 넘어가기");

        const updatedWorkspace: workspace = {
          ...selectedWS, // 기존 값 유지
          progressStep: "2",
        };

        dispatch(setSelectedWS(updatedWorkspace));
        navigate(
          `/ws/${selectedWS?.workspaceId}/step/${getStepIdFromNumber("2")}`
        );
      }
      setRequireDone(true);
    } catch (err) {
      console.log("요구사항 저장 실패 : ", err);
    } finally {
      setNextPageLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleEditSubmit();
    }
  };

  const renderList = (type: "FUNCTIONAL" | "PERFORMANCE") => {
    return (
      <ul>
        {requirements
          .filter((r) => r.requirementType === type)
          .map((req) => (
            <div
              className="require-list"
              key={req.requirementId}
              onClick={() => {
                {
                  !requireDone && handleEditClick(req);
                }
              }}
              style={{ cursor: "pointer" }}
            >
              <li>
                {editingId === req.requirementId ? (
                  <input
                    type="text"
                    value={editText}
                    autoFocus
                    onChange={(e) => setEditText(e.target.value)}
                    onBlur={handleEditSubmit}
                    onKeyDown={handleKeyDown}
                  />
                ) : (
                  req.content
                )}
              </li>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20px"
                viewBox="0 -960 960 960"
                width="20px"
                fill="#EA3323"
                onClick={(e) => {
                  e.stopPropagation();
                  handleReqDelete(req.requirementId);
                }}
              >
                <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
              </svg>
            </div>
          ))}
      </ul>
    );
  };

  const airenderList = (type: "FUNCTIONAL" | "PERFORMANCE") => {
    return (
      <ul>
        {aiRequirements
          .filter((ai) => ai.requirementType === type)
          .map((ai, index) => (
            <div className="airequire-list" key={index}>
              <li>
                <div className="airequire-wrapper">
                  <span className="airequire-text">✨{ai.content}</span>
                  <span className="airequire-actions">
                    <button
                      className="airequire-accept-btn"
                      onClick={() => handleAiAccept(ai)}
                    >
                      완료
                    </button>
                    <button
                      className="airequire-cancel-btn"
                      onClick={() => handleAiCancel(ai)}
                    >
                      취소
                    </button>
                  </span>
                </div>
              </li>
            </div>
          ))}
      </ul>
    );
  };
  return (
    <>
      <WSHeader title="요구사항 명세서" />
      <div className="require-container">
        {selectedWS?.progressStep === "1" &&
          (loading ? (
            <div className="airequire-title wave-text">
              {"✨ AI 추천 중이에요".split("").map((char, idx) => (
                <span key={idx} style={{ animationDelay: `${idx * 0.05}s` }}>
                  {char}
                </span>
              ))}
            </div>
          ) : (
            <div className="require-title">
              <p>✨기능·성능 요구사항 3개 이상 입력하면 AI 추천이 가능해요</p>
              <div className="require-aibtn" onClick={handleAiRequirements}>
                AI 추천받기
              </div>
            </div>
          ))}
        <div className="require-content">
          <div className="require-content-box ">
            <div className="require-content-title">
              <p>기능 요구사항</p>
            </div>
            <div className="require-lists">
              {renderList("FUNCTIONAL")}
              {airenderList("FUNCTIONAL")}
              {!requireDone && (
                <button
                  className="require-add-button"
                  onClick={() => handleAddFunction("")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20px"
                    viewBox="0 -960 960 960"
                    width="20px"
                    fill="#FFFFFF"
                  >
                    <path d="M444-444H240v-72h204v-204h72v204h204v72H516v204h-72v-204Z" />
                  </svg>
                  <p>요구사항 추가</p>
                </button>
              )}
            </div>
          </div>
          <div className="require-content-box ">
            <div className="require-content-title">
              <p>성능 요구사항</p>
            </div>
            <div className="require-lists">
              {renderList("PERFORMANCE")}
              {airenderList("PERFORMANCE")}
              {!requireDone && (
                <button
                  className="require-add-button"
                  onClick={() => handleAddPerformance("")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20px"
                    viewBox="0 -960 960 960"
                    width="20px"
                    fill="#FFFFFF"
                  >
                    <path d="M444-444H240v-72h204v-204h72v204h204v72H516v204h-72v-204Z" />
                  </svg>
                  <p>요구사항 추가</p>
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="require-btn">
          {requireDone ? (
            <p>수정하기</p>
          ) : (
            <p onClick={handleCompleteReq}>저장하기</p>
          )}
          {selectedWS?.progressStep === "1" && (
            <div className="require-info">?</div>
          )}
        </div>
        {openAIModal && (
          <RequireCancleModal onClose={() => setOpenAIModal(false)} />
        )}
        {nextPageloading && (
          <div>로딩 중입니다...</div> // 여기에 나중에 가이드 페이지
        )}
      </div>
    </>
  );
}
