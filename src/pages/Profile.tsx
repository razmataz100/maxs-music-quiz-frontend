import { useEffect, useState, useRef } from 'react';
import { getUserInfo, updateUserInfo, uploadProfilePicture, getProfilePictureUrl } from '../httpUtils/user';
import {User} from "../types/user.ts";
import { useNavigate } from 'react-router-dom';


function Profile() {
    const [userInfo, setUserInfo] = useState<User | null>(null);
    const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ username: '', email: '' });
    const [updateLoading, setUpdateLoading] = useState(false);
    const [updateError, setUpdateError] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserInfo();
        fetchProfilePicture();
    }, []);

    const fetchUserInfo = async () => {
        try {
            setLoading(true);
            const info = await getUserInfo();
            setUserInfo(info);
            if (info) {
                setFormData({
                    username: info.username,
                    email: info.email
                });
            }
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const fetchProfilePicture = async () => {
        try {
            const result = await getProfilePictureUrl();
            if (result && result.imageUrl) {
                setProfilePicUrl(result.imageUrl);
            } else {
                setProfilePicUrl(null);
            }
        } catch (error) {
            console.error('Failed to fetch profile picture:', error);
            setProfilePicUrl(null);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdateLoading(true);
        setUpdateError(null);

        try {
            const updatedInfo = await updateUserInfo(formData);
            setUserInfo(updatedInfo);
            setIsEditing(false);
        } catch (err) {
            setUpdateError((err as Error).message);
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleProfileClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setUploading(true);

            try {
                await uploadProfilePicture(file);
                await fetchProfilePicture();

                const profileUpdatedEvent = new CustomEvent('profilePictureUpdated');
                window.dispatchEvent(profileUpdatedEvent);
            } catch (error) {
                console.error('Failed to upload profile picture:', error);
            } finally {
                setUploading(false);
            }
        }
    }

    if (loading) return <div className="flex justify-center items-center p-8">Loading...</div>;
    if (error) return <div className="text-red-500 p-8">Error: {error}</div>;
    if (!userInfo) return <div className="p-8">No user information available</div>;

    return (
        <div className="relative p-8 bg-white border border-gray-300 shadow-md w-full max-w-4xl mx-auto mt-8">
            <div className="relative flex justify-center items-center mb-6">
                <h1 className="text-2xl font-bold">User Profile</h1>
                <button
                    onClick={() => navigate('/home')}
                    className="absolute right-0 px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 flex items-center cursor-pointer"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20"
                         fill="currentColor">
                        <path
                            d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                    </svg>
                    Home
                </button>
            </div>
            <div className="flex flex-col md:flex-row items-center mb-8">
                <div className="relative mb-4 md:mb-0 md:mr-8">
                    <div
                        onClick={handleProfileClick}
                        className="cursor-pointer relative"
                    >
                        {uploading && (
                            <div
                                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                                <div
                                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                        {profilePicUrl ? (
                            <img
                                src={profilePicUrl}
                                alt="Profile"
                                className="w-24 h-24 rounded-full object-cover border-2 border-sky-500"
                                onError={() => setProfilePicUrl(null)}
                            />
                        ) : (
                            <div
                                className="w-24 h-24 rounded-full bg-sky-500 flex items-center justify-center text-white text-2xl font-bold">
                                {userInfo.username.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div className="absolute bottom-0 right-0 bg-sky-500 text-white rounded-full p-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                        </div>
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                    />
                </div>

                <div className="flex-1">
                    <h2 className="text-xl font-bold text-sky-600">{userInfo.username}</h2>
                    <p className="text-gray-600">{userInfo.email}</p>
                    <p className="text-gray-600">Role: {userInfo.role}</p>
                </div>
            </div>

            <div className="bg-gray-100 p-4 rounded mb-6">
                <h3 className="text-lg font-semibold mb-4">Game Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-3 rounded shadow">
                        <p className="text-gray-500">Total Score</p>
                        <p className="text-2xl font-bold">{userInfo.totalScore}</p>
                    </div>
                    <div className="bg-white p-3 rounded shadow">
                        <p className="text-gray-500">Questions Answered</p>
                        <p className="text-2xl font-bold">{userInfo.totalQuestionsAnswered}</p>
                    </div>
                    <div className="bg-white p-3 rounded shadow">
                        <p className="text-gray-500">Average Score</p>
                        <p className="text-2xl font-bold">{userInfo.averageScore}</p>
                    </div>
                </div>
            </div>

            {isEditing ? (
                <div className="bg-white border border-gray-200 rounded p-4">
                    <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="username" className="block text-gray-700 mb-2">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-sky-500"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-sky-500"
                                required
                            />
                        </div>
                        {updateError && <div className="text-red-500 mb-4">{updateError}</div>}
                        <div className="flex space-x-2">
                            <button
                                type="submit"
                                disabled={updateLoading}
                                className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 disabled:bg-gray-400"
                            >
                                {updateLoading ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600"
                >
                    Edit Profile
                </button>
            )}
        </div>
    );
}

export default Profile;
