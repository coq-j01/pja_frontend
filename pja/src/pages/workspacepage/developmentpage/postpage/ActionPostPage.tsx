import { AnimatePresence } from "framer-motion";
import WsSidebar from "../../../../components/sidebar/WsSidebar";
import "./ActionPostPage.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { PostHeader } from "../../../../components/header/PostHeader";
import { formatDistanceToNow, parseISO } from "date-fns";
import { BasicModal } from "../../../../components/modal/BasicModal";
import { ko } from "date-fns/locale";
import { useEditLock } from "../../../../hooks/useEditLock";
import type { LockedUser } from "../../../../types/edit";
import {
  getPostDetails,
  updatePostDetails,
  createComment,
  updateComment,
  deleteComment,
} from "../../../../services/postApi";
import { ErrorPage } from "../../../../error/ErrorPage";
import { getworkspace } from "../../../../services/workspaceApi";
import { setSelectedWS } from "../../../../store/workspaceSlice";
import { useDispatch } from "react-redux";
import { getUserRole } from "../../../../services/userApi";
import type { Role } from "../../../../types/workspace";

interface Comment {
  id: number;
  content: string;
  username: string;
  createdAt: string;
  author: boolean;
}

interface FileInfo {
  filePath: string;
  contentType: string;
}

export default function ActionPostPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showIcon, setShowIcon] = useState(false);
  // const [selectAction, setSelectAction] = useState<action>();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  //게시물 제목
  const [actionName, setActionName] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [textContent, setTextContent] = useState<string>("");

  const [originalTextContent, setOriginalTextContent] = useState<string>("");
  const [fileList, setFileList] = useState<FileInfo[]>([]);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const [currentComment, setCurrentComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentText, setEditingCommentText] = useState<string>("");

  //UI/ 편집 관련 상태
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 모달 상태
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalDescription, setModalDescription] = useState("");
  const showModal = (title: string, description: string) => {
    setModalTitle(title);
    setModalDescription(description);
    setModalOpen(true);
  };

  // 삭제될 기존 이미지의 경로를 저장할 상태
  const [removedImagePaths, setRemovedImagePaths] = useState<string[]>([]);

  const { wsid, acId, acpostId } = useParams<{
    wsid: string;
    acId: string;
    acpostId: string;
  }>();

  const [role, setRole] = useState<Role | null>(null);
  const CanEdit = useMemo(() => {
    return role === "OWNER" || role === "MEMBER";
  }, [role]);

  const openLightbox = (src: string) => setLightboxSrc(src);
  const closeLightbox = () => setLightboxSrc(null);
  const dispatch = useDispatch();

  const {
    getUserEditingField,
    startPolling,
    stopPolling,
    startEditing,
    stopEditing,
    setAlreadyEdit,
    alreadyEdit,
  } = useEditLock("action");

  //액션 게시물 조회 api
  useEffect(() => {
    // acpostId가 없으면 아무것도 하지 않습니다.
    if (!wsid || !acId || !acpostId) {
      setIsLoading(false);
      setError("404");
      return;
    }
    const getws = async () => {
      try {
        const response = await getworkspace(Number(wsid));
        //redux저장
        if (response.data) {
          dispatch(setSelectedWS(response.data));
        }
      } catch (err: any) {
        console.log("getworkspace 실패");
      }
    };

    const fetchAndSetData = async () => {
      try {
        const postData = await getPostDetails(wsid, acId, acpostId);

        // 받아온 데이터로 상태 업데이트
        setActionName(postData.actionName);
        setTextContent(postData.content);
        setFileList(postData.fileList || []);

        // 백엔드 댓글(commentList)을 프론트엔드 댓글(comments) 타입으로 변환
        const formattedComments = postData.commentList.map((c) => ({
          id: c.commentId,
          content: c.content,
          username: c.authorName,
          createdAt: c.updatedAt,
          author: c.author,
        }));
        setComments(formattedComments);
      } catch (err: any) {
        console.error(err);
      }
    };

    const fetchData = async () => {
      setIsLoading(true); // 로딩 시작
      try {
        await Promise.all([getws(), fetchAndSetData()]);
      } catch {
        setError("포스트를 불러오는 데 실패했습니다");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [wsid, acId, acpostId]);

  useEffect(() => {
    const getrole = async () => {
      try {
        const response = await getUserRole(Number(wsid));
        const roleFromApi = response.data?.role;
        if (
          roleFromApi === "OWNER" ||
          roleFromApi === "MEMBER" ||
          roleFromApi === "GUEST"
        ) {
          setRole(roleFromApi);
        }
      } catch (error) {
        console.log("getrole 실패");
      }
    };
    startPolling();
    getrole();
    return () => {
      stopPolling();
    };
  }, [wsid]);

  // 기존 이미지 삭제 처리
  const handleRemoveExistingImage = (indexToRemove: number) => {
    const imageToRemove = fileList[indexToRemove];
    if (!imageToRemove) return;

    // 1. 화면에 보이는 fileList에서 해당 이미지를 제거
    setFileList((prev) => prev.filter((_, index) => index !== indexToRemove));

    // 2. 나중에 서버에 "이 파일들을 삭제해달라"고 요청하기 위해 경로를 따로 저장
    setRemovedImagePaths((prev) => [...prev, imageToRemove.filePath]);
  };

  const handleFileSelect = (files: FileList | null) => {
    if (files) {
      const imageFiles = Array.from(files).filter((file) =>
        file.type.startsWith("image/")
      );
      setSelectedImages((prev) => [...prev, ...imageFiles]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
    // (선택 사항) 같은 파일을 다시 업로드할 수 있도록 입력 값을 초기화합니다.
    if (e.target) e.target.value = "";
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  };

  // 업로드 영역 전체를 클릭했을 때 파일 입력 창을 띄웁니다.
  const handleUploadAreaClick = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  //수정하기 클릭 시 수정/저장 토글 함수
  const handleToggleEdit = async () => {
    if (!isEditing) {
      // 수정 모드 시작
      setIsEditing(true);
      startEditing(null, acpostId ?? null);
      setOriginalTextContent(textContent);
      // 수정 시작 시, 새로 추가되거나 삭제된 이미지 목록을 초기화
      setSelectedImages([]);
      setRemovedImagePaths([]);
    } else {
      stopEditing(null, acpostId ?? null);

      const isContentUnchanged = originalTextContent === textContent;
      const noNewImages = selectedImages.length === 0;
      const noRemovedImages = removedImagePaths.length === 0;

      if (isContentUnchanged && noNewImages && noRemovedImages) {
        setIsEditing(false); // 수정 모드만 종료
        return;
      }

      // 저장 로직 실행
      if (!wsid || !acId || !acpostId) {
        setError("404");
        return;
      }

      try {
        const updatedData = await updatePostDetails(wsid, acId, acpostId, {
          content: textContent,
          files: selectedImages,
          removedFilePaths: removedImagePaths, // API 명세에 따라 필요 시 추가
        });

        //   성공 시, 반환된 최신 데이터로 화면 상태 업데이트
        setTextContent(updatedData.content);
        setFileList(updatedData.fileList || []);
        // 수정 후에는 새로 추가/삭제한 이미지 목록 비움
        setSelectedImages([]);
        setRemovedImagePaths([]);

        showModal("저장 완료", "게시글이 성공적으로 수정되었습니다.");
      } catch (err: any) {
        setError("게시글 수정이 실패했습니다");
      } finally {
        setIsEditing(false);
      }
    }
  };

  //댓글 기능 함수
  const handleAddComment = async () => {
    if (currentComment.trim() === "") {
      return;
    }

    if (!wsid || !acId || !acpostId) {
      setError("404");
      return;
    }

    // API 호출 전에 현재 댓글 내용 저장하고 입력창 비우기
    const commentToPost = currentComment;
    setCurrentComment("");

    try {
      //  API를 호출하여 서버에 댓글을 생성/저장
      const createdCommentData = await createComment(
        wsid,
        acId,
        acpostId,
        commentToPost
      );
      //새 댓글
      const newCommentFromServer: Comment = {
        id: createdCommentData.commentId,
        content: createdCommentData.content,
        username: createdCommentData.username,
        createdAt: createdCommentData.createdAt,
        author: true,
      };

      //댓글 상태 업데이트
      setComments((prevComments) => [...prevComments, newCommentFromServer]);
    } catch (err: any) {
      setError("댓글 생성이 실패했습니다");
      // 실패 시, 입력창에 다시 내용 복원
      setCurrentComment(commentToPost);
    }
  };

  const handleStartEditing = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditingCommentText(comment.content);
  };

  const handleSaveComment = async (commentId: number) => {
    if (editingCommentText.trim() === "") {
      return showModal("댓글을 저장할 수 없습니다", "댓글을 입력해주세요.");
    }

    // API 호출에 필요한 ID들이 있는지 확인
    if (!wsid || !acId) {
      setError("404");
      return;
    }

    try {
      // 1. API를 호출하여 댓글 수정 요청
      const updatedCommentData = await updateComment(
        wsid,
        acId,
        commentId,
        editingCommentText
      );

      // 2. 성공 시, comments 배열에서 해당 댓글을 찾아 최신 정보로 업데이트
      const updatedComments = comments.map((comment) => {
        if (comment.id === commentId) {
          // 서버로부터 받은 최신 데이터로 교체
          return {
            id: commentId, // ID는 그대로
            content: updatedCommentData.content,
            username: updatedCommentData.username,
            createdAt: updatedCommentData.createdAt,
            author: true,
          };
        }
        return comment;
      });

      setComments(updatedComments);

      setEditingCommentId(null);
      setEditingCommentText("");
    } catch (err: any) {
      setError("댓글 수정에 실패했습니다");
    }
  };

  const handleDeleteComment = async (commentIdToDelete: number) => {
    // API 호출에 필요한 ID들이 있는지 확인
    if (!wsid || !acId) {
      setError("404");
      return;
    }

    try {
      await deleteComment(wsid, acId, commentIdToDelete);

      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== commentIdToDelete)
      );
    } catch (err: any) {
      setError("댓글을 삭제에 실패했습니다");
    }
  };

  const formatRelativeTime = (isoDateString: string) => {
    try {
      // 1. 서버가 보낸 시간 문자열에 'Z'가 없는 경우, 수동으로 붙여서 UTC임을 명시
      const utcDateString = isoDateString.endsWith("Z")
        ? isoDateString
        : `${isoDateString}Z`;

      // 2. 이제 이 문자열을 파싱
      const date = parseISO(utcDateString);

      // 3. 현재 시간과 비교하여 상대 시간을 계산
      return formatDistanceToNow(date, { addSuffix: true, locale: ko });
    } catch (error) {
      console.error("Invalid date format:", isoDateString);
      return isoDateString;
    }
  };

  //  로딩 및 에러 상태에 따른 UI 처리
  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (error === "404") {
    return <ErrorPage code={404} message="페이지를 찾을 수 없습니다" />;
  }

  const renderEditor = (user: LockedUser | null) => {
    if (!user) return;

    return user.userProfile ? (
      <img
        key={user.userId}
        src={user.userProfile}
        alt={user.userName}
        title={user.userName}
        className="profile-image"
      />
    ) : (
      <div key={user.userId} className="profile" title={user.userName}>
        {user.userName.charAt(0)}
      </div>
    );
  };

  return (
    <div className="post-container">
      {/* 사이드바 토글 애니메이션 */}
      <AnimatePresence onExitComplete={() => setShowIcon(true)}>
        {sidebarOpen && (
          <WsSidebar
            onClose={() => {
              setSidebarOpen(false);
              setShowIcon(false);
            }}
          />
        )}
      </AnimatePresence>
      {!sidebarOpen && showIcon && (
        <div className="post-sidebar-closed">
          <div
            className="post-sidebar-icon"
            onClick={() => setSidebarOpen(true)}
          >
            {/* 아이콘 SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#000000"
            >
              <path d="M360-120v-720h80v720h-80Zm160-160v-400l200 200-200 200Z" />
            </svg>
          </div>
        </div>
      )}

      {/* 본문 영역 */}
      <div className="actionpost-container">
        <PostHeader />
        <h2>{actionName}</h2>
        {/* ① 텍스트와 이미지가 Flexbox로 한 줄에 배치되는 부분 */}
        <div className="actionpost-wrapper">
          {/* 글 내용 */}
          {isEditing ? (
            <textarea
              placeholder="내용을 입력해주세요"
              className="actionpost-input"
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
            />
          ) : (
            <div className="editors-container">
              <div className="editors">
                {renderEditor(getUserEditingField("projectName", null))}
              </div>
              <div className="actionpost-display">{textContent}</div>
            </div>
          )}

          {/* 기존 첨부 이미지 (파일리스트가 있을 때만) */}
          {fileList.length > 0 && (
            <div className="image-section-container">
              <p className="image-section-title">첨부된 이미지</p>
              <div className="image-grid">
                {fileList.map((file, index) => (
                  <div key={index} className="image-item">
                    <img
                      src={file.filePath}
                      alt={`첨부 이미지 ${index + 1}`}
                      onClick={() => openLightbox(file.filePath)}
                    />
                    {isEditing && (
                      <button
                        className="remove-existing-image-btn"
                        onClick={() => handleRemoveExistingImage(index)}
                      >
                        X
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 새 이미지 업로드 UI (수정 모드일 때만) */}
          {isEditing && (
            <div className="image-upload-container">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileInputChange}
                ref={fileInputRef}
                style={{ display: "none" }}
              />
              <div
                className={`image-upload-area ${
                  dragActive ? "drag-active" : ""
                }`}
                onClick={handleUploadAreaClick}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {selectedImages.length === 0 ? (
                  <>
                    <span className="upload-placeholder">
                      여기에 이미지를 드래그하거나 클릭하여 업로드하세요
                    </span>
                    <svg
                      style={{ paddingRight: "10px", cursor: "pointer" }}
                      xmlns="http://www.w3.org/2000/svg"
                      height="22px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#e3e3e3"
                    >
                      <path d="M440-800v487L216-537l-56 57 320 320 320-320-56-57-224 224v-487h-80Z" />
                    </svg>
                  </>
                ) : (
                  <div className="uploaded-files">
                    {selectedImages.map((image, idx) => (
                      <div key={idx} className="uploaded-file-name">
                        <span>{image.name}</span>
                        <button
                          className="remove-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(idx);
                          }}
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {CanEdit && (
          <div className="actionpost-button-container">
            <button
              className={isEditing ? "save-button" : "modify-button"}
              onClick={handleToggleEdit}
            >
              {isEditing ? "저장하기" : "수정하기"}
            </button>
          </div>
        )}
        <hr className="divider" />

        <div className="comment-section-container">
          <p className="comment-title">댓글</p>
          <div className="comment-wrapper">
            <textarea
              className="comment-input"
              disabled={!CanEdit}
              value={currentComment}
              onChange={(e) => setCurrentComment(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              onClick={handleAddComment}
              className="send-icon-inside"
              height="21px"
              viewBox="0 -960 960 960"
              width="21px"
              fill="#212121"
            >
              <path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z" />
            </svg>
          </div>
          {/* 등록된 댓글 목록 */}
          <div className="comment-list">
            {comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                {editingCommentId === comment.id ? (
                  <div className="comment-edit-form">
                    <input
                      type="text"
                      className="comment-edit-input"
                      value={editingCommentText}
                      onChange={(e) => setEditingCommentText(e.target.value)}
                    />
                    <div className="comment-edit-actions">
                      <button onClick={() => handleSaveComment(comment.id)}>
                        저장
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="comment-top-row">
                      <div className="comment-meta">
                        <span className="comment-author">
                          {comment.username}
                        </span>
                        <span className="comment-createdAt">
                          {formatRelativeTime(comment.createdAt)}
                        </span>
                        {comment.author && (
                          <button
                            className="comment-edit-button"
                            onClick={() => handleStartEditing(comment)}
                          >
                            수정
                          </button>
                        )}
                      </div>
                      {comment.author && (
                        <svg
                          style={{ cursor: "pointer" }}
                          onClick={() => handleDeleteComment(comment.id)}
                          xmlns="http://www.w3.org/2000/svg"
                          height="24px"
                          viewBox="0 -960 960 960"
                          width="24px"
                          fill="#212121"
                        >
                          <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                        </svg>
                      )}
                    </div>

                    <p className="comment-text">{comment.content}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
        {lightboxSrc && (
          <div className="lightbox-overlay" onClick={closeLightbox}>
            <div className="lightbox-content">
              <img src={lightboxSrc} alt="확대 이미지" />
            </div>
          </div>
        )}
      </div>
      {modalOpen && (
        <BasicModal
          modalTitle={modalTitle}
          modalDescription={modalDescription}
          Close={(open) => setModalOpen(open)}
        />
      )}
      {alreadyEdit && (
        <BasicModal
          modalTitle="수정이 불가능합니다"
          modalDescription="다른 사용자가 수정 중입니다"
          Close={() => setAlreadyEdit(false)}
        />
      )}
      {error && (
        <BasicModal
          modalTitle={error}
          modalDescription={
            "일시적인 오류가 발생했습니다 페이지를 새로고침하거나 잠시 후 다시 시도해 주세요"
          }
          Close={() => setError("")}
        ></BasicModal>
      )}
    </div>
  );
}
