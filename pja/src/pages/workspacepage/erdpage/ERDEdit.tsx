import { useEffect, useState } from "react";
import type { ERDField, ERDRelation, ERDTable } from "../../../types/erd";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { getAllErd, getErdId } from "../../../services/erdApi";
import type { IsClose } from "../../../types/common";
import { editableNodeTypes } from "./TableNode";
import {
  generateEdittableNodes,
  generateEdittableRelations,
} from "../../../utils/erdUtils";
import { ReactFlow, type Edge, type Node } from "reactflow";
import "./ERDPage.css";

export default function ERDEdit({ onClose }: IsClose) {
  const [tables, setTables] = useState<ERDTable[]>([]);
  const [edges, setEdges] = useState<ERDRelation[]>([]);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [flowEdges, setFlowEdges] = useState<Edge[]>([]);
  const selectedWS = useSelector(
    (state: RootState) => state.workspace.selectedWS
  );
  const [erdId, setErdId] = useState<number>();

  const geterd = async () => {
    // erdId조회
    try {
      if (selectedWS?.workspaceId) {
        const getid = await getErdId(selectedWS.workspaceId);
        console.log("erdId 성공", getid.data);
        const ERDID = getid.data?.erdId;
        console.log(ERDID);

        if (ERDID) {
          setErdId(ERDID);
          try {
            const getallerd = await getAllErd(selectedWS?.workspaceId, ERDID);
            console.log("getallerd 결과", getallerd);

            if (getallerd.data) {
              setTables(getallerd.data.tables);
              setEdges(getallerd.data.relations);
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
  }, [selectedWS]);

  useEffect(() => {
    if (tables.length > 0) {
      const generatedNodes = generateEdittableNodes(tables);
      const generatedEdges = generateEdittableRelations(edges);

      setNodes(generatedNodes);
      setFlowEdges(generatedEdges);
    }
  }, [tables, edges]);

  const handleFieldChange = (
    tableId: string,
    fieldId: number,
    key: keyof ERDField,
    value: string | boolean
  ) => {
    setTables((prevTables) => {
      return prevTables.map((table) => {
        if (table.id === tableId) {
          const updatedFields = [...table.fields];
          updatedFields[fieldId] = {
            ...updatedFields[fieldId],
            [key]: value,
          };
          return {
            ...table,
            fields: updatedFields,
          };
        }
        return table;
      });
    });
  };
  // 새 테이블 추가 핸들러
  const handleAddTable = () => {
    const newTableId = `table_${Date.now()}`;
    const newTable: ERDTable = {
      id: newTableId,
      tableName: "새테이블",
      fields: [
        {
          name: "",
          type: "",
          primary: false,
          nullable: false,
          foreign: false,
        },
      ],
    };

    setTables((prev) => [...prev, newTable]);
  };

  // 저장 핸들러
  const handleSave = async () => {
    try {
      // 여기에 저장 API 호출
      console.log("저장할 데이터:", { tables, edges });
      // await saveErd(selectedWS?.workspaceId, erdId, { tables, relations: edges });
      onClose();
    } catch (err) {
      console.log("저장 실패:", err);
    }
  };

  return (
    <>
      <div className="erd-page-header">
        <p className="erd-title">✨ERD를 직접 편집해보세요</p>
        <div className="erd-btn-group">
          <div className="erd-btn" onClick={handleSave}>
            완료하기
          </div>
          <div className="erd-btn" onClick={handleAddTable}>
            새 테이블 생성하기
          </div>
        </div>
      </div>
      {tables.map((table, tableIdx) => (
        <div key={tableIdx}>
          <h2>{table.tableName}</h2>
          {table.fields.map((field, fieldIdx) => (
            <div key={fieldIdx}>
              <input
                value={field.name}
                onChange={(e) =>
                  handleFieldChange(table.id, fieldIdx, "name", e.target.value)
                }
              />
              <input
                value={field.type ?? ""}
                onChange={(e) =>
                  handleFieldChange(table.id, fieldIdx, "type", e.target.value)
                }
              />
            </div>
          ))}
        </div>
      ))}
      <div
        className="erd-edit-container"
        style={{ height: "calc(100vh - 200px)" }}
      >
        <ReactFlow
          nodes={nodes.map((node) => ({
            ...node,
            data: {
              ...node.data,
              onFieldChange: handleFieldChange,
            },
          }))}
          edges={flowEdges}
          nodeTypes={editableNodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
          className="erdflow-container"
          nodesDraggable={true}
          nodesConnectable={false}
          elementsSelectable={true}
        />
      </div>
    </>
  );
}
