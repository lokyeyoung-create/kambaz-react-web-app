"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";
import * as coursesClient from "../../client";
import { setQuizzes } from "./reducer";
import {
  Button,
  ListGroup,
  Dropdown,
  Form,
  InputGroup,
  Badge,
} from "react-bootstrap";
import {
  BsThreeDotsVertical,
  BsSearch,
  BsPlus,
  BsCheckCircleFill,
  BsXCircleFill,
} from "react-icons/bs";
import { FaRocket } from "react-icons/fa";
import Link from "next/link";

export default function Quizzes() {
  const { cid } = useParams();
  const courseId = Array.isArray(cid) ? cid[0] : cid;
  const router = useRouter();
  const dispatch = useDispatch();
  const [studentAttempts, setStudentAttempts] = useState<any>({});

  const { quizzes } = useSelector((state: RootState) => state.quizzesReducer);
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );

  const [searchTerm, setSearchTerm] = useState("");

  const isFaculty =
    currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";
  const isStudent = currentUser?.role === "STUDENT";

  const fetchQuizzes = async () => {
    if (!courseId) return;
    try {
      const fetchedQuizzes = await coursesClient.findQuizzesForCourse(courseId);
      dispatch(setQuizzes(fetchedQuizzes));
      return fetchedQuizzes;
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      return [];
    }
  };

  const fetchStudentAttempts = async (quizzesList: any[]) => {
    if (isFaculty || !currentUser || !quizzesList.length) return;

    try {
      const attemptsMap: any = {};
      for (const quiz of quizzesList) {
        try {
          const attempt = await coursesClient.getLatestAttempt(
            quiz._id,
            currentUser._id
          );
          if (attempt) {
            attemptsMap[quiz._id] = attempt;
          }
        } catch (error) {
          // Quiz not attempted yet
        }
      }
      setStudentAttempts(attemptsMap);
    } catch (error) {
      console.error("Error fetching student attempts:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const fetchedQuizzes = await fetchQuizzes();
      if (!isFaculty && currentUser && fetchedQuizzes.length > 0) {
        await fetchStudentAttempts(fetchedQuizzes);
      }
    };
    loadData();
  }, [courseId, currentUser]);

  const handleCreateQuiz = async () => {
    if (!courseId) return;
    const newQuiz = {
      title: "Unnamed Quiz",
      course: courseId,
      published: false,
    };
    try {
      const createdQuiz = await coursesClient.createQuizForCourse(
        courseId,
        newQuiz
      );
      router.push(`/Courses/${courseId}/Quizzes/${createdQuiz._id}`);
    } catch (error) {
      console.error("Error creating quiz:", error);
    }
  };

  const handlePublishToggle = async (quiz: any) => {
    try {
      const updatedQuiz = { ...quiz, published: !quiz.published };
      await coursesClient.updateQuiz(updatedQuiz);
      fetchQuizzes();
    } catch (error) {
      console.error("Error toggling publish:", error);
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    if (!confirm("Are you sure you want to delete this quiz?")) return;
    try {
      await coursesClient.deleteQuiz(quizId);
      fetchQuizzes();
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };

  const getAvailabilityStatus = (quiz: any) => {
    if (!quiz.availableDate || !quiz.untilDate) return "Available";

    const now = new Date();
    const availableDate = new Date(quiz.availableDate);
    const untilDate = new Date(quiz.untilDate);

    if (now < availableDate) {
      return `Not available until ${availableDate.toLocaleDateString()}`;
    }
    if (now > untilDate) {
      return "Closed";
    }
    return "Available";
  };

  const filteredQuizzes = quizzes.filter((quiz: any) =>
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedQuizzes = (
    isFaculty
      ? filteredQuizzes
      : filteredQuizzes.filter((quiz: any) => quiz.published)
  ).sort((a: any, b: any) => {
    // Sort by availableDate, with quizzes without dates at the end
    if (!a.availableDate) return 1;
    if (!b.availableDate) return -1;
    return (
      new Date(a.availableDate).getTime() - new Date(b.availableDate).getTime()
    );
  });

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <InputGroup style={{ maxWidth: "400px" }}>
          <InputGroup.Text>
            <BsSearch />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Search for Quiz"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>

        {isFaculty && (
          <div>
            <Button variant="danger" onClick={handleCreateQuiz}>
              <BsPlus className="fs-4" /> Quiz
            </Button>
          </div>
        )}
      </div>

      <hr />

      {displayedQuizzes.length === 0 && (
        <div className="text-center text-muted py-5">
          <p>No quizzes available.</p>
          {isFaculty && (
            <p>Click the "+ Quiz" button to create your first quiz.</p>
          )}
        </div>
      )}

      <ListGroup>
        {displayedQuizzes.map((quiz: any) => (
          <ListGroup.Item
            key={quiz._id}
            className="d-flex align-items-center justify-content-between p-3 mb-2"
          >
            <div className="d-flex align-items-center flex-grow-1">
              <FaRocket className="text-success me-3 fs-4" />

              <div className="flex-grow-1">
                <Link
                  href={`/Courses/${courseId}/Quizzes/${quiz._id}`}
                  className="text-decoration-none text-dark"
                >
                  <h5 className="mb-1">{quiz.title}</h5>
                </Link>

                <div className="text-muted small">
                  <span className="me-3">
                    <strong>{getAvailabilityStatus(quiz)}</strong>
                  </span>
                  {quiz.dueDate && (
                    <span className="me-3">
                      | <strong>Due</strong>{" "}
                      {new Date(quiz.dueDate).toLocaleDateString()}
                    </span>
                  )}
                  <span className="me-3">| {quiz.points || 0} pts</span>
                  <span className="me-3">
                    | {quiz.questions?.length || 0} Questions
                  </span>
                  {isStudent && studentAttempts[quiz._id] && (
                    <span className="me-3">
                      | <strong>Score:</strong>{" "}
                      {studentAttempts[quiz._id].score} / {quiz.points}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              {/* Show score badge for students */}
              {isStudent && studentAttempts[quiz._id] && (
                <Badge bg="info" className="fs-6 p-2 me-2">
                  {studentAttempts[quiz._id].score} / {quiz.points}
                </Badge>
              )}

              {isFaculty ? (
                <>
                  <Button
                    variant="link"
                    onClick={() => handlePublishToggle(quiz)}
                    className="p-0 me-2"
                  >
                    {quiz.published ? (
                      <BsCheckCircleFill className="text-success fs-5" />
                    ) : (
                      <BsXCircleFill className="text-danger fs-5" />
                    )}
                  </Button>

                  <Dropdown>
                    <Dropdown.Toggle
                      variant="link"
                      className="text-dark p-0"
                      style={{ textDecoration: "none" }}
                    >
                      <BsThreeDotsVertical />
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={() =>
                          router.push(
                            `/Courses/${courseId}/Quizzes/${quiz._id}`
                          )
                        }
                      >
                        Edit
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handlePublishToggle(quiz)}>
                        {quiz.published ? "Unpublish" : "Publish"}
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => handleDeleteQuiz(quiz._id)}
                        className="text-danger"
                      >
                        Delete
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </>
              ) : (
                quiz.published && (
                  <BsCheckCircleFill className="text-success fs-5" />
                )
              )}
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}
