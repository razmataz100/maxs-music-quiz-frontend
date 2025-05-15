import axios, { AxiosError } from 'axios';
import { API_BASE_URL } from "../config/apiConfig";
import {CreateGameRequest, GameHistory, GameWithHighScore, QuizQuestion} from "../types/game.ts";

export async function startGame(gameId: number, authToken: string): Promise<QuizQuestion[]> {
    if (!authToken || !gameId) {
        throw new Error("Authentication token or Game ID is missing");
    }

    try {
        const { data } = await axios.post<QuizQuestion[]>(
            `${API_BASE_URL}/game/${gameId}/start`,
            null,
            {
                headers: { 'Authorization': `Bearer ${authToken}` }
            }
        );
        return data;
    } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        const message = axiosError.response?.data?.message || 'Something went wrong, please try again.';
        throw new Error(message);
    }
}

export async function getAllGames(userId: number, authToken: string): Promise<GameWithHighScore[]> {
    try {
        const { data } = await axios.get<GameWithHighScore[]>(
            `${API_BASE_URL}/game/all/${userId}`,
            {
                headers: { 'Authorization': `Bearer ${authToken}` }
            }
        );
        return data;
    } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        const message = axiosError.response?.data?.message || 'Something went wrong, please try again.';
        throw new Error(message);
    }
}

export async function endGame(gameId: number, userId: number, correctAnswers: number, questionsAnswered: number, authToken: string): Promise<void> {
    try {
        await axios.post(
            `${API_BASE_URL}/game/${gameId}/end`,
            {
                userId: userId,
                correctAnswers: correctAnswers,
                questionsAnswered: questionsAnswered,
            },
            {
                headers: { 'Authorization': `Bearer ${authToken}` }
            }
        );
    } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        const message = axiosError.response?.data?.message || 'Something went wrong, please try again.';
        throw new Error(message);
    }
}

export async function createGame(request: CreateGameRequest, authToken: string): Promise<void> {
    try {
        await axios.post(
            `${API_BASE_URL}/game/create`,
            request,
            {
                headers: { 'Authorization': `Bearer ${authToken}` }
            }
        );
    } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        const message = axiosError.response?.data?.message || 'Something went wrong, please try again.';
        throw new Error(message);
    }
}

export async function deleteGame(gameId: number, authToken: string): Promise<void> {
    try {
        await axios.delete(
            `${API_BASE_URL}/game/${gameId}`,
            {
                headers: { 'Authorization': `Bearer ${authToken}` }
            }
        );
    } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        const message = axiosError.response?.data?.message || 'Something went wrong, please try again.';
        throw new Error(message);
    }
}

export async function getGameHistory(gameId: number, userId: number, limit = 3): Promise<GameHistory[]> {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Authentication required');

    const { data } = await axios.get(
        `${API_BASE_URL}/game/${gameId}/history/${userId}?limit=${limit}`,
        { headers: { 'Authorization': `Bearer ${token}` }}
    );
    return data;
}
