import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setError } from "./errorSlice";
let headers
headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  'Access-Control-Allow-Credentials':true,
  'Access-Control-Allow-Origin':true
  // Authorization: `Bearer ${token}`,
};
// Define initial state
const initialState = {
  responses:  [],
  responseById: null,
  isResponseFetching: false,
  isResponseSuccess: false,
  isResponseError: false,
  responseErrorMessage: "",
  responseSuccessMessage: "",
};

// Async thunk to get all responses
export const getAllResponsesByScenarioId = createAsyncThunk(
  "response/getAllResponsesByScenarioId",
  async (id, thunkAPI) => {
    try {
    //   const response = await fetch("/api/responses");
    //   if (!response.ok) {
    //     throw new Error('Failed to fetch responses');
    //   }
    //   const data = await response.json();
    // return data;
    const storedResponses = localStorage.getItem('responses');
      
    if (storedResponses) {
      const parsedResponses = JSON.parse(storedResponses);
      const scenarioResponses = parsedResponses.filter(response => response.scenarioId === id);

      if (scenarioResponses.length > 0) {
        return scenarioResponses;
      } else {
        throw new Error('No responses found for the given scenarioId');
      }
    } else {
      throw new Error('No responses stored in localStorage');
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

// Async thunk to get a response by ID
export const getResponseById = createAsyncThunk(
  "response/getResponseById",
  async ({participantId,scenarioId}, thunkAPI) => {
    try {

      const participant_id=participantId
        const scenario_id=scenarioId
      const response = await fetch(`/api/scenarios/${scenario_id}/participants/${participant_id}/scores`,{
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
      return thunkAPI.rejectWithValue(response.statusText);}
    } catch (error) {
      thunkAPI.dispatch(setError({
        statusCode: 500,
        message: error.message,
    }));
      return thunkAPI.rejectWithValue(error.message);
   
    }
  }
);

// Async thunk to submit a response by ID
export const submitResponseById = createAsyncThunk(
  "response/submitResponseById",
  async ( responses, thunkAPI) => {
    try {
    
       const formattedData=responses.responses
      const response = await fetch('/api/record_responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedData),
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
const responseSlice = createSlice({
  name: "response",
  initialState,
  reducers: {
    clearResponseState: (state) => {
      state.responses = [];
      state.responseById = null;
      state.isResponseFetching = false;
      state.isResponseSuccess = false;
      state.isResponseError = false;
      state.responseErrorMessage = "";
      state.responseSuccessMessage = "";
     
    },
    updatedScores:(state, action) => {
      // console.log("BIKIR@",action.payload.data[0][0], action.payload.tab)
      const tabName = action.payload.tab;
      if(tabName == "summary")
      {
        state.responseById.summary_scores.scores = action.payload.data[0].find(e=> e.response_id === state.responseById.summary_scores.response_id);
        state.responseById.summary_scores.demand_comment = action.payload.data[0].find(e=> e.response_id === state.responseById.summary_scores.response_id).demand_comment;  
      } else if(tabName == "concept_of_operation")
      {
        state.responseById.concept_of_operation_scores.scores = action.payload.data[0].find(e=> e.response_id === state.responseById.concept_of_operation_scores.response_id);
        state.responseById.concept_of_operation_scores.demand_comment = action.payload.data[0].find(e=> e.response_id === state.responseById.concept_of_operation_scores.response_id).demand_comment;
      } else if(tabName == "complexity")
      { 
        for (let i=0; i< state.responseById.scores[0].demands.length; i++)
        {
          state.responseById.scores[0].demands[i].scores=action.payload.data[0].find(e => e.response_id === state.responseById.scores[0].demands[i].response_id);
        }
        // state.responseById.scores[0].demands[0].scores=action.payload.data[0].find(e => e.response_id === state.responseById.scores[0].demands[0].response_id);
      } else if(tabName == "science")
      {
        for (let i=0; i< state.responseById.scores[1].demands.length; i++)
          {
            state.responseById.scores[1].demands[i].scores=action.payload.data[0].find(e => e.response_id === state.responseById.scores[1].demands[i].response_id);
          }
  
        // state.responseById.scores[1].demands[0].scores=action.payload.data[0].find(e => e.response_id === state.responseById.scores[0].demands[0].response_id);
      } else if(tabName == "engineering")
      {
        for (let i=0; i< state.responseById.scores[2].demands.length; i++)
          {
            state.responseById.scores[2].demands[i].scores=action.payload.data[0].find(e => e.response_id === state.responseById.scores[2].demands[i].response_id);
          }
  
        // state.responseById.scores[2].demands[0].scores=action.payload.data[0].find(e => e.response_id === state.responseById.scores[0].demands[0].response_id);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllResponsesByScenarioId.pending, (state) => {
        state.isResponseFetching = true;
      })
      .addCase(getAllResponsesByScenarioId.fulfilled, (state, { payload }) => {
        state.isResponseFetching = false;
        state.isResponseSuccess = true;
        state.responses = payload;
        state.responseSuccessMessage = "Responses fetched successfully.";
      })
      .addCase(getAllResponsesByScenarioId.rejected, (state, { payload }) => {
        state.isResponseFetching = false;
        state.isResponseError = true;
        state.responseErrorMessage = `Error: ${payload}`;
      })
      .addCase(getResponseById.pending, (state) => {
        state.isResponseFetching = true;
      })
      .addCase(getResponseById.fulfilled, (state, { payload }) => {
        state.isResponseFetching = false;
        state.isResponseSuccess = true;
        state.responseById = payload;
        state.responseSuccessMessage = "Response fetched successfully.";
      })
      .addCase(getResponseById.rejected, (state, { payload }) => {
        state.isResponseFetching = false;
        state.isResponseError = true;
        state.responseErrorMessage = `Error: ${payload}`;
      })
      .addCase(submitResponseById.pending, (state) => {
        state.isResponseFetching = true;
      })
      .addCase(submitResponseById.fulfilled, (state, { payload }) => {
        state.isResponseFetching = false;
        state.isResponseSuccess = true;
        state.responses.push(payload);
        state.responseSuccessMessage = "Response submitted successfully.";
      })
      .addCase(submitResponseById.rejected, (state, { payload }) => {
        state.isResponseFetching = false;
        state.isResponseError = true;
        state.responseErrorMessage = `Error: ${payload}`;
      });
  },
});

export const { clearResponseState,updatedScores } = responseSlice.actions;

export default responseSlice;
