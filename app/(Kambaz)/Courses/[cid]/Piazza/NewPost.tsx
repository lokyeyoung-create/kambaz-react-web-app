"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPost } from "./reducer";
import * as client from "../../client";

export default function NewPost({
  courseId,
  folders,
  onCancel,
  onPostCreated,
}: {
  courseId: string;
  folders: any[];
  onCancel: () => void;
  onPostCreated: () => void;
}) {
  const dispatch = useDispatch();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const [type, setType] = useState<"question" | "note">("question");
  const [postTo, setPostTo] = useState<"entire_class" | "individual">("entire_class");
  const [selectedFolders, setSelectedFolders] = useState<string[]>([]);
  const [summary, setSummary] = useState("");
  const [details, setDetails] = useState("");
  const [errors, setErrors] = useState<{ summary?: string; details?: string; folders?: string }>({});

  const handleFolderToggle = (folderName: string) => {
    setSelectedFolders((prev) =>
      prev.includes(folderName) ? prev.filter((f) => f !== folderName) : [...prev, folderName]
    );
  };

  const validate = () => {
    const newErrors: { summary?: string; details?: string; folders?: string } = {};
    if (!summary.trim()) newErrors.summary = "Summary is required";
    if (summary.length > 100) newErrors.summary = "Summary must be 100 characters or less";
    if (!details.trim()) newErrors.details = "Details are required";
    if (selectedFolders.length === 0) newErrors.folders = "At least one folder is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      const newPost = await client.createPost(courseId, {
        type,
        postTo,
        folders: selectedFolders,
        summary,
        details,
      });
      dispatch(addPost(newPost));
      onPostCreated();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className="p-3">
      <h4>New Post</h4>

      <div className="mb-3">
        <label className="form-label fw-bold">Post Type*</label>
        <div className="d-flex gap-3">
          <div className="form-check">
            <input type="radio" className="form-check-input" id="type-question" checked={type === "question"} onChange={() => setType("question")} />
            <label className="form-check-label" htmlFor="type-question">Question</label>
          </div>
          <div className="form-check">
            <input type="radio" className="form-check-input" id="type-note" checked={type === "note"} onChange={() => setType("note")} />
            <label className="form-check-label" htmlFor="type-note">Note</label>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">Post To*</label>
        <div className="d-flex gap-3">
          <div className="form-check">
            <input type="radio" className="form-check-input" id="post-entire" checked={postTo === "entire_class"} onChange={() => setPostTo("entire_class")} />
            <label className="form-check-label" htmlFor="post-entire">Entire Class</label>
          </div>
          <div className="form-check">
            <input type="radio" className="form-check-input" id="post-individual" checked={postTo === "individual"} onChange={() => setPostTo("individual")} />
            <label className="form-check-label" htmlFor="post-individual">Individual Student(s)/Instructor(s)</label>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">Select Folder(s)*</label>
        <div className="d-flex flex-wrap gap-2">
          {folders.map((folder) => (
            <span
              key={folder._id}
              className={`badge ${selectedFolders.includes(folder.name) ? "bg-primary" : "bg-secondary"}`}
              style={{ cursor: "pointer" }}
              onClick={() => handleFolderToggle(folder.name)}
            >
              {folder.name}
            </span>
          ))}
        </div>
        {errors.folders && <div className="text-danger small mt-1">{errors.folders}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">Summary*</label>
        <input
          type="text"
          className={`form-control ${errors.summary ? "is-invalid" : ""}`}
          placeholder="Enter a one line summary, 100 characters or less"
          maxLength={100}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />
        {errors.summary && <div className="invalid-feedback">{errors.summary}</div>}
        <small className="text-muted">{summary.length}/100</small>
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">Details*</label>
        <textarea
          className={`form-control ${errors.details ? "is-invalid" : ""}`}
          rows={8}
          placeholder="Enter the details of your question or note..."
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />
        {errors.details && <div className="invalid-feedback">{errors.details}</div>}
      </div>

      <div className="d-flex gap-2">
        <button className="btn btn-primary" onClick={handleSubmit}>
          Post My {type === "question" ? "Question" : "Note"}
        </button>
        <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}