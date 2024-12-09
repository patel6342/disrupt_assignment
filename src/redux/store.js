import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth";
import challengeSlice from "./challenge";
import scenarioSlice from "./scenario";
import demandSlice from "./demand";
import responseSlice from "./response";
import errorSlice from "./errorSlice";
import participantSlice from "./participant";
import judgeSlice from "./judge";
export const store = configureStore({
  reducer: {
    authentication:authSlice.reducer,
    challengeSlice:challengeSlice.reducer,
    scenarioSlice:scenarioSlice.reducer,
    demandSlice:demandSlice.reducer,
    responseSlice:responseSlice.reducer,
    errorSlice:errorSlice.reducer,
    participantSlice:participantSlice.reducer,
    judgeSlice:judgeSlice.reducer,
  },
});

