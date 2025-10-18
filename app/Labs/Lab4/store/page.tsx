import { configureStore } from "@reduxjs/toolkit";
import helloReducer from "../ReduxExamples/HelloRedux/helloReducer";
import counterReducer from "../ReduxExamples/CounterRedux/counterReducer";
import addReducer from "../ReduxExamples/AddRedux/addReducer";

const store = configureStore({
  reducer: {
    helloReducer,
    counterReducer,
    addReducer,
  },
});
export default store;
