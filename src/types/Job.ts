export interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  postedDate: string;
  description: string;
  salary: number;
  keywords: string[];
  level: string;
  experience: number;
  responsibilities: string[];
  requirements: string[];
  deadline: Date;
}
