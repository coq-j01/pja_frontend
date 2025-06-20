import type { IsClose } from "../../types/common";
import * as Dialog from "@radix-ui/react-dialog";
import "./BasicModal.css";

export function WsmenuModal({ onClose }: IsClose) {
  // 수정,삭제,완료 등 권한 없을 때 띄우는 모달
  return (
    <Dialog.Root open={true} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="basic-modal-overlay" />
        <Dialog.Content className="basic-modal-content">
          <Dialog.Title className="basic-modal-title">
            작업 수행 권한이 없습니다
          </Dialog.Title>
          <Dialog.Description className="basic-modal-description">
            워크스페이스 관리는 관리자만 가능합니다
          </Dialog.Description>
          <Dialog.Close asChild>
            <button className="basic-modal-close">확인</button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function WsCompleteModal({ onClose }: IsClose) {
  // 완료할 수 없을 때 뜨는 모달
  return (
    <Dialog.Root open={true} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="basic-modal-overlay" />
        <Dialog.Content className="basic-modal-content">
          <Dialog.Title className="basic-modal-title">
            워크스페이스를 완료할 수 없습니다
          </Dialog.Title>
          <Dialog.Description className="basic-modal-description">
            프로젝트를 모두 완료한 후 완료 가능합니다
          </Dialog.Description>
          <Dialog.Close asChild>
            <button className="basic-modal-close">확인</button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function StepRestrictionModal({ onClose }: IsClose) {
  // 다음스텝 이동할 때 뜨는 모달
  return (
    <Dialog.Root open={true} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="basic-modal-overlay" />
        <Dialog.Content className="basic-modal-content">
          <Dialog.Title className="basic-modal-title">
            이동이 불가능합니다
          </Dialog.Title>
          <Dialog.Description className="basic-modal-description">
            이전 단계를 모두 완료한 후 이동 가능합니다
          </Dialog.Description>
          <Dialog.Close asChild>
            <button className="basic-modal-close">확인</button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function NoCgAddModal({ onClose }: IsClose) {
  // 필터상태로 카테고리 추가 누르면 뜨는 모달
  return (
    <Dialog.Root open={true} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="basic-modal-overlay" />
        <Dialog.Content className="basic-modal-content">
          <Dialog.Title className="basic-modal-title">
            카테고리 추가가 불가능합니다
          </Dialog.Title>
          <Dialog.Description className="basic-modal-description">
            필터를 끄고 카테고리를 추가 해주세요
          </Dialog.Description>
          <Dialog.Close asChild>
            <button className="basic-modal-close">확인</button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function StackDeleteModal({ onClose }: IsClose) {
  // 기술스택 2개 이하라 삭제 불가할 때 뜨는 모달달
  return (
    <Dialog.Root open={true} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="basic-modal-overlay" />
        <Dialog.Content className="basic-modal-content">
          <Dialog.Title className="basic-modal-title">
            삭제가 불가능합니다
          </Dialog.Title>
          <Dialog.Description className="basic-modal-description">
            기술 스택이 최소 2개는 필요합니다
          </Dialog.Description>
          <Dialog.Close asChild>
            <button className="basic-modal-close">확인</button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function FeatureDeleteModal({ onClose }: IsClose) {
  // 메인기능 2개 이하라 삭제 불가할 때 뜨는 모달
  return (
    <Dialog.Root open={true} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="basic-modal-overlay" />
        <Dialog.Content className="basic-modal-content">
          <Dialog.Title className="basic-modal-title">
            삭제가 불가능합니다
          </Dialog.Title>
          <Dialog.Description className="basic-modal-description">
            메인 기능이 최소 2개는 필요합니다
          </Dialog.Description>
          <Dialog.Close asChild>
            <button className="basic-modal-close">확인</button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function RequireCancleModal({ onClose }: IsClose) {
  // 기능,성능 3개 미만이라 ai추천 불가할 때 뜨는 모달
  return (
    <Dialog.Root open={true} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="basic-modal-overlay" />
        <Dialog.Content className="basic-modal-content">
          <Dialog.Title className="basic-modal-title">
            AI추천이 불가능합니다
          </Dialog.Title>
          <Dialog.Description className="basic-modal-description">
            기능·성능 요구사항이 최소 3개는 필요합니다
          </Dialog.Description>
          <Dialog.Close asChild>
            <button className="basic-modal-close">확인</button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
