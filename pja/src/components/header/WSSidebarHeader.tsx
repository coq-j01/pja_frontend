import "./WSSidebarHeader.css";
import type { IsClose } from "../../types/common";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

export function WSSidebarHeader({ onClose }: IsClose) {
  const selectedWS = useSelector(
    (state: RootState) => state.workspace.selectedWS
  );
  return (
    <>
      <div className="sidebarheader-container">
        <div className="sidebarheader-left">
          <h3 title={selectedWS?.projectName}>{selectedWS?.projectName}</h3>
          <p title={selectedWS?.teamName}>{selectedWS?.teamName}</p>
        </div>
        <div className="sidebarheader-right">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#000000"
            onClick={onClose}
          >
            <path d="M440-280v-400L240-480l200 200Zm80 160h80v-720h-80v720Z" />
          </svg>
        </div>
      </div>
    </>
  );
}
