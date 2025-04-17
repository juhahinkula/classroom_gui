import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useParams, useNavigate } from 'react-router';
import Button from '@mui/material/Button';
import { useQuery } from '@tanstack/react-query';
import { fetchAssignments } from '../api';

function Assignments() {
  const { classroomId } = useParams<{ classroomId: string }>();
  const navigate = useNavigate();

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['assignments'], 
    queryFn: () => fetchAssignments(classroomId!)
  });  

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

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div className="error">{error.message}</div>;

  return (
    <div className="classrooms-container">
      <h1>GitHub Assignments: {classroomId}</h1>
      
      {data.length === 0 ? (
        <p>No assignments found.</p>
      ) : (
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
      )}
    </div>

  );
};

export default Assignments;