import { Handle, Position } from "reactflow";
import type { NodeProps, NodeTypes } from "reactflow";
import type { ERDField, ERDTable } from "../../../types/erd";
import "./ERDPage.css";
import "reactflow/dist/style.css";

const TableNode: React.FC<NodeProps<ERDTable>> = ({ data }) => (
  <div className="table-node">
    <div className="table-node-header">{data.tableName}</div>
    <div className="table-node-body">
      {data.fields.map((field) => (
        <div key={field.name} className="table-node-row">
          <Handle
            type="target"
            position={Position.Left}
            id={`target-${field.name}`}
            className="handle-left"
          />
          <div className="table-node-field">
            {field.primary && <span>🔑</span>}
            {field.foreign && <span>🔗</span>}
            <p
              className={`field-name ${field.primary ? "font-bold" : ""} ${
                field.foreign ? "text-foreign" : ""
              }`}
            >
              {field.name}
            </p>
          </div>
          <span className="field-type">{field.type}</span>
          <span className="nullable-type">
            {field.nullable ? "NULL" : "NOT NULL"}
          </span>
          <Handle
            type="source"
            position={Position.Right}
            id={`source-${field.name}`}
            className="handle-right"
          />
        </div>
      ))}
    </div>
  </div>
);
export const nodeTypes = {
  tableNode: TableNode,
};

const EditableTableNode: React.FC<
  NodeProps<
    ERDTable & {
      onFieldChange: (
        tableId: string,
        fieldIdx: number,
        key: keyof ERDField,
        value: string | boolean
      ) => void;
    }
  >
> = ({ data }) => {
  const { onFieldChange, ...tableData } = data;

  return (
    <div className="table-node editable-table-node">
      <div className="table-node-header">
        <input
          className="table-name-input"
          value={tableData.tableName}
          onChange={(e) => {
            // 테이블명 변경 로직 필요시 추가
          }}
        />
      </div>
      <div className="table-node-body">
        {tableData.fields.map((field, fieldIdx) => (
          <div key={fieldIdx} className="table-node-row editable-row">
            <Handle
              type="target"
              position={Position.Left}
              id={`target-${tableData.tableName}-${field.name}`}
              className="handle-left"
            />

            <div className="editable-field-container">
              {/* Primary Key 체크박스 */}
              <span className="icon-primary">🔑</span>
              <input
                type="checkbox"
                checked={field.primary || false}
                onChange={(e) =>
                  onFieldChange(
                    tableData.id,
                    fieldIdx,
                    "primary",
                    e.target.checked
                  )
                }
                className="checkbox-primary"
              />

              {/* Foreign Key 체크박스 */}
              <input
                type="checkbox"
                checked={field.foreign || false}
                onChange={(e) =>
                  onFieldChange(
                    tableData.id,
                    fieldIdx,
                    "foreign",
                    e.target.checked
                  )
                }
                className="checkbox-foreign"
              />
              {field.foreign && <span className="icon-foreign">🔗</span>}

              {/* 필드명 입력 */}
              <input
                className="field-name-input"
                value={field.name}
                onChange={(e) =>
                  onFieldChange(tableData.id, fieldIdx, "name", e.target.value)
                }
                placeholder="필드명"
              />

              {/* 타입 입력 */}
              <select
                className="field-type-select"
                value={field.type || ""}
                onChange={(e) =>
                  onFieldChange(tableData.id, fieldIdx, "type", e.target.value)
                }
              >
                <option value="">타입 선택</option>
                <option value="INTEGER">INTEGER</option>
                <option value="VARCHAR(50)">VARCHAR(50)</option>
                <option value="VARCHAR(100)">VARCHAR(100)</option>
                <option value="VARCHAR(255)">VARCHAR(255)</option>
                <option value="TEXT">TEXT</option>
                <option value="DATETIME">DATETIME</option>
                <option value="BOOLEAN">BOOLEAN</option>
                <option value="DECIMAL">DECIMAL</option>
              </select>

              {/* NULL 허용 체크박스 */}
              <label className="nullable-label">
                <input
                  type="checkbox"
                  checked={field.nullable || false}
                  onChange={(e) =>
                    onFieldChange(
                      tableData.id,
                      fieldIdx,
                      "nullable",
                      e.target.checked
                    )
                  }
                />
                NULL
              </label>
            </div>

            <Handle
              type="source"
              position={Position.Right}
              id={`source-${tableData.tableName}-${field.name}`}
              className="handle-right"
            />
          </div>
        ))}

        {/* 새 필드 추가 버튼 */}
        <div className="add-field-row">
          <button
            className="add-field-btn"
            onClick={() => {
              // 새 필드 추가 로직
              const newField: ERDField = {
                name: "new_field",
                type: "VARCHAR(50)",
                nullable: true,
                primary: false,
                foreign: false,
              };
              // onAddField(data.id, newField); // 이 함수도 props로 전달 필요
            }}
          >
            + 필드 추가
          </button>
        </div>
      </div>
    </div>
  );
};
// 노드 타입 정의
export const editableNodeTypes: NodeTypes = {
  editableTableNode: EditableTableNode,
};
