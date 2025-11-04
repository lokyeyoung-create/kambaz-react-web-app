"use client";
import { ReactNode } from "react";
import KambazNavigation from "./Navigation";
import "./styles.css";
import store from "./store";
import { Provider } from "react-redux";

export default function KambazLayout({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <div className="d-flex" id="wd-kambaz">
        <KambazNavigation />
        <div className="flex-fill" style={{ marginLeft: "120px" }}>
          {children}
        </div>
      </div>
    </Provider>
  );
}
