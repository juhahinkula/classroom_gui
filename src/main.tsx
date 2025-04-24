import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import App from './App.tsx'
import Classrooms from './components/Classrooms.tsx';
import Assignments from './components/Assignments.tsx';
import Submissions from './components/Submissions.tsx';
import ClassReport from './components/ClassReport.tsx';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <Classrooms />,
        index: true
      },
      {
        path: "assignments/:classroomId", 
        element: <Assignments />,
      },
      {
        path: "submissions/:classroomId/:assignmentId",
        element: <Submissions />,
      },
      {
        path: "report/:classroomId",
        element: <ClassReport />,
      },

    ]
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}/>
    </QueryClientProvider>
  </StrictMode>,
)
