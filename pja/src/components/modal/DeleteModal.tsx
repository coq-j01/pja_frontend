import * as Dialog from "@radix-ui/react-dialog";
import "./DeleteModal.css";
type WsDeleteModalProps = {
  onClose: () => void;
  onConfirm: () => void;
};

export function WsDeleteModal({ onClose, onConfirm }: WsDeleteModalProps) {
  // 워크스페이스 삭제 시 띄우는 모달
  return (
    <Dialog.Root open={true} onOpenChange={() => onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="delete-modal-overlay" />
        <Dialog.Content className="delete-modal-content">
          <Dialog.Title className="delete-modal-title"></Dialog.Title>
          <Dialog.Description className="delete-modal-description">
            정말 삭제하시겠습니까?
          </Dialog.Description>
          <div className="delete-modal-button">
            <button
              className="delete-modal-confirm"
              onClick={() => onConfirm()}
            >
              삭제
            </button>
            <Dialog.Close asChild>
              <button className="delete-modal-close" onClick={() => onClose()}>
                취소
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
