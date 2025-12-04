"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../store";
import * as coursesClient from "../../../../client";
import { Button, Card, Form, Alert } from "react-bootstrap";

export default function TakeQuiz() {
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
  const [startTime] = useState(new Date());
  const [attemptData, setAttemptData] = useState<any>(null);
  const [existingAttempt, setExistingAttempt] = useState<any>(null);
  const [attemptCount, setAttemptCount] = useState(0);

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

  const fetchExistingAttempt = async () => {
    if (!quizId || !currentUser) return;
    try {
      const attempt = await coursesClient.getLatestAttempt(
        quizId as string,
        currentUser._id
      );
      setExistingAttempt(attempt);

      const attempts = await coursesClient.getAttemptsByUserAndQuiz(
        quizId as string,
        currentUser._id
      );
      setAttemptCount(attempts.length);
    } catch (error) {
      console.error("Error fetching attempt:", error);
    }
  };

  useEffect(() => {
    if (!isStudent) {
      router.push(`/Courses/${courseId}/Quizzes`);
    }
  }, [isStudent]);

  useEffect(() => {
    fetchQuiz();
    fetchExistingAttempt();
  }, [quizId, currentUser]);

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const gradeQuiz = () => {
    if (!quiz) return { score: 0, gradedAnswers: [] };

    let earnedScore = 0;
    const gradedAnswers: any[] = [];

    quiz.questions.forEach((question: any) => {
      const userAnswer = answers[question._id];
      let isCorrect = false;
      let pointsEarned = 0;

      if (userAnswer !== undefined && userAnswer !== "") {
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
          pointsEarned = question.points || 0;
          earnedScore += pointsEarned;
        }
      }

      gradedAnswers.push({
        questionId: question._id,
        answer: userAnswer,
        isCorrect,
        pointsEarned,
      });
    });

    return { score: earnedScore, gradedAnswers };
  };

  const handleSubmit = async () => {
    if (!currentUser || !quiz) return;

    // Check if student has attempts remaining
    if (quiz.multipleAttempts && attemptCount >= quiz.howManyAttempts) {
      alert("You have exhausted all attempts for this quiz.");
      return;
    }

    const { score, gradedAnswers } = gradeQuiz();

    try {
      const attempt = {
        userId: currentUser._id,
        course: courseId,
        answers: gradedAnswers,
        score,
      };

      const savedAttempt = await coursesClient.submitQuizAttempt(
        quizId as string,
        attempt
      );

      setAttemptData(savedAttempt);
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Failed to submit quiz");
    }
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

  const isQuestionCorrect = (question: any, attempt: any) => {
    const answerData = attempt.answers.find(
      (a: any) => a.questionId === question._id
    );
    return answerData?.isCorrect || false;
  };

  if (!isStudent) {
    return null;
  }

  if (!quiz) {
    return <div className="p-4">Loading...</div>;
  }

  // Show previous attempt if exists and not taking new attempt
  if (
    existingAttempt &&
    !submitted &&
    attemptCount > 0 &&
    !answers[quiz.questions[0]?._id]
  ) {
    const canRetake =
      quiz.multipleAttempts && attemptCount < quiz.howManyAttempts;

    return (
      <div className="p-4">
        <h2>{quiz.title}</h2>

        <Alert variant="info">
          You have already taken this quiz. Your score: {existingAttempt.score}{" "}
          / {quiz.points} points
          {canRetake && (
            <div className="mt-2">
              Attempts: {attemptCount} / {quiz.howManyAttempts}
            </div>
          )}
        </Alert>

        <div className="mb-3">
          {quiz.questions.map((question: any, index: number) => {
            const correct = isQuestionCorrect(question, existingAttempt);
            const answerData = existingAttempt.answers.find(
              (a: any) => a.questionId === question._id
            );

            return (
              <Card
                key={question._id}
                className={`mb-3 ${
                  correct
                    ? "border-success"
                    : answerData?.answer !== undefined
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
                        : answerData?.answer !== undefined
                        ? "✗"
                        : ""}
                    </h5>
                    <span className="text-muted">
                      {answerData?.pointsEarned || 0} / {question.points} pts
                    </span>
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
                              : answerData?.answer === choice._id
                              ? "bg-danger bg-opacity-10"
                              : ""
                          }`}
                        >
                          <Form.Check
                            type="radio"
                            label={choice.text}
                            checked={answerData?.answer === choice._id}
                            disabled
                            className={
                              choice.isCorrect
                                ? "text-success fw-bold"
                                : answerData?.answer === choice._id
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
                      {[true, false].map((value) => (
                        <div
                          key={String(value)}
                          className={`p-2 mb-2 rounded ${
                            question.correctAnswer === value
                              ? "bg-success bg-opacity-10"
                              : answerData?.answer === value
                              ? "bg-danger bg-opacity-10"
                              : ""
                          }`}
                        >
                          <Form.Check
                            type="radio"
                            label={value ? "True" : "False"}
                            checked={answerData?.answer === value}
                            disabled
                            className={
                              question.correctAnswer === value
                                ? "text-success fw-bold"
                                : answerData?.answer === value
                                ? "text-danger"
                                : ""
                            }
                          />
                          {question.correctAnswer === value && (
                            <small className="text-success d-block ms-4">
                              ✓ Correct Answer
                            </small>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {question.type === "fill-in-blank" && (
                    <div>
                      <Form.Control
                        type="text"
                        value={answerData?.answer || ""}
                        disabled
                        className={correct ? "border-success" : "border-danger"}
                      />
                      {quiz.showCorrectAnswers !== "never" && (
                        <div className="mt-2">
                          <small className="text-success">
                            Correct answers:{" "}
                            {Array.isArray(question.correctAnswer)
                              ? question.correctAnswer.join(", ")
                              : ""}
                          </small>
                        </div>
                      )}
                    </div>
                  )}
                </Card.Body>
              </Card>
            );
          })}
        </div>

        <div className="d-flex gap-2">
          <Button
            variant="secondary"
            onClick={() => router.push(`/Courses/${courseId}/Quizzes`)}
          >
            Back to Quizzes
          </Button>
          {canRetake && (
            <Button
              variant="primary"
              onClick={() => {
                setExistingAttempt(null);
                setAnswers({});
              }}
            >
              Retake Quiz
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Show results after submission
  if (submitted && attemptData) {
    return (
      <div className="p-4">
        <h2>{quiz.title}</h2>
        <p>Submitted: {new Date(attemptData.submittedAt).toLocaleString()}</p>

        <Alert variant="success">
          <h4>Quiz Submitted Successfully!</h4>
          <p className="mb-0">
            Your score: {attemptData.score} / {quiz.points} points
          </p>
          {quiz.multipleAttempts && (
            <p className="mb-0 mt-2">
              Attempt {attemptData.attemptNumber} of {quiz.howManyAttempts}
            </p>
          )}
        </Alert>

        <div className="mb-3">
          {quiz.questions.map((question: any, index: number) => {
            const answerData = attemptData.answers.find(
              (a: any) => a.questionId === question._id
            );
            const correct = answerData?.isCorrect || false;

            return (
              <Card
                key={question._id}
                className={`mb-3 ${
                  correct
                    ? "border-success"
                    : answerData?.answer !== undefined
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
                        : answerData?.answer !== undefined
                        ? "✗"
                        : ""}
                    </h5>
                    <span className="text-muted">
                      {answerData?.pointsEarned || 0} / {question.points} pts
                    </span>
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
                              : answerData?.answer === choice._id
                              ? "bg-danger bg-opacity-10"
                              : ""
                          }`}
                        >
                          <Form.Check
                            type="radio"
                            label={choice.text}
                            checked={answerData?.answer === choice._id}
                            disabled
                            className={
                              choice.isCorrect
                                ? "text-success fw-bold"
                                : answerData?.answer === choice._id
                                ? "text-danger"
                                : ""
                            }
                          />
                          {choice.isCorrect &&
                            quiz.showCorrectAnswers !== "never" && (
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
                      {[true, false].map((value) => (
                        <div
                          key={String(value)}
                          className={`p-2 mb-2 rounded ${
                            question.correctAnswer === value
                              ? "bg-success bg-opacity-10"
                              : answerData?.answer === value
                              ? "bg-danger bg-opacity-10"
                              : ""
                          }`}
                        >
                          <Form.Check
                            type="radio"
                            label={value ? "True" : "False"}
                            checked={answerData?.answer === value}
                            disabled
                            className={
                              question.correctAnswer === value
                                ? "text-success fw-bold"
                                : answerData?.answer === value
                                ? "text-danger"
                                : ""
                            }
                          />
                          {question.correctAnswer === value &&
                            quiz.showCorrectAnswers !== "never" && (
                              <small className="text-success d-block ms-4">
                                ✓ Correct Answer
                              </small>
                            )}
                        </div>
                      ))}
                    </div>
                  )}

                  {question.type === "fill-in-blank" && (
                    <div>
                      <Form.Control
                        type="text"
                        value={answerData?.answer || ""}
                        disabled
                        className={correct ? "border-success" : "border-danger"}
                      />
                      {quiz.showCorrectAnswers !== "never" && (
                        <div className="mt-2">
                          <small className="text-success">
                            Correct answers:{" "}
                            {Array.isArray(question.correctAnswer)
                              ? question.correctAnswer.join(", ")
                              : ""}
                          </small>
                        </div>
                      )}
                    </div>
                  )}
                </Card.Body>
              </Card>
            );
          })}
        </div>

        <div className="d-flex gap-2">
          <Button
            variant="secondary"
            onClick={() => router.push(`/Courses/${courseId}/Quizzes`)}
          >
            Back to Quizzes
          </Button>
          {quiz.multipleAttempts &&
            attemptData.attemptNumber < quiz.howManyAttempts && (
              <Button
                variant="primary"
                onClick={() => {
                  setSubmitted(false);
                  setAttemptData(null);
                  setAnswers({});
                  setCurrentQuestionIndex(0);
                }}
              >
                Retake Quiz
              </Button>
            )}
        </div>
      </div>
    );
  }

  const currentQuestion =
    quiz.questions && quiz.questions[currentQuestionIndex];

  // Taking the quiz - one question at a time or all at once
  if (!quiz.oneQuestionAtTime) {
    return (
      <div className="p-4">
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
