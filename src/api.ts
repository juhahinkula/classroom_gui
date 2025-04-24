import { Assignment, Classroom, Submission } from "./types";

const token = import.meta.env.VITE_GITHUB_TOKEN;

export const fetchClassrooms = (): Promise<Classroom[]> => {
  return fetch('https://api.github.com/classrooms', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.classroom-preview+json'
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
}

// Fetch assignments by classroom
export function fetchAssignments(classroomId: string): Promise<Assignment[]> {
  return fetch(`https://api.github.com/classrooms/${classroomId}/assignments`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.classroom-preview+json'
    }
  })
  .then(response => {
    if (!response.ok) 
      throw new Error('Failed to fetch assignments');
      
    return response.json();
  })
}

// Fetch submissions by assignment
export function fetchSubmissions(assignmentId: string): Promise<Submission[]> {
  return fetch(`https://api.github.com/assignments/${assignmentId}/grades`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json'
    }
  })
  .then(response => {
    if (!response.ok) 
      throw new Error('Failed to fetch submissions');
      
    return response.json();
  })
}

// Fetch file content from the Github API
// If filePath is not passed, value from the .env is used
export function fetchFileContent(repo_name: string, filePath?: string) {  
  const owner = import.meta.env.VITE_OWNER_ORGANIZATION;
  const branch = 'main';
  const pathToFetch = filePath || import.meta.env.VITE_PATH_NAME;
  const url = `https://api.github.com/repos/${owner}/${repo_name}/contents/${pathToFetch}?ref=${branch}`;
  
  return fetch(url, 
    { 
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Github API error: ${response.status}`);
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error fetching file content:', error);
      throw error;
    });
}  