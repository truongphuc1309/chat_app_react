import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import { CookiesProvider, useCookies } from 'react-cookie';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './components/Profile';
import Contacts from './components/Contacts';
import ConversationBox from './components/ConversationBox';
import VerifyEmail from './pages/VerifyEmail';
import NotFound from './pages/NotFound';
import SendVerification from './pages/SendVerification';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function App() {
    return (
        <CookiesProvider>
            <Routes>
                <Route path="/" element={<Home />}>
                    <Route path="profile" element={<Profile />}></Route>
                    <Route path="c" element={<Contacts />}>
                        <Route path=":id" element={<ConversationBox />} />
                    </Route>
                </Route>
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
