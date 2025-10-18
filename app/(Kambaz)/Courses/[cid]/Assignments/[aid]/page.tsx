"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "react-bootstrap";
import { assignments } from "@/app/(Kambaz)/Database";

export default function AssignmentEditor() {
  const { cid, aid } = useParams();
  
  // Find the specific assignment using the aid parameter
  const assignment = assignments.find((a) => a._id === aid);
  
  if (!assignment) {
    return (
      <div className="container-fluid">
        <h3>Assignment not found</h3>
        <Link href={`/Courses/${cid}/Assignments`}>
          <Button variant="secondary">Back to Assignments</Button>
        </Link>
      </div>
    );
  }

  // Format datetime for input fields
  const formatDateTimeForInput = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  return (
    <div id="wd-assignments-editor" className="container-fluid" style={{ maxWidth: "800px" }}>
      <label htmlFor="wd-name" className="form-label">
        Assignment Name
      </label>
      <input
        id="wd-name"
        className="form-control mb-4"
        defaultValue={assignment.title}
      />

      <textarea
        id="wd-description"
        className="form-control mb-4"
        rows={10}
        defaultValue={assignment.description}
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
            defaultValue={assignment.points}
          />
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
              <input 
                id="wd-assign-to" 
                className="form-control" 
                defaultValue="Everyone" 
              />
            </div>

            <div className="mb-3">
              <label htmlFor="wd-due-date" className="form-label fw-bold">
                Due
              </label>
              <input
                id="wd-due-date"
                type="datetime-local"
                className="form-control"
                defaultValue={formatDateTimeForInput(assignment.dueDate)}
              />
            </div>

            <div className="row">
              <div className="col-6">
                <label htmlFor="wd-available-from" className="form-label fw-bold">
                  Available from
                </label>
                <input
                  id="wd-available-from"
                  type="datetime-local"
                  className="form-control"
                  defaultValue={formatDateTimeForInput(assignment.availableDate)}
                />
              </div>
              <div className="col-6">
                <label htmlFor="wd-available-until" className="form-label fw-bold">
                  Until
                </label>
                <input
                  id="wd-available-until"
                  type="datetime-local"
                  className="form-control"
                  defaultValue={formatDateTimeForInput(assignment.availableUntil)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="my-4" />

      <div className="d-flex justify-content-end">
        <Link href={`/Courses/${cid}/Assignments`}>
          <Button variant="secondary" className="me-2">Cancel</Button>
        </Link>
        <Link href={`/Courses/${cid}/Assignments`}>
          <Button variant="danger">Save</Button>
        </Link>
      </div>
    </div>
  );
}