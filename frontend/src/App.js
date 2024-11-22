import { Routes, Route } from 'react-router-dom';
import { Home, Error, Login } from './pages/index'
import Navbar from './components/Navbar';
import UserForm from './users/UserForm'

import { Box } from '@mui/material'

function App() {
  return (
      <Box>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/user-form" element={<UserForm/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path='*' element={<Error/>}/>
          </Routes>
        </div>
      </Box>
  );
}

export default App;
