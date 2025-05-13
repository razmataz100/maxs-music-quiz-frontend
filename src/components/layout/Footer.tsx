import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {getAuthToken} from "../../helpers/auth.helpers.ts";

const Footer = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        try {
            getAuthToken();
            setIsLoggedIn(true);
        } catch {
            setIsLoggedIn(false);
        }
    }, [location.pathname]);

    return (
        <div className="sticky bottom-0 z-10 flex items-center justify-between h-16 px-6 py-4 bg-gray-100 text-gray-800 border-t border-gray-200">
            <div className="text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Max's Music Quiz.
            </div>
            <div className="flex space-x-4">
                {isLoggedIn && (
                    <button
                        onClick={() => navigate('/how-to-play')}
                        className="text-sm text-gray-500 cursor-pointer hover:text-gray-700"
                    >
                        How to Play
                    </button>
                )}
            </div>
        </div>
    );
};

export default Footer;
