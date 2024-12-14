import {Route, Routes} from 'react-router-dom';
import {Error, Home, Login} from './pages/index'
import { Navbar, FormTemplate, ResetPassword, ForgotPassword, Shoppers } from './components/index';
import Users from './components/Users'
import EndUserForm from './components/EndUserForm'
import Employees from './components/Employees'
import Announcements from './components/Announcements'
import Documents from './components/Documents'

import {Box} from '@mui/material'
import {ThemeContextProvider} from "./utilities/ThemeContext";

function App() {
    return (
        <ThemeContextProvider>
            <Box>
                <Navbar/>
                <Box sx={{display: 'flex', justifyContent: 'center', marginTop: 10}}>
                    <div className="App">
                        <Routes>
                            <Route path="/" element={<Home/> } />

                            <Route path="/users" element={<Users /> } />

                            <Route path="/announcements" element={<Announcements /> } />

                            <Route path="/shoppers" element={<Shoppers />} />

                            <Route path="/employees" element={<Employees/> } />

                            <Route path='/documents' element={<Documents /> } />
                            <Route path="/forms" element={<EndUserForm/> } />
                            <Route path="/form-template" element={<FormTemplate/> } />

                            <Route path="/login" element={<Login/>}/>

                            <Route path='/reset-password' element={<ResetPassword /> } />
                            <Route path='/forgot-password' element={<ForgotPassword /> } />


                            <Route path='*' element={<Error/> } />
                        </Routes>
                    </div>
                </Box>
            </Box>
        </ThemeContextProvider>
    );
}

export default App;
