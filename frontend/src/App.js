import {Route, Routes} from 'react-router-dom';
import {Error, Home, Login} from './pages/index'
import {
    Navbar,
    FormTemplate,
    EndUserForm,
    ResetPassword,
    ForgotPassword,
    Shoppers,
    Dashboards,
    ViewableAnnouncements,
    ViewableDocuments,
    Users,
    Employees,
    Announcements,
    Documents,
    AdminMenu,
} from './components/index';

import TestComponent from './components/TestComponent'

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
                                    <PrivateRoute roles={['Admin', 'Shopper']}>
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
                                        <ViewableDocuments />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/manage-documents"
                                element={
                                    <PrivateRoute roles={['Admin']}>
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
                                path="/admin"
                                element={
                                    <PrivateRoute roles={['Admin']}>
                                        <AdminMenu/>
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

                            <Route
                                path="/documents"
                                element={
                                    <PrivateRoute roles={['Admin', 'User']}>
                                        <ViewableDocuments />
                                    </PrivateRoute>
                                }
                            />
                            <Route path='/reset-password' element={<ResetPassword /> } />
                            <Route path='/forgot-password' element={<ForgotPassword /> } />
                            <Route path='unauthorized' element={<Unauthorized /> } />

                            <Route path='test' element={<TestComponent /> } />

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
