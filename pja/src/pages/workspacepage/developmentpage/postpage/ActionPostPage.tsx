import { AnimatePresence } from "framer-motion";
import WsSidebar from "../../../../components/sidebar/WsSidebar";
import { actions } from "../../../../constants/listconstant";
import type { action } from "../../../../types/list";
import "./ActionPostPage.css";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { PostHeader } from "../../../../components/header/PostHeader";
import imageUpIcon from "../../../../assets/img/imageUp.png";
import sendIcon from "../../../../assets/img/send.png";
import codelIcon from "../../../../assets/img/codel.png";
import { formatDistanceToNow, parseISO } from "date-fns";
import { ko } from "date-fns/locale";

interface Comment {
  id: number;
  content: string;
  username: string;
  createdAt: string;
}

export default function ActionPostPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showIcon, setShowIcon] = useState(false);
  const [selectAction, setSelectAction] = useState<action>();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [textContent, setTextContent] = useState<string>("");
  const [originalTextContent, setOriginalTextContent] = useState<string>("");
  const [originalImages, setOriginalImages] = useState<File[]>([]);

  const [currentComment, setCurrentComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentText, setEditingCommentText] = useState<string>("");

  const { acId } = useParams<{
    acId: string;
  }>();

  useEffect(() => {
    const setaction = actions.find((ac) => ac.action_id === Number(acId));
    setSelectAction(setaction);
  }, [acId]);

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
  const handleToggleEdit = () => {
    if (!isEditing) {
      //수정모드
      setIsEditing(true);
      setOriginalTextContent(textContent);
      setOriginalImages([...selectedImages]);
    } else {
      //저장하고 수정 모드 종료
      setIsEditing(false);
      console.log("저장된 내용:", textContent);
      console.log("저장된 이미지:", selectedImages);
    }
  };

  //댓글 기능 함수
  const handleAddComment = () => {
    if (currentComment.trim() === "") {
      return;
    }
    //새 댓글
    const newComment: Comment = {
      id: Date.now(),
      content: currentComment,
      username: "testuser1",
      createdAt: new Date().toISOString(),
    };
    //댓글 상태 업데이트
    setComments((prevComments) => [...prevComments, newComment]);
    setCurrentComment("");
  };

  //Enter 키를 누를 때 댓글을 추가하는 함수
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddComment();
    }
  };

  const handleStartEditing = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditingCommentText(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingCommentText("");
  };

  const handleSaveComment = (commentId: number) => {
    const updateComments = comments.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          content: editingCommentText,
        };
      }
      return comment;
    });
    setComments(updateComments);
    setEditingCommentId(null);
    setEditingCommentText("");
  };

  const handleDeleteComment = (CommentId: number) => {
    const updatedComments = comments.filter(
      (comment) => comment.id !== CommentId
    );
    setComments(updatedComments);
  };

  const formatRelativeTime = (isoDateString: string) => {
    try {
      const date = parseISO(isoDateString);
      return formatDistanceToNow(date, { addSuffix: true, locale: ko });
    } catch (error) {
      // 잘못된 날짜 형식이 들어올 경우를 대비한 예외 처리
      console.error("Invalid date format:", isoDateString);
      return isoDateString;
    }
  };

  return (
    <div className="post-container">
      {/* ... (AnimatePresence, Sidebar 등 기존 코드는 그대로) ... */}
      <AnimatePresence
        onExitComplete={() => {
          setShowIcon(true);
        }}
      >
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
      <div className="actionpost-container">
        <PostHeader />
        <h2>{selectAction?.name}</h2>
        <div className="actionpost-wrapper">
          {isEditing ? (
            <textarea
              placeholder="내용을 입력해주세요"
              className="actionpost-input"
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
            />
          ) : (
            <div className="actionpost-display">{textContent}</div>
          )}
        </div>
        {/*사진 업로드 창*/}
        <div className="image-upload-container">
          {/* 파일 input (숨김) */}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileInputChange}
            ref={fileInputRef}
            style={{ display: "none" }}
          />

          {/* 이미지 업로드 클릭*/}
          <div
            className={`image-upload-area ${dragActive ? "drag-active" : ""}`}
            onClick={handleUploadAreaClick}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {/*  업로드 전 안내 문구 & 아이콘 */}
            {selectedImages.length === 0 && (
              <>
                <span className="upload-placeholder">
                  여기에 이미지를 드래그하거나 클릭하여 업로드하세요
                </span>
                <img
                  src={imageUpIcon}
                  className="image-upload-icon"
                  alt="업로드 아이콘"
                />
              </>
            )}

            {/*  업로드된 파일 이름 표시 */}
            {selectedImages.length > 0 && (
              <div className="uploaded-files">
                {selectedImages.map((image, index) => (
                  <div key={index} className="uploaded-file-name">
                    <span>{image.name}</span>
                    <button
                      className="remove-btn"
                      onClick={() => removeImage(index)}
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="actionpost-button-container">
          <button
            className={isEditing ? "save-button" : "modify-button"}
            onClick={handleToggleEdit}
          >
            {isEditing ? "저장하기" : "수정하기"}
          </button>
        </div>
        <hr className="divider" />

        <div className="comment-section-container">
          <p className="comment-title">댓글</p>
          <div className="comment-wrapper">
            <input
              type="text"
              className="comment-input"
              value={currentComment}
              onChange={(e) => setCurrentComment(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <img
              src={sendIcon}
              className="send-icon-inside"
              alt="저장 아이콘"
              onClick={handleAddComment}
            />
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
                      <button onClick={handleCancelEdit}>취소</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="comment-content">
                      <div className="comment-header">
                        <span className="comment-author">
                          {comment.username}
                        </span>
                        <span className="comment-createdAt">
                          {formatRelativeTime(comment.createdAt)}
                        </span>
                      </div>
                      {/* [수정된 부분 2] p 태그가 comment-content 안으로 들어옴 */}
                      <p className="comment-text">{comment.content}</p>
                    </div>

                    {/* [수정된 부분 3] 수정/삭제 버튼을 포함하는 액션 그룹 */}
                    <div className="comment-actions">
                      <button onClick={() => handleStartEditing(comment)}>
                        수정
                      </button>
                      <img
                        src={codelIcon}
                        className="comment-delete-icon"
                        onClick={() => handleDeleteComment(comment.id)}
                        alt="삭제"
                      />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
