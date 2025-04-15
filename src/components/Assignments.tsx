import { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useParams, useNavigate } from 'react-router';
import Button from '@mui/material/Button';

type Assignment = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  createdAt: string;
}

function Assignments() {
  const { classroomId } = useParams<{ classroomId: string }>();
  const navigate = useNavigate();

  console.log(classroomId);

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const token = import.meta.env.VITE_GITHUB_TOKEN;

  const columns: GridColDef[] = [
    { 
      field: 'id', 
      headerName: 'Id', 
      width: 100 },
    { 
      field: 'title', 
      headerName: 'Title', 
      flex: 1 
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Button
          variant="text"
          size="small"
          onClick={() => navigate(`/submissions/${classroomId}/${params.row.id}`)}
        >
          Submissions
        </Button>
      )
    }
  ];

  useEffect(() => {
    setLoading(true);
    fetch(`https://api.github.com/classrooms/${classroomId}/assignments`, {
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
    .then(data => {
      setAssignments(data);
      setError(null);
    })
    .catch(err => {
      console.error('Error fetching assignments:', err);
      setError('Failed to load assignment');
    })
    .finally(() => {
      setLoading(false);
    })}
  , [classroomId, token])

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="classrooms-container">
      <h1>GitHub Assignments: {classroomId}</h1>
      
      {assignments.length === 0 ? (
        <p>No assignments found.</p>
      ) : (
        <div style={{ height: 400, width: '90%' }}>
          <DataGrid
            rows={assignments}
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
      )}
    </div>

  );
};

export default Assignments;