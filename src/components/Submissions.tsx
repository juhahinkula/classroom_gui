import { useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useParams } from 'react-router';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CodeEditor from './CodeEditor';
import { SubmissionResponse } from '../types';
import { useNavigate } from "react-router";
import { fetchFileContent } from '../api';
import { useQuery } from '@tanstack/react-query';
import { fetchSubmissions } from '../api';

export default function Submissions() {
  const params = useParams();
  const classroomId = params.classroomId as string;
  const assignmentId = params.assignmentId as string;

  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [repositoryUrl, setRepositoryUrl] = useState("");
  const [repositoryName, setRepositoryName] = useState("");
  const [studentCode, setStudentCode] = useState("");
  const [path, setPath] = useState(import.meta.env.VITE_PATH_NAME);

  const navigate = useNavigate();

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['assignments', assignmentId], 
    queryFn: () => fetchSubmissions(assignmentId),
    select: (data) => {
        const items = data.map(
          (submission: SubmissionResponse) => ({
            ...submission,
            repository: submission.repository.html_url,
            repositoryName: submission.repository.name,
            studentName: submission.students && submission.students.length > 0 ? 
                        submission.students[0].name : null,
            studentLogin: submission.students && submission.students.length > 0 ? 
                          submission.students[0].login : null
          })
        );
        return items;
      }  
  });  

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
            getFileContent(params.row.repositoryName, path);
            setRepositoryUrl(params.row.repository);
            setRepositoryName(params.row.repositoryName);
            setShowCodeEditor(true);
          }}
        >
          Code
        </Button>
      )
    }
  ];

  function getFileContent(repo_name: string, filePath?: string) {  
    if (!filePath)
      setStudentCode("Select a file to show");
    else {
      fetchFileContent(repo_name, filePath)
      .then(data => {
        const content = atob(data.content);
        setStudentCode(content);
      })
      .catch(error => {
        console.error('Error fetching file content:', error);
        throw error;
      });
    }
    }  

  const closeCodeEditor = () => {
    setShowCodeEditor(false);
  }

  if (isPending) return <div>Loading submissions...</div>;
  if (isError) return <div className="error">{error.message}</div>;

  return (
    <div className="submissions-container">   
      <h3>Assignment Submissions: Classroom ID {classroomId} | Assignment ID {assignmentId}</h3>
        
      {data.length === 0 ? (
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
              rows={data}
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
        repositoryName={repositoryName}
      />
    </div>
  );
}