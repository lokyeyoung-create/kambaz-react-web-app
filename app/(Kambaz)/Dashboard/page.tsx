"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import * as client from "../Courses/client";

import {
  addNewCourse,
  deleteCourse,
  updateCourse,
  setCourses,
} from "../Courses/reducer";
import {
  enrollInCourse,
  unenrollFromCourse,
  toggleShowAllCourses,
  setEnrollments,
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

export default function Dashboard() {
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );
  const { enrollments, showAllCourses } = useSelector(
    (state: RootState) => state.enrollmentsReducer
  );
  const dispatch = useDispatch();

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

  // Check if user is a student
  const isStudent = currentUser?.role === "STUDENT";

  // Filter courses based on enrollment status
  const getDisplayedCourses = () => {
    if (isFaculty) {
      // Faculty see all courses
      return courses;
    }

    if (isStudent) {
      if (showAllCourses) {
        // Show all available courses
        return courses;
      } else {
        // Show only enrolled courses
        return courses.filter((course: any) =>
          enrollments.some(
            (enrollment: any) =>
              enrollment.user === currentUser._id &&
              enrollment.course === course._id
          )
        );
      }
    }

    return courses;
  };

  // Check if student is enrolled in a specific course
  const isEnrolled = (courseId: string) => {
    return enrollments.some(
      (enrollment: any) =>
        enrollment.user === currentUser?._id && enrollment.course === courseId
    );
  };

  // Handle enrollment - NOW WITH API CALL
  const handleEnroll = async (courseId: string) => {
    if (currentUser) {
      try {
        // First update the backend
        await client.enrollIntoCourse(currentUser._id, courseId);
        // Then update Redux state
        dispatch(enrollInCourse({ userId: currentUser._id, courseId }));
      } catch (error) {
        console.error("Error enrolling in course:", error);
        alert("Failed to enroll in course. Please try again.");
      }
    }
  };

  // Handle unenrollment - NOW WITH API CALL
  const handleUnenroll = async (courseId: string) => {
    if (currentUser) {
      try {
        console.log("Attempting to unenroll:", {
          userId: currentUser._id,
          courseId: courseId,
          url: `${process.env.NEXT_PUBLIC_REMOTE_SERVER}/api/enrollments/${currentUser._id}/${courseId}`,
        });

        // First update the backend
        await client.unenrollFromCourse(currentUser._id, courseId);

        // Then update Redux state
        dispatch(unenrollFromCourse({ userId: currentUser._id, courseId }));

        console.log("Successfully unenrolled");
      } catch (error: any) {
        console.error("Error unenrolling from course:", error);
        console.error("Error details:", error.response?.data || error.message);
        alert(
          `Failed to unenroll from course: ${
            error.response?.data?.message || error.message
          }`
        );
      }
    }
  };

  const onAddNewCourse = async () => {
    const newCourse = await client.createCourse(course);
    dispatch(setCourses([...courses, newCourse]));
  };

  const fetchCourses = async () => {
    try {
      console.log("Fetching courses...");
      const fetchedCourses = await client.fetchAllCourses();
      console.log("Fetched courses from server:", fetchedCourses);
      dispatch(setCourses(fetchedCourses));
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  // ADD THIS: Fetch enrollments from backend
  const fetchEnrollments = async () => {
    if (currentUser) {
      try {
        console.log(
          "Dashboard: Fetching enrollments for user:",
          currentUser._id
        );
        const userEnrollments = await client.findEnrollmentsForUser(
          currentUser._id
        );
        console.log("Dashboard: Received enrollments:", userEnrollments);

        // Only dispatch if we got valid data
        if (userEnrollments && Array.isArray(userEnrollments)) {
          dispatch(setEnrollments(userEnrollments));
        } else {
          console.log("No enrollments found or invalid data");
          dispatch(setEnrollments([]));
        }
      } catch (error) {
        console.error("Dashboard: Error fetching enrollments:", error);
        // Set empty enrollments on error
        dispatch(setEnrollments([]));
      }
    }
  };

  const onDeleteCourse = async (courseId: string) => {
    const status = await client.deleteCourse(courseId);
    dispatch(setCourses(courses.filter((course) => course._id !== courseId)));
  };

  const onUpdateCourse = async () => {
    await client.updateCourse(course);
    dispatch(
      setCourses(
        courses.map((c) => {
          if (c._id === course._id) {
            return course;
          } else {
            return c;
          }
        })
      )
    );
  };

  useEffect(() => {
    console.log("Dashboard useEffect triggered, currentUser:", currentUser);
    if (currentUser) {
      fetchCourses();
      fetchEnrollments(); // NOW ACTUALLY FETCHING ENROLLMENTS
    }
  }, [currentUser]);

  const displayedCourses = getDisplayedCourses();

  return (
    <div className="p-4" id="wd-dashboard">
      <div className="d-flex justify-content-between align-items-center">
        <h1 id="wd-dashboard-title">Dashboard</h1>
      </div>
      <hr />

      {/* Only show course creation form for faculty/admin */}
      {isFaculty && (
        <>
          <h5>
            New Course
            <button
              onClick={onAddNewCourse}
              className="btn btn-primary float-end"
              id="wd-add-new-course-click"
            >
              Add
            </button>
            <button
              onClick={onUpdateCourse}
              className="btn btn-secondary float-end me-2"
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

      {/* Enrollment toggle for students */}
      {isStudent && (
        <div className="mb-3">
          <Button
            variant={showAllCourses ? "secondary" : "primary"}
            onClick={() => dispatch(toggleShowAllCourses())}
            className="mb-3"
          >
            {showAllCourses ? "My Courses" : "Show All Courses"}
          </Button>
        </div>
      )}

      <h2 id="wd-dashboard-published">
        {isStudent && !showAllCourses
          ? `Enrolled Courses (${displayedCourses.length})`
          : isFaculty
          ? `Published Courses (${displayedCourses.length})`
          : `All Courses (${displayedCourses.length})`}
      </h2>
      <hr />

      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {displayedCourses.map((course: any) => (
            <Col
              key={course._id}
              className="wd-dashboard-course"
              style={{ width: "300px" }}
            >
              <Card>
                <Link
                  href={`/Courses/${course._id}/Home`}
                  className="wd-dashboard-course-link text-decoration-none text-dark"
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

                    {/* Show Go button only for enrolled students or faculty */}
                    {(isFaculty || isEnrolled(course._id)) && (
                      <Button variant="primary" className="me-2">
                        Go
                      </Button>
                    )}

                    {/* Enrollment buttons for students */}
                    {isStudent && (
                      <>
                        {isEnrolled(course._id) ? (
                          <Button
                            variant="danger"
                            onClick={(event) => {
                              event.preventDefault();
                              handleUnenroll(course._id);
                            }}
                          >
                            Unenroll
                          </Button>
                        ) : (
                          <Button
                            variant="success"
                            onClick={(event) => {
                              event.preventDefault();
                              handleEnroll(course._id);
                            }}
                          >
                            Enroll
                          </Button>
                        )}
                      </>
                    )}

                    {/* Admin controls for faculty */}
                    {isFaculty && (
                      <>
                        <button
                          className="btn btn-danger ms-2"
                          onClick={(event) => {
                            event.preventDefault();
                            onDeleteCourse(course._id);
                          }}
                        >
                          Delete
                        </button>
                        <button
                          id="wd-edit-course-click"
                          onClick={(event) => {
                            event.preventDefault();
                            setCourse(course);
                          }}
                          className="btn btn-warning float-end"
                        >
                          Edit
                        </button>
                      </>
                    )}
                  </CardBody>
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
