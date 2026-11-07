import { TopicItem } from '../data/curriculum';

export type UserRole = 'student' | 'teacher';

export interface UserProfile {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  grade?: number;
  className?: string;
  avatar?: string;
  createdAt: string;
}

export interface CompositionPlan {
  foreground: string;
  midground: string;
  background: string;
}

export interface ArtCritique {
  interestingThings: string;
  composition: string;
  colors: string;
  creativeDetails: string;
  suggestions: string[];
  encouragement: string;
  topicName?: string;
  imageThumbnail?: string;
  createdAt: string;
}

export interface TeacherFeedbackItem {
  id: string;
  teacherId: string;
  teacherName: string;
  comment: string;
  createdAt: string;
}

export interface NotebookItem {
  id: string;
  userId: string;
  studentName: string;
  studentGrade: number;
  studentClass: string;
  title: string;
  grade: number;
  topicName: string;
  topicId?: string;
  mainContent: string;
  charactersAndObjects: string;
  activitiesAndDetails: string;
  composition: CompositionPlan;
  colorSuggestions: string;
  creativeSpark: string;
  materialSuggestions: string;
  studentNotes: string;
  status: 'Ý tưởng mới' | 'Đang phát triển' | 'Đã hoàn thành';
  savedCritique?: ArtCritique | null;
  sharedWithTeacher: boolean;
  teacherFeedbacks: TeacherFeedbackItem[];
  createdAt: string;
  updatedAt: string;
}

export interface Assignment {
  id: string;
  teacherId: string;
  teacherName: string;
  title: string;
  grade: number;
  topics: string[];
  targetClass: string;
  instructions: string;
  deadline?: string;
  createdAt: string;
}

export interface GeneratedIdea {
  title: string;
  mainContent: string;
  charactersAndObjects: string;
  activitiesAndDetails: string;
  composition: {
    foreground: string;
    midground: string;
    background: string;
  };
  colorSuggestions: string;
  creativeSpark: string;
  materialSuggestions: string;
  openEndedQuestion?: string;
}

export interface IdeaGenerationResult {
  ideas: GeneratedIdea[];
  friendlyNote: string;
  guidingQuestions?: string[];
}

export interface ArtReviewResult {
  isArtworkDetected: boolean;
  interestingThings: string;
  composition: string;
  colors: string;
  creativeDetails: string;
  suggestions: string[];
  encouragement: string;
}
