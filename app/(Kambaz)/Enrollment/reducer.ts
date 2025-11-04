import { createSlice } from "@reduxjs/toolkit";
import { enrollments as initialEnrollments } from "../Database";
import { v4 as uuidv4 } from "uuid";

const initialState = {
  enrollments: initialEnrollments,
  showAllCourses: false,
};

const enrollmentsSlice = createSlice({
  name: "enrollments",
  initialState,
  reducers: {
    enrollInCourse: (state, action) => {
      const { userId, courseId } = action.payload;
      const newEnrollment = {
        _id: uuidv4(),
        user: userId,
        course: courseId,
      };
      state.enrollments = [...state.enrollments, newEnrollment] as any;
    },
    unenrollFromCourse: (state, action) => {
      const { userId, courseId } = action.payload;
      state.enrollments = state.enrollments.filter(
        (e: any) => !(e.user === userId && e.course === courseId)
      );
    },
    toggleShowAllCourses: (state) => {
      state.showAllCourses = !state.showAllCourses;
    },
    setEnrollments: (state, action) => {
      state.enrollments = action.payload;
    },
  },
});

export const { enrollInCourse, unenrollFromCourse, toggleShowAllCourses, setEnrollments } =
  enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;