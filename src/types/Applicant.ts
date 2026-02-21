export type ApplicantStatus =
  | "applied"
  | "reviewing"
  | "interview"
  | "hired"
  | "rejected";
export interface Applicant {
  _id: string;
  name: string;
  email: string;
  phone?: string;                     // optional
  status?: ApplicantStatus;           // optional
  appliedDate?: string;               // optional, ISO date string
  experience: number;
  keywords: string[];
  resumeUrl: string;
  skills?: string[];
  notes?: { id: string; text: string; author: string }[];
  matchScore?: number;
}