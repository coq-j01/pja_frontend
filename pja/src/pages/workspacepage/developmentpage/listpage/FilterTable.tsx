import React, { useMemo } from "react";
import type { action, feature, filtered } from "../../../../types/list";
import { useCategoryFeatureCategory } from "../../../../hooks/useCategoryFeatureAction";
import DateSelectCell from "../../../../components/cells/DateSelectCell";
import { ActionStatusCell } from "../../../../components/cells/ActionStatusCell";
import { FeatureProgressCell } from "../../../../components/cells/FeatureProgessCell";
import { ImportanceCell } from "../../../../components/cells/ImportantCell";
import { ParticipantsCell } from "../../../../components/cells/ParticipantsCell";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import "./ListTable.css";
import { actions, features } from "../../../../constants/listconstant";

export default function FilterTable({
  selectedCategories,
  selectedAssignees,
  selectedStatuses,
}: filtered) {
  const {
    categoryList,
    workspaceId,
    clickCg,
    clickFt,
    name,
    editingCategoryId,
    editingFeatureId,
    editingActionId,
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

    updateCategoryName,
    updateFeatureName,
    updateActionName,

    handleDeleteCategory,
    handleDeleteFeature,
    handleDeleteAction,
  } = useCategoryFeatureCategory();

  const navigate = useNavigate();

  const categoryMap = useMemo(() => {
    const categoryMap = new Map<
      number,
      { feature: feature; actions: action[] }[]
    >();

    categoryList.forEach((category) => {
      // 1. 카테고리 필터링
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(category.featureCategoryId)
      ) {
        return;
      }

      const matchedFeatures: { feature: feature; actions: action[] }[] = [];

      category.features.forEach((ft) => {
        const filteredActions = ft.actions.filter((ac) => {
          // 2. 참여자 필터
          const assigneeMatch =
            selectedAssignees.length === 0 ||
            (ac.participants &&
              ac.participants.some((p) =>
                selectedAssignees.includes(p.memberId)
              ));

          const statusMatch =
            selectedStatuses.length === 0 ||
            selectedStatuses.includes(ac.state);

          return assigneeMatch && statusMatch;
        });
        if (filteredActions.length > 0) {
          matchedFeatures.push({ feature: ft, actions: filteredActions });
        }
      });

      if (matchedFeatures.length > 0) {
        categoryMap.set(category.featureCategoryId, matchedFeatures);
      }
    });

    return categoryMap;
  }, [selectedCategories, selectedAssignees, selectedStatuses, categoryList]);

  return (
    <>
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
          {Array.from(categoryMap.entries()).map(
            ([categoryId, featureActionList], index) => {
              const category = categoryList.find(
                (cg) => cg.featureCategoryId === categoryId
              );
              if (!category) return null;
              const isCompleted = category.state === true;

              return (
                <React.Fragment key={categoryId}>
                  {/* 카테고리 행 */}
                  <tr className={`cg-row ${isCompleted ? "completed" : ""}`}>
                    <td className="list-name">
                      <div className="cglist-name">
                        {category.name === "" ||
                        editingCategoryId === category.featureCategoryId ? (
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                (e.target as HTMLInputElement).blur(); // 엔터로 blur
                              }
                            }}
                            onBlur={() => {
                              updateCategoryName(category.name === ""); // 새로 만든 경우 true 전달
                              setEditingCategoryId(null); // 편집 종료
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
                              onClick={() => {
                                cgToggleClick(category.featureCategoryId);
                              }}
                              style={{ cursor: "pointer" }}
                            >
                              <path
                                d={
                                  clickCg[category.featureCategoryId]
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
                            <span title={category.name}>{category.name}</span>
                            <button
                              className="list-modifybtn"
                              onClick={() => {
                                setName(category.name);
                                setEditingCategoryId(
                                  category.featureCategoryId
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
                                  handleDeleteCategory(
                                    category.featureCategoryId
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
                          !categoryCompletableMap[category.featureCategoryId]
                        }
                        onClick={() =>
                          handleCompleteClick(category.featureCategoryId)
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
                        checked={category.hasTest ?? false}
                        onChange={() =>
                          toggleTestCheckCg(category.featureCategoryId)
                        }
                      />
                    </td>
                  </tr>

                  {/* 기능 리스트 */}
                  {clickCg[categoryId] &&
                    featureActionList.map(({ feature, actions }) => {
                      return (
                        <React.Fragment key={feature.featureId}>
                          <tr
                            className={`ft-row ${
                              isCompleted ? "completed" : ""
                            }`}
                          >
                            <td className="list-name">
                              <div className="ftlist-name">
                                {feature.name === "" ||
                                editingFeatureId === feature.featureId ? (
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
                                        feature.featureId,
                                        feature.name === ""
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
                                      onClick={() => {
                                        ftToggleClick(feature.featureId);
                                      }}
                                      style={{ cursor: "pointer" }}
                                    >
                                      <path
                                        d={
                                          clickFt[feature.featureId]
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

                                    <span title={feature.name}>
                                      {feature.name}
                                    </span>
                                    <button
                                      className="list-modifybtn"
                                      onClick={() => {
                                        setName(feature.name); // 현재 이름으로 초기화
                                        setEditingFeatureId(feature.featureId); // 수정 모드 진입
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
                                          handleDeleteFeature(
                                            category.featureCategoryId,
                                            feature.featureId
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
                              </div>
                            </td>
                            <td />
                            <td />
                            <td />
                            <td>
                              <FeatureProgressCell actions={feature.actions} />
                            </td>
                            <td />
                            <td>
                              <input
                                type="checkbox"
                                disabled={isCompleted}
                                className="list-checkbox"
                                checked={feature.hasTest || false}
                                onChange={() =>
                                  toggleTestCheckFt(
                                    category.featureCategoryId,
                                    feature.featureId
                                  )
                                }
                              />
                            </td>
                          </tr>

                          {/* 액션 리스트 */}
                          {clickFt[feature.featureId] &&
                            actions.map((ac) => (
                              <tr
                                key={ac.actionId}
                                className={`ac-row ${
                                  isCompleted ? "completed" : ""
                                }`}
                              >
                                <td className="list-name">
                                  <div className="aclist-name">
                                    {ac.name === "" ||
                                    editingActionId === ac.actionId ? (
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
                                            category.featureCategoryId,
                                            feature.featureId,
                                            ac.name === ""
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
                                        <span
                                          title={ac.name}
                                          onClick={() =>
                                            navigate(
                                              `/ws/${workspaceId}/post/action/${ac.actionPostId}`
                                            )
                                          }
                                        >
                                          {ac.name}
                                        </span>
                                        <button
                                          className="list-modifybtn"
                                          onClick={() => {
                                            setName(ac.name);
                                            setEditingActionId(ac.actionId);
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
                                                category.featureCategoryId,
                                                feature.featureId,
                                                ac.actionId
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
                                  </div>
                                </td>
                                <td>
                                  <DateSelectCell
                                    value={ac.startDate ?? null}
                                    disable={isCompleted}
                                    onChange={(date) => {
                                      if (isCompleted) return;
                                      updateStartDate(
                                        category.featureCategoryId,
                                        feature.featureId,
                                        ac.actionId,
                                        date
                                      );
                                    }}
                                  />
                                </td>
                                <td>
                                  <DateSelectCell
                                    value={ac.endDate ?? null}
                                    disable={isCompleted}
                                    onChange={(date) => {
                                      if (isCompleted) return;
                                      updateEndDate(
                                        category.featureCategoryId,
                                        feature.featureId,
                                        ac.actionId,
                                        date
                                      );
                                    }}
                                  />
                                </td>
                                <td>
                                  {/* 참여자 */}
                                  <ParticipantsCell
                                    value={ac.participants.map(
                                      (p) => p.memberId
                                    )}
                                    disable={isCompleted}
                                    onChange={(newParti) => {
                                      if (isCompleted) return;
                                      // 상태 업데이트
                                      updateAssignee(
                                        category.featureCategoryId,
                                        feature.featureId,
                                        ac.actionId,
                                        newParti
                                      );
                                    }}
                                  />
                                </td>
                                <td>
                                  {/* 지금 action상태변화에 따른 feature상태변화 안되는 중임 */}
                                  {/* 오류나서 api연결하고 해야할것같음 */}
                                  <ActionStatusCell
                                    status={ac.state}
                                    disable={isCompleted}
                                    onChange={(newStatus) => {
                                      if (isCompleted) return;

                                      updateStatus(
                                        category.featureCategoryId,
                                        feature.featureId,
                                        ac.actionId,
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
                                        category.featureCategoryId,
                                        feature.featureId,
                                        ac.actionId,
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
                                    checked={ac.hasTest || false}
                                    onChange={() =>
                                      toggleTestCheckAc(
                                        category.featureCategoryId,
                                        feature.featureId,
                                        ac.actionId
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
            }
          )}
        </tbody>
      </table>
    </>
  );
}
