import { useState } from 'react';
import { DataGrid, GridColDef, Toolbar, ExportCsv, ToolbarButton } from '@mui/x-data-grid';
import { useParams } from 'react-router';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CodeEditor from './CodeEditor';
import { useNavigate } from "react-router";
import { fetchFileContent } from '../api';
import { useQuery } from '@tanstack/react-query';
import { fetchSubmissions } from '../api';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Submission } from '../types';

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
  });  

  function CustomToolbar() {
    return (
      <Toolbar>
        <Tooltip title="Download as CSV">
          <ExportCsv render={<ToolbarButton />}>
            <FileDownloadIcon fontSize="small" />
          </ExportCsv>
        </Tooltip>
      </Toolbar>
    );
  }  

  const columns: GridColDef<Submission>[] = [
    { 
      field: 'github_username', 
      headerName: 'Student', 
      width: 150,
    },
    { 
      field: 'roster_identifier', 
      headerName: 'Roster ID', 
      width: 150,
    },
    {
      field: 'submission_timestamp', 
      headerName: 'Submitted', 
      width: 180,
    },
    { 
      field: 'points_awarded', 
      headerName: 'Points', 
      width: 80,
    },

    {
      field: 'actions',
      headerName: 'Actions',
      disableExport: true,
      width: 110,
      renderCell: (params) => (
        <Button
          variant="text"
          size="small"
          startIcon={<OpenInNewIcon />}
          href={params.row.student_repository_url}
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
      disableExport: true,
      width: 110,
      renderCell: (params) => (
        <Button
          variant="text"
          size="small"
          onClick={() => {
            getFileContent(params.row.student_repository_name, path);
            setRepositoryUrl(params.row.student_repository_url);
            setRepositoryName(params.row.student_repository_name);
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
      <h3>Assignment Submissions: Classroom ID {classroomId} | Assignment {assignmentId} {data && data[0].assignment_name}</h3>
        
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
          <div style={{ height: 400, width: '95%' }}>
            <DataGrid
              rows={data}
              columns={columns}
              slots={{ toolbar: CustomToolbar }}
              showToolbar
              getRowId={data => data.student_repository_name}
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