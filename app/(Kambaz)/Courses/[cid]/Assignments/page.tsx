"use client";

import { use } from "react";
import Link from "next/link";
import { Button, Form } from "react-bootstrap";
import { FaSearch, FaPlus, FaCheckCircle } from "react-icons/fa";
import { BsGripVertical } from "react-icons/bs";
import { IoEllipsisVertical } from "react-icons/io5";
import { FaFileLines } from "react-icons/fa6";

export default function Assignments({
  params,
}: {
  params: Promise<{ cid: string }>;
}) {
  const { cid } = use(params);

  return (
    <div id="wd-assignments" className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="input-group" style={{ width: "300px" }}>
          <span className="input-group-text bg-white">
            <FaSearch />
          </span>
          <input
            type="text"
            className="form-control border-start-0"
            placeholder="Search for Assignments"
            id="wd-search-assignment"
          />
        </div>

        <div>
          <Button
            variant="secondary"
            className="me-2"
            id="wd-add-assignment-group"
          >
            <FaPlus className="me-1" /> Group
          </Button>
          <Button variant="danger" id="wd-add-assignment">
            <FaPlus className="me-1" /> Assignment
          </Button>
        </div>
      </div>

      <div className="list-group rounded-0">
        <div className="list-group-item border-0 border-start border-success border-3">
          <div className="d-flex justify-content-between align-items-start">
            <div className="d-flex">
              <BsGripVertical className="me-2 fs-4 text-muted" />
              <FaFileLines className="me-3 fs-4 text-success" />
              <div>
                <Link
                  href={`/Courses/${cid}/Assignments/123`}
                  className="wd-assignment-link text-decoration-none fw-bold text-dark"
                >
                  A1
                </Link>
                <div className="small text-muted">
                  <span className="text-danger">Multiple Modules</span> |
                  <strong> Not available until</strong> May 6 at 12:00am |
                  <br />
                  <strong>Due</strong> May 13 at 11:59pm | 100 pts
                </div>
              </div>
            </div>
            <div>
              <FaCheckCircle className="text-success me-2" />
              <IoEllipsisVertical className="fs-4" />
            </div>
          </div>
        </div>

        <div className="list-group-item border-0 border-start border-success border-3">
          <div className="d-flex justify-content-between align-items-start">
            <div className="d-flex">
              <BsGripVertical className="me-2 fs-4 text-muted" />
              <FaFileLines className="me-3 fs-4 text-success" />
              <div>
                <Link
                  href={`/Courses/${cid}/Assignments/124`}
                  className="wd-assignment-link text-decoration-none fw-bold text-dark"
                >
                  A2
                </Link>
                <div className="small text-muted">
                  <span className="text-danger">Multiple Modules</span> |
                  <strong> Not available until</strong> May 13 at 12:00am |
                  <br />
                  <strong>Due</strong> May 20 at 11:59pm | 100 pts
                </div>
              </div>
            </div>
            <div>
              <FaCheckCircle className="text-success me-2" />
              <IoEllipsisVertical className="fs-4" />
            </div>
          </div>
        </div>

        <div className="list-group-item border-0 border-start border-success border-3">
          <div className="d-flex justify-content-between align-items-start">
            <div className="d-flex">
              <BsGripVertical className="me-2 fs-4 text-muted" />
              <FaFileLines className="me-3 fs-4 text-success" />
              <div>
                <Link
                  href={`/Courses/${cid}/Assignments/125`}
                  className="wd-assignment-link text-decoration-none fw-bold text-dark"
                >
                  A3
                </Link>
                <div className="small text-muted">
                  <span className="text-danger">Multiple Modules</span> |
                  <strong> Not available until</strong> May 20 at 12:00am |
                  <br />
                  <strong>Due</strong> May 27 at 11:59pm | 100 pts
                </div>
              </div>
            </div>
            <div>
              <FaCheckCircle className="text-success me-2" />
              <IoEllipsisVertical className="fs-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
