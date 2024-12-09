import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setError } from "./errorSlice";
import { updatedScores } from "./response";


let headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Origin': true,
};

// Define initial state
const initialState = {
  judgeData: null,
  isJudgeDataFetching: false,
  isJudgeDataSuccess: false,
  isJudgeDataError: false,
  judgeErrorMessage: "",
  judgeSuccessMessage: "",
};

// Async thunk to submit judge's score
export const submitScore = createAsyncThunk(
  "judge/submitScore",
  async (judgeData, thunkAPI) => {
    try {
      const response = await fetch('/api/submit_scores', {
        method: 'POST',
        headers,
        body: JSON.stringify(judgeData.data),
      });
      
      let data = await response.json();
      thunkAPI.dispatch(updatedScores({data, tab:judgeData.tab}))
      if (response.status === 200) {
        console.log("theojudgedata", judgeData)
        console.log("theojudgetab", judgeData.tab);
        return data;
      } 
     else {
      return thunkAPI.rejectWithValue(data);
    }
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data || 'Something went wrong');
  }
});

// Create slice
const judgeSlice = createSlice({
  name: "judge",
  initialState,
  reducers: {
    clearJudgeState: (state) => {
      
      state.isJudgeDataFetching = false;
      state.isJudgeDataSuccess = false;
      state.isJudgeDataError = false;
      state.judgeErrorMessage = "";
      state.judgeSuccessMessage = "";
      state.judgeData=null;
      state.formSubmittedSuccessfully = false;
    },
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitScore.pending, (state) => {
        state.isJudgeDataFetching = true;
      })
      .addCase(submitScore.fulfilled, (state, { payload }) => {
        state.isJudgeDataFetching = false;
        state.formSubmittedSuccessfully = true;
        state.submitJudgeData = payload;
        // state.judgeSuccessMessformSubmittedSucceformSubmittedSuccessfullyssfullyage = "Score submitted successfully.";
      })
      .addCase(submitScore.rejected, (state, { payload }) => {
        state.isJudgeDataFetching = false;
        state.isJudgeDataError = true;
        state.judgeErrorMessage = `Error: ${payload}`;
      });
  },
});

export const { clearJudgeState } = judgeSlice.actions;

export default judgeSlice;
