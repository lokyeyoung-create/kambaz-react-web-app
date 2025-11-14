"use client";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { setCurrentUser } from "../reducer";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import * as db from "../../Database";
import { FormControl, Button } from "react-bootstrap";
import * as client from "../client";

type UserRole = "STUDENT" | "FACULTY" | "ADMIN" | "USER" | "TA";

interface User {
  _id: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  dob?: string;
  role: UserRole;
  loginId?: string;
  section?: string;
  lastActivity?: string;
  totalActivity?: string;
}

export default function Signin() {
  useEffect(() => {
    console.log("=== CLIENT DEBUG ===");
    console.log("HTTP_SERVER:", process.env.NEXT_PUBLIC_HTTP_SERVER);
    console.log(
      "Full signin URL:",
      `${process.env.NEXT_PUBLIC_HTTP_SERVER}/api/users/signin`
    );
  }, []);
  const [credentials, setCredentials] = useState<any>({
    username: "",
    password: "",
  });
  const dispatch = useDispatch();
  const router = useRouter();

  const signin = async () => {
    const user = await client.signin(credentials);
    if (!user) return;
    dispatch(setCurrentUser(user));
    redirect("/Dashboard");
  };

  return (
    <div id="wd-signin-screen">
      <h1>Sign in</h1>
      <FormControl
        value={credentials.username}
        onChange={(e) =>
          setCredentials({ ...credentials, username: e.target.value })
        }
        className="mb-2"
        placeholder="username"
        id="wd-username"
      />
      <FormControl
        value={credentials.password}
        onChange={(e) =>
          setCredentials({ ...credentials, password: e.target.value })
        }
        className="mb-2"
        placeholder="password"
        type="password"
        id="wd-password"
      />
      <Button onClick={signin} id="wd-signin-btn" className="w-100">
        Sign in
      </Button>
      <Link id="wd-signup-link" href="/Account/Signup">
        Sign up
      </Link>
    </div>
  );
}
