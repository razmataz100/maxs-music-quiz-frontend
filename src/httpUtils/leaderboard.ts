import {LeaderboardEntry, UserRanking} from "../types/leaderboard.ts";
import {API_BASE_URL} from "../config/apiConfig.ts";

export async function getTotalScoreLeaderboard(limit = 10, offset = 0): Promise<LeaderboardEntry[]> {
    const token = localStorage.getItem('authToken');

    if (!token) {
        throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/leaderboard/global/total-score?limit=${limit}&offset=${offset}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch total score leaderboard: ${response.statusText}`);
    }

    return await response.json();
}

export async function getAverageScoreLeaderboard(limit = 10, offset = 0): Promise<LeaderboardEntry[]> {
    const token = localStorage.getItem('authToken');

    if (!token) {
        throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/leaderboard/global/average-score?limit=${limit}&offset=${offset}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch average score leaderboard: ${response.statusText}`);
    }

    return await response.json();
}

export async function getGamesCompletedLeaderboard(limit = 10, offset = 0): Promise<LeaderboardEntry[]> {
    const token = localStorage.getItem('authToken');

    if (!token) {
        throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/leaderboard/global/games-completed?limit=${limit}&offset=${offset}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch games completed leaderboard: ${response.statusText}`);
    }

    return await response.json();
}

export async function getGameLeaderboard(gameId: number, limit = 10, offset = 0): Promise<LeaderboardEntry[]> {
    const token = localStorage.getItem('authToken');

    if (!token) {
        throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/leaderboard/game/${gameId}?limit=${limit}&offset=${offset}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch game leaderboard: ${response.statusText}`);
    }

    return await response.json();
}

export async function getWeeklyLeaderboard(limit = 10): Promise<LeaderboardEntry[]> {
    const token = localStorage.getItem('authToken');

    if (!token) {
        throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/leaderboard/weekly?limit=${limit}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch weekly leaderboard: ${response.statusText}`);
    }

    return await response.json();
}

export async function getMonthlyLeaderboard(limit = 10): Promise<LeaderboardEntry[]> {
    const token = localStorage.getItem('authToken');

    if (!token) {
        throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/leaderboard/monthly?limit=${limit}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch monthly leaderboard: ${response.statusText}`);
    }

    return await response.json();
}

export async function getUserRanking(): Promise<UserRanking> {
    const token = localStorage.getItem('authToken');

    if (!token) {
        throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/leaderboard/user/ranking`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch user ranking: ${response.statusText}`);
    }

    return await response.json();
}
