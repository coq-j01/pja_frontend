import { useEffect, useRef, useState } from "react";
import "./GanttChartPage.css";
import { getSequentialColor } from "../../../../utils/colorUtils";
import { Gantt_COLORS } from "../../../../constants/colors";
import type { getaction } from "../../../../types/list";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../store/store";
import { getactionlist } from "../../../../services/listapi/ActionApi";
import { useNavigate } from "react-router-dom";

function dateDiffInDays(a: Date, b: Date) {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  return Math.floor(
    (Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()) -
      Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())) /
      _MS_PER_DAY
  );
}

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10); // yyyy-mm-dd
}

export default function GanttChartPage() {
  const selectedWS = useSelector(
    (state: RootState) => state.workspace.selectedWS
  );

  const navigate = useNavigate();

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const scrollStartX = useRef(0);

  const [actionList, setActionList] = useState<getaction[]>([]);

  const startDates = actionList.map((t) => new Date(t.startDate ?? new Date()));
  const endDates = actionList.map((t) => new Date(t.endDate ?? new Date()));
  const chartStart = new Date(Math.min(...startDates.map((d) => d.getTime())));
  const chartEnd = new Date(Math.max(...endDates.map((d) => d.getTime())));
  const totalDays = dateDiffInDays(chartStart, chartEnd);
  const today = formatDate(new Date());

  const dates: string[] = [];
  for (let i = 0; i <= totalDays; i++) {
    const d = new Date(chartStart);
    d.setDate(d.getDate() + i);
    dates.push(formatDate(d));
  }

  const CELL_WIDTH = 80;

  // 오늘 날짜를 가운데로 스크롤
  const scrollToToday = () => {
    if (!containerRef.current || !contentRef.current) return;
    const todayIndex = dates.indexOf(today);
    if (todayIndex === -1) return;

    const scrollTo =
      todayIndex * CELL_WIDTH -
      containerRef.current.clientWidth / 2 +
      CELL_WIDTH / 2;
    containerRef.current.scrollLeft = scrollTo > 0 ? scrollTo : 0;
  };

  //액션리스트 불러오기
  const getaclist = async () => {
    if (selectedWS?.workspaceId) {
      try {
        const aclist = await getactionlist(selectedWS.workspaceId);
        console.log("getactionlist 결과", aclist.data);
        if (aclist.data) {
          setActionList([...aclist.data]);
        }
      } catch (err) {
        console.log("액션리스트 불러오기 실패");
      }
    }
  };

  useEffect(() => {
    getaclist();
  }, []);

  useEffect(() => {
    // actionList가 바뀔 때마다 오늘 위치로 스크롤
    if (actionList.length > 0) {
      scrollToToday();
    }
  }, [actionList]);

  // 드래그 핸들링
  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
    scrollStartX.current = containerRef.current?.scrollLeft || 0;
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    const dx = e.clientX - dragStartX.current;
    containerRef.current.scrollLeft = scrollStartX.current - dx;
  };

  const onMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging]);
  if (!actionList || actionList.length === 0) {
    return (
      <div className="gantt-empty">
        <p>표시할 작업이 없습니다.</p>
      </div>
    );
  }
  const minRows = 14; // 최소 14줄 확보
  const rowCount = Math.max(
    minRows,
    Math.ceil((actionList.length * 40 + 60) / 40)
  );

  return (
    <>
      <div className="gantt-header">
        <p>
          {formatDate(chartStart)} ~ {formatDate(chartEnd)}
        </p>
        <button onClick={() => scrollToToday()}>오늘</button>
      </div>

      <div
        className="gantt-container"
        ref={containerRef}
        onMouseDown={onMouseDown}
      >
        <div
          className="gantt-drag-area"
          ref={contentRef}
          style={{ width: dates.length * CELL_WIDTH }}
        >
          <div className="gantt-content">
            <div
              className="gantt-chart"
              style={{ width: dates.length * CELL_WIDTH }}
            >
              {/* 배경 그리드 - 날짜 컬럼들을 반복해서 생성 */}

              <div className="gantt-background">
                {Array.from({ length: rowCount }).map((_, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="gantt-row"
                    style={{ top: rowIndex * 40 }}
                  >
                    {dates.map((date) => {
                      const isToday = date === today;
                      return (
                        <div
                          key={`${rowIndex}-${date}`}
                          className={`gantt-cell ${isToday ? "today" : ""}`}
                          style={{ width: CELL_WIDTH }}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* 날짜 라벨 (맨 위 고정) */}
              <div className="gantt-date-labels">
                {dates.map((date) => (
                  <div
                    key={date}
                    className="gantt-date-label"
                    style={{ width: CELL_WIDTH }}
                  >
                    {date.slice(5)}
                  </div>
                ))}
              </div>

              {/* 태스크 바들 */}
              {actionList.map((task, i) => {
                if (!task.endDate || !task.startDate) return;
                const left =
                  dateDiffInDays(chartStart, new Date(task.startDate)) *
                  CELL_WIDTH;
                const width =
                  (dateDiffInDays(
                    new Date(task.startDate),
                    new Date(task.endDate)
                  ) +
                    1) *
                  CELL_WIDTH;

                return (
                  <div
                    key={task.actionId}
                    className="gantt-task-bar"
                    style={{
                      top: i * 40 + 40, // 날짜 라벨 아래부터 시작
                      left,
                      width,
                      backgroundColor: getSequentialColor(Gantt_COLORS, i),
                    }}
                  >
                    <span
                      className="gantt-task-name"
                      title={`${task.actionName}`}
                      onClick={() =>
                        navigate(
                          `/ws/${selectedWS?.workspaceId}/action/${task.actionPostId}`
                        )
                      }
                    >
                      {task.actionName}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
