import type { Node, Edge } from "reactflow";
import { MarkerType } from "reactflow";
import type { ERDRelation, ERDTable } from "../types/erd";

export function generateEdgesFromData(relations: ERDRelation[]): Edge[] {
  return relations.map((rel) => ({
    id: rel.id,
    source: rel.source,
    target: rel.target,
    sourceHandle: rel.sourceHandle,
    targetHandle: rel.targetHandle,
    label: rel.label,
    animated: true,
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
    style: { stroke: "#555" },
  }));
}

export function generateNodesFromData(tables: ERDTable[]): Node[] {
  const gapX = 600;
  const gapY = 300;

  return tables.map((table, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    return {
      id: table.id,
      type: "tableNode",
      data: {
        tableName: table.tableName,
        fields: table.fields,
      },
      position: { x: col * gapX, y: row * gapY },
    };
  });
}

// 수정페이지 노드 생성 함수
export function generateEdittableNodes(tables: ERDTable[]): Node[] {
  const gapX = 550;
  const gapY = 500;
  const maxCols = 3; // 한 줄에 최대 3개까지

  return tables.map((table, index) => {
    // const col = index % 2;
    // const row = Math.floor(index / 2);
    const col = index % maxCols;
    const row = Math.floor(index / maxCols);
    const x = col * gapX + Math.random() * 30;
    const y = row * gapY + Math.random() * 30;

    return {
      id: table.id,
      type: "editableTableNode",
      position: { x, y },
      data: table,
    };
  });
}

// 수정페이지 엣지 생성 함수
export function generateEdittableRelations(relations: ERDRelation[]): Edge[] {
  return relations.map((relation, index) => ({
    id: `edge-${index}`,
    source: relation.source,
    target: relation.target,
    sourceHandle: `source-${relation.source}-${relation.sourceHandle}`,
    targetHandle: `target-${relation.target}-${relation.targetHandle}`,
    type: "smoothstep",
    animated: true,
    style: { stroke: "#00205B", strokeWidth: 2 },
    label: relation.label || "1:N",
  }));
}
