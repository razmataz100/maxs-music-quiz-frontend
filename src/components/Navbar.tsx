import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProfileIcon from '../assets/profile.svg';
import LogoutIcon from '../assets/logout.svg';
import TrophyIcon from '../assets/trophy.svg';
import { getProfilePictureUrl } from "../httpUtils/user.ts";

function Navbar() {
    const [username, setUsername] = useState<string | null>(null);
    const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const isLoginPage = location.pathname === '/' || location.pathname === '/login';
    const isLoggedIn = Boolean(localStorage.getItem('authToken')) && !isLoginPage;

    useEffect(() => {
        if (isLoginPage) {
            localStorage.clear();
        }
    }, [isLoginPage]);

    useEffect(() => {
        if (isLoggedIn) {
            setUsername(localStorage.getItem('username'));
            fetchProfilePicture();

            const handleProfileUpdate = () => {
                fetchProfilePicture();
            };

            window.addEventListener('profilePictureUpdated', handleProfileUpdate);

            return () => {
                window.removeEventListener('profilePictureUpdated', handleProfileUpdate);
            };
        } else {
            setUsername(null);
            setProfilePicUrl(null);
        }
    }, [isLoggedIn]);

    const fetchProfilePicture = async () => {
        try {
            const result = await getProfilePictureUrl();
            if (result && result.imageUrl) {
                const imageUrl = result.imageUrl;
                setProfilePicUrl(imageUrl);
            } else {
                setProfilePicUrl(null);
            }
        } catch (error) {
            console.error('Failed to fetch profile picture:', error);
            setProfilePicUrl(null);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        setUsername(null);
        setProfilePicUrl(null);
        navigate('/');
    };

    const handleProfileClick = () => {
        navigate('/profile');
    };

    const handleLeaderboardClick = () => {
        navigate('/leaderboard');
    };

    return (
        <div className="sticky top-0 z-10 flex items-center h-16 px-6 py-4 bg-indigo-600 text-white shadow-md">
            {isLoggedIn && username && (
                <div className="flex items-center">
                    <div
                        onClick={handleProfileClick}
                        className="flex items-center cursor-pointer hover:bg-indigo-700 transition-colors rounded p-1"
                    >
                        <div className="relative">
                            {profilePicUrl ? (
                                <img
                                    src={profilePicUrl}
                                    alt="Profile"
                                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-transparent"
                                    onError={() => setProfilePicUrl(null)}
                                />
                            ) : (
                                <img
                                    src={ProfileIcon}
                                    alt="Profile Icon"
                                    className="w-9 h-9 sm:w-9 sm:h-9"
                                />
                            )}
                        </div>
                        <h2 className="text-lg font-medium hidden md:block ml-2">
                            {username}
                        </h2>
                    </div>
                    <button
                        onClick={handleLeaderboardClick}
                        className="ml-3 p-1 rounded hover:bg-indigo-700 transition-colors flex items-center justify-center cursor-pointer"
                        aria-label="Leaderboard"
                    >
                        <img src={TrophyIcon} alt="Leaderboard" className="w-5 h-5 sm:w-6 sm:h-6"/>
                        <span className="ml-2 hidden md:inline">Leaderboard</span>
                    </button>
                </div>
            )}
            <div className="absolute left-1/2 transform -translate-x-1/2 text-sm sm:text-xl font-bold">
                Max's Music Quiz
            </div>
            {isLoggedIn && (
                <div className="ml-auto">
                    <button
                        onClick={handleLogout}
                        className="p-1 rounded hover:bg-indigo-700 transition-colors flex items-center justify-center cursor-pointer"
                    >
                        <img src={LogoutIcon} alt="Logout Icon" className="w-6 h-6"/>
                        <span className="ml-2 hidden md:inline">Logout</span>
                    </button>
                </div>
            )}
        </div>
    );
}

export default Navbar;
