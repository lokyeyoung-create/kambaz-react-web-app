"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../../store";
import * as coursesClient from "../../../../../client";
import { Button, Card, Nav, Dropdown, ListGroup } from "react-bootstrap";
import { BsThreeDotsVertical, BsPlus } from "react-icons/bs";
import MultipleChoiceEditor from "./MultipleChoiceEditor";
import TrueFalseEditor from "./TrueFalseEditor";
import FillInBlankEditor from "./FillInBlankEditor";

export default function QuestionsEditor() {
  const { cid, qid } = useParams();
  const courseId = Array.isArray(cid) ? cid[0] : cid;
  const quizId = Array.isArray(qid) ? qid[0] : qid;
  const router = useRouter();

  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );

  const [quiz, setQuiz] = useState<any>(null);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(
    null
  );
  const [editingQuestion, setEditingQuestion] = useState<any>(null);

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

  const handleAddQuestion = async () => {
    const newQuestion = {
      type: "multiple-choice",
      title: "New Question",
      points: 0,
      question: "",
      choices: [
        { _id: crypto.randomUUID(), text: "", isCorrect: false },
        { _id: crypto.randomUUID(), text: "", isCorrect: false },
      ],
    };

    try {
      const addedQuestion = await coursesClient.addQuestionToQuiz(
        quizId as string,
        newQuestion
      );

      // Set the new question to editing mode immediately
      setEditingQuestionId(addedQuestion._id);
      setEditingQuestion(addedQuestion);

      // Refresh quiz data
      await fetchQuiz();
    } catch (error) {
      console.error("Error adding question:", error);
      alert("Failed to add question");
    }
  };

  const handleEditQuestion = (question: any) => {
    setEditingQuestionId(question._id);
    setEditingQuestion({ ...question });
  };

  const handleSaveQuestion = async (question: any) => {
    try {
      await coursesClient.updateQuestion(
        quizId as string,
        question._id,
        question
      );

      // Update total points
      const updatedQuiz = await coursesClient.findQuizById(quizId as string);
      const totalPoints = updatedQuiz.questions.reduce(
        (sum: number, q: any) => sum + (q.points || 0),
        0
      );
      await coursesClient.updateQuiz({ ...updatedQuiz, points: totalPoints });

      setEditingQuestionId(null);
      setEditingQuestion(null);
      await fetchQuiz();
    } catch (error) {
      console.error("Error saving question:", error);
      alert("Failed to save question");
    }
  };

  const handleCancelEdit = () => {
    setEditingQuestionId(null);
    setEditingQuestion(null);
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;

    try {
      await coursesClient.deleteQuestion(quizId as string, questionId);

      // Update total points
      const updatedQuiz = await coursesClient.findQuizById(quizId as string);
      const totalPoints = updatedQuiz.questions.reduce(
        (sum: number, q: any) => sum + (q.points || 0),
        0
      );
      await coursesClient.updateQuiz({ ...updatedQuiz, points: totalPoints });

      await fetchQuiz();
    } catch (error) {
      console.error("Error deleting question:", error);
      alert("Failed to delete question");
    }
  };

  const handleCancel = () => {
    router.push(`/Courses/${courseId}/Quizzes`);
  };

  const handleSave = async () => {
    alert("Questions saved successfully!");
    router.push(`/Courses/${courseId}/Quizzes/${quizId}`);
  };

  if (!isFaculty || !quiz) {
    return <div className="p-4">Loading...</div>;
  }

  const totalPoints = quiz.questions?.reduce(
    (sum: number, q: any) => sum + (q.points || 0),
    0
  );

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Points {totalPoints || 0}</h3>
        <div>
          <span className="me-3">
            {quiz.published ? "✅ Published" : "🚫 Not Published"}
          </span>
        </div>
      </div>

      <Nav variant="tabs" className="mb-4">
        <Nav.Item>
          <Nav.Link
            onClick={() =>
              router.push(`/Courses/${courseId}/Quizzes/${quizId}/editor`)
            }
          >
            Details
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link active>Questions</Nav.Link>
        </Nav.Item>
      </Nav>

      <Card className="mb-3">
        <Card.Body>
          <div className="d-flex justify-content-center mb-3">
            <Button variant="outline-secondary" onClick={handleAddQuestion}>
              <BsPlus className="fs-4" /> New Question
            </Button>
          </div>

          <ListGroup variant="flush">
            {quiz.questions?.map((question: any, index: number) => (
              <ListGroup.Item key={question._id} className="p-3">
                {editingQuestionId === question._id ? (
                  <div>
                    {editingQuestion.type === "multiple-choice" && (
                      <MultipleChoiceEditor
                        question={editingQuestion}
                        onChange={setEditingQuestion}
                        onSave={handleSaveQuestion}
                        onCancel={handleCancelEdit}
                      />
                    )}
                    {editingQuestion.type === "true-false" && (
                      <TrueFalseEditor
                        question={editingQuestion}
                        onChange={setEditingQuestion}
                        onSave={handleSaveQuestion}
                        onCancel={handleCancelEdit}
                      />
                    )}
                    {editingQuestion.type === "fill-in-blank" && (
                      <FillInBlankEditor
                        question={editingQuestion}
                        onChange={setEditingQuestion}
                        onSave={handleSaveQuestion}
                        onCancel={handleCancelEdit}
                      />
                    )}
                  </div>
                ) : (
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center mb-2">
                        <h5 className="mb-0 me-3">Question {index + 1}</h5>
                        <span className="badge bg-secondary me-2">
                          {question.type === "multiple-choice" &&
                            "Multiple Choice"}
                          {question.type === "true-false" && "True/False"}
                          {question.type === "fill-in-blank" && "Fill in Blank"}
                        </span>
                        <span className="text-muted">
                          {question.points} pts
                        </span>
                      </div>
                      <div className="mb-2">
                        <strong>{question.title || "Untitled Question"}</strong>
                      </div>
                      <div
                        className="text-muted"
                        dangerouslySetInnerHTML={{
                          __html: question.question || "No question text",
                        }}
                      />
                    </div>

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
                          onClick={() => handleEditQuestion(question)}
                        >
                          Edit
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => handleDeleteQuestion(question._id)}
                          className="text-danger"
                        >
                          Delete
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                )}
              </ListGroup.Item>
            ))}

            {(!quiz.questions || quiz.questions.length === 0) && (
              <ListGroup.Item className="text-center text-muted py-4">
                No questions yet. Click "New Question" to add your first
                question.
              </ListGroup.Item>
            )}
          </ListGroup>
        </Card.Body>
      </Card>

      <div className="d-flex justify-content-end gap-2 mt-3">
        <Button variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
}
