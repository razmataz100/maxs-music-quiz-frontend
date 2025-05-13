import axios, { AxiosError } from 'axios';
import { LeaderboardEntry, UserRanking } from "../types/leaderboard.ts";
import { API_BASE_URL } from "../config/apiConfig.ts";

export async function getTotalScoreLeaderboard(limit = 10, offset = 0): Promise<LeaderboardEntry[]> {
    const token = localStorage.getItem('authToken');

    if (!token) {
        throw new Error('Authentication required');
    }

    try {
        const { data } = await axios.get<LeaderboardEntry[]>(
            `${API_BASE_URL}/leaderboard/global/total-score?limit=${limit}&offset=${offset}`,
            {
                headers: { 'Authorization': `Bearer ${token}` }
            }
        );
        return data;
    } catch (error) {
        throw new Error(`Failed to fetch total score leaderboard: ${(error as AxiosError).message}`);
    }
}

export async function getAverageScoreLeaderboard(limit = 10, offset = 0): Promise<LeaderboardEntry[]> {
    const token = localStorage.getItem('authToken');

    if (!token) {
        throw new Error('Authentication required');
    }

    try {
        const { data } = await axios.get<LeaderboardEntry[]>(
            `${API_BASE_URL}/leaderboard/global/average-score?limit=${limit}&offset=${offset}`,
            {
                headers: { 'Authorization': `Bearer ${token}` }
            }
        );
        return data;
    } catch (error) {
        throw new Error(`Failed to fetch average score leaderboard: ${(error as AxiosError).message}`);
    }
}

export async function getGamesCompletedLeaderboard(limit = 10, offset = 0): Promise<LeaderboardEntry[]> {
    const token = localStorage.getItem('authToken');

    if (!token) {
        throw new Error('Authentication required');
    }

    try {
        const { data } = await axios.get<LeaderboardEntry[]>(
            `${API_BASE_URL}/leaderboard/global/games-completed?limit=${limit}&offset=${offset}`,
            {
                headers: { 'Authorization': `Bearer ${token}` }
            }
        );
        return data;
    } catch (error) {
        throw new Error(`Failed to fetch games completed leaderboard: ${(error as AxiosError).message}`);
    }
}

export async function getGameLeaderboard(gameId: number, limit = 10, offset = 0): Promise<LeaderboardEntry[]> {
    const token = localStorage.getItem('authToken');

    if (!token) {
        throw new Error('Authentication required');
    }

    try {
        const { data } = await axios.get<LeaderboardEntry[]>(
            `${API_BASE_URL}/leaderboard/game/${gameId}?limit=${limit}&offset=${offset}`,
            {
                headers: { 'Authorization': `Bearer ${token}` }
            }
        );
        return data;
    } catch (error) {
        throw new Error(`Failed to fetch game leaderboard: ${(error as AxiosError).message}`);
    }
}

export async function getWeeklyLeaderboard(limit = 10): Promise<LeaderboardEntry[]> {
    const token = localStorage.getItem('authToken');

    if (!token) {
        throw new Error('Authentication required');
    }

    try {
        const { data } = await axios.get<LeaderboardEntry[]>(
            `${API_BASE_URL}/leaderboard/weekly?limit=${limit}`,
            {
                headers: { 'Authorization': `Bearer ${token}` }
            }
        );
        return data;
    } catch (error) {
        throw new Error(`Failed to fetch weekly leaderboard: ${(error as AxiosError).message}`);
    }
}

export async function getMonthlyLeaderboard(limit = 10): Promise<LeaderboardEntry[]> {
    const token = localStorage.getItem('authToken');

    if (!token) {
        throw new Error('Authentication required');
    }

    try {
        const { data } = await axios.get<LeaderboardEntry[]>(
            `${API_BASE_URL}/leaderboard/monthly?limit=${limit}`,
            {
                headers: { 'Authorization': `Bearer ${token}` }
            }
        );
        return data;
    } catch (error) {
        throw new Error(`Failed to fetch monthly leaderboard: ${(error as AxiosError).message}`);
    }
}

export async function getUserRanking(): Promise<UserRanking> {
    const token = localStorage.getItem('authToken');

    if (!token) {
        throw new Error('Authentication required');
    }

    try {
        const { data } = await axios.get<UserRanking>(
            `${API_BASE_URL}/leaderboard/user/ranking`,
            {
                headers: { 'Authorization': `Bearer ${token}` }
            }
        );
        return data;
    } catch (error) {
        throw new Error(`Failed to fetch user ranking: ${(error as AxiosError).message}`);
    }
}
