import { useEffect, useState, useRef } from 'react';
import { getUserInfo, updateUserInfo, uploadProfilePicture, getProfilePictureUrl } from '../httpUtils/user';
import {User} from "../types/user.ts";
import { useNavigate } from 'react-router-dom';
import BackButton from "../components/BackButton.tsx";
import {FormInput} from "../components/FormInput.tsx";
import {StatCard} from "../components/StatCard.tsx";
import {ProfilePicture} from "../components/ProfilePicture.tsx";
import {Button} from "../components/Button.tsx";
import {StatusMessage} from "../components/StatusMessage.tsx";
import {LoadingSpinner} from "../components/LoadingSpinner.tsx";


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

    if (loading) return <LoadingSpinner fullPage size="large" />;
    if (error) return (
        <div className="p-8">
            <StatusMessage type="error" message={error} />
        </div>
    );
    if (!userInfo) return <div className="p-8">No user information available</div>;

    return (
        <div
            className="relative p-8 bg-white border border-gray-200 shadow-md w-full max-w-4xl mx-auto mt-8 rounded-lg">
            <div className="relative flex justify-center items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">User Profile</h1>
                <BackButton onClick={() => navigate('/home')}/>
            </div>
            <div className="flex flex-col md:flex-row items-center mb-8">
                <div className="relative mb-4 md:mb-0 md:mr-8">
                    <ProfilePicture
                        imageUrl={profilePicUrl}
                        uploading={uploading}
                        onClick={handleProfileClick}
                        showEditIcon={true}
                    />
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                    />
                </div>

                <div className="flex-1">
                    <h2 className="text-xl font-bold text-indigo-600">{userInfo.username}</h2>
                    <p className="text-gray-600">{userInfo.email}</p>
                    <p className="text-gray-600">Role: {userInfo.role}</p>
                </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-100">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Game Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard title="Total Score" value={userInfo.totalScore}/>
                    <StatCard title="Questions Answered" value={userInfo.totalQuestionsAnswered}/>
                    <StatCard title="Average Score" value={userInfo.averageScore}/>
                </div>
            </div>

            {isEditing ? (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Edit Profile</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <FormInput
                                id="username"
                                label="Username"
                                type="text"
                                value={formData.username}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <FormInput
                                id="email"
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <StatusMessage type="error" message={updateError} />
                        <div className="flex space-x-2">
                            <Button
                                type="submit"
                                variant="primary"
                                isLoading={updateLoading}
                                loadingText="Saving..."
                                disabled={updateLoading}
                            >
                                Save Changes
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setIsEditing(false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="flex justify-center sm:justify-start">
                    <Button
                        variant="primary"
                        onClick={() => setIsEditing(true)}
                    >
                        Edit Profile
                    </Button>
                </div>
            )}
        </div>
    );
}

export default Profile;
