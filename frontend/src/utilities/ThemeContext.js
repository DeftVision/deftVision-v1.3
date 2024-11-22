import { createContext, useState, useMemo, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline';


export const ThemeContext = createContext();

export const ThemeContextProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const savedMode = localStorage.getItem('darkMode');
        if(savedMode !== null) {
            setDarkMode(JSON.parse(savedMode));
        }
    }, [])

    const toggleDarkMode = () => {
        setDarkMode((prevMode) => {
            const newMode = !prevMode;
            localStorage.setItem('darkMode', JSON.stringify(newMode));
            return newMode;
        })
    }

    const theme = useMemo(() => createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light',
        },
        components: {
            MuiTextField: {
                defaultProps: {
                    margin: 'none'
                },
            },
        },
    }), [darkMode]);

    return (
        <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );


}