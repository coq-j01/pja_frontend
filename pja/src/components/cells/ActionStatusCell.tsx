import { useState } from "react";
import type { Status } from "../../types/list";
import "./ActionStatusCell.css"; // CSS 파일 임포트

interface StatusCellProps {
  status: Status;
  onChange: (newStatus: Status) => void;
  disable: boolean;
}

const statusLabels: Record<Status, string> = {
  BEFORE: "진행 전",
  IN_PROGRESS: "진행 중",
  DONE: "완료",
};

const statusColors: Record<Status, string> = {
  BEFORE: "#d9d9d6",
  IN_PROGRESS: "#fec300",
  DONE: "#fe5000",
};

export const ActionStatusCell = ({
  status,
  onChange,
  disable,
}: StatusCellProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleSelect = (newStatus: Status) => {
    console.log("selected status:", newStatus);
    onChange(newStatus);
    setIsEditing(false);
  };

  return (
    <div className="status-td">
      {isEditing && !disable ? (
        <div className="status-dropdown">
          {(["BEFORE", "IN_PROGRESS", "DONE"] as Status[]).map((s) => (
            <div
              key={s}
              className="status-option"
              onClick={() => handleSelect(s)}
            >
              <span
                className="status-dot"
                style={{ backgroundColor: statusColors[s] }}
              />
              <span>{statusLabels[s]}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="status-display" onClick={() => setIsEditing(true)}>
          <span
            className="status-dot"
            style={{ backgroundColor: statusColors[status] }}
          />
          <span>{statusLabels[status]}</span>
        </div>
      )}
    </div>
  );
};
