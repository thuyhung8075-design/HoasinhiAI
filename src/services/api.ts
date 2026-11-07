import {
  UserProfile,
  NotebookItem,
  Assignment,
  IdeaGenerationResult,
  ArtReviewResult,
} from '../types';

const TOKEN_KEY = 'hoasini_auth_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null): void {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Yêu cầu thất bại (${response.status})`);
  }

  return data as T;
}

// Authentication
export async function apiLogin(credentials: {
  username: string;
  password: string;
}): Promise<{ token: string; user: UserProfile }> {
  const res = await request<{ token: string; user: UserProfile }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  setStoredToken(res.token);
  return res;
}

// Student passwordless login
export async function apiStudentLogin(data: {
  name?: string;
  grade?: number;
  className?: string;
  avatar?: string;
  studentId?: string;
}): Promise<{ token: string; user: UserProfile }> {
  const res = await request<{ token: string; user: UserProfile }>('/api/auth/student-login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  setStoredToken(res.token);
  return res;
}

export async function apiGetPublicStudents(): Promise<{ students: UserProfile[] }> {
  return request<{ students: UserProfile[] }>('/api/auth/public-students');
}

export async function apiRegister(data: {
  username: string;
  password: string;
  name: string;
  grade: number;
  className: string;
  avatar?: string;
}): Promise<{ token: string; user: UserProfile }> {
  const res = await request<{ token: string; user: UserProfile }>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  setStoredToken(res.token);
  return res;
}

export async function apiGetMe(): Promise<{ user: UserProfile }> {
  return request<{ user: UserProfile }>('/api/auth/me');
}

export async function apiLogout(): Promise<void> {
  try {
    await request('/api/auth/logout', { method: 'POST' });
  } finally {
    setStoredToken(null);
  }
}

// Teacher Student Management
export async function apiTeacherCreateStudent(data: {
  username: string;
  password: string;
  name: string;
  grade: number;
  className: string;
  avatar?: string;
}): Promise<{ success: boolean; user: UserProfile }> {
  return request('/api/auth/teacher/create-student', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function apiTeacherGetStudents(): Promise<{ students: UserProfile[] }> {
  return request('/api/auth/teacher/students');
}

// Gemini AI Ideas
export async function apiGenerateIdeas(params: {
  grade: number;
  topicName: string;
  studentWish?: string;
  previousTitles?: string[];
}): Promise<IdeaGenerationResult> {
  return request<IdeaGenerationResult>('/api/ideas/generate', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// Gemini AI Art Review (Soi tranh)
export async function apiReviewArtwork(params: {
  imageBase64: string;
  mimeType?: string;
  topicName?: string;
  grade?: number;
  studentDescription?: string;
}): Promise<ArtReviewResult> {
  return request<ArtReviewResult>('/api/art/review', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// Notebook (Sổ tay sáng tạo)
export async function apiGetNotebook(): Promise<{ items: NotebookItem[] }> {
  return request<{ items: NotebookItem[] }>('/api/notebook');
}

export async function apiSaveNotebookItem(
  data: Partial<NotebookItem>
): Promise<{ success: boolean; item: NotebookItem }> {
  return request<{ success: boolean; item: NotebookItem }>('/api/notebook', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function apiUpdateNotebookItem(
  id: string,
  data: Partial<NotebookItem>
): Promise<{ success: boolean; item: NotebookItem }> {
  return request<{ success: boolean; item: NotebookItem }>(`/api/notebook/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function apiDeleteNotebookItem(id: string): Promise<{ success: boolean }> {
  return request<{ success: boolean }>(`/api/notebook/${id}`, {
    method: 'DELETE',
  });
}

// Assignments
export async function apiGetAssignments(grade?: number): Promise<{ assignments: Assignment[] }> {
  const query = grade ? `?grade=${grade}` : '';
  return request<{ assignments: Assignment[] }>(`/api/assignments${query}`);
}

export async function apiCreateAssignment(data: {
  title: string;
  grade: number;
  topics: string[];
  targetClass: string;
  instructions: string;
  deadline?: string;
}): Promise<{ success: boolean; assignment: Assignment }> {
  return request<{ success: boolean; assignment: Assignment }>('/api/assignments', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function apiDeleteAssignment(id: string): Promise<{ success: boolean }> {
  return request<{ success: boolean }>(`/api/assignments/${id}`, {
    method: 'DELETE',
  });
}

// Teacher submissions & feedback
export async function apiTeacherGetSubmissions(): Promise<{ submissions: NotebookItem[] }> {
  return request<{ submissions: NotebookItem[] }>('/api/teacher/submissions');
}

export async function apiTeacherAddFeedback(params: {
  itemId: string;
  comment: string;
}): Promise<{ success: boolean; item: NotebookItem }> {
  return request<{ success: boolean; item: NotebookItem }>('/api/teacher/feedback', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// System Status
export async function apiGetSystemStatus(): Promise<{
  appName: string;
  status: string;
  hasGeminiKey: boolean;
  currentTime: string;
}> {
  return request('/api/system/status');
}
