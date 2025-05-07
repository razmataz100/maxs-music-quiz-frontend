export interface LeaderboardEntry {
  rank: number;
  userId: number;
  username: string;
  profilePictureUrl: string | null;
  score: number;
}

export interface GameRanking {
  gameId: number;
  gameTheme: string;
  rank: number;
  score: number;
}

export interface UserRanking {
  globalRank: number;
  totalScore: number;
  averageScore: number;
  gamesCompleted: number;
  gameRankings: GameRanking[];
}
