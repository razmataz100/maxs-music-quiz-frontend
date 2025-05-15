import { LeaderboardEntry, UserRanking } from "../../types/leaderboard.ts";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from "../../components/common/BackButton.tsx";
import {LoadingSpinner} from "../../components/common/LoadingSpinner.tsx";
import {StatusMessage} from "../../components/common/StatusMessage.tsx";
import {ProfilePicture} from "../../components/common/ProfilePicture.tsx";
import {Button} from "../../components/common/Button.tsx";
import { LeaderboardType, getLeaderBoardData, getRankBadgeClass } from "../../helpers/leaderboard.helpers.ts";
import { getUserRanking } from "../../services/leaderboard.service.ts";
import { getUserId } from "../../helpers/auth.helpers.ts";

function Leaderboard() {
    const [leaderboardType, setLeaderboardType] = useState<LeaderboardType>('total');
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [userRanking, setUserRanking] = useState<UserRanking | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const currentUserId = getUserId();

    useEffect(() => {
        fetchLeaderboard(leaderboardType);
        fetchUserRanking();
    }, [leaderboardType]);

    const fetchLeaderboard = async (type: LeaderboardType) => {
        try {
            setLoading(true);
            const config = getLeaderBoardData[type];
            const data = await config.fetchFn();
            setLeaderboard(data);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserRanking = async () => {
        try {
            const ranking = await getUserRanking();
            setUserRanking(ranking);
        } catch (error) {
            console.error('Failed to fetch user ranking:', error);
        }
    };

    const UserRankingSummary = () => {
        if (!userRanking) return null;

        return (
            <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">Your Rankings</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                        <span className="text-gray-600">Global Rank:</span>
                        <span className="ml-2 font-bold text-blue-900">#{userRanking.globalRank}</span>
                    </div>
                    <div>
                        <span className="text-gray-600">Total Score:</span>
                        <span className="ml-2 font-bold text-blue-900">{userRanking.totalScore}</span>
                    </div>
                    <div>
                        <span className="text-gray-600">Average:</span>
                        <span className="ml-2 font-bold text-blue-900">{userRanking.averageScore.toFixed(2)}%</span>
                    </div>
                    <div>
                        <span className="text-gray-600">Games:</span>
                        <span className="ml-2 font-bold text-blue-900">{userRanking.gamesCompleted}</span>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) return <LoadingSpinner fullPage size="large" />;
    if (error) return <StatusMessage type="error" message={error} />;

    return (
        <div className="flex flex-col bg-white border border-gray-200 shadow-md w-full max-w-4xl rounded-lg h-[calc(100vh-14rem)] sm:h-auto sm:max-h-[70vh]">
            <div className="sticky top-0 z-10 bg-white rounded-t-lg border-b border-gray-200">
                <div className="p-6">
                    <div className="relative flex justify-start sm:justify-center items-center">
                        <h2 className="text-base xs:text-lg sm:text-2xl font-bold text-gray-800 text-left sm:text-center w-full sm:w-auto pr-14 sm:pr-0">
                            {getLeaderBoardData[leaderboardType].title}
                        </h2>
                        <BackButton onClick={() => navigate('/home')}/>
                    </div>

                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                        {(Object.keys(getLeaderBoardData) as LeaderboardType[]).map((type) => (
                            <Button
                                key={type}
                                variant={leaderboardType === type ? 'primary' : 'secondary'}
                                onClick={() => setLeaderboardType(type)}
                                className={leaderboardType !== type ? 'bg-gray-100 hover:bg-gray-200 text-gray-800' : ''}
                            >
                                {getLeaderBoardData[type].buttonLabel}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto rounded-b-lg">
                <div className="p-6">
                    <UserRankingSummary />
                    {leaderboard.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                                <thead>
                                <tr className="bg-gray-100 border-b border-gray-300">
                                    <th className="py-3 px-4 text-left w-16 text-gray-700">Rank</th>
                                    <th className="py-3 px-4 text-left text-gray-700">Player</th>
                                    <th className="py-3 px-4 text-right text-gray-700">{getLeaderBoardData[leaderboardType].scoreLabel}</th>
                                </tr>
                                </thead>
                                <tbody>
                                {leaderboard.map((entry, index) => {
                                    const badgeClass = getRankBadgeClass(entry.rank);
                                    const isCurrentUser = entry.userId === currentUserId;

                                    return (
                                        <tr key={`${entry.userId}-${index}`}
                                            className={`border-b border-gray-200 hover:bg-gray-100 transition-colors ${
                                                isCurrentUser ? 'bg-blue-50 hover:bg-blue-100' : 'bg-gray-50'
                                            }`}>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center">
                                                    {entry.rank <= 3 ? (
                                                        <span
                                                            className={`flex items-center justify-center w-8 h-8 rounded-full mr-2 text-white font-bold ${badgeClass}`}>
                                                        {entry.rank}
                                                    </span>
                                                    ) : (
                                                        <span className="ml-3 text-gray-600">{entry.rank}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center">
                                                    <ProfilePicture
                                                        imageUrl={entry.profilePictureUrl}
                                                        className="w-9 h-9 mr-3"
                                                        baseUrl="http://localhost:5284"
                                                    />
                                                    <span className={`font-medium ${isCurrentUser ? 'text-blue-900' : 'text-gray-800'}`}>
                                                        {entry.username}
                                                        {isCurrentUser && <span className="ml-2 text-sm text-blue-600">(You)</span>}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className={`py-3 px-4 text-right font-semibold ${isCurrentUser ? 'text-blue-900' : 'text-gray-800'}`}>
                                                {entry.score}{leaderboardType === 'average' ? ' %' : ''}
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No data available for this leaderboard.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Leaderboard;
