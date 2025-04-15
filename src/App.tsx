import Container  from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { Link, Outlet } from 'react-router';

function App() {
  return (
    <Container maxWidth="md">
       <nav>
        <Link to={"/"}>Home</Link>
      </nav>
      <Outlet />     
      <CssBaseline />
    </Container>
  )
}

export default App
