import { API_BASE_URL } from "../config/apiConfig";
import {CreateGameRequest, GameWithHighScore, QuizQuestion} from "../types/game.ts";


async function handleApiResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const responseClone = response.clone();
        let errorMessage = 'Something went wrong, please try again.';

        try {
            const errorData = await responseClone.json();
            errorMessage = errorData.message || errorMessage;
        } catch {
            try {
                const errorText = await response.text();
                errorMessage = errorText || errorMessage;
            } catch {
                errorMessage = 'An unknown error occurred.';
            }
        }

        throw new Error(errorMessage);
    }

    return await response.json();
}

export async function startGame(gameId: number, authToken: string): Promise<QuizQuestion[]> {
    if (!authToken || !gameId) {
        throw new Error("Authentication token or Game ID is missing");
    }

    const response = await fetch(`${API_BASE_URL}/game/${gameId}/start-game`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
        },
    });

    return handleApiResponse<QuizQuestion[]>(response);
}


export async function getAllGames(userId: number, authToken: string): Promise<GameWithHighScore[]> {
    const response = await fetch(`${API_BASE_URL}/game/all/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
        },
    });

    return handleApiResponse<GameWithHighScore[]>(response);
}

export async function endGame(gameId: number, userId: number, correctAnswers: number, questionsAnswered: number, authToken: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/game/${gameId}/end-game`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
            userId: userId,
            correctAnswers: correctAnswers,
            questionsAnswered: questionsAnswered,
        }),
    });

    return handleApiResponse(response);
}

export async function createGame(request: CreateGameRequest, authToken: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/game/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(request),
    });

    return handleApiResponse(response);
}

export async function deleteGame(gameId: number, authToken: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/game/${gameId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
        },
    });

    return handleApiResponse(response);
}



