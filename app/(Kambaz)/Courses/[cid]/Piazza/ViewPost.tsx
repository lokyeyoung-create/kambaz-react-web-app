"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { updatePost, deletePost as deletePostAction } from "./reducer";
import * as client from "../../client";
import FollowupDiscussion from "./FollowupDiscussion";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";

export default function ViewPost({
  post,
  currentUser,
  onPostUpdated,
  onPostDeleted,
}: {
  post: any;
  currentUser: any;
  onPostUpdated: () => void;
  onPostDeleted: () => void;
}) {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editSummary, setEditSummary] = useState(post.summary);
  const [editDetails, setEditDetails] = useState(post.details);
  const [studentAnswer, setStudentAnswer] = useState("");
  const [instructorAnswer, setInstructorAnswer] = useState("");

  const isInstructor = currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";
  const isAuthor = currentUser?._id === post.author?._id || currentUser?._id === post.author;
  const canEdit = isInstructor || isAuthor;

  const handleUpdatePost = async () => {
    try {
      await client.updatePost(post._id, { summary: editSummary, details: editDetails });
      onPostUpdated();
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handleDeletePost = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await client.deletePost(post._id);
      dispatch(deletePostAction(post._id));
      onPostDeleted();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleAddAnswer = async (answerType: "student" | "instructor") => {
    const content = answerType === "student" ? studentAnswer : instructorAnswer;
    if (!content.trim()) return;
    try {
      const updatedPost = await client.addAnswer(post._id, answerType, { content });
      dispatch(updatePost(updatedPost));
      if (answerType === "student") setStudentAnswer("");
      else setInstructorAnswer("");
      onPostUpdated();
    } catch (error) {
      console.error("Error adding answer:", error);
    }
  };

  const handleDeleteAnswer = async (answerType: "student" | "instructor", answerId: string) => {
    if (!confirm("Are you sure you want to delete this answer?")) return;
    try {
      const updatedPost = await client.deleteAnswer(post._id, answerType, answerId);
      dispatch(updatePost(updatedPost));
      onPostUpdated();
    } catch (error) {
      console.error("Error deleting answer:", error);
    }
  };

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <span className="badge bg-secondary me-2">{post.type}</span>
          {post.folders?.map((f: string) => (
            <span key={f} className="badge bg-info me-1">{f}</span>
          ))}
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-primary"><FaEye className="me-1" />{post.views} views</span>
          {canEdit && (
            <div className="dropdown">
              <button className="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">Actions</button>
              <ul className="dropdown-menu">
                <li><button className="dropdown-item" onClick={() => setIsEditing(true)}><FaEdit className="me-2" />Edit</button></li>
                <li><button className="dropdown-item text-danger" onClick={handleDeletePost}><FaTrash className="me-2" />Delete</button></li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="mb-4">
          <input className="form-control mb-2" value={editSummary} onChange={(e) => setEditSummary(e.target.value)} />
          <textarea className="form-control mb-2" rows={5} value={editDetails} onChange={(e) => setEditDetails(e.target.value)} />
          <button className="btn btn-primary btn-sm me-2" onClick={handleUpdatePost}>Save</button>
          <button className="btn btn-secondary btn-sm" onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div className="mb-4">
          <h3>{post.summary}</h3>
          <div className="text-muted small mb-2">Posted by {post.author?.firstName || "Unknown"} {post.author?.lastName || ""}</div>
          <div dangerouslySetInnerHTML={{ __html: post.details }} />
        </div>
      )}

      {post.type === "question" && (
        <>
          <div className="border rounded p-3 mb-3 bg-light">
            <h5 className="text-primary">Student's Answers</h5>
            {post.studentAnswers?.map((answer: any) => (
              <div key={answer._id} className="border-bottom py-2">
                <div className="d-flex justify-content-between">
                  <small className="text-muted">{answer.author?.firstName || "Student"} - {new Date(answer.createdAt).toLocaleString()}</small>
                  {(isInstructor || currentUser?._id === answer.author?._id || currentUser?._id === answer.author) && (
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteAnswer("student", answer._id)}>
                      <FaTrash />
                    </button>
                  )}
                </div>
                <div dangerouslySetInnerHTML={{ __html: answer.content }} />
              </div>
            ))}
            {!isInstructor && post.studentAnswers?.length === 0 && (
              <div className="mt-2">
                <textarea className="form-control mb-2" rows={3} placeholder="Write your answer..." value={studentAnswer} onChange={(e) => setStudentAnswer(e.target.value)} />
                <button className="btn btn-primary btn-sm" onClick={() => handleAddAnswer("student")}>Submit Answer</button>
              </div>
            )}
          </div>

          <div className="border rounded p-3 mb-3 bg-light">
            <h5 className="text-danger">Instructor's Answers</h5>
            {post.instructorAnswers?.map((answer: any) => (
              <div key={answer._id} className="border-bottom py-2">
                <div className="d-flex justify-content-between">
                  <small className="text-muted">{answer.author?.firstName || "Instructor"} - {new Date(answer.createdAt).toLocaleString()}</small>
                  {isInstructor && (
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteAnswer("instructor", answer._id)}>
                      <FaTrash />
                    </button>
                  )}
                </div>
                <div dangerouslySetInnerHTML={{ __html: answer.content }} />
              </div>
            ))}
            {isInstructor && post.instructorAnswers?.length === 0 && (
              <div className="mt-2">
                <textarea className="form-control mb-2" rows={3} placeholder="Write your answer..." value={instructorAnswer} onChange={(e) => setInstructorAnswer(e.target.value)} />
                <button className="btn btn-primary btn-sm" onClick={() => handleAddAnswer("instructor")}>Submit Answer</button>
              </div>
            )}
          </div>
        </>
      )}

      <FollowupDiscussion post={post} currentUser={currentUser} onPostUpdated={onPostUpdated} />
    </div>
  );
}