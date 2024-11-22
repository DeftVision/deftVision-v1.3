import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

    useEffect(() => {
        const handleStorageChange = () => {
            setIsAuthenticated(!!localStorage.getItem('token'));
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const login = (token) => {
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
    };

    // Accept navigate as an argument
    const logout = (navigate) => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        navigate('/login'); //
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

