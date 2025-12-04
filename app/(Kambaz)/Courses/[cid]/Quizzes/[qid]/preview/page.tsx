"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../store";
import * as coursesClient from "../../../../client";
import { Button, Card, Form, Alert } from "react-bootstrap";

export default function QuizPreview() {
  const { cid, qid } = useParams();
  const courseId = Array.isArray(cid) ? cid[0] : cid;
  const quizId = Array.isArray(qid) ? qid[0] : qid;
  const router = useRouter();

  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );

  const [quiz, setQuiz] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [startTime] = useState(new Date());

  const isFaculty =
    currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";

  const fetchQuiz = async () => {
    if (!quizId) return;
    try {
      const fetchedQuiz = await coursesClient.findQuizById(quizId);
      setQuiz(fetchedQuiz);
    } catch (error) {
      console.error("Error fetching quiz:", error);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, [quizId]);

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const gradeQuiz = () => {
    if (!quiz) return 0;

    let totalScore = 0;
    let earnedScore = 0;

    quiz.questions.forEach((question: any) => {
      totalScore += question.points || 0;
      const userAnswer = answers[question._id];

      if (!userAnswer) return;

      let isCorrect = false;

      if (question.type === "multiple-choice") {
        const correctChoice = question.choices.find((c: any) => c.isCorrect);
        isCorrect = userAnswer === correctChoice?._id;
      } else if (question.type === "true-false") {
        isCorrect = userAnswer === question.correctAnswer;
      } else if (question.type === "fill-in-blank") {
        const correctAnswers = Array.isArray(question.correctAnswer)
          ? question.correctAnswer
          : [];
        isCorrect = correctAnswers.some(
          (ans: string) =>
            ans.toLowerCase().trim() === userAnswer.toLowerCase().trim()
        );
      }

      if (isCorrect) {
        earnedScore += question.points || 0;
      }
    });

    return earnedScore;
  };

  const handleSubmit = () => {
    const finalScore = gradeQuiz();
    setScore(finalScore);
    setSubmitted(true);
  };

  const handleNext = () => {
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const isQuestionAnswered = (questionId: string) => {
    return answers[questionId] !== undefined && answers[questionId] !== "";
  };

  const isQuestionCorrect = (question: any) => {
    const userAnswer = answers[question._id];
    if (!userAnswer) return false;

    if (question.type === "multiple-choice") {
      const correctChoice = question.choices.find((c: any) => c.isCorrect);
      return userAnswer === correctChoice?._id;
    } else if (question.type === "true-false") {
      return userAnswer === question.correctAnswer;
    } else if (question.type === "fill-in-blank") {
      const correctAnswers = Array.isArray(question.correctAnswer)
        ? question.correctAnswer
        : [];
      return correctAnswers.some(
        (ans: string) =>
          ans.toLowerCase().trim() === userAnswer.toLowerCase().trim()
      );
    }
    return false;
  };

  if (!quiz) {
    return <div className="p-4">Loading...</div>;
  }

  const currentQuestion =
    quiz.questions && quiz.questions[currentQuestionIndex];

  if (submitted) {
    return (
      <div className="p-4">
        <Alert variant="info">
          ⓘ This is a preview of the published version of the quiz
        </Alert>

        <h2>{quiz.title}</h2>
        <p>Started: {startTime.toLocaleString()}</p>

        <Card className="mb-3">
          <Card.Body>
            <h3>Quiz Instructions</h3>
            <div
              dangerouslySetInnerHTML={{
                __html: quiz.description || "No instructions provided",
              }}
            />
          </Card.Body>
        </Card>

        <h3 className="mb-3">
          Score: {score} / {quiz.points} points
        </h3>

        <div className="mb-3">
          {quiz.questions.map((question: any, index: number) => {
            const correct = isQuestionCorrect(question);
            return (
              <Card
                key={question._id}
                className={`mb-3 ${
                  correct
                    ? "border-success"
                    : isQuestionAnswered(question._id)
                    ? "border-danger"
                    : ""
                }`}
              >
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5>
                      Question {index + 1}{" "}
                      {correct
                        ? "✓"
                        : isQuestionAnswered(question._id)
                        ? "✗"
                        : ""}
                    </h5>
                    <span className="text-muted">{question.points} pts</span>
                  </div>

                  <div
                    className="mb-3"
                    dangerouslySetInnerHTML={{ __html: question.question }}
                  />

                  {question.type === "multiple-choice" && (
                    <div>
                      {question.choices.map((choice: any) => (
                        <div
                          key={choice._id}
                          className={`p-2 mb-2 rounded ${
                            choice.isCorrect
                              ? "bg-success bg-opacity-10"
                              : answers[question._id] === choice._id
                              ? "bg-danger bg-opacity-10"
                              : ""
                          }`}
                        >
                          <Form.Check
                            type="radio"
                            label={choice.text}
                            checked={answers[question._id] === choice._id}
                            disabled
                            className={
                              choice.isCorrect
                                ? "text-success fw-bold"
                                : answers[question._id] === choice._id
                                ? "text-danger"
                                : ""
                            }
                          />
                          {choice.isCorrect && (
                            <small className="text-success d-block ms-4">
                              ✓ Correct Answer
                            </small>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {question.type === "true-false" && (
                    <div>
                      <div
                        className={`p-2 mb-2 rounded ${
                          question.correctAnswer === true
                            ? "bg-success bg-opacity-10"
                            : answers[question._id] === true
                            ? "bg-danger bg-opacity-10"
                            : ""
                        }`}
                      >
                        <Form.Check
                          type="radio"
                          label="True"
                          checked={answers[question._id] === true}
                          disabled
                          className={
                            question.correctAnswer === true
                              ? "text-success fw-bold"
                              : answers[question._id] === true
                              ? "text-danger"
                              : ""
                          }
                        />
                        {question.correctAnswer === true && (
                          <small className="text-success d-block ms-4">
                            ✓ Correct Answer
                          </small>
                        )}
                      </div>
                      <div
                        className={`p-2 mb-2 rounded ${
                          question.correctAnswer === false
                            ? "bg-success bg-opacity-10"
                            : answers[question._id] === false
                            ? "bg-danger bg-opacity-10"
                            : ""
                        }`}
                      >
                        <Form.Check
                          type="radio"
                          label="False"
                          checked={answers[question._id] === false}
                          disabled
                          className={
                            question.correctAnswer === false
                              ? "text-success fw-bold"
                              : answers[question._id] === false
                              ? "text-danger"
                              : ""
                          }
                        />
                        {question.correctAnswer === false && (
                          <small className="text-success d-block ms-4">
                            ✓ Correct Answer
                          </small>
                        )}
                      </div>
                    </div>
                  )}

                  {question.type === "fill-in-blank" && (
                    <div>
                      <Form.Control
                        type="text"
                        value={answers[question._id] || ""}
                        disabled
                        className={correct ? "border-success" : "border-danger"}
                      />
                      <div className="mt-2">
                        <small className="text-success">
                          Correct answers:{" "}
                          {Array.isArray(question.correctAnswer)
                            ? question.correctAnswer.join(", ")
                            : ""}
                        </small>
                      </div>
                    </div>
                  )}
                </Card.Body>
              </Card>
            );
          })}
        </div>

        <Button
          variant="secondary"
          onClick={() =>
            router.push(`/Courses/${courseId}/Quizzes/${quizId}/editor`)
          }
        >
          Keep Editing This Quiz
        </Button>
      </div>
    );
  }
  {
    quiz.oneQuestionAtTime && (
      <Card className="mb-3">
        <Card.Body>
          <h5>Questions</h5>
          <div className="d-flex flex-wrap gap-2">
            {quiz.questions.map((q: any, idx: number) => (
              <Button
                key={q._id}
                variant={
                  idx === currentQuestionIndex
                    ? "primary"
                    : isQuestionAnswered(q._id)
                    ? "outline-success"
                    : "outline-secondary"
                }
                onClick={() => setCurrentQuestionIndex(idx)}
                size="sm"
              >
                {idx + 1}
              </Button>
            ))}
          </div>
        </Card.Body>
      </Card>
    );
  }
  if (!quiz.oneQuestionAtTime) {
    // Show all questions at once
    return (
      <div className="p-4">
        <Alert variant="info">
          ⓘ This is a preview of the published version of the quiz
        </Alert>

        <h2>{quiz.title}</h2>
        <p>Started: {startTime.toLocaleString()}</p>

        <Card className="mb-3">
          <Card.Body>
            <h3>Quiz Instructions</h3>
            <div
              dangerouslySetInnerHTML={{
                __html: quiz.description || "No instructions provided",
              }}
            />
          </Card.Body>
        </Card>

        {quiz.questions.map((question: any, index: number) => (
          <Card key={question._id} className="mb-3">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h5>Question {index + 1}</h5>
                <span className="text-muted">{question.points} pts</span>
              </div>

              <div
                className="mb-3"
                dangerouslySetInnerHTML={{ __html: question.question }}
              />

              {question.type === "multiple-choice" && (
                <Form.Group>
                  {question.choices.map((choice: any) => (
                    <Form.Check
                      key={choice._id}
                      type="radio"
                      name={`question-${question._id}`}
                      label={choice.text}
                      checked={answers[question._id] === choice._id}
                      onChange={() =>
                        handleAnswerChange(question._id, choice._id)
                      }
                    />
                  ))}
                </Form.Group>
              )}

              {question.type === "true-false" && (
                <Form.Group>
                  <Form.Check
                    type="radio"
                    name={`question-${question._id}`}
                    label="True"
                    checked={answers[question._id] === true}
                    onChange={() => handleAnswerChange(question._id, true)}
                  />
                  <Form.Check
                    type="radio"
                    name={`question-${question._id}`}
                    label="False"
                    checked={answers[question._id] === false}
                    onChange={() => handleAnswerChange(question._id, false)}
                  />
                </Form.Group>
              )}

              {question.type === "fill-in-blank" && (
                <Form.Group>
                  <Form.Control
                    type="text"
                    placeholder="Enter your answer"
                    value={answers[question._id] || ""}
                    onChange={(e) =>
                      handleAnswerChange(question._id, e.target.value)
                    }
                  />
                </Form.Group>
              )}
            </Card.Body>
          </Card>
        ))}

        <div className="d-flex justify-content-end">
          <Button variant="danger" onClick={handleSubmit}>
            Submit Quiz
          </Button>
        </div>
      </div>
    );
  }

  // One question at a time
  return (
    <div className="p-4">
      <Alert variant="info">
        ⓘ This is a preview of the published version of the quiz
      </Alert>

      <h2>{quiz.title}</h2>
      <p>Started: {startTime.toLocaleString()}</p>

      {currentQuestionIndex === 0 && (
        <Card className="mb-3">
          <Card.Body>
            <h3>Quiz Instructions</h3>
            <div
              dangerouslySetInnerHTML={{
                __html: quiz.description || "No instructions provided",
              }}
            />
          </Card.Body>
        </Card>
      )}

      {currentQuestion && (
        <Card className="mb-3">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-start mb-2">
              <h5>
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </h5>
              <span className="text-muted">{currentQuestion.points} pts</span>
            </div>

            <div
              className="mb-3"
              dangerouslySetInnerHTML={{ __html: currentQuestion.question }}
            />

            {currentQuestion.type === "multiple-choice" && (
              <Form.Group>
                {currentQuestion.choices.map((choice: any) => (
                  <Form.Check
                    key={choice._id}
                    type="radio"
                    name={`question-${currentQuestion._id}`}
                    label={choice.text}
                    checked={answers[currentQuestion._id] === choice._id}
                    onChange={() =>
                      handleAnswerChange(currentQuestion._id, choice._id)
                    }
                  />
                ))}
              </Form.Group>
            )}

            {currentQuestion.type === "true-false" && (
              <Form.Group>
                <Form.Check
                  type="radio"
                  name={`question-${currentQuestion._id}`}
                  label="True"
                  checked={answers[currentQuestion._id] === true}
                  onChange={() => handleAnswerChange(currentQuestion._id, true)}
                />
                <Form.Check
                  type="radio"
                  name={`question-${currentQuestion._id}`}
                  label="False"
                  checked={answers[currentQuestion._id] === false}
                  onChange={() =>
                    handleAnswerChange(currentQuestion._id, false)
                  }
                />
              </Form.Group>
            )}

            {currentQuestion.type === "fill-in-blank" && (
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Enter your answer"
                  value={answers[currentQuestion._id] || ""}
                  onChange={(e) =>
                    handleAnswerChange(currentQuestion._id, e.target.value)
                  }
                />
              </Form.Group>
            )}
          </Card.Body>
        </Card>
      )}

      <div className="d-flex justify-content-between">
        <Button
          variant="secondary"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>

        {currentQuestionIndex < quiz.questions.length - 1 ? (
          <Button variant="primary" onClick={handleNext}>
            Next
          </Button>
        ) : (
          <Button variant="danger" onClick={handleSubmit}>
            Submit Quiz
          </Button>
        )}
      </div>

      <div className="text-center mt-3 text-muted">
        Quiz saved at {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
}
