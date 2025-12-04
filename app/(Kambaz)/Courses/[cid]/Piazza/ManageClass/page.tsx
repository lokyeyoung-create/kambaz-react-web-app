"use client";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import PiazzaNavigation from "../Navigation";
import ManageFolders from "./ManagerFolders";

export default function ManageClassPage() {
  const { cid } = useParams();
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { courses } = useSelector((state: any) => state.coursesReducer);

  const isInstructor = currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const currentCourse = courses.find((c: any) => c._id === cid);

  useEffect(() => {
    if (!isInstructor) {
      router.push(`/Courses/${cid}/Piazza`);
    }
  }, [isInstructor, cid, router]);

  if (!isInstructor) return null;

  return (
    <div className="d-flex flex-column h-100">
      <PiazzaNavigation courseName={currentCourse?.name || cid} userName={`${currentUser?.firstName} ${currentUser?.lastName}`} />

      <div className="p-4">
        <h2>Manage Class</h2>
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <span className="nav-link active">Manage Folders</span>
          </li>
        </ul>

        <ManageFolders courseId={cid as string} />
      </div>
    </div>
  );
}