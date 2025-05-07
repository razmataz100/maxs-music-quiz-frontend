import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileIcon from '../assets/profile.svg';
import LogoutIcon from '../assets/logout.svg';
import TrophyIcon from '../assets/trophy.svg';
import { uploadProfilePicture, getProfilePictureUrl } from "../httpUtils/user.ts";

function Navbar() {
    const [username, setUsername] = useState<string | null>(null);
    const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const isLoggedIn = Boolean(localStorage.getItem('authToken'));

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

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            console.log("File selected:", file);
            setUploading(true);

            try {
                const result = await uploadProfilePicture(file);
                console.log("Upload result:", result);
                setProfilePicUrl(result.imageUrl);
                await fetchProfilePicture();
            } catch (error) {
                console.error('Failed to upload profile picture:', error);
            } finally {
                setUploading(false);
            }
        }
    };

    return (
        <div className="sticky top-0 z-10 flex items-center h-16 px-6 py-4 bg-sky-500 text-white shadow-md">
            {isLoggedIn && username && (
                <div className="flex items-center space-x-2 ml-4">
                    <div
                        onClick={handleProfileClick}
                        className="cursor-pointer relative"
                    >
                        {uploading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                        {profilePicUrl ? (
                            <img
                                src={profilePicUrl}
                                alt="Profile"
                                className="w-8 h-8 rounded-full object-cover"
                                onError={() => setProfilePicUrl(null)}
                            />
                        ) : (
                            <img
                                src={ProfileIcon}
                                alt="Profile Icon"
                                className="w-8 h-8"
                            />
                        )}
                    </div>
                    <h2 className="text-2xl font-bold ml-2 hidden md:block">
                        {username}
                    </h2>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                    />
                </div>
            )}
            <div className="absolute left-1/2 transform -translate-x-1/2 text-lg font-bold">
                Max's Music Quiz
            </div>
            {isLoggedIn && (
                <div className="ml-auto flex items-center space-x-2">
                    {/* Leaderboard button */}
                    <button
                        onClick={handleLeaderboardClick}
                        className="px-2 py-2 rounded cursor-pointer flex items-center justify-center"
                        aria-label="Leaderboard"
                    >
                        <img src={TrophyIcon} alt="Leaderboard" className="w-8 h-8" />
                        <span className="ml-1 hidden md:inline">Leaderboard</span>
                    </button>

                    {/* Logout button */}
                    <button
                        onClick={handleLogout}
                        className="px-2 py-2 rounded cursor-pointer flex items-center justify-center"
                    >
                        <img src={LogoutIcon} alt="Logout Icon" className="w-8 h-8" />
                    </button>
                </div>
            )}
        </div>
    );
}

export default Navbar;
