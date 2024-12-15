import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

    useEffect(() => {
        const handleStorageChange = () => {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            setIsAuthenticated(!!localStorage.getItem('token'));
            setUser(storedUser || null); // Update user state from localStorage
        };

        // Initialize `user` and `isAuthenticated` on app load
        const storedUser = JSON.parse(localStorage.getItem('user'));
        console.log('Stored User on Load:', storedUser);
        setIsAuthenticated(!!localStorage.getItem('token'));
        setUser(storedUser || null);

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const login = (token, userData) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setIsAuthenticated(true);
        setUser(userData);
        console.log('User logged in:', userData); // Debug login flow
    };

    const logout = (navigate) => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUser(null);
        navigate('/login'); // Redirect to login page
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
