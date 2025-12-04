"use client";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "./reducer";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function PostsSidebar({
  posts,
  selectedPost,
  searchTerm,
  onSearchChange,
  onSelectPost,
  onNewPost,
}: {
  posts: any[];
  selectedPost: any;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onSelectPost: (post: any) => void;
  onNewPost: () => void;
}) {
  const dispatch = useDispatch();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { showSidebar } = useSelector((state: any) => state.piazzaReducer);

  const groupPostsByDate = (posts: any[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const groups: { [key: string]: any[] } = { Today: [], Yesterday: [], "Last Week": [], Earlier: [] };

    posts.forEach((post) => {
      const postDate = new Date(post.createdAt);
      postDate.setHours(0, 0, 0, 0);

      if (postDate.getTime() === today.getTime()) {
        groups["Today"].push(post);
      } else if (postDate.getTime() === yesterday.getTime()) {
        groups["Yesterday"].push(post);
      } else if (postDate >= lastWeek) {
        groups["Last Week"].push(post);
      } else {
        groups["Earlier"].push(post);
      }
    });

    return groups;
  };

  const groupedPosts = groupPostsByDate(posts);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  };

  return (
    <div className="border-end d-flex flex-column" style={{ width: showSidebar ? "350px" : "40px", minWidth: showSidebar ? "350px" : "40px", transition: "width 0.3s" }}>
      <div className="p-2 border-bottom d-flex align-items-center">
        <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => dispatch(toggleSidebar())}>
          {showSidebar ? <FaChevronLeft /> : <FaChevronRight />}
        </button>
        {showSidebar && (
          <>
            <button className="btn btn-danger btn-sm me-2" onClick={onNewPost}>New Post</button>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </>
        )}
      </div>

      {showSidebar && (
        <div className="overflow-auto flex-grow-1">
          {Object.entries(groupedPosts).map(([group, groupPosts]) =>
            groupPosts.length > 0 && (
              <div key={group}>
                <div className="px-3 py-2 bg-light fw-bold small text-muted">{group}</div>
                {groupPosts.map((post) => (
                  <div
                    key={post._id}
                    className={`px-3 py-2 border-bottom ${selectedPost?._id === post._id ? "bg-primary bg-opacity-10" : ""}`}
                    style={{ cursor: "pointer" }}
                    onClick={() => onSelectPost(post)}
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1">
                        <div className="fw-bold small text-truncate">{post.summary}</div>
                        <div className="text-muted small">
                          {post.author?.role === "FACULTY" ? "Instr" : "Stud"}: {post.details?.substring(0, 50)}...
                        </div>
                      </div>
                      <small className="text-muted">{formatTime(post.createdAt)}</small>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}