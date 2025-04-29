import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useGameHub } from "../hooks/useGameHub";
import {leaveGame} from "../httpUtils/game.ts";

interface LocationState {
    userId: number;
    gameId: number;
}

function Lobby() {
    console.log('Lobby component mounting!');

    const { joinCode } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    console.log('URL params:', { joinCode });
    console.log('Location state:', location.state);

    const state = location.state as LocationState | null;
    const userId = state?.userId;

    const [messages, setMessages] = useState<string[]>([]);

    const {
        players,
        isConnected,
        error,
        initializeConnection,
        joinLobby,
        leaveLobby,
        connection
    } = useGameHub();

    useEffect(() => {
        console.log('Checking if joinCode and userId exist:', { joinCode, userId });

        if (!joinCode || !userId) {
            console.log('Missing data, redirecting to /join-game');
            navigate('/join-game');
            return;
        }

        console.log('Initializing SignalR connection...');
        initializeConnection();
    }, [joinCode, userId, initializeConnection, navigate]);

    // Join the lobby once connected with retry logic
    useEffect(() => {
        if (isConnected && joinCode && userId) {
            console.log('Connection established, joining lobby...');
            joinLobby(joinCode, userId);
        }
    }, [isConnected, joinCode, userId, joinLobby]);

    // Listen for player events and update messages
    useEffect(() => {
        if (!connection) return;

        const handlePlayerJoined = (player: { username: string }) => {
            setMessages(prev => [...prev, `${player.username} joined the lobby.`]);
        };

        const handlePlayerLeft = (playerId: number) => {
            const player = players.find(p => p.userId === playerId);
            if (player) {
                setMessages(prev => [...prev, `${player.username} left the lobby.`]);
            }
        };

        connection.on("PlayerJoined", handlePlayerJoined);
        connection.on("PlayerLeft", handlePlayerLeft);

        return () => {
            connection.off("PlayerJoined", handlePlayerJoined);
            connection.off("PlayerLeft", handlePlayerLeft);
        };
    }, [connection, players]);

    const handleExitGame = async () => {
        try {
            const authToken = localStorage.getItem('authToken');

            if (joinCode && authToken) {
                await leaveGame(joinCode, authToken);
                await leaveLobby(joinCode);
            }
            navigate("/profile");
        } catch (error) {
            console.error('Error exiting game:', error);
            navigate("/profile");
        }
    };

    const handleStartGame = () => {
        console.log("Game started!");
    };

    if (error) {
        return (
            <div className="relative p-8 bg-white border border-gray-300 shadow-md w-full max-w-4xl h-auto">
                <h2 className="text-xl text-red-600 mb-6">Error</h2>
                <p>{error}</p>
                <button
                    onClick={() => navigate('/join-game')}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Back to Join
                </button>
                <button
                    onClick={() => initializeConnection()}
                    className="mt-4 ml-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    Retry Connection
                </button>
            </div>
        );
    }

    return (
        <div className="relative p-8 bg-white border border-gray-300 shadow-md w-full max-w-4xl h-auto">
            <button
                className="absolute top-4 right-4 text-red-600 hover:underline cursor-pointer"
                onClick={handleExitGame}
            >
                Exit Game
            </button>

            <h2 className="text-xl mb-6">Lobby for Game {joinCode}</h2>
            <p>Status: {isConnected ? 'Connected' : 'Connecting...'}</p>

            <div className="mt-4">
                <h3 className="font-semibold mb-2">Players ({players.length})</h3>
                <ul>
                    {players.map((player) => (
                        <li key={player.userId} className="flex items-center gap-2 mb-2">
                            {player.profilePictureUrl ? (
                                <img
                                    src={player.profilePictureUrl}
                                    alt={player.username}
                                    className="w-8 h-8 rounded-full"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                                    {player.username[0]?.toUpperCase()}
                                </div>
                            )}
                            <span>{player.username}</span>
                            {player.userId === userId && <span className="text-gray-500">(You)</span>}
                        </li>
                    ))}
                </ul>
            </div>

            <button
                onClick={handleStartGame}
                className="mt-6 px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600"
            >
                Start Game
            </button>

            <div className="mt-4">
                <h3 className="font-semibold mb-2">Messages</h3>
                <ul>
                    {messages.map((msg, index) => (
                        <li key={index} className="text-gray-600">{msg}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Lobby;
