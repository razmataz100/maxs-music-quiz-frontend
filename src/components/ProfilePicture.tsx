import { FC } from 'react';
import ProfileIcon from "../assets/profile.svg";

interface ProfilePictureProps {
    imageUrl: string | null;
    uploading?: boolean;
    onClick?: () => void;
    showEditIcon?: boolean;
    className?: string;
    baseUrl?: string; // Add optional baseUrl prop
}

export const ProfilePicture: FC<ProfilePictureProps> = ({
                                                            imageUrl,
                                                            uploading = false,
                                                            onClick,
                                                            showEditIcon = false,
                                                            className = "w-24 h-24",
                                                            baseUrl = "" // Default to empty string
                                                        }) => {
    const fullImageUrl = imageUrl
        ? (baseUrl && !imageUrl.startsWith('http') ? `${baseUrl}${imageUrl}` : imageUrl)
        : null;

    return (
        <div
            onClick={onClick}
            className={`${onClick ? 'cursor-pointer' : ''} relative`}
        >
            {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
            {fullImageUrl ? (
                <img
                    src={fullImageUrl}
                    alt="Profile"
                    className={`${className} rounded-full object-cover border-2 border-indigo-600`}
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = ProfileIcon;
                    }}
                />
            ) : (
                <img
                    src={ProfileIcon}
                    alt="Profile Icon"
                    className={`${className} rounded-full object-cover border-2 border-indigo-600`}
                />
            )}
            {showEditIcon && (
                <div className="absolute bottom-0 right-0 bg-indigo-600 text-white rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                        <path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                        <path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                </div>
            )}
        </div>
    );
};
