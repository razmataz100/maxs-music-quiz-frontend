import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import Home from './pages/game/Home';
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Quiz from "./pages/game/Quiz";
import CreateQuiz from './pages/game/CreateQuiz';
import Profile from "./pages/profile/Profile";
import Leaderboard from "./pages/leaderboard/Leaderboard";
import HowToPlay from "./pages/game/HowToPlay";
import AppLayout from "./components/layout/AppLayout";

function App() {
    return (
        <Router>
            <AppLayout>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/game/:gameId" element={<Quiz />} />
                    <Route path="/create-quiz" element={<CreateQuiz />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route path="/how-to-play" element={<HowToPlay />} />
                </Routes>
            </AppLayout>
        </Router>
    );
}

export default App;
