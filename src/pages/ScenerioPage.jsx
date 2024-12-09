import React, { useEffect, useState, lazy, Suspense, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllScenario,
  addScenario,
  editScenario,
  deleteScenario,
  clearScenarioListData,
  clearScenarioState,
} from "../redux/scenario";
import { cn } from "../lib/utils";
import nodata from "../assets/image.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../routes/AuthContext";
import ComponentLoader from "../components/ComponentLoader/ComponentLoader";
import Button from "../components/Button/Button";

// Lazy loading components
const ScenerioMenu = lazy(() => import("../Menu/ScenerioMenu"));
const ScenarioTable = lazy(() => import("../components/Sceneriotable/Sceneriotbale"));
const DeletePopup = lazy(() => import("../Modal/DeleteModal/DeleteModal"));

// Sub-components
const AddScenarioForm = ({ onCreate, onCancel, value, onChange }) => (
  <div className="bg-white m-4 shadow-lg rounded-lg w-full hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 border border-transparent">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-lg">
      <div className="flex flex-row rounded-lg" style={{ backgroundColor: "#f7f8fc" }}>
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder="Enter scenario name"
          style={{ backgroundColor: "#f7f8fc" }}
          className=" p-4  work-sans-style"   />
      </div>
      <div className="flex items-center p-4"></div>
      <div className="flex space-x-2 justify-start md:justify-end items-center p-4">
        <button onClick={onCreate} 
                 className="text-blue-500 border border-gray-300 px-3 py-2 shadow-lg rounded-md hover:text-blue-700 hover:border-blue-400"
                 >
          Create
        </button>
        <button onClick={onCancel} 
                className="text-blue-500 border border-gray-300 px-3 py-2 shadow-lg rounded-md hover:text-blue-700 hover:border-blue-400"
                 
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
);

const NoDataSection = ({ role, onAddClick }) => (
  <div className="flex flex-col w-full h-96 bg-white justify-center items-center">
    <div className="flex flex-col gap-4 justify-center items-center">
      <img src={nodata} alt="No Data" loading='lazy' className="w-40 h-40" />
      <h1 className="work-sans-style text-[#A5A3A9]">No Scenarios Found</h1>
      {role === "game_master" && <Button buttonName={"+ Add Scenarios"} onClick={onAddClick} />}
    </div>
  </div>
);

const ScenerioPage = () => {
  const { challengeId } = useParams();
  const { isLoggedIn, role, checkAuthToken } = useAuth();

  useEffect(() => {
    checkAuthToken();
  }, [checkAuthToken]);

  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [scenarioToDelete, setScenarioToDelete] = useState(null);
  const [showAddScenarioForm, setShowAddScenarioForm] = useState(false);
  const [newScenarioName, setNewScenarioName] = useState('');

  const {
    scenarios,
    challengeName,
    isScenarioSliceListFetching,
    isScenarioSliceListSuccess,
    isScenarioSliceFetching,
    isScenarioSliceSuccess,
    scenarioSliceErrorMessage,
    scenarioSliceSuccessMessage,
    isScenarioSliceError,
  } = useSelector((state) => state.scenarioSlice);

  const handleAddScenarioClick = () => setShowAddScenarioForm(true);
  const handleInputChange = (e) => setNewScenarioName(e.target.value);
  const handleCreateScenario = () => {
    if (newScenarioName.trim() === '') {
      toast.error("Scenario name cannot be empty");
      return;
    }
    const newScenario = {
      name: newScenarioName,
      is_enabled: false,
      challenge_id: challengeId,
      background: '',
      deliverable: '',
      timeline: '',
      requirements: [],
    };
    dispatch(addScenario(newScenario));
    setNewScenarioName('');
    setShowAddScenarioForm(false);
  };
  const handleCancelCreation = () => {
    setNewScenarioName('');
    setShowAddScenarioForm(false);
  };
  const handleEditScenario = (id, editedScenario) => dispatch(editScenario({ id, name: editedScenario }));
  const handleDeleteScenario = (id) => {
    setScenarioToDelete(id);
    setShowDeletePopup(true);
  };
  const confirmDeleteScenario = () => {
    dispatch(deleteScenario(scenarioToDelete));
    setShowDeletePopup(false);
  };
  const handleChangeStatus = (id, status) => dispatch(editScenario({ id, is_enabled: status }));
  // const handleChangeStatus = (id) => dispatch(editScenario({ id }));
  const handleSearch = (term) => setSearchTerm(term);

  useEffect(() => {
    dispatch(getAllScenario(challengeId));
    return () => {
      dispatch(clearScenarioState());
      dispatch(clearScenarioListData());
    };
  }, [ challengeId]);

  useEffect(() => {
    if (isScenarioSliceSuccess) {
      toast.success(scenarioSliceSuccessMessage);
    } else if (isScenarioSliceError) {
      toast.error(scenarioSliceErrorMessage);
    }

    return () => {
      dispatch(clearScenarioState());
    }
  }, [
    isScenarioSliceError,
    isScenarioSliceSuccess,
    scenarioSliceErrorMessage,
    scenarioSliceSuccessMessage,
    
  ]);

  // Memoize filtered scenarios
  const filteredScenarios = useMemo(() => {
    return scenarios.filter((scenario) =>
      scenario.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [scenarios, searchTerm]);

  return (
    <>
      <ToastContainer />
      {isScenarioSliceListFetching && <ComponentLoader />}
      {showDeletePopup && (
        <Suspense fallback={<ComponentLoader />}>
          <DeletePopup
            title="Scenario"
            item={{ "S No.": scenarioToDelete }}
            onClose={() => setShowDeletePopup(false)}
            onDelete={confirmDeleteScenario}
            delTitle="Are you sure you want to delete this scenario?"
          />
        </Suspense>
      )}
      <div className={cn("my-5 flex-grow flex flex-col px-4", "relative")} style={{ backgroundColor: "#f9f9f9" }}>
        <div className="container w-10/12 md:w-10/12 lg:w-10/12 xl:w-10/12 2xl:w-10/12 flex flex-col mx-auto justify-center items-center">
          <Suspense fallback={<ComponentLoader />}>
            <ScenerioMenu
              onSearch={handleSearch}
              challengeId={challengeId}
              challengeName={challengeName || "Unknown Challenge"}
              status={challengeId?.is_enabled || "Unknown Status"}
              handleAddScenarioClick={handleAddScenarioClick}
              role={role}
            />
          </Suspense>

          {showAddScenarioForm && (
            <AddScenarioForm
              onCreate={handleCreateScenario}
              onCancel={handleCancelCreation}
              value={newScenarioName}
              onChange={handleInputChange}
            />
          )}

          {filteredScenarios.length > 0 ? (
            <Suspense fallback={<ComponentLoader />}>
              <ScenarioTable
                scenarios={filteredScenarios}
                updateScenarioStatus={handleChangeStatus}
                handleDeleteScenario={handleDeleteScenario}
                handleEditScenario={handleEditScenario}
                chId={challengeId}
                role={role}
              />
            </Suspense>
          ) : (
            !showAddScenarioForm && (
              <NoDataSection
                role={role}
                onAddClick={handleAddScenarioClick}
              />
            )
          )}
        </div>
      </div>
    </>
  );
};

export default ScenerioPage;
