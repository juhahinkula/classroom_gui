export type Classroom = {
  id: string;
  name: string;
  archived: boolean;
  url: string;
  organization_name?: string;
  created_at?: string;
}

export type Assignment = {
  id: string;
  title: string;
  deadline: string;
  submissions: number;
  classroom: Classroom;
}

export type Student = {
  id: number,
  login: string;
  name: string;
  avatar_url: string;
  html_url: string
}

export type Submission = {
  assignment_name: string;
  assignment_url: string;
  starter_code_url: string;
  github_username: string;
  roster_identifier: string;
  student_repository_name: string;
  student_repository_url: string;
  points_awarded: string;
  submission_timestamp: string;
  points_available: string;
}
