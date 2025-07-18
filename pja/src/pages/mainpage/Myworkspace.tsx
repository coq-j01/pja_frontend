import "./Myworkspace.css";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BasicModal } from "../../components/modal/BasicModal";
import { useUserData } from "../../hooks/useUserData";
import type { workspace } from "../../types/workspace";
import { getStepIdFromNumber } from "../../utils/projectSteps";
import { WsDeleteModal } from "../../components/modal/DeleteModal";
import {
  completeworkspace,
  deleteworkspace,
} from "../../services/workspaceApi";

export function Myworkspace() {
  const { myWSData } = useUserData();
  const navigate = useNavigate();

  const [processWorkspaces, setProcessWorkspaces] = useState<workspace[]>([]);
  const [completeWorkspaces, setCompleteWorkspaces] = useState<workspace[]>([]);
  const [completeModalOpen, setCompleteModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [forbiddenModal, setForbiddenModal] = useState<boolean>(false);
  const [wsMenuOpenId, setWsMenuOpenId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!Array.isArray(myWSData)) return;
    const processWS = myWSData?.filter((ws) => Number(ws.progressStep) < 6);
    setProcessWorkspaces(processWS);
    const completeWS = myWSData?.filter((ws) => Number(ws.progressStep) === 6);
    setCompleteWorkspaces(completeWS);
  }, [myWSData]);

  // 각각의 스크롤 영역에 대해 따로 참조 만들기
  const activeRef = useRef<HTMLDivElement>(null);
  const completeRef = useRef<HTMLDivElement>(null);
  //메뉴 영역
  const wsMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wsMenuRef.current &&
        !wsMenuRef.current.contains(event.target as Node)
      ) {
        setWsMenuOpenId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickWS = (ws: workspace) => {
    const stepId = getStepIdFromNumber(ws.progressStep);
    navigate(`/ws/${ws.workspaceId}/${stepId}`);
  };

  const toggleMenu = (workspaceId: number) => {
    setWsMenuOpenId((prevId) => (prevId === workspaceId ? null : workspaceId));
  };

  const handleComplete = async (id: number, step: string) => {
    if (step === "5") {
      try {
        const response = await completeworkspace(id);
        console.log("완료 결과 : ", response.data);

        // progress에서 제거
        setProcessWorkspaces((prev) =>
          prev.filter((ws) => ws.workspaceId !== id)
        );

        // complete에 추가
        const completedWS = myWSData?.find((ws) => ws.workspaceId === id);
        if (completedWS) {
          setCompleteWorkspaces((prev) => [
            ...prev,
            { ...completedWS, progressStep: "6" },
          ]);
        }
      } catch (err: any) {
        if (err.response?.status === 403) {
          // 권한 없음 모달 열기
          setForbiddenModal(true);
        } else {
          setError("워크스페이스 완료에 실패했습니다");
        }
      }
    } else if (step === "6") {
      try {
        await completeworkspace(id);

        // complete에서 제거
        setCompleteWorkspaces((prev) =>
          prev.filter((ws) => ws.workspaceId !== id)
        );

        // process에 추가
        const revertedWS = myWSData?.find((ws) => ws.workspaceId === id);
        if (revertedWS) {
          setProcessWorkspaces((prev) => [
            ...prev,
            { ...revertedWS, progressStep: "5" },
          ]);
        }
      } catch (err: any) {
        if (err.response?.status === 403) {
          // 권한 없음 모달 열기
          setForbiddenModal(true);
        } else {
          setError("워크스페이스 완료취소에 실패했습니다");
        }
      }
    } else {
      setCompleteModalOpen(true);
    }
    setWsMenuOpenId(null);
  };
  const handleClickDelete = (id: number) => {
    setDeleteTargetId(id);
    setDeleteModalOpen(true);
    setWsMenuOpenId(null);
  };

  const handleConfirmDelete = async () => {
    if (deleteTargetId === null) return;

    try {
      await deleteworkspace(deleteTargetId);
      setProcessWorkspaces((prev) =>
        prev.filter((ws) => ws.workspaceId !== deleteTargetId)
      );
    } catch (err: any) {
      if (err.response?.status === 403) {
        // 권한 없음 모달 열기
        setForbiddenModal(true);
      } else setError("워크스페이스 삭제에 실패했습니다");
    } finally {
      setDeleteModalOpen(false);
      setDeleteTargetId(null);
    }
  };

  // 드래그 로직 재사용 함수
  const useDragScroll = (ref: React.RefObject<HTMLDivElement | null>) => {
    const isDragging = useRef(false);
    const moved = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);

    const handleMouseDown = (e: React.MouseEvent) => {
      isDragging.current = true;
      moved.current = false;
      startX.current = e.pageX - (ref.current?.offsetLeft ?? 0);
      scrollLeft.current = ref.current?.scrollLeft ?? 0;
    };

    const handleMouseMove = (e: React.MouseEvent) => {
      if (!isDragging.current || !ref.current) return;
      const x = e.pageX - ref.current.offsetLeft;
      const walk = x - startX.current;
      //마우스를 눌렀을 때가 아닌 드래그 했을 때만 드래그로 판단
      if (Math.abs(walk) > 0) {
        moved.current = true; // 이동했다고 간주
        ref.current.scrollLeft = scrollLeft.current - walk;
      }
    };

    const handleMouseLeave = () => {
      isDragging.current = false;
      moved.current = false;
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    useEffect(() => {
      const el = ref.current;
      if (!el) return;

      const handleWheel = (e: WheelEvent) => {
        if (e.deltaY !== 0) {
          e.preventDefault();
          el.scrollLeft += e.deltaY;
        }
      };
      el.addEventListener("wheel", handleWheel, { passive: false });
      return () => el.removeEventListener("wheel", handleWheel);
    }, [ref]);

    return {
      onMouseDown: handleMouseDown,
      onMouseLeave: handleMouseLeave,
      onMouseUp: handleMouseUp,
      onMouseMove: handleMouseMove,
      isMoved: () => moved.current,
    };
  };

  const activeHandlers = useDragScroll(activeRef);
  const completeHandlers = useDragScroll(completeRef);

  const renderCards = (
    data: workspace[],
    dragHandlers: ReturnType<typeof useDragScroll>
  ) =>
    data.map((ws) => (
      <div
        key={ws.workspaceId}
        className="workspace-card"
        onClick={(e) => {
          if ((e.target as HTMLElement).closest(".workspace-more")) return;
          if (!dragHandlers.isMoved()) {
            handleClickWS(ws);
          } // 드래그가 아니었을 경우만 진입
        }}
      >
        <div>
          <div
            className="workspace-more"
            onClick={(e) => {
              e.stopPropagation();
              toggleMenu(ws.workspaceId);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#000000"
            >
              <path d="M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z" />
            </svg>
          </div>
          {wsMenuOpenId === ws.workspaceId && Number(ws.progressStep) < 6 && (
            <div ref={wsMenuRef} className="workspace-menu">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleComplete(ws.workspaceId, ws.progressStep);
                  // : (setMenuModalOpen(true), setWsMenuOpenId(null));
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#5EC93D"
                >
                  <path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                </svg>
                <p>워크스페이스 완료</p>
              </div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleClickDelete(ws.workspaceId);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#EA3323"
                >
                  <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                </svg>
                <p>워크스페이스 삭제</p>
              </div>
            </div>
          )}
          {wsMenuOpenId === ws.workspaceId && ws.progressStep === "6" && (
            <div ref={wsMenuRef} className="workspace-menu">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleComplete(ws.workspaceId, ws.progressStep);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#EA3323"
                >
                  <path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                </svg>
                <p>완료 취소</p>
              </div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleClickDelete(ws.workspaceId);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#EA3323"
                >
                  <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                </svg>
                <p>워크스페이스 삭제</p>
              </div>
            </div>
          )}
          <div className="ws-title-container">
            <p className="workspace-title" title={ws.projectName}>
              {/* 마우스 가져다대면 title뜨는거 기본인데 나중에 시간 남으면 커스텀 해보기로! */}
              {ws.isPublic ? "" : "🔒"}
              {ws.projectName}
            </p>
          </div>
        </div>
        <div className="workspace-team">
          <p>{ws.teamName}</p>
        </div>
      </div>
    ));

  return (
    <div className="workspace-container">
      <div className="ws-container-2">
        <p className="wstitle">진행 중인 워크스페이스</p>
        <div className="workspace-active-container">
          <div
            className="workspace-scroll"
            ref={activeRef}
            onMouseDown={activeHandlers.onMouseDown}
            onMouseMove={activeHandlers.onMouseMove}
            onMouseUp={activeHandlers.onMouseUp}
            onMouseLeave={activeHandlers.onMouseLeave}
          >
            {renderCards(processWorkspaces, activeHandlers)}
          </div>
          <button onClick={() => navigate("/addws")}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#000000"
            >
              <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
            </svg>
          </button>
        </div>

        <p className="wstitle">완료한 워크스페이스</p>
        <div
          className="workspace-scroll"
          ref={completeRef}
          onMouseDown={completeHandlers.onMouseDown}
          onMouseMove={completeHandlers.onMouseMove}
          onMouseUp={completeHandlers.onMouseUp}
          onMouseLeave={completeHandlers.onMouseLeave}
        >
          {renderCards(completeWorkspaces, completeHandlers)}
        </div>
      </div>
      {forbiddenModal && (
        <BasicModal
          modalTitle="작업 수행 권한이 없습니다"
          modalDescription="워크스페이스 관리는 관리자만 가능합니다"
          Close={() => setForbiddenModal(false)}
        />
      )}
      {completeModalOpen && (
        <BasicModal
          modalTitle="워크스페이스를 완료할 수 없습니다"
          modalDescription="프로젝트를 모두 완료한 후 완료 가능합니다"
          Close={() => setCompleteModalOpen(false)}
        />
      )}
      {deleteModalOpen && (
        <WsDeleteModal
          onClose={() => {
            setDeleteTargetId(null), setDeleteModalOpen(false);
          }}
          onConfirm={() => handleConfirmDelete()}
        />
      )}
      {error && (
        <BasicModal
          modalTitle={error}
          modalDescription={
            "일시적인 오류가 발생했습니다 페이지를 새로고침하거나 잠시 후 다시 시도해 주세요"
          }
          Close={() => setError("")}
        ></BasicModal>
      )}
    </div>
  );
}
