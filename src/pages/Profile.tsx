import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {Game} from "../types/game.ts";


function Profile() {
    const [username, setUsername] = useState('');
    const [games, setGames] = useState<Game[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        const authToken = localStorage.getItem('authToken');

        if (!authToken) {
            navigate('/');
            return;
        }

        setUsername(storedUsername!);
        setGames([
            { id: 1, name: 'Chess', datePlayed: '2023-10-01' },
            { id: 2, name: 'Poker', datePlayed: '2023-10-05' },
        ]);
    }, [navigate]);

    const handleJoinGame = () => {
        navigate('/join-game');
    };

    return (
        <div className="p-8 bg-white border border-gray-300 shadow-md w-full max-w-4xl h-auto">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl">{username} profile</h2>
                <button
                    onClick={handleJoinGame}
                    className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600"
                >
                    Join Game
                </button>
            </div>
            <h3 className="text-lg font-semibold mb-2">Played Games:</h3>
            <ul className="list-disc pl-5">
                {games.map((game) => (
                    <li key={game.id}>
                        {game.name} - Played on {game.datePlayed}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Profile;
