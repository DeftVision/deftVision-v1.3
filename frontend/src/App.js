import {Route, Routes} from 'react-router-dom';
import {Error, Home, Login} from './pages/index'
import { Navbar, FormTemplate, ResetPassword, ForgotPassword } from './components/index';
import UserForm from './users/UserForm'
import UserData from './users/UserData'
import EndUserForm from './components/EndUserForm'
import EmployeeForm from './employees/EmployeeForm'
import EmployeeData from './employees/EmployeeData'
import Announcements from './components/Announcements'

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
                            <Route path="/" element={<Home/>}/>

                            <Route path="/user-form" element={<UserForm/>}/>
                            <Route path="/user-data" element={<UserData/>}/>

                            <Route path="/announcements" element={<Announcements />} />


                            <Route path="/employee-form" element={<EmployeeForm/>}/>
                            <Route path="/employee-data" element={<EmployeeData/>}/>

                            <Route path="/forms" element={<EndUserForm/>}/>
                            <Route path="/form-template" element={<FormTemplate/>}/>

                            <Route path="/login" element={<Login/>}/>

                            <Route path='/reset-password' element={<ResetPassword />} />
                            <Route path='/forgot-password' element={<ForgotPassword />} />


                            <Route path='*' element={<Error/>}/>
                        </Routes>
                    </div>
                </Box>
            </Box>
        </ThemeContextProvider>
    );
}

export default App;
