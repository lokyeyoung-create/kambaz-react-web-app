"use client";

import Link from "next/link";
import { Form } from "react-bootstrap";

export default function Signin() {
  return (
    <div id="wd-signin-screen" className="p-4" style={{ maxWidth: "400px" }}>
      <h3>Signin</h3>
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
        id="wd-signin-btn"
        href="/Account/Profile"
        className="btn btn-primary w-100 mb-2 text-white text-decoration-none"
      >
        Signin
      </Link>
      <Link id="wd-signup-link" href="/Account/Signup">Signup</Link>
    </div>
  );
}