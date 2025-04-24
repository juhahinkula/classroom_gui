import { useState, useEffect } from "react"
import { useQuery, useQueries } from "@tanstack/react-query"
import { useParams } from "react-router"
import Button from "@mui/material/Button"
import { fetchAssignments, fetchSubmissions } from "../api"
import { Assignment, Submission } from "../types"
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid"
import CustomToolbar from "./CustomToolbar"

type StudentSummary = {
  github_username: string
  submittedAssignments: {
    assignmentId: string
    assignmentTitle: string
    submissionTimestamp?: string
    pointsAwarded?: string
    pointsAvailable?: string
    studentRepositoryUrl?: string
  }[]
}

const ClassReport = () => {
  const { classroomId } = useParams<{ classroomId: string }>()
  const [studentSummaries, setStudentSummaries] = useState<
    Record<string, StudentSummary>
  >({})
  const [isProcessingSubmissions, setIsProcessingSubmissions] = useState(false)

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 40 },
    { field: "github_username", headerName: "GitHub Username", width: 150 },
    { field: "assignmentTitle", headerName: "Assignment", width: 180 },
    {
      field: "submissionTimestamp",
      headerName: "Submitted At",
      width: 160,
    },
    {
      field: "grade",
      headerName: "Grade",
      width: 70,
    },
    {
        field: "gradeAvailable",
        headerName: "Available",
        width: 80,
      },  
    {
      field: "studentRepositoryUrl",
      headerName: "Repository",
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Button
          variant="text"
          size="small"
          href={params.value}
          target="_blank"
          rel="noopener noreferrer"
        >
          View
        </Button>
      ),
    },
  ]

  const {
    data: assignments,
    isLoading: isLoadingAssignments,
    error: errorAssignments,
    isSuccess: isAssignmentsSuccess,
  } = useQuery<Assignment[], Error>({
    queryKey: ["assignments", classroomId],
    queryFn: () => fetchAssignments(classroomId!),
    enabled: !!classroomId,
  })

  console.log(studentSummaries)

  const rows = Object.entries(studentSummaries).flatMap(
    ([studentId, summary]) => {
      return summary.submittedAssignments.map((assignment, index) => {
        return {
          id: `${studentId}-${index}`,
          github_username: summary.github_username,
          assignmentTitle: assignment.assignmentTitle,
          submissionTimestamp: assignment.submissionTimestamp,
          grade: assignment.pointsAwarded ? Number(assignment.pointsAwarded) : null,
          gradeAvailable: assignment.pointsAvailable ? Number(assignment.pointsAvailable) : null,
          studentRepositoryUrl: assignment.studentRepositoryUrl,
        }
      })
    }
  )

  // Fetch submissions for each assignment
  const submissionQueries = useQueries({
    queries:
      isAssignmentsSuccess && assignments
        ? assignments.map((assignment) => ({
            queryKey: ["submissions", assignment.id],
            queryFn: () => fetchSubmissions(assignment.id),
            enabled: isAssignmentsSuccess,
            staleTime: 5 * 60 * 1000,
          }))
        : [],
  })

  const isLoadingSubmissions = submissionQueries.some(
    (query) => query.isLoading
  )
  const errorSubmissions = submissionQueries.find((query) => query.isError)
    ?.error as Error | undefined
  const isSubmissionsSuccess = submissionQueries.every(
    (query) => query.isSuccess
  )

  useEffect(() => {
    if (!isAssignmentsSuccess || !isSubmissionsSuccess || !assignments) {
      return
    }

    if (isProcessingSubmissions) {
      return
    }

    setIsProcessingSubmissions(true)

    try {
      const allSubmissions: Submission[] = submissionQueries
        .filter((query) => query.data)
        .flatMap((query) => query.data || [])

      const summaries: Record<string, StudentSummary> = {}

      allSubmissions.forEach((submission) => {
        const assignment = assignments.find(
          (a) => a.title === submission.assignment_name
        )
        const assignmentId = assignment?.id || "unknown_assignment"
        const studentIdentifier = submission.github_username

        if (!summaries[studentIdentifier]) {
          summaries[studentIdentifier] = {
            github_username: studentIdentifier,
            submittedAssignments: [],
          }
        }

        summaries[studentIdentifier].submittedAssignments.push({
          assignmentId,
          assignmentTitle: submission.assignment_name,
          submissionTimestamp: submission.submission_timestamp,
          pointsAwarded: submission.points_awarded,
          pointsAvailable: submission.points_available,
          studentRepositoryUrl: submission.student_repository_url,
        })
      })

      setStudentSummaries(summaries)
    } finally {
      setIsProcessingSubmissions(false)
    }
  }, [isAssignmentsSuccess, isSubmissionsSuccess, assignments])

  if (!classroomId) {
    return <div>Please select a classroom..</div>
  }

  if (isLoadingAssignments || isLoadingSubmissions || isProcessingSubmissions) {
    return <div>Loading report data...</div>
  }

  if (errorAssignments) {
    return <div>Error loading assignments: {errorAssignments.message}</div>
  }

  if (errorSubmissions) {
    return <div>Error loading submissions: {errorSubmissions.message}</div>
  }

  if (!isAssignmentsSuccess || !isSubmissionsSuccess) {
    return <div>Could not load all necessary data.</div>
  }

  return (
    <>
      <DataGrid
        rows={rows}
        columns={columns}
        slots={{ toolbar: CustomToolbar }}
        showToolbar
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 50,
            },
          },
          sorting: {
            sortModel: [{ field: "github_username", sort: "asc" }],
          },
        }}
        pageSizeOptions={[10, 25, 50, 100]}
        disableRowSelectionOnClick
      />
    </>
  )
}

export default ClassReport
