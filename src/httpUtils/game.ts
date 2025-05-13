import axios, { AxiosError } from 'axios';
import { API_BASE_URL } from "../config/apiConfig";
import { CreateGameRequest, GameWithHighScore, QuizQuestion } from "../types/game.ts";

export async function startGame(gameId: number, authToken: string): Promise<QuizQuestion[]> {
    if (!authToken || !gameId) {
        throw new Error("Authentication token or Game ID is missing");
    }

    try {
        const { data } = await axios.post<QuizQuestion[]>(
            `${API_BASE_URL}/game/${gameId}/start-game`,
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
            `${API_BASE_URL}/game/${gameId}/end-game`,
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
