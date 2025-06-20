import type { action } from "../../types/list";
import "./FeatureProgressCell.css";

export const FeatureProgressCell = ({ actions }: { actions: action[] }) => {
  const total = actions.length;
  const completed = actions.filter((a) => a.state === "DONE").length;
  const inProgress = actions.filter((a) => a.state === "IN_PROGRESS").length;
  const notStarted = total - completed - inProgress;

  const getPercent = (n: number) => `${(n / total) * 100}%`;

  return (
    <div className="ftprogress-bar-container">
      <div
        className="ftbar-section completed"
        style={{ width: getPercent(completed) }}
      />
      <div
        className="ftbar-section in-progress"
        style={{ width: getPercent(inProgress) }}
      />
      <div
        className="ftbar-section not-started"
        style={{ width: getPercent(notStarted) }}
      />
    </div>
  );
};
