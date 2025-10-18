"use client";
import PassingFunctions from "./PassingFunction";
import ReduxExamples from "./ReduxExamples/page";
import store from "./store";
import { Provider } from "react-redux";

export default function Lab4() {
  return (
    <Provider store={store}>
      <div>
        <h2>Lab 4</h2>
        <ReduxExamples />
        ...
      </div>
    </Provider>
  );
}
