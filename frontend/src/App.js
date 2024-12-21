import {Route, Routes} from 'react-router-dom';
import {Error, Home, Login} from './pages/index'
import { Navbar, FormTemplate, ResetPassword, ForgotPassword, Shoppers, Dashboards, ViewableAnnouncements } from './components/index';
import Users from './components/Users'
import EndUserForm from './components/EndUserForm'
import Employees from './components/Employees'
import Announcements from './components/Announcements'
import Documents from './components/Documents'
import PrivateRoute from './utilities/PrivateRoute'

import {Box} from '@mui/material'
import {ThemeContextProvider} from "./utilities/ThemeContext";
import Unauthorized from "./pages/Unauthorized";

function App() {
    return (
        <ThemeContextProvider>
            <Box>
                <Navbar/>
                <Box sx={{display: 'flex', justifyContent: 'center', marginTop: 10}}>
                    <div className="App">
                        <Routes>
                            <Route
                                path='/'
                                element={
                                    <PrivateRoute roles={['Admin', 'Shopper', 'User']}>
                                        <Home />
                                    </PrivateRoute>
                            }
                            />

                            <Route
                                path='/dashboards'
                                element={
                                    <PrivateRoute roles={['Admin', 'User']}>
                                        <Dashboards />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/users"
                                element={
                                    <PrivateRoute roles={['Admin']}>
                                        <Users />
                                    </PrivateRoute>
                                }
                            />

                            <Route
                                path="/manage-announcements"
                                element={
                                    <PrivateRoute roles={['Admin']}>
                                        <Announcements />
                                    </PrivateRoute>
                                }
                            />

                            <Route
                                path="/shoppers"
                                element={
                                    <PrivateRoute roles={['Admin', 'Shopper', 'User']}>
                                        <Shoppers />
                                    </PrivateRoute>
                                }
                            />

                            <Route
                                path="/employees"
                                element={
                                    <PrivateRoute roles={['Admin', 'User']}>
                                        <Employees />
                                    </PrivateRoute>
                                }
                            />

                            <Route
                                path="/documents"
                                element={
                                    <PrivateRoute roles={['Admin', 'User']}>
                                        <Documents />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/forms"
                                element={
                                    <PrivateRoute roles={['Admin']}>
                                        <EndUserForm/>
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/form-template"
                                element={
                                    <PrivateRoute roles={['Admin']}>
                                       <Users/>
                                    </PrivateRoute>
                               }
                            />

                            <Route
                                path="/announcements"
                                element={
                                    <PrivateRoute roles={['Admin', 'Shopper', 'User']}>
                                        <ViewableAnnouncements />
                                    </PrivateRoute>
                                }
                                />
                            <Route path='/reset-password' element={<ResetPassword /> } />
                            <Route path='/forgot-password' element={<ForgotPassword /> } />
                            <Route path='unauthorized' element={<Unauthorized /> } />
                            <Route path='*' element={<Error/> } />
                            <Route path="/login" element={<Login/>}/>
                        </Routes>
                    </div>
                </Box>
            </Box>
        </ThemeContextProvider>
    );
}

export default App;
