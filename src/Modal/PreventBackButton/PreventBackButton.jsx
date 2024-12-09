import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ConfirmationPopup from "../ConfirmationModal/ConfirmationModal";
import { useAuth } from "../../routes/AuthContext";

const PreventBackButton = ({ isDirty }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showConfirmationBackModal, setShowConfirmationBackModal] = useState(false);
  const [pathBeforeLeave, setPathBeforeLeave] = useState("");
  const { role } = useAuth();

  useEffect(() => {
    if (!isDirty) return; 

    const handlePopState = (event) => {
      console.log("Back button pressed, popstate event triggered", event);

      if (event.state === null) {
        console.log("Back button pressed, null state triggered")
        let extractedPath = "";
        if (role === "participant" || role === "game_master") {
          extractedPath = location.pathname.split("/scenario")[0] + "/scenarios";
        } else if (role === "judge") {
          extractedPath = location.pathname.split("/showAllParticipants")[0] + "/showAllParticipants";
        }

        setPathBeforeLeave(extractedPath);
        setShowConfirmationBackModal(true);

        // Prevent actual navigation by pushing current state again
        window.history.pushState(null, "", location.pathname);
      }
      console.log("Back button pressed, not null state triggered")
    };

    // Ensure the current state is in history to detect "back" navigation
    window.history.pushState(null, "", location.pathname);

    // Listen for browser back button press (popstate event)
    window.addEventListener("popstate", handlePopState);

    return () => {
      // Clean up event listener when the component is unmounted
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isDirty, location.pathname, role]);

  const handleConfirm = () => {
    setShowConfirmationBackModal(false);
    if (pathBeforeLeave) {
      navigate(pathBeforeLeave, { replace: true });
    }
  };

  const handleCancelClick = () => {
    setShowConfirmationBackModal(false);
    // Re-add the current state to avoid triggering the popstate again
    window.history.pushState(null, "", location.pathname);
  };

  return (
    <>
      {showConfirmationBackModal && (
        <ConfirmationPopup
          confirmTitle="Confirm Navigation"
          confirmDesc="You have unsaved changes. Are you sure you want to leave?"
          item={"1"}
          onClose={handleCancelClick}
          onConfirm={handleConfirm}
          participantFinalSubmit={false}
        />
      )}
    </>
  );
};

export default PreventBackButton;
