"use client";
import { Button, Form, Card, InputGroup } from "react-bootstrap";
import { BsTrash } from "react-icons/bs";

interface Choice {
  _id: string;
  text: string;
  isCorrect: boolean;
}

interface MultipleChoiceEditorProps {
  question: any;
  onChange: (question: any) => void;
  onSave: (question: any) => void;
  onCancel: () => void;
}

export default function MultipleChoiceEditor({
  question,
  onChange,
  onSave,
  onCancel,
}: MultipleChoiceEditorProps) {
  const handleTypeChange = (newType: string) => {
    let updatedQuestion = { ...question, type: newType };

    // Reset question-specific fields based on type
    if (newType === "true-false") {
      updatedQuestion.correctAnswer = true;
      updatedQuestion.choices = undefined;
    } else if (newType === "fill-in-blank") {
      updatedQuestion.correctAnswer = [""];
      updatedQuestion.choices = undefined;
    }

    onChange(updatedQuestion);
  };

  const handleAddChoice = () => {
    const newChoice: Choice = {
      _id: crypto.randomUUID(),
      text: "",
      isCorrect: false,
    };
    onChange({
      ...question,
      choices: [...(question.choices || []), newChoice],
    });
  };

  const handleRemoveChoice = (choiceId: string) => {
    onChange({
      ...question,
      choices: question.choices.filter((c: Choice) => c._id !== choiceId),
    });
  };

  const handleChoiceTextChange = (choiceId: string, text: string) => {
    onChange({
      ...question,
      choices: question.choices.map((c: Choice) =>
        c._id === choiceId ? { ...c, text } : c
      ),
    });
  };

  const handleCorrectChoiceChange = (choiceId: string) => {
    onChange({
      ...question,
      choices: question.choices.map((c: Choice) => ({
        ...c,
        isCorrect: c._id === choiceId,
      })),
    });
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
            Enter your question and multiple answers, then select the one
            correct answer.
          </Form.Text>
        </Form.Group>

        <div className="mb-3">
          <Form.Label>
            <strong>Answers:</strong>
          </Form.Label>
          {question.choices?.map((choice: Choice, index: number) => (
            <InputGroup key={choice._id} className="mb-2">
              <InputGroup.Radio
                checked={choice.isCorrect}
                onChange={() => handleCorrectChoiceChange(choice._id)}
                aria-label={`Correct answer option ${index + 1}`}
              />
              <Form.Control
                type="text"
                placeholder={
                  choice.isCorrect
                    ? "Correct Answer"
                    : `Possible Answer ${index + 1}`
                }
                value={choice.text}
                onChange={(e) =>
                  handleChoiceTextChange(choice._id, e.target.value)
                }
              />
              {question.choices.length > 2 && (
                <Button
                  variant="outline-danger"
                  onClick={() => handleRemoveChoice(choice._id)}
                >
                  <BsTrash />
                </Button>
              )}
            </InputGroup>
          ))}

          <Button
            variant="link"
            className="text-danger p-0"
            onClick={handleAddChoice}
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
