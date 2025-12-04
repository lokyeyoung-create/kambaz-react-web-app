"use client";
import { Button, Form, Card, InputGroup } from "react-bootstrap";
import { BsTrash } from "react-icons/bs";

interface FillInBlankEditorProps {
  question: any;
  onChange: (question: any) => void;
  onSave: (question: any) => void;
  onCancel: () => void;
}

export default function FillInBlankEditor({
  question,
  onChange,
  onSave,
  onCancel,
}: FillInBlankEditorProps) {
  const possibleAnswers = Array.isArray(question.correctAnswer)
    ? question.correctAnswer
    : [];

  const handleTypeChange = (newType: string) => {
    let updatedQuestion = { ...question, type: newType };

    // Reset question-specific fields based on type
    if (newType === "multiple-choice") {
      updatedQuestion.choices = [
        { _id: crypto.randomUUID(), text: "", isCorrect: false },
        { _id: crypto.randomUUID(), text: "", isCorrect: false },
      ];
      updatedQuestion.correctAnswer = undefined;
    } else if (newType === "true-false") {
      updatedQuestion.correctAnswer = true;
      updatedQuestion.choices = undefined;
    }

    onChange(updatedQuestion);
  };

  const handleAddAnswer = () => {
    const newAnswers = [...possibleAnswers, ""];
    onChange({ ...question, correctAnswer: newAnswers });
  };

  const handleRemoveAnswer = (index: number) => {
    const newAnswers = possibleAnswers.filter(
      (_: string, i: number) => i !== index
    );
    onChange({ ...question, correctAnswer: newAnswers });
  };

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = possibleAnswers.map((answer: string, i: number) =>
      i === index ? value : answer
    );
    onChange({ ...question, correctAnswer: newAnswers });
  };

  return (
    <Card>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Form.Group className="flex-grow-1 me-3">
            <Form.Control
              type="text"
              placeholder="Question Title"
              value={question.title || ""}
              onChange={(e) => onChange({ ...question, title: e.target.value })}
            />
          </Form.Group>

          <Form.Group style={{ width: "200px" }} className="me-3">
            <Form.Select
              value={question.type}
              onChange={(e) => handleTypeChange(e.target.value)}
            >
              <option value="multiple-choice">Multiple Choice</option>
              <option value="true-false">True/False</option>
              <option value="fill-in-blank">Fill in Blank</option>
            </Form.Select>
          </Form.Group>

          <Form.Group style={{ width: "100px" }}>
            <Form.Label className="mb-0 me-2">
              <strong>pts:</strong>
            </Form.Label>
            <Form.Control
              type="number"
              value={question.points || 0}
              onChange={(e) =>
                onChange({ ...question, points: parseInt(e.target.value) || 0 })
              }
              min={0}
            />
          </Form.Group>
        </div>

        <Form.Group className="mb-3">
          <Form.Label>
            <strong>Question:</strong>
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter your question text (e.g., 'How much is 2 + 2 = _______?')"
            value={question.question || ""}
            onChange={(e) =>
              onChange({ ...question, question: e.target.value })
            }
          />
          <Form.Text className="text-muted">
            Enter your question text, then define all possible correct answers
            for the blank. Students will see the question followed by a small
            text box to type their answer.
          </Form.Text>
        </Form.Group>

        <div className="mb-3">
          <Form.Label>
            <strong>Answers:</strong>
          </Form.Label>
          {possibleAnswers.map((answer: string, index: number) => (
            <InputGroup key={index} className="mb-2">
              <InputGroup.Text>Possible Answer:</InputGroup.Text>
              <Form.Control
                type="text"
                placeholder={`Answer ${index + 1}`}
                value={answer}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
              />
              {possibleAnswers.length > 1 && (
                <Button
                  variant="outline-danger"
                  onClick={() => handleRemoveAnswer(index)}
                >
                  <BsTrash />
                </Button>
              )}
            </InputGroup>
          ))}

          <Button
            variant="link"
            className="text-danger p-0"
            onClick={handleAddAnswer}
          >
            + Add Another Answer
          </Button>
        </div>

        <div className="d-flex justify-content-end gap-2">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => onSave(question)}>
            Update Question
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
