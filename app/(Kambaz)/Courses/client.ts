import axios from "axios";
import { HTTP_SERVER } from "../Account/client";
const axiosWithCredentials = axios.create({ withCredentials: true });

// Use one consistent server URL
const REMOTE_SERVER = process.env.NEXT_PUBLIC_REMOTE_SERVER || process.env.NEXT_PUBLIC_HTTP_SERVER;
const COURSES_API = `${REMOTE_SERVER}/api/courses`;
const USERS_API = `${REMOTE_SERVER}/api/users`;
const MODULES_API = `${REMOTE_SERVER}/api/modules`;
const ASSIGNMENTS_API = `${REMOTE_SERVER}/api/assignments`; // Add this line
const ENROLLMENTS_API = `${REMOTE_SERVER}/api/enrollments`;

// Debug log to verify URLs
console.log("Client API URLs:", {
  REMOTE_SERVER,
  ENROLLMENTS_API,
  COURSES_API
});

// ============ QUIZ FUNCTIONS ============
const QUIZZES_API = `${REMOTE_SERVER}/api/quizzes`;

export const findQuizzesForCourse = async (courseId: string) => {
  const response = await axios.get(`${COURSES_API}/${courseId}/quizzes`);
  return response.data;
};

export const createQuizForCourse = async (courseId: string, quiz: any) => {
  const response = await axiosWithCredentials.post(
    `${COURSES_API}/${courseId}/quizzes`,
    quiz
  );
  return response.data;
};

export const updateQuiz = async (quiz: any) => {
  const response = await axiosWithCredentials.put(
    `${QUIZZES_API}/${quiz._id}`,
    quiz
  );
  return response.data;
};

export const deleteQuiz = async (quizId: string) => {
  const response = await axiosWithCredentials.delete(
    `${QUIZZES_API}/${quizId}`
  );
  return response.data;
};

export const findQuizById = async (quizId: string) => {
  const response = await axios.get(`${QUIZZES_API}/${quizId}`);
  return response.data;
};

// Quiz Questions
export const addQuestionToQuiz = async (quizId: string, question: any) => {
  const response = await axiosWithCredentials.post(
    `${QUIZZES_API}/${quizId}/questions`,
    question
  );
  return response.data;
};

export const updateQuestion = async (quizId: string, questionId: string, question: any) => {
  const response = await axiosWithCredentials.put(
    `${QUIZZES_API}/${quizId}/questions/${questionId}`,
    question
  );
  return response.data;
};

export const deleteQuestion = async (quizId: string, questionId: string) => {
  const response = await axiosWithCredentials.delete(
    `${QUIZZES_API}/${quizId}/questions/${questionId}`
  );
  return response.data;
};

// Quiz Attempts
export const submitQuizAttempt = async (quizId: string, attempt: any) => {
  const response = await axiosWithCredentials.post(
    `${QUIZZES_API}/${quizId}/attempts`,
    attempt
  );
  return response.data;
};

export const getLatestAttempt = async (quizId: string, userId: string) => {
  const response = await axios.get(
    `${QUIZZES_API}/${quizId}/attempts/${userId}/latest`
  );
  return response.data;
};

export const getAttemptsByUserAndQuiz = async (quizId: string, userId: string) => {
  const response = await axios.get(
    `${QUIZZES_API}/${quizId}/attempts/${userId}`
  );
  return response.data;
};

// ============ ENROLLMENT FUNCTIONS ============
// Enroll a user in a course
export const enrollInCourse = async (userId: string, courseId: string) => {
  const response = await axiosWithCredentials.post(ENROLLMENTS_API, {
    userId,
    courseId,
  });
  return response.data;
};

// Get all enrollments for a specific user
export const findEnrollmentsForUser = async (userId: string) => {
  try {
    console.log("Fetching enrollments for user:", userId);
    console.log("URL:", `${ENROLLMENTS_API}/user/${userId}`);
    const response = await axiosWithCredentials.get(`${ENROLLMENTS_API}/user/${userId}`);
    console.log("Enrollments response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching enrollments:");
    console.error("Full error:", error);
    console.error("Error message:", error.message);
    console.error("Error response:", error.response);
    console.error("Error status:", error.response?.status);
    console.error("Error data:", error.response?.data);
    
    // Return empty array instead of throwing to prevent app crash
    return [];
  }
};

// Get all enrollments (if needed for admin purposes)
export const findAllEnrollments = async () => {
  const response = await axiosWithCredentials.get(ENROLLMENTS_API);
  return response.data;
};

// ============ COURSE FUNCTIONS ============
export const fetchAllCourses = async () => {
  const { data } = await axios.get(COURSES_API);
  return data;
};

export const findMyCourses = async () => {
  const { data } = await axiosWithCredentials.get(`${USERS_API}/current/courses`);
  return data;
};

export const createCourse = async (course: any) => {
  const { data } = await axiosWithCredentials.post(`${USERS_API}/current/courses`, course);
  return data;
};

export const deleteCourse = async (id: string) => {
  const { data } = await axiosWithCredentials.delete(`${COURSES_API}/${id}`);
  return data;
};

export const updateCourse = async (course: any) => {
  const { data } = await axiosWithCredentials.put(`${COURSES_API}/${course._id}`, course);
  return data;
};

// ============ MODULE FUNCTIONS ============
export const findModulesForCourse = async (courseId: string) => {
  const response = await axios.get(`${COURSES_API}/${courseId}/modules`);
  return response.data;
};

export const createModuleForCourse = async (courseId: string, module: any) => {
  const response = await axiosWithCredentials.post(
    `${COURSES_API}/${courseId}/modules`,
    module
  );
  return response.data;
};

export const updateModule = async (courseId: string, module: any) => {
 const { data } = await axios.put(
   `${COURSES_API}/${courseId}/modules/${module._id}`,
   module
 );
 return data;
};


export const deleteModule = async (courseId: string, moduleId: string) => {
 const response = await axios.delete(
   `${COURSES_API}/${courseId}/modules/${moduleId}`
 );
 return response.data;
};


// ============ ASSIGNMENT FUNCTIONS ============
// In your client.ts file
export const findAssignmentsForCourse = async (courseId: string) => {
  const response = await axios.get(`${COURSES_API}/${courseId}/assignments`);
  return response.data;
};

export const createAssignmentForCourse = async (courseId: string, assignment: any) => {
  const response = await axiosWithCredentials.post(
    `${COURSES_API}/${courseId}/assignments`,
    assignment
  );
  return response.data;
};

export const updateAssignment = async (assignment: any) => {
  const response = await axiosWithCredentials.put(
    `${ASSIGNMENTS_API}/${assignment._id}`,
    assignment
  );
  return response.data;
};

export const deleteAssignment = async (assignmentId: string) => {
  const response = await axiosWithCredentials.delete(
    `${ASSIGNMENTS_API}/${assignmentId}`
  );
  return response.data;
};

export const findAssignmentById = async (assignmentId: string) => {
  const response = await axios.get(
    `${ASSIGNMENTS_API}/${assignmentId}` 
  );
  return response.data;
};

export const enrollIntoCourse = async (userId: string, courseId: string) => {
  const response = await axiosWithCredentials.post(`${USERS_API}/${userId}/courses/${courseId}`);
  return response.data;
};

export const unenrollFromCourse = async (userId: string, courseId: string) => {
  const response = await axiosWithCredentials.delete(`${USERS_API}/${userId}/courses/${courseId}`);
  return response.data;
};

export const findUsersForCourse = async (courseId: string) => {
  const response = await axios.get(`${COURSES_API}/${courseId}/users`);
  return response.data;
};