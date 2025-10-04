"use client";

import Link from "next/link";
import { Form } from "react-bootstrap";

export default function Profile() {
  return (
    <div id="wd-profile-screen" className="p-4" style={{ maxWidth: "500px" }}>
      <h3>Profile</h3>
      <Form.Control id="wd-username" value="alice" readOnly className="mb-2" />
      <Form.Control
        id="wd-password"
        value="123"
        type="password"
        readOnly
        className="mb-2"
      />
      <Form.Control id="wd-firstname" value="Alice" readOnly className="mb-2" />
      <Form.Control
        id="wd-lastname"
        value="Wonderland"
        readOnly
        className="mb-2"
      />
      <Form.Control
        id="wd-dob"
        type="date"
        value="2000-01-01"
        readOnly
        className="mb-2"
      />
      <Form.Control
        id="wd-email"
        type="email"
        value="alice@wonderland.com"
        readOnly
        className="mb-2"
      />
      <Form.Select id="wd-role" className="mb-3" disabled>
        <option value="USER">User</option>
        <option value="ADMIN">Admin</option>
        <option value="FACULTY">Faculty</option>
        <option value="STUDENT">Student</option>
      </Form.Select>

      <Link
        id="wd-signout-btn"
        href="/Account/Signin"
        className="btn btn-danger w-100 text-white text-decoration-none"
      >
        Signout
      </Link>
    </div>
  );
}
