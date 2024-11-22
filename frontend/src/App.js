import {Route, Routes} from 'react-router-dom';
import {Error, Home, Login} from './pages/index'
import Navbar from './components/Navbar';
import UserForm from './users/UserForm'

import {Box} from '@mui/material'
import {ThemeContextProvider} from "./utilities/ThemeContext";

function App() {
    return (
        <ThemeContextProvider>
            <Box>
                <Navbar/>
                <Box sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: 10}}>
                    <div className="App">
                        <Routes>
                            <Route path="/" element={<Home/>}/>
                            <Route path="/user-form" element={<UserForm/>}/>
                            <Route path="/login" element={<Login/>}/>
                            <Route path='*' element={<Error/>}/>
                        </Routes>
                    </div>
                </Box>
            </Box>
        </ThemeContextProvider>
    );
}

export default App;
