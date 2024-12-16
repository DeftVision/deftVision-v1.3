import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();



export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(!!sessionStorage.getItem('token'));
    const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')) || null);

    useEffect(() => {
        const handleStorageChange = () => {
            const storedUser = JSON.parse(sessionStorage.getItem('user'));
            setIsAuthenticated(!!sessionStorage.getItem('token'));
            setUser(storedUser || null); // Update user state from localStorage
        };

        // Initialize `user` and `isAuthenticated` on app load
        const storedUser = JSON.parse(sessionStorage.getItem('user'));
        setIsAuthenticated(!!sessionStorage.getItem('token'));
        setUser(storedUser || null);

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const login = (token, userData) => {
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('user', JSON.stringify(userData));
        setIsAuthenticated(true);
        setUser(userData);
        console.log('User logged in:', userData); // Debug login flow
    };


    const logout = (navigate) => {
        sessionStorage.clear(); // Clear all session storage items
        localStorage.clear();   // Clear local storage (if used)
        setIsAuthenticated(false);
        setUser(null);

        // Use a small delay to allow state to clear before navigation
        setTimeout(() => {
            navigate('/login', { replace: true }); // Ensure absolute path
        }, 0);
    };





    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
