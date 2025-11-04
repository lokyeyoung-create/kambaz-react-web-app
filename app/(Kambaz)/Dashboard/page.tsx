"use client";
import { useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { addNewCourse, deleteCourse, updateCourse } from "../Courses/reducer";
import {
  enrollInCourse,
  unenrollFromCourse,
  toggleShowAllCourses,
} from "../Enrollment/reducer";
import { RootState } from "../store";
import {
  Row,
  Col,
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardText,
  Button,
  FormControl,
} from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";

export default function Dashboard() {
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const dispatch = useDispatch();
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );
  const { enrollments, showAllCourses } = useSelector(
    (state: RootState) => state.enrollmentsReducer
  );

  const [course, setCourse] = useState<any>({
    _id: "0",
    name: "New Course",
    number: "New Number",
    startDate: "2023-09-10",
    endDate: "2023-12-15",
    image: "/images/reactjs.jpg",
    description: "New Description",
  });

  // Check if user is faculty/admin (can create/edit courses)
  const isFaculty =
    currentUser?.role === "FACULTY" ||
    currentUser?.role === "ADMIN" ||
    currentUser?.role === "TA";

  // Check if user is enrolled in a specific course
  const isEnrolled = (courseId: string) => {
    return enrollments.some(
      (enrollment: any) =>
        enrollment.user === currentUser?._id && enrollment.course === courseId
    );
  };

  // Determine which courses to display based on enrollment status and showAllCourses flag
  const displayedCourses = !currentUser
    ? courses // Not logged in: show all courses
    : isFaculty
    ? courses // Faculty/Admin/TA: ALWAYS show all courses
    : showAllCourses
    ? courses // Students with "Enrollments" clicked: show all
    : courses.filter((course: any) => isEnrolled(course._id)); // Students default: only enrolled

  const handleEnroll = (courseId: string) => {
    if (currentUser) {
      dispatch(enrollInCourse({ userId: currentUser._id, courseId }));
    }
  };

  const handleUnenroll = (courseId: string) => {
    if (currentUser) {
      dispatch(unenrollFromCourse({ userId: currentUser._id, courseId }));
    }
  };

  const handleToggleEnrollments = () => {
    dispatch(toggleShowAllCourses());
  };

  return (
    <div className="p-4" id="wd-dashboard">
      <div className="d-flex justify-content-between align-items-center">
        <h1 id="wd-dashboard-title">Dashboard</h1>
        {/* Add Enrollments button for students only */}
        {currentUser && !isFaculty && (
          <Button
            variant="primary"
            onClick={handleToggleEnrollments}
            id="wd-enrollments-btn"
          >
            {showAllCourses ? "My Courses" : "Enrollments"}
          </Button>
        )}
      </div>
      <hr />

      {/* Only show course creation form for faculty/admin */}
      {isFaculty && (
        <>
          <h5>
            New Course
            <button
              className="btn btn-primary float-end"
              id="wd-add-new-course-click"
              onClick={() => {
                dispatch(addNewCourse(course));
                setCourse({
                  _id: "0",
                  name: "New Course",
                  number: "New Number",
                  startDate: "2023-09-10",
                  endDate: "2023-12-15",
                  image: "/images/reactjs.jpg",
                  description: "New Description",
                });
              }}
            >
              Add
            </button>
            <button
              className="btn btn-warning float-end me-2"
              onClick={() => dispatch(updateCourse(course))}
              id="wd-update-course-click"
            >
              Update
            </button>
          </h5>
          <br />
          <FormControl
            value={course.name}
            className="mb-2"
            onChange={(e) => setCourse({ ...course, name: e.target.value })}
          />
          <FormControl
            as="textarea"
            value={course.description}
            rows={3}
            onChange={(e) =>
              setCourse({ ...course, description: e.target.value })
            }
          />
          <hr />
        </>
      )}

      <h2 id="wd-dashboard-published">
        {showAllCourses ? "All Courses" : "Published Courses"} (
        {displayedCourses.length})
      </h2>
      <hr />
      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {displayedCourses.map((course: any) => {
            const enrolled = isEnrolled(course._id);
            // Only allow navigation to course if enrolled or if faculty
            const canNavigate = enrolled || isFaculty;

            return (
              <Col
                key={course._id}
                className="wd-dashboard-course"
                style={{ width: "300px" }}
              >
                <Card>
                  <Link
                    href={canNavigate ? `/Courses/${course._id}/Home` : "#"}
                    className="wd-dashboard-course-link text-decoration-none text-dark"
                    onClick={(e) => {
                      if (!canNavigate) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <CardImg
                      src="/images/Green.jpg"
                      variant="top"
                      width="100%"
                      height={160}
                    />
                    <CardBody className="card-body">
                      <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                        {course.name}
                      </CardTitle>
                      <CardText
                        className="wd-dashboard-course-description overflow-hidden"
                        style={{ height: "100px" }}
                      >
                        {course.description}
                      </CardText>

                      {/* Different buttons based on user role */}
                      {isFaculty ? (
                        // Faculty/Admin see original buttons
                        <>
                          <Button variant="primary">Go</Button>
                          <button
                            onClick={(event) => {
                              event.preventDefault();
                              dispatch(deleteCourse(course._id));
                            }}
                            className="btn btn-danger float-end"
                            id="wd-delete-course-click"
                          >
                            Delete
                          </button>
                          <button
                            id="wd-edit-course-click"
                            onClick={(event) => {
                              event.preventDefault();
                              setCourse(course);
                            }}
                            className="btn btn-warning me-2 float-end"
                          >
                            Edit
                          </button>
                        </>
                      ) : currentUser ? (
                        // Students see enrollment buttons
                        <>
                          {enrolled ? (
                            <>
                              <Button variant="primary">Go</Button>
                              {showAllCourses && (
                                <Button
                                  variant="danger"
                                  className="float-end"
                                  onClick={(event) => {
                                    event.preventDefault();
                                    handleUnenroll(course._id);
                                  }}
                                  id="wd-unenroll-btn"
                                >
                                  Unenroll
                                </Button>
                              )}
                            </>
                          ) : (
                            <Button
                              variant="success"
                              className="w-100"
                              onClick={(event) => {
                                event.preventDefault();
                                handleEnroll(course._id);
                              }}
                              id="wd-enroll-btn"
                            >
                              Enroll
                            </Button>
                          )}
                        </>
                      ) : (
                        // Not logged in users just see Go button
                        <Button variant="primary">Go</Button>
                      )}
                    </CardBody>
                  </Link>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
}
