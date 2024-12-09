import React, { useState, useEffect, useCallback, useRef, lazy, Suspense, memo, useMemo } from "react";
import { cn } from "../lib/utils";
import DashboardMenu from "../Menu/DashboardMenu";
import nodata from "../assets/image.png";
import Button from "../components/Button/Button";
import {
  addChallenge,
  getAllChallenges,
  editChallenge,
  deleteChallenge,
  clearChallengeState,
  clearChallengeData,
} from "../redux/challenge";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";
import { createSelector } from "reselect";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../routes/AuthContext";
import ComponentLoader from "../components/ComponentLoader/ComponentLoader";

const DeletePopup = lazy(() => import("../Modal/DeleteModal/DeleteModal"));
const Table = lazy(() => import("../components/Challengetable/Challengetable"));


const MemoizedDashboardMenu = memo(({ onSearch, handleAddChallengeClick, role, username }) => (
  <DashboardMenu onSearch={onSearch} handleAddChallengeClick={handleAddChallengeClick} role={role} username={username} />
));

const DashboardPage = () => {
  const { role, checkAuthToken, username } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [challengeToDelete, setChallengeToDelete] = useState(null);
  const [localChallenge, setLocalChallenge] = useState(null);
  const [challengeName, setChallengeName] = useState("New Challenge");
  const challengeRef = useRef(null);
  const dispatch = useDispatch();

 
 
  const {
    challenges,
    isChallengeSliceListFetching,
    isChallengeSliceSuccess,
    isChallengeSliceError,
    challengeSliceErrorMessage,
    challengeSliceSuccessMessage,
  } = useSelector((state) => state.challengeSlice);

  useEffect(() => {
    checkAuthToken();
  
  }, [checkAuthToken]);

  useEffect(()=>{
    dispatch(getAllChallenges());
    return () => {
      dispatch(clearChallengeState());
      dispatch(clearChallengeData());
    };
  }, [dispatch]);

  useEffect(() => {
    if (isChallengeSliceSuccess) {
      toast.success(challengeSliceSuccessMessage);
    } else if (isChallengeSliceError) {
      toast.error(challengeSliceErrorMessage);
    }

    return () => {
      dispatch(clearChallengeState());
    };
  }, [isChallengeSliceSuccess, isChallengeSliceError, challengeSliceSuccessMessage, challengeSliceErrorMessage, dispatch]);

  // Debounce the search input to reduce re-renders
  const handleSearch = useCallback(
    debounce((term) => {
      setSearchTerm(term);
    }, 300),
    []
  );

  const handleAddChallengeClick = useCallback(() => {
    const newChallenge = {
      id: Date.now(),
      challenge_name: "New Challenge",
      is_enabled: false,
      num_scenarios: 0,
    };

    localStorage.setItem("newChallenge", JSON.stringify(newChallenge));
    setLocalChallenge(newChallenge);
    setChallengeName(newChallenge.challenge_name);
  }, []);

  const handleClickOutside = useCallback(
    (event) => {
      if (challengeRef.current && !challengeRef.current.contains(event.target)) {
        const savedChallenge = JSON.parse(localStorage.getItem("newChallenge"));
        if (savedChallenge) {
          dispatch(addChallenge(savedChallenge));
          localStorage.removeItem("newChallenge");
          setLocalChallenge(null);
        }
      }
    },
    [dispatch]
  );

  useEffect(() => {
    if (localChallenge) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [localChallenge, handleClickOutside]);

  const handleEditChallenge = useCallback(
    (editedChallenge) => {
      dispatch(editChallenge(editedChallenge));
    },
    [dispatch]
  );

  const handleChangeStatus = useCallback(
    (obj) => {
      dispatch(editChallenge({ id: obj.id, is_enabled: obj.is_enabled }));
      // dispatch(editChallenge({ id: obj.id }));
    },
    [dispatch]
  );

  const openDeleteModal = useCallback((challenge) => {
    setChallengeToDelete(challenge);
    setIsDeleteModalOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
    setChallengeToDelete(null);
  }, []);

  const handleDeleteChallenge = useCallback(() => {
    if (challengeToDelete) {
      dispatch(deleteChallenge(challengeToDelete));
      closeDeleteModal();
    }
  }, [challengeToDelete, dispatch, closeDeleteModal]);


  const handleCreateChallenge = useCallback(() => {
    if (localChallenge) {
      const { id, ...challengeWithoutId } = localChallenge; // Remove 'id'
      const updatedChallenge = {
        ...challengeWithoutId,
        challenge_name: challengeName,
      };
      dispatch(addChallenge(updatedChallenge));
      localStorage.removeItem("newChallenge");
      setLocalChallenge(null);
    }
  }, [localChallenge, challengeName, dispatch]);
  
  const handleCancelChallenge = useCallback(() => {
    localStorage.removeItem("newChallenge");
    setLocalChallenge(null);
  }, []);


  const filteredChallenges = useMemo(
    () =>
      challenges.filter((challenge) =>
        challenge.challenge_name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [challenges, searchTerm]
  );

  return (
    <>
      <ToastContainer />
      {isChallengeSliceListFetching && <ComponentLoader />}
      <div
        className={cn("my-5 flex-grow flex flex-col px-4", "relative")}
        style={{ backgroundColor: "#f9f9f9" }}
      >
        <div className="container w-10/12 flex flex-col mx-auto justify-center items-center">
          <MemoizedDashboardMenu
            onSearch={handleSearch}
            handleAddChallengeClick={handleAddChallengeClick}
            role={role}
            username={username}
          />
          <div ref={challengeRef} className="w-full">
            {localChallenge && (
              <div className="bg-white shadow-lg rounded-lg w-full hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 border border-transparent">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-lg">
                  <div className="flex flex-row rounded-lg" style={{ backgroundColor: "#f7f8fc" }}>
                    <input
                      type="text"
                      value={challengeName}
                      onChange={(e) => setChallengeName(e.target.value)}
                      style={{ backgroundColor: "#f7f8fc" }}
                      className="p-4  work-sans-style"
                    />
                  </div>
                  <div className="flex items-center p-4"></div>
                  <div className="flex space-x-2 justify-start md:justify-end items-center p-4">
                    <button
                      onClick={handleCreateChallenge}
                      className="text-blue-500 border border-gray-300 px-3 py-2 shadow-lg rounded-md hover:text-blue-700 hover:border-blue-400"
                    >
                      Create Challenge
                    </button>
                    <button
                      onClick={handleCancelChallenge}
                      className="text-blue-500 border border-gray-300 px-3 py-2 shadow-lg rounded-md hover:text-blue-700 hover:border-blue-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
            <Suspense fallback={<ComponentLoader />}>
              {filteredChallenges.length > 0 ? (
                <Table
                  challenges={filteredChallenges}
                  handleEditChallenge={handleEditChallenge}
                  handleChangeStatus={handleChangeStatus}
                  handleDeleteChallenge={openDeleteModal}
                  role={role}
                />
              ) : !localChallenge && (
                <div className="flex flex-col w-full h-96 bg-white justify-center items-center">
                  <div className="flex flex-col gap-4 justify-center items-center">
                    <img src={nodata} alt="No Data" loading="lazy" className="w-40 h-40" />
                    <h1 className="work-sans-style text-[#A5A3A9]">No Challenge Found</h1>
                    {role === 'game_master' && (
                      <Button buttonName={"+ Add Challenge"} onClick={handleAddChallengeClick} />
                    )}
                  </div>
                </div>
              )}
            </Suspense>
          </div>
        </div>
        <Suspense fallback={<ComponentLoader />}>
        {isDeleteModalOpen && (
          <DeletePopup
            title="Challenge"
            item={challengeToDelete}
            onClose={closeDeleteModal}
            onDelete={handleDeleteChallenge}
            delTitle="Are you sure you want to delete this challenge?"
          />
        )}
        </Suspense>
      </div>
    </>
  );
};

export default DashboardPage;
