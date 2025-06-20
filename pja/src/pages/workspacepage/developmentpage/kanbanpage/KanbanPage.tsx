import { useNavigate } from "react-router-dom";
import { useCategoryFeatureCategory } from "../../../../hooks/useCategoryFeatureAction";
import type { Status } from "../../../../types/list";

import "./KanbanPage.css";
export default function KanbanPage() {
  const navigate = useNavigate();
  const { categoryList, workspaceId } = useCategoryFeatureCategory();

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

  const statusBgColors: Record<Status, string> = {
    BEFORE: "rgba(217, 217, 214, 0.2)",
    IN_PROGRESS: "rgba(254, 195, 0, 0.2)",
    DONE: "rgba(254, 80, 0, 0.2)",
  };

  // ✅ 남은 날짜 계산 함수
  const getRemainingDays = (endDate?: Date): string => {
    if (!endDate) return "-";
    const today = new Date();
    // 시/분/초 제거 (날짜 비교 정확성 확보)
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(endDate);
    targetDate.setHours(0, 0, 0, 0);

    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "D-DAY";
    if (diffDays > 0) return `D-${diffDays}`;
    return `D+${Math.abs(diffDays)}`;
  };

  const renderKanbanCards = (statusKey: Status) => {
    return categoryList.flatMap((cg) =>
      cg.features.flatMap((ft) => {
        const filteredActions = ft.actions.filter(
          (ac) => ac.state === statusKey
        );
        if (filteredActions.length === 0) return [];

        return (
          <div
            className="kanban-category"
            key={`${cg.featureCategoryId}-${ft.featureId}`}
          >
            <div
              className="category-title"
              style={{ backgroundColor: statusColors[statusKey] }}
            >
              {cg.name}
            </div>

            <div className="feature-block">
              <div className="feature-title">{ft.name}</div>
              {filteredActions.map((ac) => (
                <div className="kanban-action-card" key={ac.actionId}>
                  <div className="kanban-action-title">
                    <span
                      onClick={() =>
                        navigate(`/ws/${workspaceId}/action/${ac.actionPostId}`)
                      }
                    >
                      {ac.name}
                    </span>
                    <p>{getRemainingDays(ac.endDate ?? undefined)}</p>
                  </div>
                  <div className="kanban-action-card-content">
                    <div className="kanban-parti">
                      {ac.participants?.map((member) =>
                        member?.profileImage ? (
                          <img
                            key={member.memberId}
                            src={member.profileImage}
                            alt={member.username}
                            className="listprofile-img"
                            title={member.username}
                          />
                        ) : (
                          <div
                            key={member.memberId}
                            className="listprofile-none"
                            title={member.username}
                          >
                            {member.username.charAt(0)}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })
    );
  };

  return (
    <div className="kanban-board">
      {(["BEFORE", "IN_PROGRESS", "DONE"] as Status[]).map((statusKey) => (
        <div
          className="kanban-column"
          key={statusKey}
          style={{ backgroundColor: statusBgColors[statusKey] }}
        >
          <div className="kanban-column-title">{statusLabels[statusKey]}</div>
          {renderKanbanCards(statusKey)}
        </div>
      ))}
    </div>
  );
}
