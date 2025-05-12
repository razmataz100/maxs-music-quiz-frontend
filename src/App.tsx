import {BrowserRouter as Router, Routes, Route, useNavigate} from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import Login from './pages/Login';
import Home from './pages/Home.tsx';
import Register from "./pages/Register.tsx";
import ForgotPassword from "./pages/ForgotPassword.tsx";
import Quiz from "./pages/Quiz.tsx";
import CreateQuiz from './pages/CreateQuiz.tsx';
import Profile from "./pages/Profile.tsx";
import Leaderboard from "./pages/Leaderboard.tsx";
import HowToPlay from "./pages/HowToPlay.tsx";

function DebugRoutes() {
    return (
        <Routes>
            <Route
                path="/"
                element={<LoginWithNavigation />}
            />
            <Route path="/home" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/game/:gameId" element={<Quiz />} />
            <Route path="/create-quiz" element={<CreateQuiz />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/how-to-play" element={<HowToPlay />} />
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
        navigate('/home');
    };

    return <Login onLoginSuccess={handleLoginSuccess} />;
}

export default App;
