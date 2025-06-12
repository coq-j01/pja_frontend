import "./ListTable.css";
import { useState } from "react";
import React from "react";
import DateSelectCell from "../../../../components/cells/DateSelectCell";
import { ActionStatusCell } from "../../../../components/cells/ActionStatusCell";
import { FeatureProgressCell } from "../../../../components/cells/FeatureProgessCell";
import { ImportanceCell } from "../../../../components/cells/ImportantCell";
import { ParticipantsCell } from "../../../../components/cells/ParticipantsCell";
import { useNavigate } from "react-router-dom";
import { useCategoryFeatureCategory } from "../../../../hooks/useCategoryFeatureAction";
import type { Status } from "../../../../types/list";
import { Members } from "../../../../constants/userconstants";
import FilterTable from "./FilterTable";
import { NoCgAddModal } from "../../../../components/modal/WsmenuModal";

export default function ListTable() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [showFilter, setShowFilter] = useState<Boolean>(false);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedAssignees, setSelectedAssignees] = useState<number[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<Status[]>([]);
  const [showCategory, setShowCategory] = useState(false);
  const [showParticipant, setShowParticipant] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const {
    categoryList,
    clickCg,
    clickFt,
    name,
    workspaceId,
    participantList,
    editingCategoryId,
    editingFeatureId,
    editingActionId,
    featuresByCategoryId,
    actionsByFeatureId,
    testCheckCg,
    testCheckFt,
    testCheckAc,
    categoryCompletableMap,

    toggleTestCheckCg,
    toggleTestCheckFt,
    toggleTestCheckAc,
    setName,
    setEditingCategoryId,
    setEditingFeatureId,
    setEditingActionId,

    handleCompleteClick,
    cgToggleClick,
    ftToggleClick,

    updateAssignee,
    updateStatus,
    updateImportance,
    updateStartDate,
    updateEndDate,
    handleAddCategory,
    updateCategoryName,
    handleAddFeature,
    updateFeatureName,
    handleAddAction,
    updateActionName,

    handleDeleteCategory,
    handleDeleteFeature,
    handleDeleteAction,
  } = useCategoryFeatureCategory();

  const statusLabels: Record<Status, string> = {
    NOT_STARTED: "진행 전",
    IN_PROGRESS: "진행 중",
    COMPLETED: "완료",
  };

  const navigate = useNavigate();

  return (
    <div className="listtable-container">
      {isModalOpen && <NoCgAddModal onClose={() => setIsModalOpen(false)} />}
      <div className="listtable-btn-container">
        <button
          onClick={() => {
            if (showFilter) {
              setIsModalOpen(true);
            } else handleAddCategory();
          }}
        >
          <p>카테고리 추가</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20px"
            viewBox="0 -960 960 960"
            width="20px"
            fill="#FFFFFF"
          >
            <path d="M444-444H240v-72h204v-204h72v204h204v72H516v204h-72v-204Z" />
          </svg>
        </button>
        <button onClick={() => setIsFilter((prev) => !prev)}>
          <p>필터</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20px"
            viewBox="0 -960 960 960"
            width="20px"
            fill="#FFFFFF"
          >
            <path d="M456.18-192Q446-192 439-198.9t-7-17.1v-227L197-729q-9-12-2.74-25.5Q200.51-768 216-768h528q15.49 0 21.74 13.5Q772-741 763-729L528-443v227q0 10.2-6.88 17.1-6.89 6.9-17.06 6.9h-47.88ZM480-498l162-198H317l163 198Zm0 0Z" />
          </svg>
        </button>
        {isFilter && (
          <div className="filter-dropdown">
            {/* 카테고리 */}
            <div className="filter-group">
              <div
                className="filter-header"
                onClick={() => setShowCategory((prev) => !prev)}
              >
                <label>카테고리</label>
                {showCategory ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20px"
                    viewBox="0 -960 960 960"
                    width="20px"
                    fill="#000000"
                  >
                    <path d="M480-525 291-336l-51-51 240-240 240 240-51 51-189-189Z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20px"
                    viewBox="0 -960 960 960"
                    width="20px"
                    fill="#000"
                  >
                    <path d="M480-333 240-573l51-51 189 189 189-189 51 51-240 240Z" />
                  </svg>
                )}
              </div>
              <div className="dropdown-wrapper">
                {showCategory && (
                  <div className="dropdown-absolute">
                    {categoryList.map((cg) => (
                      <div key={cg.feature_category_id}>
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(
                            cg.feature_category_id
                          )}
                          onChange={() =>
                            setSelectedCategories((prev) =>
                              prev.includes(cg.feature_category_id)
                                ? prev.filter(
                                    (id) => id !== cg.feature_category_id
                                  )
                                : [...prev, cg.feature_category_id]
                            )
                          }
                        />
                        <span>{cg.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 참여자 */}
            <div className="filter-group">
              <div
                className="filter-header"
                onClick={() => setShowParticipant((prev) => !prev)}
              >
                <label>참여자</label>
                {showParticipant ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20px"
                    viewBox="0 -960 960 960"
                    width="20px"
                    fill="#000000"
                  >
                    <path d="M480-525 291-336l-51-51 240-240 240 240-51 51-189-189Z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20px"
                    viewBox="0 -960 960 960"
                    width="20px"
                    fill="#000"
                  >
                    <path d="M480-333 240-573l51-51 189 189 189-189 51 51-240 240Z" />
                  </svg>
                )}
              </div>
              <div className="dropdown-wrapper">
                {showParticipant && (
                  <div className="dropdown-absolute">
                    {participantList.map((user) => (
                      <div key={user}>
                        <input
                          type="checkbox"
                          checked={selectedAssignees.includes(user)}
                          onChange={() =>
                            setSelectedAssignees((prev) =>
                              prev.includes(user)
                                ? prev.filter((u) => u !== user)
                                : [...prev, user]
                            )
                          }
                        />
                        {Members.find((m) => m.user_id === user)
                          ?.profile_image ? (
                          <img
                            src={
                              Members.find((m) => m.user_id === user)
                                ?.profile_image
                            }
                            alt={Members.find((m) => m.user_id === user)?.name}
                            className="listprofile-img"
                          />
                        ) : (
                          <div className="listprofile-none">
                            {Members.find(
                              (m) => m.user_id === user
                            )?.name.charAt(0)}
                          </div>
                        )}
                        <span
                          title={Members.find((m) => m.user_id === user)?.name}
                        >
                          {Members.find((m) => m.user_id === user)?.name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 상태 */}
            <div className="filter-group">
              <div
                className="filter-header"
                onClick={() => setShowStatus((prev) => !prev)}
              >
                <label>상태</label>
                {showStatus ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20px"
                    viewBox="0 -960 960 960"
                    width="20px"
                    fill="#000000"
                  >
                    <path d="M480-525 291-336l-51-51 240-240 240 240-51 51-189-189Z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20px"
                    viewBox="0 -960 960 960"
                    width="20px"
                    fill="#000"
                  >
                    <path d="M480-333 240-573l51-51 189 189 189-189 51 51-240 240Z" />
                  </svg>
                )}
              </div>
              <div className="dropdown-wrapper">
                {showStatus && (
                  <div className="dropdown-absolute">
                    {(
                      ["NOT_STARTED", "IN_PROGRESS", "COMPLETED"] as Status[]
                    ).map((status) => (
                      <div key={status}>
                        <input
                          type="checkbox"
                          checked={selectedStatuses.includes(status)}
                          onChange={() =>
                            setSelectedStatuses((prev) =>
                              prev.includes(status)
                                ? prev.filter((s) => s !== status)
                                : [...prev, status]
                            )
                          }
                        />
                        <span>{statusLabels[status]}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => {
                setShowFilter(true);
                setShowCategory(false);
                setShowParticipant(false);
                setShowStatus(false);
              }}
              className="filter-apply-btn"
            >
              확인
            </button>
            <button
              onClick={() => {
                setShowFilter(false);
                setSelectedCategories([]);
                setSelectedAssignees([]);
                setSelectedStatuses([]);
              }}
              className="filter-apply-btn"
            >
              취소
            </button>
          </div>
        )}
      </div>
      {showFilter ? (
        <FilterTable
          selectedCategories={selectedCategories}
          selectedAssignees={selectedAssignees}
          selectedStatuses={selectedStatuses}
        />
      ) : (
        <table className="feature-table">
          <thead>
            <tr>
              <th>이름</th>
              <th>시작일</th>
              <th>마감일</th>
              <th>참여자</th>
              <th>상태</th>
              <th>중요도</th>
              <th>테스트 여부</th>
            </tr>
          </thead>
          <tbody>
            {categoryList.map((cg, index) => {
              const isCompleted = cg.state;

              const categoryFeatures =
                featuresByCategoryId.get(cg.feature_category_id) || [];

              return (
                <React.Fragment key={cg.feature_category_id}>
                  {/* 카테고리 행 */}
                  <tr className={`cg-row ${isCompleted ? "completed" : ""}`}>
                    <td className="list-name">
                      <div className="cglist-name">
                        {editingCategoryId === cg.feature_category_id ? (
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                (e.target as HTMLInputElement).blur(); // 엔터치면 blur로 확정
                              }
                            }}
                            onBlur={() =>
                              updateCategoryName(cg.feature_category_id)
                            }
                            autoFocus
                          />
                        ) : (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              height="20px"
                              viewBox="0 -960 960 960"
                              width="20px"
                              fill="#000"
                              onClick={() => cgToggleClick(index)}
                              style={{ cursor: "pointer" }}
                            >
                              <path
                                d={
                                  clickCg[index]
                                    ? "M480-333 240-573l51-51 189 189 189-189 51 51-240 240Z" // ▼
                                    : "M522-480 333-669l51-51 240 240-240 240-51-51 189-189Z" // ▶
                                }
                              />
                            </svg>
                            <svg
                              className="cglist-icon"
                              xmlns="http://www.w3.org/2000/svg"
                              height="20px"
                              viewBox="0 -960 960 960"
                              width="20px"
                              fill="#FFFFFF"
                            >
                              <path d="M48-144v-72h864v72H48Zm120-120q-29.7 0-50.85-21.15Q96-306.3 96-336v-408q0-29.7 21.15-50.85Q138.3-816 168-816h624q29.7 0 50.85 21.15Q864-773.7 864-744v408q0 29.7-21.15 50.85Q821.7-264 792-264H168Zm0-72h624v-408H168v408Zm0 0v-408 408Z" />
                            </svg>
                            {cg.name === "" ? (
                              <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    (e.target as HTMLInputElement).blur(); // 엔터치면 blur로 확정
                                  }
                                }}
                                onBlur={() => {
                                  updateCategoryName(
                                    cg.feature_category_id,
                                    true
                                  );
                                }}
                                autoFocus
                              />
                            ) : (
                              <>
                                <span title={cg.name}>{cg.name}</span>
                                <button
                                  className="list-modifybtn"
                                  onClick={() => {
                                    setName(cg.name);
                                    setEditingCategoryId(
                                      cg.feature_category_id
                                    );
                                  }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="20px"
                                    viewBox="0 -960 960 960"
                                    width="20px"
                                    fill="#FFFFFF"
                                  >
                                    <path d="M216-216h51l375-375-51-51-375 375v51Zm-72 72v-153l498-498q11-11 23.84-16 12.83-5 27-5 14.16 0 27.16 5t24 16l51 51q11 11 16 24t5 26.54q0 14.45-5.02 27.54T795-642L297-144H144Zm600-549-51-51 51 51Zm-127.95 76.95L591-642l51 51-25.95-25.05Z" />
                                  </svg>
                                </button>
                                <div>
                                  <button
                                    onClick={() =>
                                      handleAddFeature(cg.feature_category_id)
                                    }
                                    className="list-addbtn"
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
                                  </button>
                                  <button
                                    className="list-deletebtn"
                                    onClick={() =>
                                      handleDeleteCategory(
                                        cg.feature_category_id
                                      )
                                    }
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      height="20px"
                                      viewBox="0 -960 960 960"
                                      width="20px"
                                      fill="#FFFFFF"
                                    >
                                      <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
                                    </svg>
                                  </button>
                                </div>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                    <td />
                    <td />
                    <td />
                    <td>
                      <button
                        className={`list-completebtn ${
                          isCompleted ? "completed" : ""
                        }`}
                        disabled={
                          !categoryCompletableMap[cg.feature_category_id]
                        }
                        onClick={() =>
                          handleCompleteClick(cg.feature_category_id)
                        }
                      >
                        완료하기
                      </button>
                    </td>
                    <td />
                    <td>
                      <input
                        type="checkbox"
                        disabled={isCompleted}
                        className="list-checkbox"
                        checked={testCheckCg[cg.feature_category_id] || false}
                        onChange={() =>
                          toggleTestCheckCg(cg.feature_category_id)
                        }
                      />
                    </td>
                  </tr>

                  {/* 기능 리스트 */}
                  {clickCg[index] &&
                    categoryFeatures.map((ft) => {
                      const featureActions =
                        actionsByFeatureId.get(ft.feature_id) || [];

                      return (
                        <React.Fragment key={ft.feature_id}>
                          <tr
                            className={`ft-row ${
                              isCompleted ? "completed" : ""
                            }`}
                          >
                            <td className="list-name">
                              <div className="ftlist-name">
                                {editingFeatureId === ft.feature_id ? (
                                  <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        (e.target as HTMLInputElement).blur(); // 엔터치면 blur로 확정
                                      }
                                    }}
                                    onBlur={() => {
                                      updateFeatureName(
                                        ft.category_id,
                                        ft.feature_id
                                      );
                                    }}
                                    autoFocus
                                  />
                                ) : (
                                  <>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      height="20px"
                                      viewBox="0 -960 960 960"
                                      width="20px"
                                      fill="#000"
                                      onClick={() =>
                                        ftToggleClick(ft.feature_id)
                                      }
                                      style={{ cursor: "pointer" }}
                                    >
                                      <path
                                        d={
                                          clickFt[ft.feature_id]
                                            ? "M480-333 240-573l51-51 189 189 189-189 51 51-240 240Z"
                                            : "M522-480 333-669l51-51 240 240-240 240-51-51 189-189Z"
                                        }
                                      />
                                    </svg>
                                    <svg
                                      className="ftlist-icon"
                                      xmlns="http://www.w3.org/2000/svg"
                                      height="20px"
                                      viewBox="0 -960 960 960"
                                      width="20px"
                                      fill="#FFFFFF"
                                    >
                                      <path d="M168-192q-29 0-50.5-21.5T96-264v-432q0-29.7 21.5-50.85Q139-768 168-768h216l96 96h312q29.7 0 50.85 21.15Q864-629.7 864-600v336q0 29-21.15 50.5T792-192H168Zm0-72h624v-336H450l-96-96H168v432Zm0 0v-432 432Z" />
                                    </svg>
                                    {ft.name === "" ? (
                                      <input
                                        type="text"
                                        value={name}
                                        onChange={(e) =>
                                          setName(e.target.value)
                                        }
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter") {
                                            (
                                              e.target as HTMLInputElement
                                            ).blur(); // 엔터치면 blur로 확정
                                          }
                                        }}
                                        onBlur={() => {
                                          updateFeatureName(
                                            ft.category_id,
                                            ft.feature_id,
                                            true
                                          );
                                        }}
                                        autoFocus
                                      />
                                    ) : (
                                      <>
                                        <span title={ft.name}>{ft.name}</span>
                                        <button
                                          className="list-modifybtn"
                                          onClick={() => {
                                            setName(ft.name); // 현재 이름으로 초기화
                                            setEditingFeatureId(ft.feature_id); // 수정 모드 진입
                                          }}
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            height="20px"
                                            viewBox="0 -960 960 960"
                                            width="20px"
                                            fill="#FFFFFF"
                                          >
                                            <path d="M216-216h51l375-375-51-51-375 375v51Zm-72 72v-153l498-498q11-11 23.84-16 12.83-5 27-5 14.16 0 27.16 5t24 16l51 51q11 11 16 24t5 26.54q0 14.45-5.02 27.54T795-642L297-144H144Zm600-549-51-51 51 51Zm-127.95 76.95L591-642l51 51-25.95-25.05Z" />
                                          </svg>
                                        </button>
                                        <div>
                                          <button
                                            onClick={() =>
                                              handleAddAction(ft.feature_id)
                                            }
                                            className="list-addbtn"
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
                                          </button>
                                          <button
                                            onClick={() =>
                                              handleDeleteFeature(
                                                ft.category_id,
                                                ft.feature_id
                                              )
                                            }
                                            className="list-deletebtn"
                                          >
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              height="20px"
                                              viewBox="0 -960 960 960"
                                              width="20px"
                                              fill="#FFFFFF"
                                            >
                                              <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
                                            </svg>
                                          </button>
                                        </div>
                                      </>
                                    )}
                                  </>
                                )}
                              </div>
                            </td>
                            <td />
                            <td />
                            <td />
                            <td>
                              <FeatureProgressCell actions={featureActions} />
                            </td>
                            <td />
                            <td>
                              <input
                                type="checkbox"
                                disabled={isCompleted}
                                className="list-checkbox"
                                checked={testCheckFt[ft.feature_id] || false}
                                onChange={() =>
                                  toggleTestCheckFt(
                                    ft.category_id,
                                    ft.feature_id
                                  )
                                }
                              />
                            </td>
                          </tr>

                          {/* 액션 리스트 */}
                          {clickFt[ft.feature_id] &&
                            featureActions.map((ac) => (
                              <tr
                                key={ac.action_id}
                                className={`ac-row ${
                                  isCompleted ? "completed" : ""
                                }`}
                              >
                                <td className="list-name">
                                  <div className="aclist-name">
                                    {editingActionId === ac.action_id ? (
                                      <input
                                        type="text"
                                        value={name}
                                        onChange={(e) =>
                                          setName(e.target.value)
                                        }
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter") {
                                            (
                                              e.target as HTMLInputElement
                                            ).blur(); // 엔터치면 blur로 확정
                                          }
                                        }}
                                        onBlur={() => {
                                          updateActionName(
                                            ac.feature_id,
                                            ac.action_id
                                          );
                                        }}
                                        autoFocus
                                      />
                                    ) : (
                                      <>
                                        <svg
                                          className="aclist-icon"
                                          xmlns="http://www.w3.org/2000/svg"
                                          height="20px"
                                          viewBox="0 -960 960 960"
                                          width="20px"
                                          fill="#FFF"
                                        >
                                          <path d="M336-240h288v-72H336v72Zm0-144h288v-72H336v72ZM263.72-96Q234-96 213-117.15T192-168v-624q0-29.7 21.15-50.85Q234.3-864 264-864h312l192 192v504q0 29.7-21.16 50.85Q725.68-96 695.96-96H263.72ZM528-624v-168H264v624h432v-456H528ZM264-792v189-189 624-624Z" />
                                        </svg>
                                        {ac.name === "" ? (
                                          <input
                                            type="text"
                                            value={name}
                                            onChange={(e) =>
                                              setName(e.target.value)
                                            }
                                            onKeyDown={(e) => {
                                              if (e.key === "Enter") {
                                                (
                                                  e.target as HTMLInputElement
                                                ).blur(); // 엔터치면 blur로 확정
                                              }
                                            }}
                                            onBlur={() => {
                                              updateActionName(
                                                ac.feature_id,
                                                ac.action_id,
                                                true
                                              );
                                            }}
                                            autoFocus
                                          />
                                        ) : (
                                          <>
                                            <span
                                              title={ac.name}
                                              onClick={() =>
                                                navigate(
                                                  `/ws/${cg.workspace_id}/post/action/${ac.action_id}`
                                                )
                                              }
                                            >
                                              {ac.name}
                                            </span>
                                            <button
                                              className="list-modifybtn"
                                              onClick={() => {
                                                setName(ac.name);
                                                setEditingActionId(
                                                  ac.action_id
                                                );
                                              }}
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="20px"
                                                viewBox="0 -960 960 960"
                                                width="20px"
                                                fill="#FFFFFF"
                                              >
                                                <path d="M216-216h51l375-375-51-51-375 375v51Zm-72 72v-153l498-498q11-11 23.84-16 12.83-5 27-5 14.16 0 27.16 5t24 16l51 51q11 11 16 24t5 26.54q0 14.45-5.02 27.54T795-642L297-144H144Zm600-549-51-51 51 51Zm-127.95 76.95L591-642l51 51-25.95-25.05Z" />
                                              </svg>
                                            </button>
                                            <div>
                                              <button
                                                className="list-deletebtn"
                                                onClick={() =>
                                                  handleDeleteAction(
                                                    ac.feature_id,
                                                    ac.action_id
                                                  )
                                                }
                                              >
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  height="20px"
                                                  viewBox="0 -960 960 960"
                                                  width="20px"
                                                  fill="#FFFFFF"
                                                >
                                                  <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
                                                </svg>
                                              </button>
                                            </div>
                                          </>
                                        )}
                                      </>
                                    )}
                                  </div>
                                </td>
                                <td>
                                  <DateSelectCell
                                    value={ac.start_date ?? null}
                                    disable={isCompleted}
                                    onChange={(date) => {
                                      if (isCompleted) return;
                                      updateStartDate(
                                        ac.feature_id,
                                        ac.action_id,
                                        date
                                      );
                                    }}
                                  />
                                </td>
                                <td>
                                  <DateSelectCell
                                    value={ac.end_date ?? null}
                                    disable={isCompleted}
                                    onChange={(date) => {
                                      if (isCompleted) return;
                                      updateEndDate(
                                        ac.feature_id,
                                        ac.action_id,
                                        date
                                      );
                                    }}
                                  />
                                </td>
                                <td>
                                  {/* 참여자 */}
                                  <ParticipantsCell
                                    value={ac.assignee_id}
                                    wsid={cg.workspace_id}
                                    disable={isCompleted}
                                    onChange={(newParti) => {
                                      if (isCompleted) return;
                                      // 상태 업데이트
                                      updateAssignee(
                                        ac.feature_id,
                                        ac.action_id,
                                        newParti
                                      );
                                    }}
                                  />
                                </td>
                                <td>
                                  {/* 지금 action상태변화에 따른 feature상태변화 안되는 중임 */}
                                  {/* 오류나서 api연결하고 해야할것같음 */}
                                  <ActionStatusCell
                                    status={ac.status}
                                    disable={isCompleted}
                                    onChange={(newStatus) => {
                                      if (isCompleted) return;

                                      updateStatus(
                                        ac.feature_id,
                                        ac.action_id,
                                        newStatus
                                      );
                                    }}
                                  />
                                </td>
                                <td>
                                  <ImportanceCell
                                    value={ac.importance ?? 0}
                                    onChange={(newVal) => {
                                      if (isCompleted) return;
                                      // 상태 업데이트
                                      updateImportance(
                                        ac.feature_id,
                                        ac.action_id,
                                        newVal
                                      );
                                    }}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="checkbox"
                                    disabled={isCompleted}
                                    className="list-checkbox"
                                    checked={testCheckAc[ac.action_id] || false}
                                    onChange={() =>
                                      toggleTestCheckAc(
                                        ac.feature_id,
                                        ac.action_id
                                      )
                                    }
                                  />
                                </td>
                              </tr>
                            ))}
                        </React.Fragment>
                      );
                    })}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
