"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../store";
import * as coursesClient from "../../../../client";
import { Button, Form, Card, Nav, Row, Col } from "react-bootstrap";

export default function QuizEditor() {
  const { cid, qid } = useParams();
  const courseId = Array.isArray(cid) ? cid[0] : cid;
  const quizId = Array.isArray(qid) ? qid[0] : qid;
  const router = useRouter();

  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );

  const [activeTab, setActiveTab] = useState("details");
  const [quiz, setQuiz] = useState<any>({
    title: "",
    description: "",
    quizType: "graded-quiz",
    points: 0,
    assignmentGroup: "quizzes",
    shuffleAnswers: true,
    timeLimit: 20,
    multipleAttempts: false,
    howManyAttempts: 1,
    showCorrectAnswers: "immediately",
    accessCode: "",
    oneQuestionAtTime: true,
    webcamRequired: false,
    lockQuestionsAfterAnswering: false,
    dueDate: "",
    availableDate: "",
    untilDate: "",
  });

  const isFaculty =
    currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";

  useEffect(() => {
    if (!isFaculty) {
      router.push(`/Courses/${courseId}/Quizzes`);
    }
  }, [isFaculty]);

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

  const handleSave = async () => {
    try {
      await coursesClient.updateQuiz(quiz);
      alert("Quiz saved successfully!");
      router.push(`/Courses/${courseId}/Quizzes/${quizId}`);
    } catch (error) {
      console.error("Error saving quiz:", error);
      alert("Failed to save quiz");
    }
  };

  const handleSaveAndPublish = async () => {
    try {
      await coursesClient.updateQuiz({ ...quiz, published: true });
      alert("Quiz saved and published!");
      router.push(`/Courses/${courseId}/Quizzes`);
    } catch (error) {
      console.error("Error saving quiz:", error);
      alert("Failed to save quiz");
    }
  };

  const handleCancel = () => {
    router.push(`/Courses/${courseId}/Quizzes`);
  };

  if (!isFaculty) {
    return null;
  }

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Points {quiz.points || 0}</h3>
        <div>
          <span className="me-3">
            {quiz.published ? "✅ Published" : "🚫 Not Published"}
          </span>
        </div>
      </div>

      <Nav variant="tabs" className="mb-4">
        <Nav.Item>
          <Nav.Link
            active={activeTab === "details"}
            onClick={() => setActiveTab("details")}
          >
            Details
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            active={activeTab === "questions"}
            onClick={() =>
              router.push(
                `/Courses/${courseId}/Quizzes/${quizId}/editor/questions`
              )
            }
          >
            Questions
          </Nav.Link>
        </Nav.Item>
      </Nav>

      <Card>
        <Card.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={quiz.title}
                onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Quiz Instructions</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={quiz.description || ""}
                onChange={(e) =>
                  setQuiz({ ...quiz, description: e.target.value })
                }
                placeholder="Enter quiz instructions..."
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Quiz Type</Form.Label>
              <Form.Select
                value={quiz.quizType}
                onChange={(e) => setQuiz({ ...quiz, quizType: e.target.value })}
              >
                <option value="graded-quiz">Graded Quiz</option>
                <option value="practice-quiz">Practice Quiz</option>
                <option value="graded-survey">Graded Survey</option>
                <option value="ungraded-survey">Ungraded Survey</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Assignment Group</Form.Label>
              <Form.Select
                value={quiz.assignmentGroup}
                onChange={(e) =>
                  setQuiz({ ...quiz, assignmentGroup: e.target.value })
                }
              >
                <option value="quizzes">Quizzes</option>
                <option value="exams">Exams</option>
                <option value="assignments">Assignments</option>
                <option value="project">Project</option>
              </Form.Select>
            </Form.Group>

            <h5 className="mt-4 mb-3">Options</h5>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Shuffle Answers"
                checked={quiz.shuffleAnswers}
                onChange={(e) =>
                  setQuiz({ ...quiz, shuffleAnswers: e.target.checked })
                }
              />
            </Form.Group>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    label="Time Limit"
                    checked={!!quiz.timeLimit}
                    onChange={(e) =>
                      setQuiz({
                        ...quiz,
                        timeLimit: e.target.checked ? 20 : 0,
                      })
                    }
                  />
                </Form.Group>
              </Col>
              {quiz.timeLimit > 0 && (
                <Col md={6}>
                  <Form.Control
                    type="number"
                    value={quiz.timeLimit}
                    onChange={(e) =>
                      setQuiz({ ...quiz, timeLimit: parseInt(e.target.value) })
                    }
                    placeholder="Minutes"
                  />
                </Col>
              )}
            </Row>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Allow Multiple Attempts"
                checked={quiz.multipleAttempts}
                onChange={(e) =>
                  setQuiz({ ...quiz, multipleAttempts: e.target.checked })
                }
              />
            </Form.Group>

            {quiz.multipleAttempts && (
              <Form.Group className="mb-3">
                <Form.Label>How Many Attempts</Form.Label>
                <Form.Control
                  type="number"
                  value={quiz.howManyAttempts}
                  onChange={(e) =>
                    setQuiz({
                      ...quiz,
                      howManyAttempts: parseInt(e.target.value),
                    })
                  }
                  min={1}
                />
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Show Correct Answers</Form.Label>
              <Form.Select
                value={quiz.showCorrectAnswers}
                onChange={(e) =>
                  setQuiz({ ...quiz, showCorrectAnswers: e.target.value })
                }
              >
                <option value="immediately">Immediately</option>
                <option value="after-due-date">After Due Date</option>
                <option value="never">Never</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Access Code</Form.Label>
              <Form.Control
                type="text"
                value={quiz.accessCode || ""}
                onChange={(e) =>
                  setQuiz({ ...quiz, accessCode: e.target.value })
                }
                placeholder="Leave blank for no access code"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="One Question at a Time"
                checked={quiz.oneQuestionAtTime}
                onChange={(e) =>
                  setQuiz({ ...quiz, oneQuestionAtTime: e.target.checked })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Webcam Required"
                checked={quiz.webcamRequired}
                onChange={(e) =>
                  setQuiz({ ...quiz, webcamRequired: e.target.checked })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Lock Questions After Answering"
                checked={quiz.lockQuestionsAfterAnswering}
                onChange={(e) =>
                  setQuiz({
                    ...quiz,
                    lockQuestionsAfterAnswering: e.target.checked,
                  })
                }
              />
            </Form.Group>

            <h5 className="mt-4 mb-3">Assign</h5>

            <Form.Group className="mb-3">
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="datetime-local"
                value={quiz.dueDate || ""}
                onChange={(e) => setQuiz({ ...quiz, dueDate: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Available from</Form.Label>
              <Form.Control
                type="datetime-local"
                value={quiz.availableDate || ""}
                onChange={(e) =>
                  setQuiz({ ...quiz, availableDate: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Until</Form.Label>
              <Form.Control
                type="datetime-local"
                value={quiz.untilDate || ""}
                onChange={(e) =>
                  setQuiz({ ...quiz, untilDate: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>

      <div className="d-flex justify-content-end gap-2 mt-3">
        <Button variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save
        </Button>
        <Button variant="danger" onClick={handleSaveAndPublish}>
          Save & Publish
        </Button>
      </div>
    </div>
  );
}
