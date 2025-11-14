import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });

// Use one consistent server URL
const REMOTE_SERVER = process.env.NEXT_PUBLIC_REMOTE_SERVER || process.env.NEXT_PUBLIC_HTTP_SERVER;
const COURSES_API = `${REMOTE_SERVER}/api/courses`;
const USERS_API = `${REMOTE_SERVER}/api/users`;
const MODULES_API = `${REMOTE_SERVER}/api/modules`;
const ASSIGNMENTS_API = `${REMOTE_SERVER}/api/assignments`;
const ENROLLMENTS_API = `${REMOTE_SERVER}/api/enrollments`;

// Debug log to verify URLs
console.log("Client API URLs:", {
  REMOTE_SERVER,
  ENROLLMENTS_API,
  COURSES_API
});

// ============ ENROLLMENT FUNCTIONS ============
// Enroll a user in a course
export const enrollInCourse = async (userId: string, courseId: string) => {
  const response = await axiosWithCredentials.post(ENROLLMENTS_API, {
    userId,
    courseId,
  });
  return response.data;
};

// Unenroll a user from a course
export const unenrollFromCourse = async (userId: string, courseId: string) => {
  try {
    const response = await axiosWithCredentials.delete(
      `${ENROLLMENTS_API}/${userId}/${courseId}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error unenrolling from course:", error.response || error);
    throw error;
  }
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

export const updateModule = async (module: any) => {
  const { data } = await axiosWithCredentials.put(`${MODULES_API}/${module._id}`, module);
  return data;
};

export const deleteModule = async (moduleId: string) => {
  const response = await axiosWithCredentials.delete(`${MODULES_API}/${moduleId}`);
  return response.data;
};

// ============ ASSIGNMENT FUNCTIONS ============
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
  const { data } = await axiosWithCredentials.put(`${ASSIGNMENTS_API}/${assignment._id}`, assignment);
  return data;
};

export const deleteAssignment = async (assignmentId: string) => {
  const response = await axiosWithCredentials.delete(`${ASSIGNMENTS_API}/${assignmentId}`);
  return response.data;
};

export const findAssignmentById = async (assignmentId: string) => {
  const response = await axios.get(`${ASSIGNMENTS_API}/${assignmentId}`);
  return response.data;
};