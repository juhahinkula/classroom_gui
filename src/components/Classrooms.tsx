import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Button  from '@mui/material/Button';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { fetchClassrooms } from '../api';

function Classrooms() {
  const navigate = useNavigate();

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['classrooms'], 
    queryFn: fetchClassrooms
  });  

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

  if (isPending) return <div>Loading classrooms...</div>;
  if (isError) return <div className="error">{error.message}</div>;

  return (
    <div className="classrooms-container">
      <h1>GitHub Classrooms</h1>
      
      {data.length === 0 ? (
        <p>No classrooms found.</p>
      ) : (
        <div style={{ height: 400, width: '100%' }}>
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
      )}
    </div>
  );
};

export default Classrooms;