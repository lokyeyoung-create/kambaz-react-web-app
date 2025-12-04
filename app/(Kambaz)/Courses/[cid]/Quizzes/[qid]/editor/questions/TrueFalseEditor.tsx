"use client";
import { Button, Form, Card } from "react-bootstrap";

interface TrueFalseEditorProps {
  question: any;
  onChange: (question: any) => void;
  onSave: (question: any) => void;
  onCancel: () => void;
}

export default function TrueFalseEditor({
  question,
  onChange,
  onSave,
  onCancel,
}: TrueFalseEditorProps) {
  const handleTypeChange = (newType: string) => {
    let updatedQuestion = { ...question, type: newType };

    // Reset question-specific fields based on type
    if (newType === "multiple-choice") {
      updatedQuestion.choices = [
        { _id: crypto.randomUUID(), text: "", isCorrect: false },
        { _id: crypto.randomUUID(), text: "", isCorrect: false },
      ];
      updatedQuestion.correctAnswer = undefined;
    } else if (newType === "fill-in-blank") {
      updatedQuestion.correctAnswer = [""];
      updatedQuestion.choices = undefined;
    }

    onChange(updatedQuestion);
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
            placeholder="Enter your question text"
            value={question.question || ""}
            onChange={(e) =>
              onChange({ ...question, question: e.target.value })
            }
          />
          <Form.Text className="text-muted">
            Enter your question text, then select if True or False is the
            correct answer.
          </Form.Text>
        </Form.Group>

        <div className="mb-3">
          <Form.Label>
            <strong>Answers:</strong>
          </Form.Label>

          <div className="d-flex align-items-center mb-2">
            <Form.Check
              type="radio"
              id="true-option"
              name="trueFalseAnswer"
              label="True"
              checked={question.correctAnswer === true}
              onChange={() => onChange({ ...question, correctAnswer: true })}
              className="me-4"
            />

            <Form.Check
              type="radio"
              id="false-option"
              name="trueFalseAnswer"
              label="False"
              checked={question.correctAnswer === false}
              onChange={() => onChange({ ...question, correctAnswer: false })}
            />
          </div>
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
