export type Student = {
  id: number,
  login: string;
  name: string;
  avatar_url: string;
  html_url: string
}

export type SubmissionResponse = {
  id: number;
  submitted: boolean;
  passing: boolean;
  commit_count: number;
  grade: number | null;
  students: Student[],
  repository: {
    id: number;
    name: string;
    full_name: string;
    html_url: string;
    private: boolean;
    default_branch: string;
  }
}

export type Submission = {
  id: string;
  repository: string;
  repositoryName: string;
  studentName: string;
  studentLogin: string;
}
