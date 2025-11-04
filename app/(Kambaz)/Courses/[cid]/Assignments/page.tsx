"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { FaSearch, FaPlus, FaCheckCircle, FaTrash } from "react-icons/fa";
import { BsGripVertical } from "react-icons/bs";
import { IoEllipsisVertical } from "react-icons/io5";
import { FaFileLines } from "react-icons/fa6";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";
import { deleteAssignment } from "./reducer";

export default function Assignments() {
  const { cid } = useParams();
  const dispatch = useDispatch();
  const { assignments } = useSelector(
    (state: RootState) => state.assignmentsReducer
  );
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );

  // State for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<any>(null);

  // Filter assignments for the current course
  const courseAssignments = assignments.filter(
    (assignment: any) => assignment.course === cid
  );

  // Check if user is faculty/TA (can edit) or student (view only)
  const isFaculty =
    currentUser?.role === "FACULTY" ||
    currentUser?.role === "ADMIN" ||
    currentUser?.role === "TA";

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleDeleteClick = (assignment: any) => {
    setAssignmentToDelete(assignment);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (assignmentToDelete) {
      dispatch(deleteAssignment(assignmentToDelete._id));
    }
    setShowDeleteModal(false);
    setAssignmentToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setAssignmentToDelete(null);
  };

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

        {isFaculty && (
          <div>
            <Button
              variant="secondary"
              className="me-2"
              id="wd-add-assignment-group"
            >
              <FaPlus className="me-1" /> Group
            </Button>
            <Link href={`/Courses/${cid}/Assignments/new`}>
              <Button variant="danger" id="wd-add-assignment">
                <FaPlus className="me-1" /> Assignment
              </Button>
            </Link>
          </div>
        )}
      </div>

      <div className="list-group rounded-0">
        {courseAssignments.map((assignment: any) => (
          <div
            key={assignment._id}
            className="list-group-item border-start border-success border-3"
          >
            <div className="d-flex justify-content-between align-items-start">
              <div className="d-flex">
                <BsGripVertical className="me-2 fs-4 text-muted" />
                <FaFileLines className="me-3 fs-4 text-success" />
                <div>
                  <Link
                    href={`/Courses/${cid}/Assignments/${assignment._id}`}
                    className="wd-assignment-link text-decoration-none fw-bold text-dark"
                  >
                    {assignment.title}
                  </Link>
                  <div className="small text-muted">
                    <span className="text-danger">Multiple Modules</span> |
                    <strong> Not available until</strong>{" "}
                    {formatDate(assignment.availableDate)} |
                    <br />
                    <strong>Due</strong> {formatDate(assignment.dueDate)} |{" "}
                    {assignment.points || 0} pts
                  </div>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <FaCheckCircle className="text-success me-2" />
                {isFaculty && (
                  <FaTrash
                    className="text-danger me-2"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDeleteClick(assignment)}
                  />
                )}
                <IoEllipsisVertical className="fs-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={cancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to remove the assignment &quot;
          {assignmentToDelete?.title}&quot;?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
