import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { setError } from "./errorSlice";
let headers;
// const apiUrl = process.env.REACT_APP_BACKEND_URL;
const apiUrl = "";

 headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  'Access-Control-Allow-Credentials':true,
  'Access-Control-Allow-Origin':true
  // Authorization: `Bearer ${token}`,
};
// Define initial state
const initialState = {
  challenges: [],
  challengeById:[],
  isChallengeSliceFetching: false,
  isChallengeSliceListFetching:false,
  isChallengeSliceSuccess: false,
  isChallengeSliceError: false,
  challengeSliceErrorMessage: "",
  challengeSliceSuccessMessage: "",
  isChallengeSliceListSuccess:false
};

export const getAllChallenges = createAsyncThunk(
  'challenge/getAllChallenges',
  async (_, thunkAPI) => {
    try {
      const response = await fetch('/api/get_challenges',{
      method: "GET",
      headers,
    });
    let data = await response.json();
    if (response.status === 200) {
      return data;
    } else {
      thunkAPI.dispatch(setError({
        statusCode: response.status,
        message: 'Failed to fetch data',
    }));
    return thunkAPI.rejectWithValue(response.statusText);

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

export const getChallengeById = createAsyncThunk(
  'challenge/getChallengeById',
  async (challengeId, thunkAPI) => {
      try {
      
        const challenge_id=challengeId
        const response = await fetch(`/api/challenges/${challenge_id}/scenarios`,{
        method: "GET",
        headers,
      });
      let data = await response.json();
      if (response.status === 200) {
        return data;
      } else {
        thunkAPI.dispatch(setError({
          statusCode: response.status,
          message: 'Failed to fetch data',
      }));
      return thunkAPI.rejectWithValue(response.statusText);
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

// Define async thunks for API calls
export const addChallenge = createAsyncThunk('challenge/addChallenge', async (challengeData, thunkAPI) => {
  try {
    const response = await fetch('/api/create_challenge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(challengeData),
    });
    let data = await response.json();
      if (response.status === 200) {
        return data;
      }  else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response?.data || 'Something went wrong');
    }
  });

export const editChallenge = createAsyncThunk('challenge/editChallenge', async (challengeData, thunkAPI) => {
  try {
    const response = await fetch(`api/update_challenge/${challengeData.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(challengeData),
    });
    let data = await response.json();
      if (response.status === 200) {
        return data;
      }  else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response?.data || 'Something went wrong');
    }
  });

export const deleteChallenge = createAsyncThunk('challenge/deleteChallenge', async (challengeId, thunkAPI) => {
  try {
    const ids=[challengeId]
 
    const response = await fetch('/api/delete_challenges',{
      headers,
      method: 'DELETE',
      body:JSON.stringify(ids)
      
    });
    let data = await response.json();
    if (response.status === 200) {
      return data;
    }  else {
      return thunkAPI.rejectWithValue(data);
    }
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data || 'Something went wrong');
  }
});


// Create slice
const challengeSlice = createSlice({
  name: 'challenge',
  initialState,
  reducers: {
    clearChallengeState: (state) => {
      state.isChallengeSliceFetching = false;
      state.isChallengeSliceSuccess = false;
      state.isChallengeSliceError = false;
      state.challengeSliceErrorMessage = "";
      state.challengeSliceSuccessMessage = "";
      state.isChallengeSliceListFetching=false;
      state.isChallengeSliceListSuccess=false
    },
    clearChallengeData:(state)=>{
      state.challenges=[]
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(getAllChallenges.pending, (state) => {
      state.isChallengeSliceListFetching = true;
    })
    .addCase(getAllChallenges.fulfilled, (state, { payload }) => {
      state.isChallengeSliceListFetching = false;
      state.isChallengeSliceListSuccess = true;
      state.challenges = payload;
      // state.challengeSliceSuccessMessage = "Challenges fetched successfully.";
    })
    .addCase(getAllChallenges.rejected, (state, { payload }) => {
      state.isChallengeSliceListFetching = false;
      state.isChallengeSliceError = true;
      state.challengeSliceErrorMessage = `Error: ${payload}`;
    })

    .addCase(getChallengeById.pending, (state) => {
      state.isChallengeSliceFetching = true;
    })
    .addCase(getChallengeById.fulfilled, (state, { payload }) => {
      state.isChallengeSliceFetching = false;
      state.isChallengeSliceSuccess = true;
      state.challengeById = payload;
      state.challengeSliceSuccessMessage = "Challenge By Id fetched successfully.";
    })
    .addCase(getChallengeById.rejected, (state, { payload }) => {
      state.isChallengeSliceFetching = false;
      state.isChallengeSliceError = true;
      state.challengeSliceErrorMessage = `Error: ${payload}`;
    })
    .addCase(addChallenge.pending, (state) => {
      state.isChallengeSliceFetching = true;
    })
    .addCase(addChallenge.fulfilled, (state, { payload }) => {
      state.isChallengeSliceFetching = false;
      state.isChallengeSliceSuccess = true;
      state.challenges.push(payload);
      state.challengeSliceSuccessMessage = "Challenge added successfully.";
    })
    .addCase(addChallenge.rejected, (state, { payload }) => {
      state.isChallengeSliceFetching = false;
      state.isChallengeSliceError = true;
      state.challengeSliceErrorMessage = `Error: ${payload}`;
    })
    .addCase(editChallenge.pending, (state) => {
      state.isChallengeSliceFetching = true;
    })
    .addCase(editChallenge.fulfilled, (state, { payload }) => {
      state.isChallengeSliceFetching = false;
      state.isChallengeSliceSuccess = true;
      
      const index = state.challenges.findIndex(challenge => challenge.id === payload.id);
      if (index >= 0) {
        state.challenges[index] = { ...state.challenges[index], ...payload };
      }
      state.challengeSliceSuccessMessage = "Challenge Edited successfully.";
    })
    .addCase(editChallenge.rejected, (state, { payload }) => {
      state.isChallengeSliceFetching = false;
      state.isChallengeSliceError = true;
      state.challengeSliceErrorMessage = `Error: ${payload}`;
    })
    .addCase(deleteChallenge.pending, (state) => {
      state.isChallengeSliceFetching = true;
    })
    .addCase(deleteChallenge.fulfilled, (state, { payload }) => {
      state.isChallengeSliceFetching = false;
      state.isChallengeSliceSuccess = true;
   

     
      const deletedChallengeIds = payload.deleted_challenge_ids;
      
     state.challenges = state.challenges.filter(challenge => !deletedChallengeIds.includes(Number(challenge.id)));
      
     state.challengeSliceSuccessMessage = "Challenge deleted successfully.";
    })
    .addCase(deleteChallenge.rejected, (state, { payload }) => {
      state.isChallengeSliceFetching = false;
      state.isChallengeSliceError = true;
      state.challengeSliceErrorMessage = `Error: ${payload}`;
    });
   
  },
});

export const { clearChallengeState,clearChallengeData } = challengeSlice.actions;

export default challengeSlice;





