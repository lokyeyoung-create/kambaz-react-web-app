"use client";

import Link from "next/link";
import { Form } from "react-bootstrap";

export default function Signup() {
  return (
    <div id="wd-signup-screen" className="p-4" style={{ maxWidth: "400px" }}>
      <h3>Signup</h3>
      <Form.Control 
        id="wd-username"
        placeholder="username"
        className="mb-2"
      />
      <Form.Control 
        id="wd-password"
        placeholder="password" 
        type="password"
        className="mb-2"
      />
      <Link 
        id="wd-signup-btn"
        href="/Account/Profile"
        className="btn btn-primary w-100 mb-2 text-white text-decoration-none"
      >
        Signup
      </Link>
      <Link id="wd-signin-link" href="/Account/Signin">Signin</Link>
    </div>
  );
}