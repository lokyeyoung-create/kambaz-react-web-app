"use client";
import { ReactNode } from "react";
import AccountNavigation from "./Navigation";

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <div id="wd-account-screen">
      <div className="d-flex">
        <div className="d-none d-md-block">
          <AccountNavigation />
        </div>
        <div className="flex-fill p-3">{children}</div>
      </div>
    </div>
  );
}
