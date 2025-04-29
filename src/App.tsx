import {BrowserRouter as Router, Routes, Route, useNavigate, useLocation} from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Register from "./pages/Register.tsx";
import ForgotPassword from "./pages/ForgotPassword.tsx";
import JoinGame from "./pages/JoinGame.tsx";
import Lobby from "./pages/Lobby.tsx";

function DebugRoutes() {
    const location = useLocation();
    console.log('Current location:', location.pathname);

    return (
        <Routes>
            <Route
                path="/"
                element={<LoginWithNavigation />}
            />
            <Route path="/profile" element={<Profile />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/join-game" element={<JoinGame />} />
            <Route path="/lobby/:joinCode" element={<Lobby />} />
        </Routes>
    );
}

function App() {
    return (
        <Router>
            <AppLayout>
                <DebugRoutes />
            </AppLayout>
        </Router>
    );
}

function LoginWithNavigation() {
    const navigate = useNavigate();

    const handleLoginSuccess = () => {
        navigate('/profile');
    };

    return <Login onLoginSuccess={handleLoginSuccess} />;
}

export default App;
