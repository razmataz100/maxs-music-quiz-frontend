import {LeaderboardEntry} from "../types/leaderboard.ts";
import {
    getAverageScoreLeaderboard,
    getGamesCompletedLeaderboard, getMonthlyLeaderboard,
    getTotalScoreLeaderboard, getWeeklyLeaderboard
} from "../services/leaderboard.service.ts";

export type LeaderboardType = 'total' | 'average' | 'games' | 'weekly' | 'monthly';


export const getLeaderBoardData: Record<LeaderboardType, {
    title: string;
    buttonLabel: string;
    scoreLabel: string;
    fetchFn: () => Promise<LeaderboardEntry[]>;
}> = {
    total: {
        title: 'Top Players by Total Score',
        buttonLabel: 'Total Score',
        scoreLabel: 'Score',
        fetchFn: getTotalScoreLeaderboard
    },
    average: {
        title: 'Top Players by Average Score',
        buttonLabel: 'Average Score',
        scoreLabel: 'Score',
        fetchFn: getAverageScoreLeaderboard
    },
    games: {
        title: 'Top Players by Games Completed',
        buttonLabel: 'Games Completed',
        scoreLabel: 'Games',
        fetchFn: getGamesCompletedLeaderboard
    },
    weekly: {
        title: 'Weekly Top Players',
        buttonLabel: 'Weekly',
        scoreLabel: 'Score',
        fetchFn: getWeeklyLeaderboard
    },
    monthly: {
        title: 'Monthly Top Players',
        buttonLabel: 'Monthly',
        scoreLabel: 'Score',
        fetchFn: getMonthlyLeaderboard
    }
};

export const getRankBadgeClass = (rank: number): string => {
    if (rank === 1) return 'bg-amber-400';
    if (rank === 2) return 'bg-gray-400';
    if (rank === 3) return 'bg-amber-600';
    return '';
};
