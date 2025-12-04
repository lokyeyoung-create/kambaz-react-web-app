"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { setPosts, setFolders, setSelectedPost, setSelectedFolder, setStats, updatePost } from "./reducer";
import * as client from "../../client";
import PiazzaNavigation from "./Navigation";
import FolderFilters from "./FolderFilters";
import PostsSidebar from "./PostsSidebar";
import ClassAtGlance from "./ClassAtGlance";
import NewPost from "./NewPost";
import ViewPost from "./ViewPost";

export default function PiazzaPage() {
  const { cid } = useParams();
  const dispatch = useDispatch();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { posts, folders, selectedPost, selectedFolder, showSidebar, stats } = useSelector((state: any) => state.piazzaReducer);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { courses } = useSelector((state: any) => state.coursesReducer);

  const [showNewPost, setShowNewPost] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const currentCourse = courses.find((c: any) => c._id === cid);

  const fetchData = async () => {
    if (!cid) return;
    try {
      const [postsData, foldersData, statsData] = await Promise.all([
        client.findPostsForCourse(cid as string, selectedFolder || undefined),
        client.findFoldersForCourse(cid as string),
        client.getClassStats(cid as string),
      ]);
      dispatch(setPosts(postsData));
      dispatch(setFolders(foldersData));
      dispatch(setStats(statsData));
    } catch (error) {
      console.error("Error fetching Piazza data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    dispatch(setSelectedPost(null));
  }, [cid, selectedFolder]);

  const handleFolderSelect = (folderName: string | null) => {
    dispatch(setSelectedFolder(folderName));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePostSelect = async (post: any) => {
    try {
      const fullPost = await client.findPostById(post._id);
      dispatch(setSelectedPost(fullPost));
      dispatch(updatePost(fullPost));
      setShowNewPost(false);
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  };

  const handleNewPostClick = () => {
    dispatch(setSelectedPost(null));
    setShowNewPost(true);
  };

  const handlePostCreated = () => {
    setShowNewPost(false);
    fetchData();
  };

  const handlePostUpdated = async () => {
    if (selectedPost) {
      const updatedPost = await client.findPostById(selectedPost._id);
      dispatch(setSelectedPost(updatedPost));
      dispatch(updatePost(updatedPost));
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filteredPosts = posts.filter((p: any) =>
    p.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="d-flex flex-column h-100">
      <PiazzaNavigation courseName={currentCourse?.name || cid} userName={`${currentUser?.firstName} ${currentUser?.lastName}`} />
      <FolderFilters folders={folders} selectedFolder={selectedFolder} onSelectFolder={handleFolderSelect} />

      <div className="d-flex flex-grow-1" style={{ minHeight: 0 }}>
        {showSidebar && (
          <PostsSidebar
            posts={filteredPosts}
            selectedPost={selectedPost}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onSelectPost={handlePostSelect}
            onNewPost={handleNewPostClick}
          />
        )}

        <div className="flex-grow-1 p-3 overflow-auto">
          {showNewPost ? (
            <NewPost courseId={cid as string} folders={folders} onCancel={() => setShowNewPost(false)} onPostCreated={handlePostCreated} />
          ) : selectedPost ? (
            <ViewPost post={selectedPost} currentUser={currentUser} onPostUpdated={handlePostUpdated} onPostDeleted={() => { dispatch(setSelectedPost(null)); fetchData(); }} />
          ) : (
            <ClassAtGlance stats={stats} />
          )}
        </div>
      </div>
    </div>
  );
}