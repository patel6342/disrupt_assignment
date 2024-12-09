import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Define initial state
const initialState = {
  demands: [],
  isFetching: false,
  error: null,
};

// Define async thunks for API calls
export const addDemand = createAsyncThunk('demand/addDemand', async (demandData, thunkAPI) => {
  try {
    const response = await fetch(`${apiUrl}/demands`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(demandData),
    });
    const newDemand = await response.json();

    // Get the existing demands from localStorage
    const demands = JSON.parse(localStorage.getItem('demands')) || [];
    
    // Add the new demand to the array and save it back to localStorage
    demands.push(newDemand);
    localStorage.setItem('demands', JSON.stringify(demands));

    return newDemand;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const editDemand = createAsyncThunk('demand/editDemand', async (demandData, thunkAPI) => {
  try {
    const response = await fetch(`${apiUrl}/demands/${demandData.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(demandData),
    });
    const updatedDemand = await response.json();

    // Get the existing demands from localStorage
    const demands = JSON.parse(localStorage.getItem('demands')) || [];
    
    // Find the index of the demand to update
    const index = demands.findIndex(demand => demand.id === demandData.id);
    
    if (index >= 0) {
      // Update the demand in the array and save it back to localStorage
      demands[index] = updatedDemand;
      localStorage.setItem('demands', JSON.stringify(demands));
    }

    return updatedDemand;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});


// Create slice
const demandSlice = createSlice({
  name: 'demand',
  initialState,
  reducers: {},
 
    extraReducers: (builder) => {
      builder
        .addCase(addDemand.pending, (state) => {
          state.isFetching = true;
        })
        .addCase(addDemand.fulfilled, (state, { payload }) => {
          state.isFetching = false;
          state.demands.push(payload);
        })
        .addCase(addDemand.rejected, (state, { payload }) => {
          state.isFetching = false;
          state.error = payload;
        })
        .addCase(editDemand.pending, (state) => {
          state.isFetching = true;
        })
        .addCase(editDemand.fulfilled, (state, { payload }) => {
          state.isFetching = false;
          const index = state.demands.findIndex(demand => demand.id === payload.id);
          if (index >= 0) {
            state.demands[index] = payload;
          }
        })
        .addCase(editDemand.rejected, (state, { payload }) => {
          state.isFetching = false;
          state.error = payload;
        });
    },
  });
  


export default demandSlice;
