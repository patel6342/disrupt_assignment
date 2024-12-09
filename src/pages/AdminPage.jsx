import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  Suspense,
} from "react";
import ComponentLoader from "../components/ComponentLoader/ComponentLoader";
import DefaultTable from "../components/defaultTable/DefaultTable";
import AdminMenu from "../Menu/AdminMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrashAlt,
  faArrowUpRightFromSquare,
  faToggleOn,
  faToggleOff,
} from "@fortawesome/free-solid-svg-icons";
import { cn } from "../lib/utils";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeletePopup from "../Modal/DeleteModal/DeleteModal";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../routes/AuthContext";
import { signupUser, getAllUsers ,clearAllSliceStates } from "../redux/auth";
const AdminPage = () => {
  const { isLoggedIn, role, checkAuthToken, username } = useAuth();

  useEffect(() => {
    checkAuthToken();
  }, [checkAuthToken]);

  const [searchTerm, setSearchTerm] = useState("");
  const [toggleState, setToggleState] = useState({});
  const [editRow, setEditRow] = useState(null);
  const [localUser, setLocalUser] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userPassword, setUserPassword] = useState(null);
  const dispatch = useDispatch();
  const { allUsers ,isAuthSliceSuccess,authSliceSuccessMessage,authSliceErrorMessage,isAuthSliceError} = useSelector((state) => state.authentication);

  const [data, setData] = useState([
    {
      id: "1",
    
      username: "John Doe",
      role: "Game Master",
    },
    {
      id: "2",
     
      username: "Jane Smith",
      role: "Participant",
    },
    {
      id: "3",
   
      username: "Emily Johnson",
      role: "Judge",
    },
  ]);

  const [isDeletePopupOpen, setDeletePopupOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const userRef = useRef(null);
  const columns = ["username", "role", "Actions"];

  const options = [
    { id: "High", name: "High" },
    { id: "Low", name: "Low" },
  ];

  const roleOptions = [
    { id: "game_master", name: "Game Master" },
    { id: "judge", name: "Judge" },
    { id: "participant", name: "Participant" },
    { id: "admin", name: "Admin" },
  ];

  const handleToggleStatus = (rowId) => {
    setToggleState((prevState) => ({
      ...prevState,
      [rowId]: !prevState[rowId],
    }));
  };

  const handleEditClick = (row) => {
    setEditRow(row);
  };

  const handleSaveClick = () => {
    const { username, role } = editRow;

    if (!username || !role ) {
      toast.error("All fields are required.");
      return;
    }

    const validRoles = roleOptions.map((option) => option.id);
    if (!validRoles.includes(role)) {
      toast.error("Role must be one of: game_master, judge, participant.");
      return;
    }

    setData((prevData) =>
      prevData.map((row) => (row["id"] === editRow["id"] ? editRow : row))
    );
    setEditRow(null);
  };

  const handleCancelClick = () => {
    setEditRow(null);
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setEditRow((prevRow) => ({ ...prevRow, [name]: value }));
  };

  const handleDeleteClick = (row) => {
    setItemToDelete(row);
    setDeletePopupOpen(true);
  };

  const handleDeleteConfirm = (id) => {
    setData((prevData) => prevData.filter((item) => item.id !== id));
    setDeletePopupOpen(false);
    setItemToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeletePopupOpen(false);
    setItemToDelete(null);
  };

  const handleNavigate = (row) => {
    console.log("Navigate to", row);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const addDemoUser = () => {
    const newUsername = "New User";
    const newRole = "participant";

    const newUser = {
      username: newUsername,
      role: newRole,
      password: newUsername + "_123",
    };
    console.log("newuser", newUser);

    localStorage.setItem("newUser", JSON.stringify(newUser));
    setLocalUser(newUser);
    setUserName(newUser.username);
    setUserRole(newUser.role);
    setUserPassword(newUser.password);
  };

  const handleClickOutside = useCallback(
    (event) => {
      if (userRef.current && !userRef.current.contains(event.target)) {
        const savedUser = JSON.parse(localStorage.getItem("newUser"));
        if (savedUser) {
          dispatch(signupUser(savedUser));
          localStorage.removeItem("newUser");
          setLocalUser(null);
        }
      }
    },
    [dispatch]
  );
  const handleCreateUser = useCallback(() => {
    if (localUser) {
      const updatedUser = {
        ...localUser,
        username: userName,
        role: userRole,
        password: userPassword,
      };
      dispatch(signupUser(updatedUser));
      localStorage.removeItem("newUser");
      setLocalUser(null);
    }
  }, [localUser, userName, userRole, userPassword, dispatch]);

  const handleCancelUser = useCallback(() => {
    localStorage.removeItem("newUser");
    setLocalUser(null);
  }, []);

  useEffect(() => {
    if (localUser) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [localUser, handleClickOutside]);

  const actions = (row) => [
    {
      className: `text-${
        toggleState[row["id"]] ? "[#4C6EF5]" : "gray-500"
      } hover:text-${
        toggleState[row["id"]] ? "blue-700" : "gray-700"
      } px-3 py-1`,
      onClick: () => handleToggleStatus(row["id"]),
      icon: toggleState[row["id"]] ? (
        <FontAwesomeIcon icon={faToggleOn} size="md" />
      ) : (
        <FontAwesomeIcon icon={faToggleOff} size="md" />
      ),
      text: toggleState[row["id"]] ? "Active" : "Inactive",
    },
    {
      className: "text-black px-3 py-1 hover:text-blue-700",
      onClick: () => handleEditClick(row),
      icon: <FontAwesomeIcon icon={faEdit} size="sm" />,
    },
    {
      className: "text-black px-3 py-1 hover:text-blue-700",
      onClick: () => handleDeleteClick(row),
      icon: <FontAwesomeIcon icon={faTrashAlt} size="sm" />,
    },
    {
      className: "text-black px-3 py-1 hover:text-blue-700",
      onClick: () => handleNavigate(row),
      icon: <FontAwesomeIcon icon={faArrowUpRightFromSquare} size="sm" />,
    },
  ];



  useEffect(() => {
    dispatch(getAllUsers());
    return (()=>{
      dispatch(clearAllSliceStates())
    })
  }, []);

  useEffect(() => {
    if (isAuthSliceSuccess ) {
      toast.error(authSliceSuccessMessage, {
        autoClose: 3000,
        hideProgressBar: false,
        pauseOnHover: true,
      });
    }
  }, [isAuthSliceSuccess,authSliceSuccessMessage]);

 
  useEffect(() => {
    if (isAuthSliceError) {
      toast.error(authSliceErrorMessage, {
        autoClose: 3000,
        hideProgressBar: false,
        pauseOnHover: true,
      });
    }
  }, [isAuthSliceError, authSliceErrorMessage]);

  console.log("allusers", allUsers);
  return (
    <div
      className={cn("my-5 flex-grow flex flex-col", "relative")}
      style={{ backgroundColor: "#f9f9f9" }}
    >
      <div className="w-full flex flex-col">
        <AdminMenu
          onSearch={handleSearch}
          options={options}
          roleOptions={roleOptions}
          onAddUser={addDemoUser}
        />
        <div ref={userRef} className="w-full">
          {localUser && (
            <div className=" w-11/12 mx-auto hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 border border-transparent">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 rounded-lg">
                <div
                  className="flex flex-col p-4 "
                  
                >
                <label>UserName</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="font-semibold text-xl  w-8/12 rounded"
                  />
                </div>
                <div className="flex  flex-col p-4">
                <label>Password</label>
                  <input
                    type="text"
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                    className="font-semibold text-xl   w-8/12 rounded"
                  />
                </div>
                <div className="flex  flex-col p-4">
                <label>Role </label>
                  <select
                    name="role"
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="">Select Role</option>
                    <option value="game_master">Game Master</option>
                    <option value="judge">Judge</option>
                    <option value="participant">Participant</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex space-x-2 justify-start md:justify-end items-center p-4">
                  <button
                    onClick={handleCreateUser}
                    className="text-blue-500 border border-gray-300 px-3 py-2 shadow-lg rounded-md hover:text-blue-700 hover:border-blue-400"
                  >
                    Create User
                  </button>
                  <button
                    onClick={handleCancelUser}
                    className="text-blue-500 border border-gray-300 px-3 py-2 shadow-lg rounded-md hover:text-blue-700 hover:border-blue-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <DefaultTable
          columns={columns}
          data={data}
          actions={actions}
          editRow={editRow}
          onFieldChange={handleFieldChange}
          onSave={handleSaveClick}
          onCancel={handleCancelClick}
        />
        <ToastContainer />

        {isDeletePopupOpen && itemToDelete && (
          <DeletePopup
            title="User"
            item={itemToDelete}
            onClose={handleDeleteCancel}
            onDelete={() => handleDeleteConfirm(itemToDelete.id)}
            delTitle={`Are you sure you want to delete ${itemToDelete.username}?`}
          />
        )}
      </div>
    </div>
  );
};

export default AdminPage;
