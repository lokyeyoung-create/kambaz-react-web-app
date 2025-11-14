"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../store";
import { setAssignments } from "../reducer";
import * as coursesClient from "../../../client";

export default function AssignmentEditor() {
  const { cid, aid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { assignments } = useSelector(
    (state: RootState) => state.assignmentsReducer
  );
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );

  // Check if user is faculty
  const isFaculty =
    currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";

  // Check if creating new or editing existing
  const isNewAssignment = aid === "new";
  const [assignment, setAssignment] = useState({
    _id: "",
    title: "New Assignment",
    course: cid as string,
    description: "",
    points: 100,
    dueDate: "",
    availableDate: "",
    availableUntil: "",
  });

  // Fetch assignment if editing
  useEffect(() => {
    const fetchAssignment = async () => {
      if (!isNewAssignment && aid) {
        const fetchedAssignment = await coursesClient.findAssignmentById(
          aid as string
        );
        setAssignment(fetchedAssignment);
      }
    };
    fetchAssignment();
  }, [aid, isNewAssignment]);

  const handleSave = async () => {
    if (isNewAssignment) {
      const newAssignment = await coursesClient.createAssignmentForCourse(
        cid as string,
        assignment
      );
      dispatch(setAssignments([...assignments, newAssignment]));
    } else {
      await coursesClient.updateAssignment(assignment);
      const updatedAssignments = assignments.map((a: any) =>
        a._id === assignment._id ? assignment : a
      );
      dispatch(setAssignments(updatedAssignments));
    }
    router.push(`/Courses/${cid}/Assignments`);
  };

  // Format datetime for input fields
  const formatDateTimeForInput = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  const handleCancel = () => {
    router.push(`/Courses/${cid}/Assignments`);
  };

  if (!isFaculty) {
    return null; // Will redirect in useEffect
  }

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
        value={assignment.title}
        onChange={(e) =>
          setAssignment({ ...assignment, title: e.target.value })
        }
      />

      <textarea
        id="wd-description"
        className="form-control mb-4"
        rows={10}
        value={assignment.description}
        onChange={(e) =>
          setAssignment({ ...assignment, description: e.target.value })
        }
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
            onChange={(e) =>
              setAssignment({
                ...assignment,
                points: parseInt(e.target.value) || 0,
              })
            }
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
                onChange={(e) =>
                  setAssignment({ ...assignment, dueDate: e.target.value })
                }
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
                  value={formatDateTimeForInput(assignment.availableDate)}
                  onChange={(e) =>
                    setAssignment({
                      ...assignment,
                      availableDate: e.target.value,
                    })
                  }
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
                  value={formatDateTimeForInput(assignment.availableUntil)}
                  onChange={(e) =>
                    setAssignment({
                      ...assignment,
                      availableUntil: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="my-4" />

      <div className="d-flex justify-content-end">
        <Button variant="secondary" className="me-2" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
}
