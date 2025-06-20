import axios from 'axios';
import { authHeader } from './AuthService';

const API_BASE = 'http://localhost:5293/api/admin/teachers';
//get all teachers
export const getTeachers = () =>
  axios.get(API_BASE, { headers: authHeader() });

//get teacher by id
export const getTeachersById = (id) =>
    axios.get(`${API_BASE}/${id}`, { headers: authHeader() });
        
//create a new teacher
export const createTeacher = (data) =>
  axios.post(API_BASE, data, { headers: authHeader() });
//update existing teacher
export const updateTeacher = (id, data) =>
  axios.put(`${API_BASE}/${id}`, data, { headers: authHeader() });

//delete teacher by 
export const deleteTeacher = (id) =>
  axios.delete(`${API_BASE}/${id}`, { headers: authHeader() });
