import { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useParams } from 'react-router';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CodeEditor from './CodeEditor';
import { Submission, SubmissionResponse } from '../types';
import { useNavigate } from "react-router";

export default function Submissions() {
  const params = useParams();
  const classroomId = params.classroomId as string;
  const assignmentId = params.assignmentId as string;

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [repositoryUrl, setRepositoryUrl] = useState("");
  const [studentCode, setStudentCode] = useState("");
  const [path, setPath] = useState(import.meta.env.VITE_PATH_NAME);

  const token = import.meta.env.VITE_GITHUB_TOKEN;

  const navigate = useNavigate();

  const columns: GridColDef[] = [
    { 
      field: 'id', 
      headerName: 'ID', 
      width: 100 
    },
    { 
      field: 'studentName', 
      headerName: 'Student', 
      width: 190,
    },
    { 
      field: 'studentLogin', 
      headerName: 'Student login', 
      width: 200,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 130,
      renderCell: (params) => (
        <Button
          variant="text"
          size="small"
          startIcon={<OpenInNewIcon />}
          href={params.row.repository}
          target="_blank"
          rel="noopener noreferrer"
        >
          View
        </Button>
      )
    },
    {
      field: 'actions2',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <Button
          variant="text"
          size="small"
          onClick={() => {
            fetchFileContent(params.row.repositoryName)
              .then(() => setRepositoryUrl(params.row.repository))
              .then(() => setShowCodeEditor(true));
          }}
        >
          Code
        </Button>
      )
    }
  ];

  useEffect(() => {
    setLoading(true);
    fetch(`https://api.github.com/assignments/${assignmentId}/accepted_assignments`, {
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
    .then(data => {
      const flattenedData: Submission[] = data.map((submission: SubmissionResponse)  => {
        return {
          ...submission,
          repository: submission.repository.html_url,
          repositoryName: submission.repository.name,
          studentName: submission.students && submission.students.length > 0 ? 
                       submission.students[0].name : null,
          studentLogin: submission.students && submission.students.length > 0 ? 
                        submission.students[0].login : null
 
        };
      });
    
      setSubmissions(flattenedData);
      setError(null);
    })
    .catch(err => {
      console.error('Error fetching submissions:', err);
      setError('Failed to load submissions');
    })
    .finally(() => {
      setLoading(false);
    });
  }, [assignmentId, token]);

  function fetchFileContent(repo_name: string, filePath?: string) {  
    const owner = import.meta.env.VITE_OWNER_ORGANIZATION;
    const branch = 'main';
    const pathToFetch = filePath || path;
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
      .then(data => {
        const content = atob(data.content);
        setStudentCode(content);
      })
      .catch(error => {
        console.error('Error fetching file content:', error);
        throw error;
      });
  }  

  const closeCodeEditor = () => {
    setShowCodeEditor(false);
  }

  if (loading) return <div>Loading submissions...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="submissions-container">   
      <h3>Assignment Submissions: Classroom ID {classroomId} | Assignment ID {assignmentId}</h3>
        
      {submissions.length === 0 ? (
        <p>No submissions found.</p>
      ) : (
        <>
          <Stack mb={2} spacing={2} alignItems="flex-start">
            <Button onClick={() => navigate(-1)}>Back</Button>
            <TextField
              sx={{ width: 300}} 
              label="File path"
              value={path}
              onChange={event => setPath(event.target.value)}
            />
          </Stack>
          <div style={{ height: 400, width: '90%' }}>
            <DataGrid
              rows={submissions}
              columns={columns}
              pageSizeOptions={[5, 10, 25]}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10, page: 0 },
                },
              }}
              disableRowSelectionOnClick
            />
          </div>
        </>
      )}    
      <CodeEditor 
        open={showCodeEditor} 
        onClose={closeCodeEditor} 
        code={studentCode}
        repositoryUrl={repositoryUrl}
      />
    </div>
  );
}