import { supabase } from './supabase';

const API_URL = 'http://localhost:3000/api';

const getAuthHeaders = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session?.access_token || ''}`
  };
};

export const fetchStudentDashboard = async () => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/student/dashboard`, { headers });
  if (!response.ok) throw new Error('Failed to fetch dashboard');
  return response.json();
};

export const fetchFacultyCourses = async () => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/faculty/courses`, { headers });
  if (!response.ok) throw new Error('Failed to fetch courses');
  return response.json();
};

export const fetchAdminData = async () => {
  const headers = await getAuthHeaders();
  const [users, courses] = await Promise.all([
    fetch(`${API_URL}/admin/users`, { headers }).then(res => res.json()),
    fetch(`${API_URL}/admin/courses`, { headers }).then(res => res.json())
  ]);
  return { users, courses };
};
