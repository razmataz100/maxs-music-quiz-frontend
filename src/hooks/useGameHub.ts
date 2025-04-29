// hooks/useGameHub.ts
import { useEffect, useState, useCallback } from 'react';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { HUB_BASE_URL } from "../config/apiConfig";

export interface LobbyPlayer {
    userId: number;
    username: string;
    profilePictureUrl?: string;
}

export interface LobbyMessage {
    userId: number;
    username: string;
    message: string;
    timestamp: Date;
}

export const useGameHub = () => {
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const [players, setPlayers] = useState<LobbyPlayer[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initialize connection
    const initializeConnection = useCallback(async () => {
        try {
            const token = localStorage.getItem('authToken');

            const newConnection = new HubConnectionBuilder()
                .withUrl(HUB_BASE_URL, {
                    accessTokenFactory: () => token || ''
                })
                .configureLogging(LogLevel.Information)
                .build();

            // Set up event handlers before starting
            newConnection.on('CurrentPlayers', (currentPlayers: LobbyPlayer[]) => {
                setPlayers(currentPlayers);
            });

            newConnection.on('PlayerJoined', (player: LobbyPlayer) => {
                setPlayers(current => [...current, player]);
            });

            newConnection.on('PlayerLeft', (playerId: number) => {
                setPlayers(current => current.filter(p => p.userId !== playerId));
            });

            newConnection.on('LobbyError', (errorMessage: string) => {
                setError(errorMessage);
            });

            newConnection.on('ReceiveLobbyMessage', (message: LobbyMessage) => {
                console.log('Received message:', message);
            });

            // Handle connection state changes
            newConnection.onclose((error) => {
                console.log('Connection closed:', error);
                setIsConnected(false);
            });

            newConnection.onreconnecting((error) => {
                console.log('Reconnecting:', error);
                setIsConnected(false);
            });

            newConnection.onreconnected(() => {
                console.log('Reconnected');
                setIsConnected(true);
            });

            await newConnection.start();
            console.log('SignalR Connected');
            setConnection(newConnection);
            setIsConnected(true);
            setError(null);

        } catch (err) {
            console.error('Failed to connect to game hub:', err);
            setError('Failed to connect to game lobby');
            setIsConnected(false);
        }
    }, []);


    const joinLobby = useCallback(async (joinCode: string, userId: number) => {
        if (!connection) {
            setError('No connection available');
            return;
        }

        try {
            await connection.invoke('JoinLobby', joinCode, userId);
            setError(null);
        } catch (err) {
            console.error('Failed to join lobby:', err);
            setError('Failed to join lobby');
        }
    }, [connection]);

    // Leave lobby function
    const leaveLobby = useCallback(async (joinCode: string) => {
        if (!connection) return;

        try {
            await connection.invoke('LeaveLobby', joinCode);
        } catch (err) {
            console.error('Failed to leave lobby:', err);
        }
    }, [connection]);

    // Send message function
    const sendMessage = useCallback(async (joinCode: string, message: string) => {
        if (!connection) return;

        try {
            await connection.invoke('SendLobbyMessage', joinCode, message);
        } catch (err) {
            console.error('Failed to send message:', err);
        }
    }, [connection]);

    // Clean up on unmount
    useEffect(() => {
        return () => {
            if (connection) {
                connection.stop();
            }
        };
    }, [connection]);

    return {
        connection,
        players,
        isConnected,
        error,
        initializeConnection,
        joinLobby,
        leaveLobby,
        sendMessage
    };
};
