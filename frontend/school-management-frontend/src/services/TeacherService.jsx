// services/TeacherService.js

import axios from 'axios';
import { authHeader } from './AuthService';

const BASE_URL = 'http://localhost:5293/api';
const ADMIN_TEACHER_URL = `${BASE_URL}/admin/teachers`;
const ADMIN_COURSE_URL = `${BASE_URL}/admin/courses`;
const ASSIGN_COURSE_URL = `${BASE_URL}/admin/assign-courses`;
const TEACHER_API_URL = `${BASE_URL}/teacher`;

// ✅ ADMIN SIDE - TEACHERS CRUD
export const getTeachers = () =>
  axios.get(ADMIN_TEACHER_URL, { headers: authHeader() });

export const getTeacherById = (id) =>
  axios.get(`${ADMIN_TEACHER_URL}/${id}`, { headers: authHeader() });

export const createTeacher = (data) =>
  axios.post(ADMIN_TEACHER_URL, data, { headers: authHeader() });

export const updateTeacher = (id, data) =>
  axios.put(`${ADMIN_TEACHER_URL}/${id}`, data, { headers: authHeader() });

export const deleteTeacher = (id) =>
  axios.delete(`${ADMIN_TEACHER_URL}/${id}`, { headers: authHeader() });

// ✅ ADMIN SIDE - COURSE ASSIGNMENT
export const getAllCourses = () =>
  axios.get(ADMIN_COURSE_URL, { headers: authHeader() });

export const assignCoursesToTeacher = (data) =>
  axios.post(ASSIGN_COURSE_URL, data, {
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
  });

// ✅ TEACHER SIDE - VIEW COURSES
export const getAssignedCourses = () =>
  axios.get(`${TEACHER_API_URL}/courses`, { headers: authHeader() });
