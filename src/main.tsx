import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import App from './App.tsx'
import Classrooms from './components/Classrooms.tsx';
import Assignments from './components/Assignments.tsx';
import Submissions from './components/Submissions.tsx';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [                       // children are nested routes with a route
      {
        element: <Classrooms />,
        index: true                   // index route does not need any path
      },
      {
        path: "assignments/:classroomId",                // path can be defined relative to the parent path
        element: <Assignments />,
      },
      {
        path: "submissions/:classroomId/:assignmentId",
        element: <Submissions />,
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
