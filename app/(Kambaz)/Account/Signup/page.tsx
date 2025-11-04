"use client";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FormControl, Button } from "react-bootstrap";
import { useState } from "react";

export default function Signup() {
  const [user, setUser] = useState<any>({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
  });

  const signup = () => {
    redirect("/Account/Signin");
  };

  return (
    <div id="wd-signup-screen">
      <h1>Sign up</h1>
      <FormControl
        value={user.username}
        onChange={(e) => setUser({ ...user, username: e.target.value })}
        className="mb-2"
        placeholder="username"
        id="wd-username"
      />
      <FormControl
        value={user.password}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
        className="mb-2"
        placeholder="password"
        type="password"
        id="wd-password"
      />
      <FormControl
        value={user.firstName}
        onChange={(e) => setUser({ ...user, firstName: e.target.value })}
        className="mb-2"
        placeholder="first name"
        id="wd-firstname"
      />
      <FormControl
        value={user.lastName}
        onChange={(e) => setUser({ ...user, lastName: e.target.value })}
        className="mb-2"
        placeholder="last name"
        id="wd-lastname"
      />
      <FormControl
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        className="mb-2"
        placeholder="email"
        type="email"
        id="wd-email"
      />
      <Button onClick={signup} id="wd-signup-btn" className="w-100">
        Sign up
      </Button>
      <Link id="wd-signin-link" href="/Account/Signin">
        Sign in
      </Link>
    </div>
  );
}
