"use client";

import { use } from "react";
import Link from "next/link";
import { Button } from "react-bootstrap";

export default function AssignmentEditor({
  params,
}: {
  params: Promise<{ cid: string; aid: string }>;
}) {
  const { cid, aid } = use(params);

  return (
    <div
      id="wd-assignments-editor"
      className="container-fluid"
      style={{ maxWidth: "800px" }}
    >
      <label htmlFor="wd-name" className="form-label">
        Assignment Name
      </label>
      <input
        id="wd-name"
        className="form-control mb-4"
        defaultValue="A1 - ENV + HTML"
      />

      <textarea
        id="wd-description"
        className="form-control mb-4"
        rows={10}
        defaultValue="The assignment is available online Submit a link to the landing page of your Web application running on Netlify. The landing page should include the following: Your full name and section Links to each of the lab assignments Link to the Kanbas application Links to all relevant source code repositories The Kanbas application should include a link to navigate back to the landing page."
      />

      <div className="row mb-3">
        <div className="col-3 text-end">
          <label htmlFor="wd-points" className="form-label">
            Points
          </label>
        </div>
        <div className="col-9">
          <input
            id="wd-points"
            type="number"
            className="form-control"
            defaultValue={100}
          />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-3 text-end">
          <label htmlFor="wd-group" className="form-label">
            Assignment Group
          </label>
        </div>
        <div className="col-9">
          <select id="wd-group" className="form-select">
            <option value="ASSIGNMENTS">ASSIGNMENTS</option>
            <option value="QUIZZES">QUIZZES</option>
            <option value="EXAMS">EXAMS</option>
            <option value="PROJECT">PROJECT</option>
          </select>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-3 text-end">
          <label htmlFor="wd-display-grade-as" className="form-label">
            Display Grade as
          </label>
        </div>
        <div className="col-9">
          <select id="wd-display-grade-as" className="form-select">
            <option value="PERCENTAGE">Percentage</option>
            <option value="POINTS">Points</option>
            <option value="LETTER">Letter Grade</option>
          </select>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-3 text-end">
          <label htmlFor="wd-submission-type" className="form-label">
            Submission Type
          </label>
        </div>
        <div className="col-9">
          <div className="border rounded p-3">
            <select id="wd-submission-type" className="form-select mb-3">
              <option value="ONLINE">Online</option>
              <option value="PAPER">On Paper</option>
            </select>

            <div>
              <div className="fw-bold mb-3">Online Entry Options</div>
              <div className="form-check mb-2">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="wd-text-entry"
                />
                <label htmlFor="wd-text-entry" className="form-check-label">
                  Text Entry
                </label>
              </div>
              <div className="form-check mb-2">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="wd-website-url"
                  defaultChecked
                />
                <label htmlFor="wd-website-url" className="form-check-label">
                  Website URL
                </label>
              </div>
              <div className="form-check mb-2">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="wd-media-recordings"
                />
                <label
                  htmlFor="wd-media-recordings"
                  className="form-check-label"
                >
                  Media Recordings
                </label>
              </div>
              <div className="form-check mb-2">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="wd-student-annotation"
                />
                <label
                  htmlFor="wd-student-annotation"
                  className="form-check-label"
                >
                  Student Annotation
                </label>
              </div>
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="wd-file-upload"
                />
                <label htmlFor="wd-file-upload" className="form-check-label">
                  File Uploads
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-3 text-end">
          <label className="form-label">Assign</label>
        </div>
        <div className="col-9">
          <div className="border rounded p-3">
            <div className="mb-3">
              <label htmlFor="wd-assign-to" className="form-label fw-bold">
                Assign to
              </label>
              <div className="input-group">
                <input
                  id="wd-assign-to"
                  className="form-control"
                  defaultValue="Everyone"
                />
                <button className="btn btn-outline-secondary" type="button">
                  ×
                </button>
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="wd-due-date" className="form-label fw-bold">
                Due
              </label>
              <input
                id="wd-due-date"
                type="datetime-local"
                className="form-control"
                defaultValue="2024-05-13T23:59"
              />
            </div>

            <div className="row">
              <div className="col-6">
                <label
                  htmlFor="wd-available-from"
                  className="form-label fw-bold"
                >
                  Available from
                </label>
                <input
                  id="wd-available-from"
                  type="datetime-local"
                  className="form-control"
                  defaultValue="2024-05-06T00:00"
                />
              </div>
              <div className="col-6">
                <label
                  htmlFor="wd-available-until"
                  className="form-label fw-bold"
                >
                  Until
                </label>
                <input
                  id="wd-available-until"
                  type="datetime-local"
                  className="form-control"
                  defaultValue="2024-05-20T23:59"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="my-4" />

      <div className="d-flex justify-content-end">
        <Link href={`/Courses/${cid}/Assignments`}>
          <Button variant="secondary" className="me-2">
            Cancel
          </Button>
        </Link>
        <Button variant="danger">Save</Button>
      </div>
    </div>
  );
}
