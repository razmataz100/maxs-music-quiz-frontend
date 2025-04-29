import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar() {
    const [username, setUsername] = useState<string | null>(null);
    const navigate = useNavigate();
    const isLoggedIn = Boolean(localStorage.getItem('authToken'));

    useEffect(() => {
        setUsername(localStorage.getItem('username'));
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className="sticky top-0 z-10 flex items-center h-16 px-6 py-4 bg-sky-500 text-white shadow-md">
            {isLoggedIn && username && (
                <div className="text-lg font-semibold">
                    Welcome, {username}
                </div>
            )}
            <div className="absolute left-1/2 transform -translate-x-1/2 text-lg font-bold">
                Max's Music Quiz
            </div>
            {isLoggedIn && (
                <button
                    onClick={handleLogout}
                    className="ml-auto px-4 py-2 bg-red-500 rounded hover:bg-red-200"
                >
                    Logout
                </button>
            )}
        </div>
    );
}

export default Navbar;
