import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { WSHeader } from "../../../components/header/WSHeader";
import { Controls, ReactFlow, useReactFlow, type Edge } from "reactflow";
import type { Node } from "reactflow";
import {
  generateEdgesFromData,
  generateNodesFromData,
} from "../../../utils/erdUtils";
import { nodeTypes } from "./TableNode";
import { progressworkspace } from "../../../services/workspaceApi";
import { useNavigate } from "react-router-dom";
import { setSelectedWS } from "../../../store/workspaceSlice";
import { getStepIdFromNumber } from "../../../utils/projectSteps";
import { useEffect, useState } from "react";
// import ERDEdit from "./ERDEdit";
import "./ERDPage.css";
import "reactflow/dist/style.css";
import { getAllErd, getErdId } from "../../../services/erdApi";
import ERDEdit from "./ERDEdit";

export default function ERDPage() {
  const dispatch = useDispatch();
  const selectedWS = useSelector(
    (state: RootState) => state.workspace.selectedWS
  );

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  // const nodes = generateNodesFromData(tableData);
  const [erdDone, setErdDone] = useState<boolean>(false);
  const [modifyMode, setModifyMode] = useState<boolean>(false);
  const navigate = useNavigate();

  const geterd = async () => {
    // erdId조회api
    try {
      if (selectedWS?.workspaceId) {
        const getid = await getErdId(selectedWS.workspaceId);
        console.log("erdId 성공", getid.data);
        const ERDID = getid.data?.erdId;
        console.log(ERDID);

        if (ERDID) {
          try {
            const getallerd = await getAllErd(selectedWS?.workspaceId, ERDID);
            console.log("getallerd 결과", getallerd);

            const relations = getallerd.data?.relations;
            const tables = getallerd.data?.tables;

            if (relations && tables) {
              const generatedNodes = generateNodesFromData(tables);
              const generatedEdges = generateEdgesFromData(relations);

              setNodes(generatedNodes);
              setEdges(generatedEdges);
            }
          } catch (err) {
            console.log("getallerd 실패", err);
          }
        }
      }
    } catch (err) {
      console.log("erdId 조회 실패");
    }
  };

  useEffect(() => {
    geterd();
    if (Number(selectedWS?.progressStep) > 3) {
      setErdDone(true);
    }
  }, [selectedWS]);
  useEffect(() => {
    console.log(
      "✅ nodes 상태 확인",
      nodes.map((n) => n.position)
    );
  }, [nodes]);
  const { fitView } = useReactFlow();

  useEffect(() => {
    const handleResize = () => {
      fitView({ padding: 0.2 });
    };

    return () => window.removeEventListener("resize", handleResize);
  }, [nodes, fitView]);

  useEffect(() => {
    console.log("🔍 전체 노드 데이터:");
    nodes.forEach((node, index) => {
      console.log(`Node ${index}:`, {
        id: node.id,
        position: node.position,
        tableName: node.data?.tableName,
      });
    });
  }, [nodes]);
  //완료 버튼
  const handleErdComplete = async () => {
    if (selectedWS?.progressStep === "3") {
      try {
        //여기에 API명세서 호출 api 선언하면 됨

        await progressworkspace(selectedWS.workspaceId, "4");
        console.log("API페이지로 이동");
        dispatch(
          setSelectedWS({
            ...selectedWS,
            progressStep: "4",
          })
        );
        setErdDone(true);
        navigate(
          `/ws/${selectedWS?.workspaceId}/step/${getStepIdFromNumber("4")}`
        );
      } catch (err) {
        console.log("api명세서 ai생성 실패", err);
      }
    }
  };

  return (
    <>
      <WSHeader title="ERD 생성" />
      <div className="erd-page-container">
        {/* <ReactFlow nodes={nodes} edges={initialEdges} nodeTypes={nodeTypes} /> */}
        {modifyMode ? (
          <ERDEdit onClose={() => setModifyMode(false)} />
        ) : (
          <>
            <div className="erd-page-header">
              <p className="erd-title">
                ✨아이디어와 명세서를 분석하여 ERD 추천을 해드려요
              </p>
              <div className="erd-btn-group">
                <div className="erd-btn" onClick={() => setModifyMode(true)}>
                  수정하기
                </div>
                {!erdDone && (
                  <div className="erd-complete-btn" onClick={handleErdComplete}>
                    저장하기
                  </div>
                )}
              </div>
            </div>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.2 }}
              defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
              zoomOnScroll={false}
              zoomActivationKeyCode="Control" // Ctrl 키 누르고 휠 돌릴 때만 확대/축소
              className="erdflow-container"
            >
              <Controls />
            </ReactFlow>
          </>
        )}
      </div>
    </>
  );
}
