"use client";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { FaUserCircle } from "react-icons/fa";

export default function PiazzaNavigation({ courseName, userName }: { courseName: string; userName: string }) {
  const { cid } = useParams();
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const isInstructor = currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";

  return (
    <nav className="navbar navbar-expand-lg bg-dark text-white px-3 py-2" style={{ position: "sticky", top: 0, zIndex: 100 }}>
      <span className="navbar-brand text-danger fw-bold me-4">pazza</span>
      <span className="text-white me-4">{courseName}</span>

      <ul className="navbar-nav me-auto">
        <li className="nav-item">
          <span className="nav-link text-white text-decoration-underline" style={{ cursor: "pointer" }} onClick={() => router.push(`/Courses/${cid}/Piazza`)}>
            Q & A
          </span>
        </li>
        {isInstructor && (
          <li className="nav-item">
            <span className="nav-link text-white" style={{ cursor: "pointer" }} onClick={() => router.push(`/Courses/${cid}/Piazza/ManageClass`)}>
              Manage Class
            </span>
          </li>
        )}
      </ul>

      <div className="d-flex align-items-center text-white">
        <FaUserCircle className="me-2 fs-5" />
        <span>{userName}</span>
      </div>
    </nav>
  );
}