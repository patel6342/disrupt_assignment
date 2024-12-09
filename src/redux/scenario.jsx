import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setError } from "./errorSlice";
// Define initial state
let headers
headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  'Access-Control-Allow-Credentials':true,
  'Access-Control-Allow-Origin':true
  // Authorization: `Bearer ${token}`,
};
const initialState = {
  scenarios:[],
  isScenarioSliceFetching: false,
  isScenarioSliceListFetching:false,
  isScenarioSliceListSuccess:false,
  isScenarioSliceSuccess: false,
  isScenarioSliceError: false,
  scenarioSliceErrorMessage: "",
  scenarioSliceSuccessMessage: "",
  isScenarioSliceErrorMessage:'',
  isScenarioSliceSuccessMessage:'',
  isScenarioSliceByIdSuccess:false,
  isScenarioSlicebyIdFetching:false,
  isScenarioSliceByIdFetching:false,
  scenarioById:[],
  challengeName:''
};

// Async thunk to get all scenarios from local storage
export const getAllScenario = createAsyncThunk(
  'scenario/getAllScenario',
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


export const getScenarioById = createAsyncThunk(
  'scenario/getScenarioById',
  async (scenarioId, thunkAPI) => {
    try {
        const scenario_id=scenarioId
        const response = await fetch(`/api/scenarios/${scenario_id}`,{
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

// Async thunk to add a new scenario
export const addScenario = createAsyncThunk(
  'scenario/addScenario',
  async (scenarioData, thunkAPI) => {
    try {
      const response = await fetch('/api/create_scenario', {
        method: 'POST',
        headers,
        body: JSON.stringify(scenarioData),
      });
      let data = await response.json();
        if (response.status === 200) {
         
          return {  id:data.scenario_id, name: scenarioData.name };
          // return data;
        } else {
          return thunkAPI.rejectWithValue(data);
    
        }
    
    } catch (error) {
      
      return thunkAPI.rejectWithValue(error.message);
   
    }
  }
);

// Async thunk to edit an existing scenario
export const editScenario = createAsyncThunk(
  'scenario/editScenario',
  async (obj, thunkAPI) => {
    const {
      autoSave,...payload
    } = obj;
    console.log(obj.id,"edit obj",payload.id);
         
      try {
        const response = await fetch(`/api/update_scenario/${payload.id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(payload),
        });

        console.log("my response"+response);

        let data = await response.json();
          if (response.status === 200) {
            return { ...data, id: obj.id, autoSave };
            // return data;
          }  else {
              return thunkAPI.rejectWithValue(data);
            }
          } catch (e) {
            return thunkAPI.rejectWithValue(e.response?.data || 'Something went wrong');
          }
        });

// Async thunk to delete a scenario
export const deleteScenario = createAsyncThunk(
  'scenario/deleteScenario',
  async (scenarioId, thunkAPI) => {
    try {
      const ids=[scenarioId]
     
      const response = await fetch('/api/delete_scenarios',{
        method: 'DELETE',
        headers,
        body:JSON.stringify(ids)
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

export const changeScenarioStatus = createAsyncThunk(
  'scenario/changeScenarioStatus',
  async ({ id, status }, thunkAPI) => {
    try {
      // Optionally, you can make a PUT request to a backend server here
      // const response = await fetch(`${apiUrl}/challenges/${id}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status }),
      // });
      // if (!response.ok) {
      //   throw new Error('Failed to update challenge status');
      // }
    console.log("sttaus",status)
      // Update local storage
      const storedScenario = JSON.parse(localStorage.getItem('scenarios')) || [];
      const updatedScenario = storedScenario.map(scenario =>
        scenario.id === id ? { ...scenario, status } : scenario
      );

    
      // Update local storage with the new challenge list
      localStorage.setItem('scenarios', JSON.stringify(updatedScenario));

      // Return the updated id and status for the fulfilled case
      return { id, status }; 
    } catch (error) {
      thunkAPI.dispatch(setError({
        statusCode: 500,
        message: error.message,
    }));
      return thunkAPI.rejectWithValue(error.message);
     }
  }
);

export const editMoreInfoScenario = createAsyncThunk(
  'scenario/editMoreInfoScenario',
  async (obj, thunkAPI) => {
    try {
      console.log("is", obj);
      const scenarios = JSON.parse(localStorage.getItem('scenarios')) || [];
      const index = scenarios.findIndex(scenario => scenario.id === obj.id);

      if (index >= 0) {
        const updatedScenario = {
          ...scenarios[index],
        };
     console.log("up",updatedScenario)
        scenarios[index] = updatedScenario;
        localStorage.setItem('scenarios', JSON.stringify(scenarios));

        return updatedScenario;
      } else {
        throw new Error('Scenario not found');
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
// Create slice
const scenarioSlice = createSlice({
  name: 'scenario',
  initialState,
  reducers: {
    clearScenarioState:(state)=>{
state.isScenarioSliceError=false,
state.isScenarioSliceFetching=false,
state.isScenarioSliceSuccess=false,
state.isScenarioSliceErrorMessage='',
state.isScenarioSliceListSuccess=false,
state.isScenarioSliceListFetching=false,
state.isScenarioSliceSuccessMessage='',
state.isScenarioSliceByIdFetching=false
    },
    clearScenarioListData:(state)=>{
      state.scenarios=[],
      state.challengeName=''
    },
    clearScenarioById:(state)=>{
      state.scenarioById=[]
    }
  }, 
  extraReducers: (builder) => {
    builder
      .addCase(getAllScenario.pending, (state) => {
        state.isScenarioSliceListFetching = true;
      })
      .addCase(getAllScenario.fulfilled, (state, { payload }) => {
        state.isScenarioSliceListFetching = false;
        state.isScenarioSliceListSuccess = true;
        state.scenarios = payload.scenarios;
        state.challengeName=payload.challenge_name
     })
      .addCase(getAllScenario.rejected, (state, { payload }) => {
        state.isScenarioSliceListFetching = false;
        state.isScenarioSliceError = true;
        state.scenarioSliceErrorMessage = `Error: ${payload}`;
      })
      .addCase(addScenario.pending, (state) => {
        state.isScenarioSliceFetching = true;
      })
      .addCase(addScenario.fulfilled, (state, { payload }) => {
        state.isScenarioSliceFetching = false;
        state.isScenarioSliceSuccess = true;
        state.scenarioSliceSuccessMessage=payload?.message || 'Scenario Created Successfully!'
        state.scenarios.push(payload);
      })
      .addCase(addScenario.rejected, (state, { payload }) => {
        state.isScenarioSliceFetching = false;
        state.isScenarioSliceError = true;
        state.scenarioSliceErrorMessage = payload || 'Something went Wrong!';
      })
     
    
      .addCase(editScenario.pending, (state) => {
        state.isScenarioSliceFetching = true;
      })
      .addCase(editScenario.fulfilled, (state, { payload }) => {
        state.isScenarioSliceFetching = false;
        state.isScenarioSliceSuccess = true;
        if(!payload.autoSave){
          state.scenarioSliceSuccessMessage=payload?.message || 'Scenario Updated Successfully !'
        }else
        state.scenarioSliceSuccessMessage=null
        // Check if payload has the necessary data directly
        state.scenarios = state.scenarios.map((scenario) =>
          scenario.id === payload.id ? payload : scenario
        );
      })
      .addCase(editScenario.rejected, (state, { payload }) => {
        state.isScenarioSliceFetching = false;
        state.isScenarioSliceError = true;
        state.scenarioSliceErrorMessage = payload?.detail || 'Something went wrong';
      })

      .addCase(editMoreInfoScenario.rejected, (state, { payload }) => {
        state.isScenarioSliceFetching = false;
        state.isScenarioSliceError = true;
        state.scenarioSliceErrorMessage = payload || 'Something went wrong';
      })
      .addCase(editMoreInfoScenario.pending, (state) => {
        state.isScenarioSliceFetching = true;
      })
      .addCase(editMoreInfoScenario.fulfilled, (state, { payload }) => {
        state.isScenarioSliceFetching = false;
        state.isScenarioSliceSuccess = true;
    
        const index = state.scenarios.findIndex(scenario => scenario.id === payload.id);
        console.log("edited",payload)
        
        if (index >= 0) {
         
          state.scenarios[index] = { 
            ...state.scenarios[index], 
          
          };
        }
      })
      
    
    
      .addCase(deleteScenario.pending, (state) => {
        state.isScenarioSliceFetching = true;
      })
      .addCase(deleteScenario.fulfilled, (state, { payload }) => {
        state.isScenarioSliceFetching = false;
        state.isScenarioSliceSuccess = true;
        state.scenarioSliceSuccessMessage=payload?.message || 'Scenario Deleted Successfully!'
        
        state.scenarios = state.scenarios.filter(scenario => !payload.includes(Number(scenario.id)));
        
      })
      .addCase(deleteScenario.rejected, (state, { payload }) => {
        state.isScenarioSliceFetching = false;
        state.isScenarioSliceError = true;
        state.scenarioSliceErrorMessage = payload || 'Something Went Wrong !';
      })
      .addCase(changeScenarioStatus.pending, (state) => {
        state.isScenarioSliceFetching = true;
      })
      .addCase(changeScenarioStatus.fulfilled, (state, { payload }) => {
        state.isScenarioSliceFetching = false;
        state.isScenarioSliceSuccess = true;
        state.isScenarioSliceSuccessMessage=payload?.message || "Status Changed Successfully!"
        state.scenarios = state.scenarios.map(scenario =>
          scenario.id === payload.id ? { ...scenario, status: payload.status } : scenario
        );
     })
      .addCase(changeScenarioStatus.rejected, (state, { payload }) => {
        state.isScenarioSliceFetching = false;
        state.isScenarioSliceError = true;
        state.scenarioSliceErrorMessage = payload || 'Something Went Wrong !';
    
      })
      .addCase(getScenarioById.pending, (state) => {
        state.isScenarioSliceByIdFetching = true;
      })
      .addCase(getScenarioById.fulfilled, (state, { payload }) => {
        state.isScenarioSliceByIdFetching = false;
        state.isScenarioSliceByIdSuccess = true;
        state.scenarioById = payload;
     })
      .addCase(getScenarioById.rejected, (state, { payload }) => {
        state.isScenarioSliceByIdFetching = false;
        state.isScenarioSliceError = true;
      
        state.scenarioSliceErrorMessage = payload || 'Something Went Wrong !';
    
      });
  },
});

export const {clearScenarioById,clearScenarioListData,clearScenarioState}=scenarioSlice.actions;
export default scenarioSlice;
