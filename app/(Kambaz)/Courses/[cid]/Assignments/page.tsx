"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "react-bootstrap";
import { FaSearch, FaPlus, FaCheckCircle } from "react-icons/fa";
import { BsGripVertical } from "react-icons/bs";
import { IoEllipsisVertical } from "react-icons/io5";
import { FaFileLines } from "react-icons/fa6";
import { assignments } from "@/app/(Kambaz)/Database";

export default function Assignments() {
  const { cid } = useParams();
  
  // Filter assignments for the current course
  const courseAssignments = assignments.filter(
    (assignment: any) => assignment.course === cid
  );

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
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

        <div>
          <Button variant="secondary" className="me-2" id="wd-add-assignment-group">
            <FaPlus className="me-1" /> Group
          </Button>
          <Button variant="danger" id="wd-add-assignment">
            <FaPlus className="me-1" /> Assignment
          </Button>
        </div>
      </div>

      <div className="list-group rounded-0">
        {courseAssignments.map((assignment: any) => (
          <div 
            key={assignment._id} 
            className="list-group-item border-0 border-start border-success border-3"
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
                    <strong> Not available until</strong> {formatDate(assignment.availableDate)} |
                    <br />
                    <strong>Due</strong> {formatDate(assignment.dueDate)} | {assignment.points} pts
                  </div>
                </div>
              </div>
              <div>
                <FaCheckCircle className="text-success me-2" />
                <IoEllipsisVertical className="fs-4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}