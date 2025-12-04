"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { updatePost } from "./reducer";
import * as client from "../../client";
import { FaTrash } from "react-icons/fa";

export default function FollowupDiscussion({
  post,
  currentUser,
  onPostUpdated,
}: {
  post: any;
  currentUser: any;
  onPostUpdated: () => void;
}) {
  const dispatch = useDispatch();
  const [newDiscussion, setNewDiscussion] = useState("");
  const [replyTexts, setReplyTexts] = useState<{ [key: string]: string }>({});

  const isInstructor = currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";

  const handleAddDiscussion = async () => {
    if (!newDiscussion.trim()) return;
    try {
      const updatedPost = await client.addDiscussion(post._id, { content: newDiscussion });
      dispatch(updatePost(updatedPost));
      setNewDiscussion("");
      onPostUpdated();
    } catch (error) {
      console.error("Error adding discussion:", error);
    }
  };

  const handleToggleResolved = async (discussionId: string, currentResolved: boolean) => {
    try {
      const updatedPost = await client.toggleDiscussionResolved(post._id, discussionId, !currentResolved);
      dispatch(updatePost(updatedPost));
      onPostUpdated();
    } catch (error) {
      console.error("Error toggling resolved:", error);
    }
  };

  const handleDeleteDiscussion = async (discussionId: string) => {
    if (!confirm("Are you sure you want to delete this discussion?")) return;
    try {
      const updatedPost = await client.deleteDiscussion(post._id, discussionId);
      dispatch(updatePost(updatedPost));
      onPostUpdated();
    } catch (error) {
      console.error("Error deleting discussion:", error);
    }
  };

  const handleAddReply = async (discussionId: string) => {
    const content = replyTexts[discussionId];
    if (!content?.trim()) return;
    try {
      const updatedPost = await client.addReply(post._id, discussionId, { content });
      dispatch(updatePost(updatedPost));
      setReplyTexts((prev) => ({ ...prev, [discussionId]: "" }));
      onPostUpdated();
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  const handleDeleteReply = async (discussionId: string, replyId: string) => {
    if (!confirm("Are you sure you want to delete this reply?")) return;
    try {
      const updatedPost = await client.deleteReply(post._id, discussionId, replyId);
      dispatch(updatePost(updatedPost));
      onPostUpdated();
    } catch (error) {
      console.error("Error deleting reply:", error);
    }
  };

  return (
    <div className="border rounded p-3">
      <h5>Followup Discussions</h5>

      {post.followupDiscussions?.map((discussion: any) => (
        <div key={discussion._id} className="border rounded p-2 mb-2 bg-white">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div>
              <button
                className={`btn btn-sm me-2 ${discussion.resolved ? "btn-success" : "btn-outline-secondary"}`}
                onClick={() => handleToggleResolved(discussion._id, discussion.resolved)}
              >
                {discussion.resolved ? "Resolved" : "Unresolved"}
              </button>
              <small className="text-muted">
                {discussion.author?.firstName || "User"} - {new Date(discussion.createdAt).toLocaleString()}
              </small>
            </div>
            {(isInstructor || currentUser?._id === discussion.author?._id || currentUser?._id === discussion.author) && (
              <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteDiscussion(discussion._id)}>
                <FaTrash />
              </button>
            )}
          </div>

          <p>{discussion.content}</p>

          <div className="ms-4">
            {discussion.replies?.map((reply: any) => (
              <div key={reply._id} className="border-start ps-3 mb-2">
                <div className="d-flex justify-content-between">
                  <small className="text-muted">
                    {reply.author?.firstName || "User"} - {new Date(reply.createdAt).toLocaleString()}
                  </small>
                  {(isInstructor || currentUser?._id === reply.author?._id || currentUser?._id === reply.author) && (
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteReply(discussion._id, reply._id)}>
                      <FaTrash />
                    </button>
                  )}
                </div>
                <p className="mb-1">{reply.content}</p>
              </div>
            ))}

            <div className="d-flex gap-2 mt-2">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Reply to this discussion..."
                value={replyTexts[discussion._id] || ""}
                onChange={(e) => setReplyTexts((prev) => ({ ...prev, [discussion._id]: e.target.value }))}
              />
              <button className="btn btn-sm btn-primary" onClick={() => handleAddReply(discussion._id)}>Reply</button>
            </div>
          </div>
        </div>
      ))}

      <div className="mt-3">
        <label className="form-label fw-bold">Start a new followup discussion</label>
        <textarea
          className="form-control mb-2"
          rows={2}
          placeholder="Compose a new followup discussion..."
          value={newDiscussion}
          onChange={(e) => setNewDiscussion(e.target.value)}
        />
        <button className="btn btn-primary btn-sm" onClick={handleAddDiscussion}>Post Discussion</button>
      </div>
    </div>
  );
}