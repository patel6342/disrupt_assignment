import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { setError } from "./errorSlice";
import { redirect } from "react-router-dom";

let headers;
headers = {
  Accept: "application/json",
  'Access-Control-Allow-Credentials':true,
  'Access-Control-Allow-Origin':true
};
const data =
  Cookies.get("loginData") !== "undefined" && Cookies.get("loginData")
    ? JSON.parse(Cookies.get("loginData"))
    : null;

let officialEmail;

// const apiUrl = import.meta.env.VITE_BACKEND_URL;

const setTokenValues = () => {
  officialEmail = data.user.officialEmail;
};

const getTokenValues = () => {
  const data = Cookies.get("loginData")
    ? JSON.parse(Cookies.get("loginData"))
    : null;

  userId = data?.Data?.id;
};

export const loginUser = createAsyncThunk(
  "loginUser",
  async (obj, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("username", obj.username);
      formData.append("password", obj.password);

      const response = await fetch("/api/login", {
        method: "POST",
        body: formData,
      });

      if (response.redirected || response.status===302) {
     
        const redirectedUrl = response.url;
     
       return response
        // return thunkAPI.rejectWithValue(`Redirected to ${redirectedUrl}`);
      } else if (response.ok) {
      
        const data = await response.json();
     
        return data;
      } else {
       
        const errorData = await response.json(); 
        console.error("Login error:", errorData);
        return thunkAPI.rejectWithValue(errorData);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const signupUser = createAsyncThunk('signupUser', async (obj, thunkAPI) => {
  try {
    const response = await fetch('api/create_user', {
      method: 'POST',
      headers,
      withCredentials: 'include',
      body: JSON.stringify(obj),
    });
    const data = await response.json();
    if (response.status === 201) {
      return data;
    } else {
      return thunkAPI.rejectWithValue(data);
    }
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data || 'Something went wrong');
  }
});

export const  getAllUsers= createAsyncThunk(
  'auth/getAllUsers',
  async (_, thunkAPI) => {
    try {
      setTokenValues();
      const response = await fetch(`/api/getAllUsers`, {
        method: 'GET',
        headers,
      });
      const data = await response.json();
      if (response.status === 200) {
        return data;
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);
export const changePassword = createAsyncThunk(
  "changePassword",
  async (obj, thunkAPI) => {
    try {
      getTokenValues();

      const response = await fetch(`${apiUrl}/${userId}/changePassword`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
      });
      let data = await response.json();
      if (response.status === 200) {
        return data;
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (error) {
    
      thunkAPI.dispatch(setError({
        statusCode: 500,
        message: error.message,
    }));
      return thunkAPI.rejectWithValue(error.message);
   
    }
  }
);
export const forgotPassword = createAsyncThunk(
  "forgotPassword",
  async (obj, thunkAPI) => {
    try {
      getTokenValues();

      const response = await fetch(`${apiUrl}/forgotPassword`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
      });
      let data = await response.json();
      if (response.status === 200) {
        return data;
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (error) {
   
      thunkAPI.dispatch(setError({
        statusCode: 500,
        message: error.message,
    }));
      return thunkAPI.rejectWithValue(error.message);
   
    }
  }
);

export const resetPassword = createAsyncThunk(
  "resetPassword",
  async (obj, thunkAPI) => {
    try {
      getTokenValues();
   
      const response = await fetch(`${apiUrl}/resetPassword`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
      });
      let data = await response.json();
      if (response.status === 200) {
        return data;
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (error) {
    
      thunkAPI.dispatch(setError({
        statusCode: 500,
        message: error.message,
    }));
      return thunkAPI.rejectWithValue(error.message);
   
    }
  }
);

export const getUser=createAsyncThunk(
  'auth/getUser', async (_, thunkAPI) => {
    try {
      // setTokenValues();
      const response = await fetch('/api/get_user', {
        method: 'GET',
        headers,
        credentials:'include'
      });
      const data = await response.json();
      if (response.status === 200) {
       
    
        return data;
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const logOut=createAsyncThunk(
  'auth/logOut', async (_, thunkAPI) => {
    try {
      // setTokenValues();
      const response = await fetch('/api/logout', {
        method: 'GET',
        headers,
      });
      const data = await response;
    
      if (response.status === 302) {
    
      
        return response;
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

const initialStateValues = {
  isAuthSliceFetching: false,
  isAuthSliceSuccess: false,
  isAuthSliceError: false,
  authSliceErrorMessage: "",
  authSliceSuccessMessage: "",
  isAuthSliceFetchingSmall: false,
  isAuthSliceUserFetching:false,
  ischngeSliceSuccess: false,
  ischngeSliceSuccessMessage: "",
  ischngeSliceError: false,
  ischngeSliceErrorMessage: "",
  isGetUserError:false,
  isGetUserFetching:false,
  isGetUserSuccess:false,
  // user: { status: null },
  user:{},
  userData:[],
  allUsers:[]
};

const authSlice = createSlice({
  name: "authentication",
  initialState: initialStateValues,
  reducers: {
    
    clearAllSliceStates: (state, action) => {
      state.authSliceSuccessMessage = "";
      state.authSliceErrorMessage = "";
      state.isAuthSliceError = false;
      state.isAuthSliceFetching = false;
      state.isAuthSliceFetchingSmall = false;
      state.isAuthSliceSuccess = false;
    },
    clearUserData:(state,action)=>{
      state.userData=[]
    }
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state, { payload }) => {
      state.isAuthSliceFetching = false;
      state.isAuthSliceFetchingSmall = false;
      state.isAuthSliceSuccess = true;
      
     
        // state.user = payload;
    
      
      return state;
    });
    builder.addCase(loginUser.rejected, (state, { payload }) => {
      state.isAuthSliceFetching = false;
      state.isAuthSliceError = true;
      state.authSliceErrorMessage = payload?.detail || "Something Went Wrong";
    });
    builder.addCase(loginUser.pending, (state, { payload }) => {
      state.isAuthSliceFetching = true;
    
    });
    builder.addCase(signupUser.fulfilled, (state, { payload }) => {
      state.isAuthSliceFetching = false;
      state.isAuthSliceSuccess = true;
      state.authSliceSuccessMessage=payload?.Message || "User Created Successfully !"
    });
    builder.addCase(signupUser.rejected, (state, { payload }) => {
      state.isAuthSliceFetching = false;
      state.isAuthSliceError = true;
      state.authSliceErrorMessage = payload?.Message || 'Signup Failed';
    });
    builder.addCase(signupUser.pending, (state) => {
      state.isAuthSliceFetching = true;
    })
    builder.addCase(getAllUsers.fulfilled, (state, { payload }) => {
      state.isAuthSliceFetching = false;
      state.isAuthSliceSuccess = true;
      state.allUsers = payload;
     
    });
    builder.addCase(getAllUsers.rejected, (state, { payload }) => {
      state.isAuthSliceFetching = false;
      state.isAuthSliceError = true;
      state.authSliceErrorMessage = payload?.message || 'Something Went Wrong';
    });
    builder.addCase(getAllUsers.pending, (state) => {
      state.isAuthSliceFetching = true;
    })
    builder.addCase(changePassword.fulfilled, (state, { payload }) => {
      state.isAuthSliceFetching = false;
      state.isAuthSliceFetchingSmall = false;
      state.ischngeSliceSuccess = true;
      state.ischngeSliceSuccessMessage =
        payload?.Message || "Password Successfully changed";
      return state;
    });
    builder.addCase(changePassword.rejected, (state, { payload }) => {
      state.isAuthSliceFetching = false;
      state.isAuthSliceFetchingSmall = false;
      state.ischngeSliceError = true;
      state.ischngeSliceErrorMessage =
        payload?.message || "Something Went Wrong";
    });
    builder.addCase(changePassword.pending, (state, { payload }) => {
      state.isAuthSliceFetching = true;
      state.isAuthSliceFetchingSmall = true;
    });

    builder.addCase(forgotPassword.fulfilled, (state, { payload }) => {
      state.isAuthSliceFetching = false;
      state.ischngeSliceSuccess = true;
      state.isAuthSliceFetchingSmall = false;
      state.ischngeSliceSuccessMessage =
        payload?.Message || "Reset Password Mail Sent";
      return state;
    });
    builder.addCase(forgotPassword.rejected, (state, { payload }) => {
      state.isAuthSliceFetching = false;
      state.ischngeSliceError = true;
      state.isAuthSliceFetchingSmall = false;
      state.ischngeSliceErrorMessage =
        payload?.message || "Something Went Wrong";
    });
    builder.addCase(forgotPassword.pending, (state, { payload }) => {
      state.isAuthSliceFetching = true;
      state.isAuthSliceFetchingSmall = true;
    });

    builder.addCase(resetPassword.fulfilled, (state, { payload }) => {
      state.isAuthSliceFetching = false;
      state.ischngeSliceSuccess = true;
      state.isAuthSliceFetchingSmall = false;
      state.ischngeSliceSuccessMessage =
        payload?.Message || "Password Successfully changed";
      return state;
    });
    builder.addCase(resetPassword.rejected, (state, { payload }) => {
      state.isAuthSliceFetching = false;
      state.ischngeSliceError = true;
      state.isAuthSliceFetchingSmall = false;
      state.ischngeSliceErrorMessage =
        payload?.message || "Something Went Wrong";
    });
    builder.addCase(resetPassword.pending, (state, { payload }) => {
      state.isAuthSliceFetching = true;
      state.isAuthSliceFetchingSmall = true;
    })
    builder.addCase(getUser.fulfilled, (state, { payload }) => {
      state.isGetUserFetching = false;
      state.isGetUserSuccess = true;
      state.userData = payload;
     
    });
    builder.addCase(getUser.rejected, (state, { payload }) => {
      state.isGetUserFetching = false;
      state.isGetUserError = true;
      });
    builder.addCase(getUser.pending, (state) => {
      state.isGetUserFetching = true;
    })
    builder.addCase(logOut.fulfilled, (state, { payload }) => {
      state.isAuthSliceFetching = false;
      state.isAuthSliceSuccess = true;
      state.authSliceSuccessMessage="LogOut Successfully !"
      state.userData = [];
      // state.user={}
     
    });
    builder.addCase(logOut.rejected, (state, { payload }) => {
      state.isAuthSliceFetching = false;
      state.isAuthSliceError = true;
      state.authSliceErrorMessage = payload?.message || 'Something Went Wrong';
    });
    builder.addCase(logOut.pending, (state) => {
      state.isAuthSliceFetching = true;
    })
  },
});
                                                                
export const {  clearAllSliceStates ,clearUserData} = authSlice.actions;
export default authSlice;
