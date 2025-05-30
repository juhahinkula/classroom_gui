import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
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
      renderCell: (params: GridRenderCellParams) => (
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

  if (isPending) return <div>Loading assignments...</div>;
  if (isError) return <div className="error">{error.message}</div>;

  // Download invitation links as CSV
  const handleDownloadCsv = () => {
    if (!data || data.length === 0) return;
    type AssignmentWithInvite = typeof data[number] & { invitation_url?: string; invite_link?: string };
    type CsvRow = { Title: string; InvitationLink: string };
    const rows: CsvRow[] = (data as AssignmentWithInvite[])
      .map((a) => ({
        Title: a.title,
        InvitationLink: a.invitation_url || a.invite_link || ''
      }))
      .sort((a, b) => a.Title.localeCompare(b.Title));
    const header = ["Assignment", "InvitationLink"];
    const csv = [
      header.join(','),
      ...rows.map(row => header.map(h => `"${row[h as keyof CsvRow].replace(/"/g, '""')}"`).join(','))
    ].join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `assignments_${classroomId}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="classrooms-container">
      <h1>GitHub Assignments: {classroomId}</h1>
      <Button variant="contained" onClick={handleDownloadCsv} sx={{ mb: 2 }}>
        Download Invitation links
      </Button>
      
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