"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../store";
import * as coursesClient from "../../../../client";
import { Button, Card, Table, Alert, Badge } from "react-bootstrap";
import { BsCheckCircleFill, BsXCircleFill } from "react-icons/bs";

export default function QuizResults() {
  const { cid, qid } = useParams();
  const courseId = Array.isArray(cid) ? cid[0] : cid;
  const quizId = Array.isArray(qid) ? qid[0] : qid;
  const router = useRouter();

  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );

  const [quiz, setQuiz] = useState<any>(null);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [selectedAttempt, setSelectedAttempt] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const isFaculty =
    currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";
  const isStudent = currentUser?.role === "STUDENT";

  const fetchQuiz = async () => {
    if (!quizId) return;
    try {
      const fetchedQuiz = await coursesClient.findQuizById(quizId);
      setQuiz(fetchedQuiz);
    } catch (error) {
      console.error("Error fetching quiz:", error);
    }
  };

  const fetchAttempts = async () => {
    if (!quizId || !currentUser) return;
    try {
      const userAttempts = await coursesClient.getAttemptsByUserAndQuiz(
        quizId as string,
        currentUser._id
      );
      setAttempts(userAttempts);

      // Select the latest attempt by default
      if (userAttempts.length > 0) {
        setSelectedAttempt(userAttempts[0]);
      }
    } catch (error) {
      console.error("Error fetching attempts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
    fetchAttempts();
  }, [quizId, currentUser]);

  const getQuestionById = (questionId: string) => {
    return quiz?.questions.find((q: any) => q._id === questionId);
  };

  const getChoiceText = (question: any, choiceId: string) => {
    const choice = question.choices?.find((c: any) => c._id === choiceId);
    return choice?.text || "";
  };

  const getCorrectChoiceText = (question: any) => {
    const correctChoice = question.choices?.find((c: any) => c.isCorrect);
    return correctChoice?.text || "";
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!quiz) {
    return <div className="p-4">Quiz not found</div>;
  }

  if (attempts.length === 0) {
    return (
      <div className="p-4">
        <Alert variant="info">You haven't taken this quiz yet.</Alert>
        <Button
          variant="primary"
          onClick={() => router.push(`/Courses/${courseId}/Quizzes/${quizId}`)}
        >
          Go to Quiz
        </Button>
      </div>
    );
  }

  const latestAttempt = attempts[0];
  const displayAttempt = selectedAttempt || latestAttempt;

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{quiz.title} - Results</h2>
        <Button
          variant="secondary"
          onClick={() => router.push(`/Courses/${courseId}/Quizzes`)}
        >
          Back to Quizzes
        </Button>
      </div>

      {/* Summary Card */}
      <Card className="mb-4">
        <Card.Body>
          <div className="row">
            <div className="col-md-3">
              <h5>Score</h5>
              <h3 className="text-primary">
                {displayAttempt.score} / {quiz.points}
              </h3>
              <p className="text-muted mb-0">
                {((displayAttempt.score / quiz.points) * 100).toFixed(1)}%
              </p>
            </div>

            <div className="col-md-3">
              <h5>Submitted</h5>
              <p className="mb-0">
                {new Date(displayAttempt.submittedAt).toLocaleDateString()}
              </p>
              <p className="text-muted mb-0">
                {new Date(displayAttempt.submittedAt).toLocaleTimeString()}
              </p>
            </div>

            <div className="col-md-3">
              <h5>Attempt</h5>
              <p className="mb-0">
                {displayAttempt.attemptNumber} of{" "}
                {quiz.multipleAttempts ? quiz.howManyAttempts : 1}
              </p>
            </div>

            <div className="col-md-3">
              <h5>Questions</h5>
              <p className="mb-0">
                {displayAttempt.answers.filter((a: any) => a.isCorrect).length}{" "}
                / {quiz.questions.length} correct
              </p>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Multiple Attempts Selector */}
      {attempts.length > 1 && (
        <Card className="mb-4">
          <Card.Body>
            <h5>View Different Attempt</h5>
            <div className="d-flex gap-2 flex-wrap">
              {attempts.map((attempt: any) => (
                <Button
                  key={attempt._id}
                  variant={
                    selectedAttempt?._id === attempt._id
                      ? "primary"
                      : "outline-primary"
                  }
                  onClick={() => setSelectedAttempt(attempt)}
                >
                  Attempt {attempt.attemptNumber}
                  <br />
                  <small>
                    {attempt.score} / {quiz.points} pts
                  </small>
                </Button>
              ))}
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Attempts History Table */}
      {attempts.length > 1 && (
        <Card className="mb-4">
          <Card.Body>
            <h5>All Attempts</h5>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Attempt</th>
                  <th>Score</th>
                  <th>Percentage</th>
                  <th>Submitted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {attempts.map((attempt: any) => (
                  <tr key={attempt._id}>
                    <td>
                      <Badge bg="secondary">
                        Attempt {attempt.attemptNumber}
                      </Badge>
                    </td>
                    <td>
                      {attempt.score} / {quiz.points}
                    </td>
                    <td>{((attempt.score / quiz.points) * 100).toFixed(1)}%</td>
                    <td>{new Date(attempt.submittedAt).toLocaleString()}</td>
                    <td>
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => setSelectedAttempt(attempt)}
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* Question by Question Results */}
      <h4 className="mb-3">Question-by-Question Results</h4>

      {quiz.questions.map((question: any, index: number) => {
        const answerData = displayAttempt.answers.find(
          (a: any) => a.questionId === question._id
        );
        const isCorrect = answerData?.isCorrect || false;

        return (
          <Card
            key={question._id}
            className={`mb-3 ${
              isCorrect
                ? "border-success"
                : answerData?.answer !== undefined
                ? "border-danger"
                : "border-secondary"
            }`}
          >
            <Card.Header
              className={`d-flex justify-content-between align-items-center ${
                isCorrect
                  ? "bg-success bg-opacity-10"
                  : answerData?.answer !== undefined
                  ? "bg-danger bg-opacity-10"
                  : "bg-light"
              }`}
            >
              <div className="d-flex align-items-center">
                {isCorrect ? (
                  <BsCheckCircleFill className="text-success fs-4 me-2" />
                ) : answerData?.answer !== undefined ? (
                  <BsXCircleFill className="text-danger fs-4 me-2" />
                ) : (
                  <span className="me-2">⚪</span>
                )}
                <strong>
                  Question {index + 1}
                  {question.title && `: ${question.title}`}
                </strong>
              </div>
              <div>
                <Badge bg={isCorrect ? "success" : "danger"}>
                  {answerData?.pointsEarned || 0} / {question.points} pts
                </Badge>
              </div>
            </Card.Header>

            <Card.Body>
              {/* Question Text */}
              <div className="mb-3">
                <strong>Question:</strong>
                <div
                  className="mt-2"
                  dangerouslySetInnerHTML={{ __html: question.question }}
                />
              </div>

              {/* Multiple Choice Answer */}
              {question.type === "multiple-choice" && (
                <div>
                  <strong>Choices:</strong>
                  <div className="mt-2">
                    {question.choices.map((choice: any) => {
                      const isUserAnswer = answerData?.answer === choice._id;
                      const isCorrectAnswer = choice.isCorrect;

                      return (
                        <div
                          key={choice._id}
                          className={`p-3 mb-2 rounded border ${
                            isCorrectAnswer
                              ? "border-success bg-success bg-opacity-10"
                              : isUserAnswer
                              ? "border-danger bg-danger bg-opacity-10"
                              : "border-light"
                          }`}
                        >
                          <div className="d-flex align-items-center">
                            {isUserAnswer && (
                              <span className="me-2">
                                {isCorrectAnswer ? "✓" : "✗"}
                              </span>
                            )}
                            {!isUserAnswer && isCorrectAnswer && (
                              <span className="me-2">✓</span>
                            )}
                            <span className={isCorrectAnswer ? "fw-bold" : ""}>
                              {choice.text}
                            </span>
                          </div>
                          {isUserAnswer && !isCorrectAnswer && (
                            <small className="text-danger d-block mt-1">
                              Your answer
                            </small>
                          )}
                          {isCorrectAnswer &&
                            quiz.showCorrectAnswers !== "never" && (
                              <small className="text-success d-block mt-1">
                                Correct answer
                              </small>
                            )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* True/False Answer */}
              {question.type === "true-false" && (
                <div>
                  <div className="row">
                    <div className="col-md-6">
                      <strong>Your Answer:</strong>
                      <div className="mt-2">
                        <Badge
                          bg={
                            answerData?.answer === question.correctAnswer
                              ? "success"
                              : "danger"
                          }
                          className="fs-6 p-2"
                        >
                          {answerData?.answer === true
                            ? "True"
                            : answerData?.answer === false
                            ? "False"
                            : "No answer"}
                        </Badge>
                      </div>
                    </div>
                    {quiz.showCorrectAnswers !== "never" && (
                      <div className="col-md-6">
                        <strong>Correct Answer:</strong>
                        <div className="mt-2">
                          <Badge bg="success" className="fs-6 p-2">
                            {question.correctAnswer ? "True" : "False"}
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Fill in Blank Answer */}
              {question.type === "fill-in-blank" && (
                <div>
                  <div className="row">
                    <div className="col-md-6">
                      <strong>Your Answer:</strong>
                      <div className="mt-2">
                        <div
                          className={`p-2 border rounded ${
                            isCorrect
                              ? "border-success bg-success bg-opacity-10"
                              : "border-danger bg-danger bg-opacity-10"
                          }`}
                        >
                          {answerData?.answer || "(No answer provided)"}
                        </div>
                      </div>
                    </div>
                    {quiz.showCorrectAnswers !== "never" && (
                      <div className="col-md-6">
                        <strong>Correct Answer(s):</strong>
                        <div className="mt-2">
                          <div className="p-2 border border-success rounded bg-success bg-opacity-10">
                            {Array.isArray(question.correctAnswer)
                              ? question.correctAnswer.join(", ")
                              : question.correctAnswer}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Feedback */}
              <div className="mt-3">
                {isCorrect ? (
                  <Alert variant="success" className="mb-0">
                    <strong>Correct!</strong> You earned {question.points} point
                    {question.points !== 1 ? "s" : ""}.
                  </Alert>
                ) : answerData?.answer !== undefined ? (
                  <Alert variant="danger" className="mb-0">
                    <strong>Incorrect.</strong> You earned 0 points.
                  </Alert>
                ) : (
                  <Alert variant="secondary" className="mb-0">
                    <strong>Not answered.</strong> You earned 0 points.
                  </Alert>
                )}
              </div>
            </Card.Body>
          </Card>
        );
      })}

      {/* Action Buttons */}
      <div className="d-flex justify-content-between mt-4">
        <Button
          variant="secondary"
          onClick={() => router.push(`/Courses/${courseId}/Quizzes`)}
        >
          Back to Quizzes
        </Button>

        {quiz.multipleAttempts &&
          attempts.length < quiz.howManyAttempts &&
          isStudent && (
            <Button
              variant="primary"
              onClick={() =>
                router.push(`/Courses/${courseId}/Quizzes/${quizId}/take`)
              }
            >
              Retake Quiz (Attempt {attempts.length + 1} of{" "}
              {quiz.howManyAttempts})
            </Button>
          )}
      </div>
    </div>
  );
}
