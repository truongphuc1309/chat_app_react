import { createTheme, ThemeProvider } from '@mui/material/styles';
import React from 'react';
import { useParams } from 'react-router-dom';
import ConversationBox from '../components/ConversationBox';
import SideBar from '../components/SideBar';
import AppProvider from '../contexts/AppContext';
import ConversationProvider from '../contexts/ConversationContext';

function Home() {
    const { id } = useParams();
    const theme = createTheme({
        palette: {
            primary: {
                main: '#4e426d',
            },
            green: {
                main: '#3ec5b7',
            },
        },
    });

    return (
        <AppProvider>
            <ThemeProvider theme={theme}>
                <div className="bg-[var(--primary)] h-screen flex">
                    <SideBar />
                    {id && (
                        <ConversationProvider>
                            <ConversationBox />
                        </ConversationProvider>
                    )}
                </div>
            </ThemeProvider>
        </AppProvider>
    );
}

export default Home;
