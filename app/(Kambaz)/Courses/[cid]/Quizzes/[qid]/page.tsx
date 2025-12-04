"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import * as coursesClient from "../../../client";
import { Button, Card, ListGroup } from "react-bootstrap";
import Link from "next/link";

export default function QuizDetails() {
  const { cid, qid } = useParams();
  const courseId = Array.isArray(cid) ? cid[0] : cid;
  const quizId = Array.isArray(qid) ? qid[0] : qid;
  const router = useRouter();

  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );

  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const isFaculty =
    currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";

  const fetchQuiz = async () => {
    if (!quizId) return;
    try {
      const fetchedQuiz = await coursesClient.findQuizById(quizId);
      setQuiz(fetchedQuiz);
    } catch (error) {
      console.error("Error fetching quiz:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add this state at the top with other states
  const [latestAttempt, setLatestAttempt] = useState<any>(null);

  // Add this function with other functions
  const fetchLatestAttempt = async () => {
    if (!quizId || !currentUser || isFaculty) return;
    try {
      const attempt = await coursesClient.getLatestAttempt(
        quizId as string,
        currentUser._id
      );
      setLatestAttempt(attempt);
    } catch (error) {
      console.error("Error fetching latest attempt:", error);
    }
  };

  useEffect(() => {
    fetchQuiz();
    fetchLatestAttempt();
  }, [quizId]);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!quiz) {
    return <div className="p-4">Quiz not found</div>;
  }

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>{quiz.title}</h2>
        <div>
          {isFaculty && (
            <>
              <Button
                variant="secondary"
                className="me-2"
                onClick={() =>
                  router.push(`/Courses/${courseId}/Quizzes/${quizId}/preview`)
                }
              >
                Preview
              </Button>
              <Button
                variant="primary"
                onClick={() =>
                  router.push(`/Courses/${courseId}/Quizzes/${quizId}/editor`)
                }
              >
                Edit
              </Button>
            </>
          )}
          {!isFaculty && (
            <Button
              variant="danger"
              onClick={() =>
                router.push(`/Courses/${courseId}/Quizzes/${quizId}/take`)
              }
            >
              Take Quiz
            </Button>
          )}
        </div>
      </div>

      <Card className="mb-3">
        <Card.Body>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <strong>Quiz Type:</strong>{" "}
              {quiz.quizType?.replace("-", " ").toUpperCase() || "Graded Quiz"}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Points:</strong> {quiz.points || 0}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Assignment Group:</strong>{" "}
              {quiz.assignmentGroup?.toUpperCase() || "QUIZZES"}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Shuffle Answers:</strong>{" "}
              {quiz.shuffleAnswers ? "Yes" : "No"}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Time Limit:</strong> {quiz.timeLimit || 20} Minutes
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Multiple Attempts:</strong>{" "}
              {quiz.multipleAttempts ? "Yes" : "No"}
            </ListGroup.Item>
            {quiz.multipleAttempts && (
              <ListGroup.Item>
                <strong>How Many Attempts:</strong> {quiz.howManyAttempts || 1}
              </ListGroup.Item>
            )}
            <ListGroup.Item>
              <strong>Show Correct Answers:</strong>{" "}
              {quiz.showCorrectAnswers || "Immediately"}
            </ListGroup.Item>
            {quiz.accessCode && (
              <ListGroup.Item>
                <strong>Access Code:</strong> {quiz.accessCode}
              </ListGroup.Item>
            )}
            <ListGroup.Item>
              <strong>One Question at a Time:</strong>{" "}
              {quiz.oneQuestionAtTime ? "Yes" : "No"}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Webcam Required:</strong>{" "}
              {quiz.webcamRequired ? "Yes" : "No"}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Lock Questions After Answering:</strong>{" "}
              {quiz.lockQuestionsAfterAnswering ? "Yes" : "No"}
            </ListGroup.Item>
          </ListGroup>

          <div className="mt-3">
            <h5>Availability</h5>
            <ListGroup variant="flush">
              {quiz.dueDate && (
                <ListGroup.Item>
                  <strong>Due:</strong>{" "}
                  {new Date(quiz.dueDate).toLocaleString()}
                </ListGroup.Item>
              )}
              {quiz.availableDate && (
                <ListGroup.Item>
                  <strong>Available from:</strong>{" "}
                  {new Date(quiz.availableDate).toLocaleString()}
                </ListGroup.Item>
              )}
              {quiz.untilDate && (
                <ListGroup.Item>
                  <strong>Until:</strong>{" "}
                  {new Date(quiz.untilDate).toLocaleString()}
                </ListGroup.Item>
              )}
            </ListGroup>
          </div>

          <div className="mt-3">
            <strong>Number of Questions:</strong> {quiz.questions?.length || 0}
          </div>
        </Card.Body>
      </Card>

      {!isFaculty && latestAttempt && (
        <Card className="mb-3">
          <Card.Body>
            <h5>Your Latest Score</h5>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h3 className="mb-0">
                  {latestAttempt.score} / {quiz.points}
                </h3>
                <p className="text-muted mb-0">
                  {((latestAttempt.score / quiz.points) * 100).toFixed(1)}%
                </p>
                <small className="text-muted">
                  Submitted:{" "}
                  {new Date(latestAttempt.submittedAt).toLocaleString()}
                </small>
              </div>
              <Button
                variant="outline-primary"
                onClick={() =>
                  router.push(`/Courses/${courseId}/Quizzes/${quizId}/results`)
                }
              >
                View Detailed Results
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}
