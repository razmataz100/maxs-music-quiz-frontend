import { API_BASE_URL } from "../config/apiConfig";

interface GameJoinResponse {
    gameId: number;
    status: string;
    joinCode: string;
    userId: number;
}

async function handleApiResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        // Clone the response before trying to read it
        const responseClone = response.clone();
        let errorMessage = 'Something went wrong, please try again.';

        try {
            const errorData = await responseClone.json();
            errorMessage = errorData.message || errorMessage;
        } catch {
            // If JSON parsing fails, try to get text
            try {
                const errorText = await response.text();
                errorMessage = errorText || errorMessage;
            } catch {
                // Use default error message
            }
        }

        throw new Error(errorMessage);
    }

    return await response.json();
}

export async function joinGame(joinCode: string, authToken: string): Promise<GameJoinResponse> {
    console.log('Making request to:', `${API_BASE_URL}/game/join/${joinCode}`);

    const response = await fetch(`${API_BASE_URL}/game/join/${joinCode}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
        },
    });

    return handleApiResponse<GameJoinResponse>(response);
}

export async function leaveGame(joinCode: string, authToken: string): Promise<void> {
    console.log('Making request to:', `${API_BASE_URL}/game/leave/${joinCode}`);

    const response = await fetch(`${API_BASE_URL}/game/leave/${joinCode}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
        },
    });

    return handleApiResponse(response);
}
