import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setError } from "./errorSlice";

let headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Origin': true,
};

const initialState = {
    participants: [],
    participantById: {},
    isParticipantSliceFetching: false,
    isParticipantSliceSuccess: false,
    isParticipantSliceError: false,
    participantSliceErrorMessage: "",
    participantSliceSuccessMessage: "",
  };
  export const getAllParticipantsByScenarioId = createAsyncThunk(
    'participant/getAllParticipantsByScenarioId',
    async (scenarioId, thunkAPI) => {
      try {
        const response = await fetch(`/api/scenarios/${scenarioId}/participants`, {
          method: "GET",
          headers,
        });     
        let data = await response.json();
    if (response.status === 200) {
      return data;
    
        } else {
          // Dispatch error for non-200 responses
          thunkAPI.dispatch(setError({
            statusCode: response.status,
            message: 'Failed to fetch participants',
          }));
          return thunkAPI.rejectWithValue(`Error: ${response.statusText}`);
        }
      } catch (error) {
        // Handle and dispatch any errors that occurred during fetch
        console.error('Fetch Error:', error);
        thunkAPI.dispatch(setError({
          statusCode: 500,
          message: error.message,
        }));
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );
  
  export const getParticipantById = createAsyncThunk(
    'participant/getParticipantById',
    async (participantId, scenarioId, challengeId, thunkAPI) => {
      try {
        const participant_id = 16
        const challenge_id = 109
        const scenario_id = 325
        const response = await fetch(`/api/challenge/${challenge_id}/scenario/${scenario_id}/showAllParticipants/participant/${participant_id}/judge`, {
          method: "GET",
          headers,
        });
        console.log("jjrtest", `/api/challenge/${challenge_id}/scenario/${scenario_id}/showAllParticipants/participant/${participant_id}/judge`)
        // const response = await fetch(`/api/challenge/109/scenario/325/showAllParticipants/participant/16/judge`, {
        //   method: "GET",
        //   headers,
        // });
        let data = await response.json();

        if (response.status === 200) {
          return data;
        } else {
          thunkAPI.dispatch(setError({
            statusCode: response.status,
            message: 'Failed to fetch participant data',
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

  export const getScoresByParticipantId = createAsyncThunk(
    'participant/getScoresByParticipantId',
    async (scenarioId, participantId, thunkAPI) => {
      const scenario_id = scenarioId;
      const participant_id = participantId;
      console.log("jjrscores", scenario_id, participant_id)
      try {
        const response = await fetch(`/api/scenarios/${scenario_id}/participants/${participant_id}/scores`, {
          method: "GET",
          headers,
        });     
        let data = await response.json();
    if (response.status === 200) {
      return data;
    
        } else {
          // Dispatch error for non-200 responses
          thunkAPI.dispatch(setError({
            statusCode: response.status,
            message: 'Failed to fetch participants',
          }));
          return thunkAPI.rejectWithValue(`Error: ${response.statusText}`);
        }
      } catch (error) {
        // Handle and dispatch any errors that occurred during fetch
        console.error('Fetch Error:', error);
        thunkAPI.dispatch(setError({
          statusCode: 500,
          message: error.message,
        }));
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );

  const participantSlice = createSlice({
    name: 'participant',
    initialState,
    reducers: {
      clearParticipantState: (state) => {
        state.participants = [];
        state.participantById = {};
        state.isParticipantSliceFetching = false;
        state.isParticipantSliceSuccess = false;
        state.isParticipantSliceError = false;
        state.participantSliceErrorMessage = "";
        state.participantSliceSuccessMessage = "";
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(getAllParticipantsByScenarioId.pending, (state) => {
          state.isParticipantSliceFetching = true;
        })
        .addCase(getAllParticipantsByScenarioId.fulfilled, (state, { payload }) => {
          state.isParticipantSliceFetching = false;
          state.isParticipantSliceSuccess = true;
          state.participants = payload;
          state.participantSliceSuccessMessage = "Participants fetched successfully.";
        })
        .addCase(getAllParticipantsByScenarioId.rejected, (state, { payload }) => {
          state.isParticipantSliceFetching = false;
          state.isParticipantSliceError = true;
          state.participantSliceErrorMessage = `Error: ${payload}`;
        })
  
        .addCase(getParticipantById.pending, (state) => {
          state.isParticipantSliceFetching = true;
        })
        .addCase(getParticipantById.fulfilled, (state, { payload }) => {
          state.isParticipantSliceFetching = false;
          state.isParticipantSliceSuccess = true;
          state.participantById[payload.id] = payload;
          state.participantSliceSuccessMessage = "Participant data fetched successfully.";
        })
        .addCase(getParticipantById.rejected, (state, { payload }) => {
          state.isParticipantSliceFetching = false;
          state.isParticipantSliceError = true;
          state.participantSliceErrorMessage = `Error: ${payload}`;
        })
    },
  });
  
  export const { clearParticipantState } = participantSlice.actions;
  
  export default participantSlice;