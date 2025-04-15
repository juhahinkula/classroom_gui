import { useState, useEffect } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Button  from '@mui/material/Button';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useNavigate } from 'react-router';

type Classroom = {
  id: number;
  name: string;
  archived: boolean;
  url: string;
  organization_name: string;
  created_at: string;
}

function Classrooms() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const token = import.meta.env.VITE_GITHUB_TOKEN;
  const columns: GridColDef[] = [
    { 
      field: 'id', 
      headerName: 'Id', 
      width: 100 
    },
    { 
      field: 'name', 
      headerName: 'Name', 
      width:250,
      flex: 1 
    },
    { 
      field: 'archived', 
      headerName: 'Arhived', 
      width: 100,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <Button
          variant="text"
          size="small"
          startIcon={<OpenInNewIcon />}
          href={params.row.url}
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
      width: 130,
      renderCell: (params) => (
        <Button
             variant="text"
             size="small"
             onClick={() => navigate(`/assignments/${params.row.id}`)}
           >
             Assignments
        </Button>
      )
    }
  ];

  useEffect(() => {   
    fetch('https://api.github.com/classrooms', {
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
    .then(data => {
      setClassrooms(data);
      setLoading(false);
    })
    .catch(err => {
      setError("Failed to fetch classrooms. Please check your API token and permissions.");
      setLoading(false);
      console.error(err);
    });
  }, [token]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="classrooms-container">
      <h1>GitHub Classrooms</h1>
      
      {classrooms.length === 0 ? (
        <p>No classrooms found.</p>
      ) : (
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={classrooms}
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

export default Classrooms;