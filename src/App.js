import logo from './logo.svg';
import './App.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { CookiesProvider, useCookies } from 'react-cookie';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import NotFound from './pages/NotFound';
import SendVerification from './pages/SendVerification';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Gate from './pages/Gate';
import AppProvider from './contexts/AppContext';
import ChangePassword from './pages/ChangePassword';

function App() {
    return (
        <CookiesProvider>
            <Routes>
                <Route path="/" element={<Gate />} />
                <Route path="/c" element={<Home />}>
                    <Route path=":id" element={<Home />} />
                </Route>
                <Route
                    path="/change-password"
                    element={
                        <AppProvider>
                            <ChangePassword />
                        </AppProvider>
                    }
                />
                <Route path="/login" element={<Login />}></Route>
                <Route path="/register" element={<Register />}></Route>
                <Route path="/verify-email" element={<VerifyEmail />}>
                    <Route path=":token" element={<VerifyEmail />} />
                </Route>
                <Route
                    path="/send-verification"
                    element={<SendVerification />}
                />
                <Route path="/reset-password" element={<ResetPassword />}>
                    <Route path=":token" element={<ResetPassword />} />
                </Route>
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </CookiesProvider>
    );
}

export default App;
