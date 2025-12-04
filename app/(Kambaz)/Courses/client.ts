import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });
const REMOTE_SERVER = process.env.NEXT_PUBLIC_REMOTE_SERVER || process.env.NEXT_PUBLIC_HTTP_SERVER;
const COURSES_API = `${REMOTE_SERVER}/api/courses`;
const USERS_API = `${REMOTE_SERVER}/api/users`;
const MODULES_API = `${REMOTE_SERVER}/api/modules`;
const ASSIGNMENTS_API = `${REMOTE_SERVER}/api/assignments`;
const ENROLLMENTS_API = `${REMOTE_SERVER}/api/enrollments`;
const POSTS_API = `${REMOTE_SERVER}/api/posts`;
const FOLDERS_API = `${REMOTE_SERVER}/api/folders`;

// Courses
export const fetchAllCourses = async () => {
  const { data } = await axios.get(COURSES_API);
  return data;
};

export const findMyCourses = async () => {
  const { data } = await axiosWithCredentials.get(`${USERS_API}/current/courses`);
  return data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createCourse = async (course: any) => {
  const { data } = await axiosWithCredentials.post(`${USERS_API}/current/courses`, course);
  return data;
};

export const deleteCourse = async (id: string) => {
  const { data } = await axiosWithCredentials.delete(`${COURSES_API}/${id}`);
  return data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateCourse = async (course: any) => {
  const { data } = await axiosWithCredentials.put(`${COURSES_API}/${course._id}`, course);
  return data;
};

// Modules
export const findModulesForCourse = async (courseId: string) => {
  const { data } = await axios.get(`${COURSES_API}/${courseId}/modules`);
  return data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createModuleForCourse = async (courseId: string, module: any) => {
  const { data } = await axiosWithCredentials.post(`${COURSES_API}/${courseId}/modules`, module);
  return data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateModule = async (courseId: string, module: any) => {
  const { data } = await axiosWithCredentials.put(`${COURSES_API}/${courseId}/modules/${module._id}`, module);
  return data;
};

export const deleteModule = async (courseId: string, moduleId: string) => {
  const { data } = await axiosWithCredentials.delete(`${COURSES_API}/${courseId}/modules/${moduleId}`);
  return data;
};

// Assignments
export const findAssignmentsForCourse = async (courseId: string) => {
  const { data } = await axios.get(`${COURSES_API}/${courseId}/assignments`);
  return data;
};

export const findAssignmentById = async (assignmentId: string) => {
  const { data } = await axios.get(`${ASSIGNMENTS_API}/${assignmentId}`);
  return data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createAssignment = async (courseId: string, assignment: any) => {
  const { data } = await axiosWithCredentials.post(`${COURSES_API}/${courseId}/assignments`, assignment);
  return data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateAssignment = async (assignment: any) => {
  const { data } = await axiosWithCredentials.put(`${ASSIGNMENTS_API}/${assignment._id}`, assignment);
  return data;
};

export const deleteAssignment = async (assignmentId: string) => {
  const { data } = await axiosWithCredentials.delete(`${ASSIGNMENTS_API}/${assignmentId}`);
  return data;
};

// Enrollments
export const findEnrollmentsForUser = async (userId: string) => {
  const { data } = await axiosWithCredentials.get(`${ENROLLMENTS_API}/user/${userId}`);
  return data;
};

export const findAllEnrollments = async () => {
  const { data } = await axiosWithCredentials.get(ENROLLMENTS_API);
  return data;
};

export const enrollInCourse = async (userId: string, courseId: string) => {
  const { data } = await axiosWithCredentials.post(ENROLLMENTS_API, { userId, courseId });
  return data;
};

export const enrollIntoCourse = async (userId: string, courseId: string) => {
  const { data } = await axiosWithCredentials.post(`${USERS_API}/${userId}/courses/${courseId}`);
  return data;
};

export const unenrollFromCourse = async (userId: string, courseId: string) => {
  const { data } = await axiosWithCredentials.delete(`${USERS_API}/${userId}/courses/${courseId}`);
  return data;
};

// Users
export const findUsersForCourse = async (courseId: string) => {
  const { data } = await axios.get(`${COURSES_API}/${courseId}/users`);
  return data;
};

// Piazza - Posts
export const findPostsForCourse = async (courseId: string, folder?: string) => {
  const url = folder ? `${COURSES_API}/${courseId}/posts?folder=${folder}` : `${COURSES_API}/${courseId}/posts`;
  const { data } = await axiosWithCredentials.get(url);
  return data;
};

export const findPostById = async (postId: string) => {
  const { data } = await axiosWithCredentials.get(`${POSTS_API}/${postId}`);
  return data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createPost = async (courseId: string, post: any) => {
  const { data } = await axiosWithCredentials.post(`${COURSES_API}/${courseId}/posts`, post);
  return data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updatePost = async (postId: string, updates: any) => {
  const { data } = await axiosWithCredentials.put(`${POSTS_API}/${postId}`, updates);
  return data;
};

export const deletePost = async (postId: string) => {
  const { data } = await axiosWithCredentials.delete(`${POSTS_API}/${postId}`);
  return data;
};

// Piazza - Answers
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const addAnswer = async (postId: string, answerType: string, answer: any) => {
  const { data } = await axiosWithCredentials.post(`${POSTS_API}/${postId}/answers/${answerType}`, answer);
  return data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateAnswer = async (postId: string, answerType: string, answerId: string, updates: any) => {
  const { data } = await axiosWithCredentials.put(`${POSTS_API}/${postId}/answers/${answerType}/${answerId}`, updates);
  return data;
};

export const deleteAnswer = async (postId: string, answerType: string, answerId: string) => {
  const { data } = await axiosWithCredentials.delete(`${POSTS_API}/${postId}/answers/${answerType}/${answerId}`);
  return data;
};

// Piazza - Discussions
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const addDiscussion = async (postId: string, discussion: any) => {
  const { data } = await axiosWithCredentials.post(`${POSTS_API}/${postId}/discussions`, discussion);
  return data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateDiscussion = async (postId: string, discussionId: string, updates: any) => {
  const { data } = await axiosWithCredentials.put(`${POSTS_API}/${postId}/discussions/${discussionId}`, updates);
  return data;
};

export const deleteDiscussion = async (postId: string, discussionId: string) => {
  const { data } = await axiosWithCredentials.delete(`${POSTS_API}/${postId}/discussions/${discussionId}`);
  return data;
};

export const toggleDiscussionResolved = async (postId: string, discussionId: string, resolved: boolean) => {
  const { data } = await axiosWithCredentials.put(`${POSTS_API}/${postId}/discussions/${discussionId}/resolve`, { resolved });
  return data;
};

// Piazza - Replies
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const addReply = async (postId: string, discussionId: string, reply: any) => {
  const { data } = await axiosWithCredentials.post(`${POSTS_API}/${postId}/discussions/${discussionId}/replies`, reply);
  return data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateReply = async (postId: string, discussionId: string, replyId: string, updates: any) => {
  const { data } = await axiosWithCredentials.put(`${POSTS_API}/${postId}/discussions/${discussionId}/replies/${replyId}`, updates);
  return data;
};

export const deleteReply = async (postId: string, discussionId: string, replyId: string) => {
  const { data } = await axiosWithCredentials.delete(`${POSTS_API}/${postId}/discussions/${discussionId}/replies/${replyId}`);
  return data;
};

// Piazza - Folders
export const findFoldersForCourse = async (courseId: string) => {
  const { data } = await axiosWithCredentials.get(`${COURSES_API}/${courseId}/folders`);
  return data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createFolder = async (courseId: string, folder: any) => {
  const { data } = await axiosWithCredentials.post(`${COURSES_API}/${courseId}/folders`, folder);
  return data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateFolder = async (folderId: string, updates: any) => {
  const { data } = await axiosWithCredentials.put(`${FOLDERS_API}/${folderId}`, updates);
  return data;
};

export const deleteFolder = async (folderId: string) => {
  const { data } = await axiosWithCredentials.delete(`${FOLDERS_API}/${folderId}`);
  return data;
};

export const deleteFolders = async (folderIds: string[]) => {
  const { data } = await axiosWithCredentials.post(`${FOLDERS_API}/delete-multiple`, { folderIds });
  return data;
};

// Piazza - Statistics
export const getClassStats = async (courseId: string) => {
  const { data } = await axiosWithCredentials.get(`${COURSES_API}/${courseId}/stats`);
  return data;
};