"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../store";
import { addAssignment, updateAssignment } from "../reducer";

export default function AssignmentEditor() {
  const { cid, aid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { assignments } = useSelector((state: RootState) => state.assignmentsReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  
  // Check if user is faculty
  const isFaculty = currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";
  
  // Redirect students who try to access editor
  useEffect(() => {
    if (!isFaculty) {
      router.push(`/Courses/${cid}/Assignments`);
    }
  }, [isFaculty, cid, router]);
  
  // Check if creating new or editing existing
  const isNewAssignment = aid === "new";
  const existingAssignment = assignments.find((a: any) => a._id === aid);
  
  // Initialize form state
  const [assignment, setAssignment] = useState({
    _id: isNewAssignment ? "" : existingAssignment?._id || "",
    title: isNewAssignment ? "New Assignment" : existingAssignment?.title || "",
    course: cid as string,
    description: isNewAssignment ? "" : existingAssignment?.description || "",
    points: isNewAssignment ? 100 : existingAssignment?.points || 100,
    dueDate: isNewAssignment ? "" : existingAssignment?.dueDate || "",
    availableDate: isNewAssignment ? "" : existingAssignment?.availableDate || "",
    availableUntil: isNewAssignment ? "" : existingAssignment?.availableUntil || "",
  });

  // Format datetime for input fields
  const formatDateTimeForInput = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  const handleSave = () => {
    if (isNewAssignment) {
      dispatch(addAssignment(assignment));
    } else {
      dispatch(updateAssignment(assignment));
    }
    router.push(`/Courses/${cid}/Assignments`);
  };

  const handleCancel = () => {
    router.push(`/Courses/${cid}/Assignments`);
  };

  if (!isFaculty) {
    return null; // Will redirect in useEffect
  }

  return (
    <div id="wd-assignments-editor" className="container-fluid" style={{ maxWidth: "800px" }}>
      <label htmlFor="wd-name" className="form-label">
        Assignment Name
      </label>
      <input
        id="wd-name"
        className="form-control mb-4"
        value={assignment.title}
        onChange={(e) => setAssignment({ ...assignment, title: e.target.value })}
      />

      <textarea
        id="wd-description"
        className="form-control mb-4"
        rows={10}
        value={assignment.description}
        onChange={(e) => setAssignment({ ...assignment, description: e.target.value })}
        placeholder="Enter assignment description..."
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
            value={assignment.points}
            onChange={(e) => setAssignment({ ...assignment, points: parseInt(e.target.value) || 0 })}
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
                value="Everyone"
                disabled
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
                value={formatDateTimeForInput(assignment.dueDate)}
                onChange={(e) => setAssignment({ ...assignment, dueDate: e.target.value })}
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
                  value={formatDateTimeForInput(assignment.availableDate)}
                  onChange={(e) => setAssignment({ ...assignment, availableDate: e.target.value })}
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
                  value={formatDateTimeForInput(assignment.availableUntil)}
                  onChange={(e) => setAssignment({ ...assignment, availableUntil: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="my-4" />

      <div className="d-flex justify-content-end">
        <Button 
          variant="secondary" 
          className="me-2"
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button 
          variant="danger"
          onClick={handleSave}
        >
          Save
        </Button>
      </div>
    </div>
  );
}